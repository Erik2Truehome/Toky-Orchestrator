import {
  SessionStatus,
  TransferEnum,
  TransferOptionsEnum,
} from 'src/app/toky-sdk/toky-sdk';
import { ICall } from '../interfaces/ICall';
import { IPort, PortStatus } from '../interfaces/IPort';
import { CallAbstract } from '../classes/CallAbstract';
import { ICallAbstract } from '../interfaces/ICallAbstract';
import { ICallTransfer } from '../interfaces/ICallTransfer';
// import { TransferOptionsEnum } from 'toky-phone-js-sdk/dist/types/src/constants';

export class CallTransfer
  extends CallAbstract
  implements ICallTransfer, ICallAbstract
{
  public isSuccesTransfer: boolean;
  public idPortMainCall: number;

  private _idMainCallToky: string;
  private numberIVR: string = '+525585265166'; //Numero de TEC 525585262096

  constructor(
    ports: IPort[],
    id: string,
    idPortMainCall: number,
    idMainCallToky: string
  ) {
    super(ports, id, 'callTransfer');
    this.idPortMainCall = idPortMainCall;
    this._idMainCallToky = idMainCallToky;
    console.error('no es error. _idMainCallToky:', this._idMainCallToky);
    this.isSuccesTransfer = false;
  }

  public AddEventListenersCall(): void {
    this.addEventListenersTokySessionToTransfer();
  }

  private addEventListenersTokySessionToTransfer() {
    this.addEventListenersTokySessionTransferCall();
  }

  private addEventListenersTokySessionTransferCall(): void {
    this.tokySession.on(SessionStatus.MUTED, () => {
      console.log(`#[${this.id}]-tokySession-${this.callType}-MUTED`);
    });
    this.tokySession.on(SessionStatus.UNMUTED, () => {
      console.log(`#[${this.id}]-tokySession-${this.callType}-UNMUTED`);
    });
    this.tokySession.on(SessionStatus.HOLD, () => {
      console.log(`#[${this.id}]-tokySession-${this.callType}-HOLD`);
      this.port!.currentInfo.status = PortStatus.HOLD;
    });
    this.tokySession.on(SessionStatus.UNHOLD, () => {
      console.log(`#[${this.id}]-tokySession-${this.callType}-UNHOLD`);
      this.port!.currentInfo.status = PortStatus.CONNECTED;
    });
    this.tokySession.on(SessionStatus.HOLD_NOT_AVAILABLE, () => {
      console.log(
        `#[${this.id}]-tokySession-${this.callType}-HOLD_NOT_AVAILABLE`
      );
    });
    this.tokySession.on(SessionStatus.RECORDING, () => {
      console.log(`#[${this.id}]-tokySession-${this.callType}-RECORDING`);
    });
    this.tokySession.on(SessionStatus.NOT_RECORDING, () => {
      console.log(`#[${this.id}]-tokySession-${this.callType}-NOT_RECORDING`);
    });
    this.tokySession.on(SessionStatus.RECORDING_NOT_AVAILABLE, () => {
      console.log(
        `#[${this.id}]-tokySession-${this.callType}-RECORDING_NOT_AVAILABLE`
      );
    });

    this.tokySession.on(SessionStatus.TRYING, () => {
      console.log(`#[${this.id}]-tokySession-${this.callType}-TRYING`);
    });
    this.tokySession.on(SessionStatus.RINGING, () => {
      console.log(`#[${this.id}]-tokySession-${this.callType}-RINGING`);
      this.port!.currentInfo.status = PortStatus.DIALING;
      // setTimeout(() => {
      //   if (this.port!.currentInfo.status === PortStatus.DIALING) {
      //     this.tokySession?.endCall();
      //     this.ClearAll();
      //     console.log(
      //       `#[${this.id}]-tokySession-${this.callType}-pasaron ${
      //         this.maxTimeRinging / 1000
      //       }s y el Lead no contestó, entonces, colgamos automáticamente`
      //     );
      //   }
      // }, this.maxTimeRinging);
    });

    this.tokySession.on(SessionStatus.CONNECTED, () => {
      console.log(`#[${this.id}]-tokySession-${this.callType}-CONNECTED`);
      this.port!.currentInfo.status = PortStatus.CONNECTED;
      // 1)  this.TransferToNumber(this.numberToXfer, 'blind'); //automaticamente lo mandamos al ivr. si funcionó pero pasan 5 segundos

      //2)
      // this.TransferToEmail(this.emailToXfer, 'blind'); //lo enviamos directamente con el agente especifico, es super rapido

      // this.TransferToEmail(this.emailToXfer, 'warm');
    });

    this.tokySession.on(SessionStatus.REJECTED, () => {
      console.log(`#[${this.id}]-tokySession-${this.callType}-REJECTED`);
      setTimeout(() => this.ClearAll(), 600);
    });
    this.tokySession.on(SessionStatus.FAILED, () => {
      console.log(`#[${this.id}]-tokySession-${this.callType}-FAILED`);
      setTimeout(() => this.ClearAll(), 600);
    });
    this.tokySession.on(SessionStatus.BYE, () => {
      console.log(`#[${this.id}]-tokySession-${this.callType}-BYE`);
      if (this.isWaitingTransfer) {
        this.port!.currentInfo.status = PortStatus.TRANSFER_SUCCESS;
      } else {
        this.port!.currentInfo.status = PortStatus.END_CALL;
      }
      // if (this.isSuccesTransfer) {
      //   setTimeout(() => this.ClearAll(), 2000);
      // }
      setTimeout(() => this.ClearAll(), 4000);
    });

    // para transferencias
    this.tokySession.on(SessionStatus.TRANSFER_FAILED, (argsTransError) => {
      console.log(
        `#[${this.id}]-tokySession-${
          this.callType
        }-TRANSFER_FAILED->${JSON.stringify(argsTransError)}`
      );
    });
    this.tokySession.on(SessionStatus.TRANSFER_BLIND_INIT, () => {
      console.log(
        `#[${this.id}]-tokySession-${this.callType}-TRANSFER_BLIND_INIT`
      );
      this.port!.currentInfo.status = PortStatus.TRANSFERRING;
      this.isWaitingTransfer = true;
      setTimeout(() => {
        if (this.port!.currentInfo.status === PortStatus.TRANSFERRING) {
          console.log(
            'chale tuve que liberarlo a mano porque no recibi evento de BYE'
          );
          this.ClearAll();
        }
      }, 3000);
    });
    this.tokySession.on(SessionStatus.TRANSFER_WARM_INIT, () => {
      console.log(
        `#[${this.id}]-tokySession-${this.callType}-TRANSFER_WARM_INIT`
      );
      this.port!.currentInfo.status = PortStatus.TRANSFERRING;
      this.isWaitingTransfer = true;

      setTimeout(() => {
        if (this.isWaitingTransfer) {
          const text: string = 'Ya Pasaron 2 segundos';
          if (this.isSuccesTransfer) {
            console.warn(
              `${text} pero El Lead ya esta con el Agente.... no es necesario transferir a IVR`
            );
          } else {
            //enviar a IVR la llamda del lead
            console.warn(`${text} Por lo tanto el Lead sera enviado al IVR.`);
            //this.TransferToIVRDefault();
          }
        }
      }, 2000);
    });
    this.tokySession.on(SessionStatus.TRANSFER_WARM_ANSWERED, () => {
      console.log(
        `#[${this.id}]-tokySession-${this.callType}-TRANSFER_WARM_ANSWERED`
      );
      console.log(
        'vamos a colgar la llamada en el Dial Engine pues el agente ya contestó y ya estan charlanddo el Lead con su Agente'
      );
      //colgamos pero con un delay de unos milisegundos
      // setTimeout(() => this.tokySession.endCall(), 500);
      this.tokySession.endCall();
    });

    this.tokySession.on(SessionStatus.TRANSFER_WARM_COMPLETED, () => {
      this.isSuccesTransfer = true;
      console.log(
        `#[${this.id}]-tokySession-${this.callType}-TRANSFER_WARM_COMPLETED`
      );
      console.log('El Lead ya esta charlando con el Agente');
    });

    this.tokySession.on(SessionStatus.TRANSFER_WARM_NOT_ANSWERED, () => {
      console.log(
        `#[${this.id}]-tokySession-${this.callType}-TRANSFER_WARM_NOT_ANSWERED`
      );
    });

    this.tokySession.on(SessionStatus.TRANSFER_WARM_NOT_COMPLETED, () => {
      console.log(
        `#[${this.id}]-tokySession-${this.callType}-TRANSFER_WARM_NOT_COMPLETED`
      );
    });
    console.warn('SE AGREGARON LISTENERS A LA LLAMADA DE TRANSFERENCIA');
  }

  private TransferToIVRDefault() {
    // buscamos por el phoneNumberLead
    let portMainCall: IPort | undefined = this.ports.find(
      (item) => item.idDatabase === this.idPortMainCall
    );

    if (portMainCall) {
      console.log('si encontro el puerto con la llamada principal');
      portMainCall.call?.tokySession
        // this.tokySession
        .cancelTransfer()
        .then(() => {
          console.warn('--- Cancel Transfer action success');
          portMainCall!.call?.TransferToNumber(
            this.numberIVR,
            TransferOptionsEnum.BLIND
          );
        })
        .catch(() => {
          console.warn('--- Cancel Transfer action unsuccess');
        });
    }
  }
}
