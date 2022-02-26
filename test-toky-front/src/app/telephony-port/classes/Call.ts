import {
  SessionStatus,
  TransferEnum,
  TransferOptionsEnum,
} from 'src/app/toky-sdk/toky-sdk';
import { ICall } from '../interfaces/ICall';
import { IPort, PortStatus, Agent } from '../interfaces/IPort';
import { CallAbstract } from '../classes/CallAbstract';
import { ICallAbstract } from '../interfaces/ICallAbstract';
import { BusinessTarget } from 'src/app/telephony-port/interfaces/IPort';

export class Call extends CallAbstract implements ICall, ICallAbstract {
  private assignments: BusinessTarget[];
  constructor(ports: IPort[], id: string, assignments: BusinessTarget[]) {
    super(ports, id, 'call');
    this.assignments = assignments;
  }

  public AddEventListenersCall(): void {
    this.addEventListenersTokySession();
  }

  private addEventListenersTokySession() {
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
      setTimeout(() => {
        if (this.port!.currentInfo.status === PortStatus.DIALING) {
          this.tokySession?.endCall();
          this.ClearAll();
          console.log(
            `#[${this.id}]-tokySession-${this.callType}-pasaron ${
              this.maxTimeRinging / 1000
            }s y el Lead no contestó, entonces, colgamos automáticamente`
          );
        }
      }, this.maxTimeRinging);
    });

    this.tokySession.on(SessionStatus.CONNECTED, () => {
      console.log(`#[${this.id}]-tokySession-${this.callType}-CONNECTED`);
      this.port!.currentInfo.status = PortStatus.CONNECTED; //de aqui sacamos el numero telefónico del lead realacioando esta instancia de la clase Call
      // 1)
      //this.TransferToNumber(this.numberToXfer, TransferOptionsEnum.BLIND); //automaticamente lo mandamos al ivr. si funcionó pero pasan 5 segundos

      //2)
      // this.TransferToEmail(this.emailToXfer, TransferOptionsEnum.BLIND);//me fallo una vez //El lead tarda 1.5 segundos en escuchar a alguien es super rapido
      // this.TransferToEmail(this.emailToXfer, TransferOptionsEnum.WARM); //el cliente tarda 4 segundos para escuhar a alguien

      /************************************************************************************************************************** */
      let businessTarget: BusinessTarget | undefined = this.findBusinessTarget(
        this.tokySession._callData.phone
      );

      if (businessTarget) {
        if (businessTarget.agentAssigned) {
          console.warn(
            `Trying to Transfer Lead -> Name:[${businessTarget.lead.name}] Lastname[${businessTarget.lead.lastname}] phone:[${this.tokySession._callData.phone}] to the Agent -> Name:[${businessTarget.agentAssigned.name}] Lastname[${businessTarget.agentAssigned.lastName}] email:[${businessTarget.agentAssigned.email}]`
          );

          //Falló varias veces, audio cruzado entre Leads, es decir, los leads se escuchaban entre sí. funcionó muy mal
          /*this.TransferToEmail(
            businessTarget.agentAssigned.email,
            TransferOptionsEnum.WARM
          );*/

          //Si funcionó mejor se tarda mas o menos  2 o 3 segundos para hacer la transferencia del lead hacia su agente específico
          this.TransferToEmail(
            businessTarget.agentAssigned.email,
            TransferOptionsEnum.BLIND
          );
        } else {
          console.error(
            `No hay Agente asignado para el lead con numero ${this.tokySession._callData.phone}`
          );
        }
      } else {
        console.error(
          `No se encontró businessTarget para el número del Lead [${this.tokySession._callData.phone}]`
        );
      }

      /************************************************************************************************************************** */
      //3
      //si no contesta nos permitirá enviarlo al ivr para que alguien en el ivr lo atienda
      //pero no he logrado echarlo a andar
      /*this.TransferToEmail(this.emailToXfer, 'warm');
      setTimeout(() => {
        if (this.port?.currentInfo.status === PortStatus.CONNECTED) {
          this.tokySession
            .cancelTransfer()
            .then(() => {
              console.warn(
                '--- Cancel Transfer to specific Agente, so we transfer to IVR'
              );
            })
            .catch(() => {
              console.warn('--- Cancel Transfer action unsuccess');
              this.tokySession.endCall();
            });
        }
      }, 3000);*/
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
      setTimeout(() => this.ClearAll(), 600);
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
      /*setTimeout(() => {
        if (this.port!.currentInfo.status === PortStatus.TRANSFERRING) {
          console.log(
            'chale tuve que liberarlo a mano porque no recibi evento de BYE'
          );
          this.ClearAll();
        }
      }, 3000);*/
    });
    this.tokySession.on(SessionStatus.TRANSFER_WARM_INIT, () => {
      console.log(
        `#[${this.id}]-tokySession-${this.callType}-TRANSFER_WARM_INIT`
      );
      this.port!.currentInfo.status = PortStatus.TRANSFERRING;
      this.isWaitingTransfer = true;
    });
    this.tokySession.on(SessionStatus.TRANSFER_WARM_ANSWERED, () => {
      console.log(
        `#[${this.id}]-tokySession-${this.callType}-TRANSFER_WARM_ANSWERED`
      );
    });
    this.tokySession.on(SessionStatus.TRANSFER_WARM_NOT_ANSWERED, () => {
      console.log(
        `#[${this.id}]-tokySession-${this.callType}-TRANSFER_WARM_NOT_ANSWERED`
      );
    });
    this.tokySession.on(SessionStatus.TRANSFER_WARM_COMPLETED, () => {
      console.log(
        `#[${this.id}]-tokySession-${this.callType}-TRANSFER_WARM_COMPLETED`
      );
    });
    this.tokySession.on(SessionStatus.TRANSFER_WARM_NOT_COMPLETED, () => {
      console.log(
        `#[${this.id}]-tokySession-${this.callType}-TRANSFER_WARM_NOT_COMPLETED`
      );
    });
  }
  private findBusinessTarget(
    TokyPhoneRepresentation: string
  ): BusinessTarget | undefined {
    console.log(this.assignments);

    let businessTarget: BusinessTarget | undefined = this.assignments.find(
      (item) =>
        `${item.lead.telephone.areaCode}${item.lead.telephone.number}` ===
        TokyPhoneRepresentation
    );

    return businessTarget;
  }
}
