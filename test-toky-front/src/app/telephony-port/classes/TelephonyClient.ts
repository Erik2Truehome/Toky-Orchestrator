import {
  Agent,
  Country,
  IPort,
  PortRegistrationStatus,
  PortStatus,
} from '../interfaces/IPort';
import { ITelephonyClient } from '../interfaces/ITelephonyClient';

import { ClientStatus, TokyClient } from 'src/app/toky-sdk/toky-sdk';
import { Call } from './Call';
import { Port } from './Port';
import { CallTransfer } from './CallTransfer';
import { ICallAbstract } from '../interfaces/ICallAbstract';
import { TokyCallDirection } from './constant/TokyCallDirection';

export class TelephonyClient implements ITelephonyClient {
  id: number;
  agentLinked: Agent;
  tokyClient: any;
  country: Country;
  ports: IPort[] = [];

  constructor(id: number, agentLinked: Agent, country: Country) {
    this.agentLinked = agentLinked;
    this.country = country;
    this.id = id;
  }

  public async createItsTokyClient(
    accessToken: string,
    type: string,
    acceptInboundCalls: boolean,
    callRecordingEnabled: boolean
  ): Promise<void> {
    const clientToky = new TokyClient({
      accessToken: accessToken,
      account: {
        user: this.agentLinked.email,
        type: 'agent',
        acceptInboundCalls: acceptInboundCalls,
        callRecordingEnabled: callRecordingEnabled,
      },
      transportLib: 'sip.js',
      media: {
        errorAudio: '',
        incomingRingAudio: '',
        ringAudio: '',
      },
    });

    await clientToky.init();

    this.tokyClient = clientToky;
    console.log('ya creó el TokyClient');

    this.addEventListenersTokyClient();
    console.log('ya agregó los events listeners del tokyClient');
  }

  public createPoolPorts(cantityPorts: number): void {
    for (let i: number = 1; i <= cantityPorts; i++) {
      const newPort: IPort = new Port(i, this.agentLinked, this.country);

      this.ports.push(newPort);
    }
  }

  public launchCall(
    phoneOutCompany: string,
    leadPhone: string,
    countryCodePhoneLead: string
  ): void {
    try {
      const dataOutgoingCall = {
        phoneNumber: `${
          countryCodePhoneLead.startsWith('+') ? '' : '+'
        }${countryCodePhoneLead}${leadPhone}`, // example number lead ,
        callerId: phoneOutCompany, //'+525585262096' numero de truehome TEC, example caller id from the company ,
      };

      console.log(
        `[${this.id}]-trying to launch outgoing call to ${dataOutgoingCall.phoneNumber} from this number:${dataOutgoingCall.callerId}.`
      );

      this.tokyClient!.startCall(dataOutgoingCall);
      console.log(
        `[${this.id}]-started launch outgoing call to ${dataOutgoingCall.phoneNumber} from this number:${dataOutgoingCall.callerId}.`
      );
    } catch (e) {
      console.log('error lanzando llamada', e);
    }
  }

  private addEventListenersTokyClient() {
    this.tokyClient!.on(ClientStatus.INVITE_REJECTED, (argRejected) => {
      console.log(
        `![${this.id}]-tokyClient-INVITE_REJECTED->${JSON.stringify(
          argRejected
        )}`
      );
      console.log(argRejected);
    });
    this.tokyClient!.on(ClientStatus.REGISTERING, () => {
      console.log(`![${this.id}]-tokyClient-REGISTERING`);
      this.ports.forEach(
        (item) =>
          (item.currentInfo.registrationStatus =
            PortRegistrationStatus.REGISTERING)
      );
      this.ports.forEach(
        (item) => (item.currentInfo.status = PortStatus.INITIALIZING)
      );
    });

    this.tokyClient!.on(ClientStatus.ONLINE, () => {
      console.log(`![${this.id}]-tokyClient-ONLINE`);
      this.ports.forEach(
        (item) =>
          (item.currentInfo.registrationStatus =
            PortRegistrationStatus.REGISTERED)
      );
      this.ports.forEach(
        (item) => (item.currentInfo.status = PortStatus.READY)
      );
    });

    this.tokyClient!.on(ClientStatus.OFFLINE, () => {
      console.log(`![${this.id}]-tokyClient-OFFLINE`);
      this.ports.forEach(
        (item) =>
          (item.currentInfo.registrationStatus =
            PortRegistrationStatus.UNREGISTERED)
      );
      this.ports.forEach(
        (item) => (item.currentInfo.status = PortStatus.CREATED)
      );
    });

    this.tokyClient!.on(ClientStatus.REGISTRATION_FAILED, () => {
      console.log(`![${this.id}]-tokyClient-REGISTRATION_FAILED`);
      this.ports.forEach(
        (item) =>
          (item.currentInfo.registrationStatus = PortRegistrationStatus.FAILED)
      );
      this.ports.forEach(
        (item) => (item.currentInfo.status = PortStatus.REGISTRATION_ERROR)
      );
    });

    this.tokyClient!.on(ClientStatus.DEFAULT, () => {
      // este no lo usamos
      console.log(`![${this.id}]-tokyClient-DEFAULT`);
    });

    this.tokyClient!.on(ClientStatus.READY, () => {
      console.log(`![${this.id}]-tokyClient-READY`);
      this.ports.forEach(
        (item) =>
          (item.currentInfo.registrationStatus =
            PortRegistrationStatus.REGISTERED)
      );
      this.ports.forEach(
        (item) => (item.currentInfo.status = PortStatus.READY)
      );
    });

    this.tokyClient!.on(ClientStatus.DISCONNECTED, () => {
      console.log(`![${this.id}]-tokyClient-DISCONNECTED`);
      this.ports.forEach(
        (item) =>
          (item.currentInfo.registrationStatus =
            PortRegistrationStatus.UNREGISTERED)
      );
      this.ports.forEach(
        (item) => (item.currentInfo.status = PortStatus.REGISTRATION_ERROR)
      );
    });

    this.tokyClient!.on(ClientStatus.REGISTERED, () => {
      console.log(`![${this.id}]-tokyClient-REGISTERED`);
      this.ports.forEach(
        (item) =>
          (item.currentInfo.registrationStatus =
            PortRegistrationStatus.REGISTERED)
      );
      this.ports.forEach(
        (item) => (item.currentInfo.status = PortStatus.READY)
      );
    });

    this.tokyClient!.on(ClientStatus.UNREGISTERED, () => {
      console.log(`![${this.id}]-tokyClient-UNREGISTERED`);
      this.ports.forEach(
        (item) =>
          (item.currentInfo.registrationStatus =
            PortRegistrationStatus.UNREGISTERED)
      );
      this.ports.forEach(
        (item) => (item.currentInfo.status = PortStatus.REGISTRATION_ERROR)
      );
    });

    this.tokyClient!.on(ClientStatus.SESSION_UPDATED, (args) => {
      //1
      let tokySession: any;
      let call: ICallAbstract;
      let port: IPort | undefined = undefined;

      console.log(`![${this.id}]-tokyClient-SESSION_UPDATED`);
      tokySession = args.session;
      console.log('tokySession', tokySession);

      if (tokySession) {
        if (
          //preguntamos si es llamda de transfererencia a Agente o es una llamada de salida a la PSTN
          tokySession._callDirection &&
          tokySession._callDirection === TokyCallDirection.INBOUND
        ) {
          /*es una llamada de transferencia  a Agente*/
          console.warn(
            `![${this.id}]-tokyClient-SESSION_UPDATED-llamada de transferencia a Agente`
          );

          // buscamos por el phoneNumberLead
          let portMainCall: IPort | undefined = this.ports.find(
            (item) =>
              item.call?.tokySession._callData.phone ===
              tokySession._callData.uri
          );

          if (portMainCall) {
            const portXfer = portMainCall.portXfer;
            call = new CallTransfer(
              this.ports,
              tokySession._callId,
              portMainCall.idDatabase,
              portMainCall.call?.tokySession._callId
            );
            call.Configuration(portXfer!, tokySession);
            portXfer!.call = call;
          }
        } else {
          /*es una llamada de salida para un lead que  desea comprar una casas*/
          console.warn(
            `![${this.id}]-tokyClient-SESSION_UPDATED- llamada de salida a Lead`
          );
          port = this.ports.find(
            (port) => port.currentInfo.status === PortStatus.READY
          );
          if (port) {
            port.currentInfo.status = PortStatus.RESERVED;
            const portToTransfer = this.reservePortToXfer();
            if (portToTransfer) {
              port.portXfer = portToTransfer;
              console.log(
                'id de primera llamda tokySession._callId',
                tokySession._callId
              );
              call = new Call(this.ports, Math.random().toString()); //tokySession._callId aqui no logre sacar el idCall de toky

              call.Configuration(port, tokySession);
              port.call = call;
            }
          }
        }
      } else {
        console.error('Error recibiendo la tokySesion');
      }
    });

    this.tokyClient!.on(ClientStatus.CONNECTING, () => {
      //2
      console.log(`![${this.id}]-tokyClient-CONNECTING`);
      console.log('CONNECTING... se va a lanzar una llamada outgoing');
    });

    this.tokyClient!.on(ClientStatus.INVITE, () => {
      //3
      console.log(`![${this.id}]-tokyClient-INVITE`);
      console.log('INVITE... se esta recibiendo una llamada');

      //creo que esto ya no seria necesario
      /*    TokyMedia.source.incomingRingAudio.play();
      this.currentInfo.status = PortStatus.STARTING_INBOUND_CALL;
      this.currentInfo.status = PortStatus.RINGING;
    */

      // setTimeout(() => {
      //   if (this.tokySession) {
      //     this.tokySession.acceptCall();
      //   }
      // }, 5000);//automaticamente contestamos
    });
  }

  private reservePortToXfer(): IPort | undefined {
    const port = this.ports.find(
      (port) => port.currentInfo.status === PortStatus.READY
    );

    if (port) {
      port.currentInfo.status = PortStatus.RESERVED_TO_TRANSFER;
    }
    return port;
  }
}
