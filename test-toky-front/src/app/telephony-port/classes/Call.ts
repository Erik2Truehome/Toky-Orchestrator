import {
  SessionStatus,
  TransferEnum,
  TransferOptionsEnum,
} from 'src/app/toky-sdk/toky-sdk';
import { ICall } from '../interfaces/ICall';
import { IPort, PortStatus } from '../interfaces/IPort';
import { CallAbstract } from '../classes/CallAbstract';
import { ICallAbstract } from '../interfaces/ICallAbstract';

export class Call extends CallAbstract implements ICall, ICallAbstract {
  constructor(ports: IPort[], id: string) {
    super(ports, id, 'call');
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
      this.port!.currentInfo.status = PortStatus.CONNECTED;
      // 1)
      //this.TransferToNumber(this.numberToXfer, TransferOptionsEnum.BLIND); //automaticamente lo mandamos al ivr. si funcionó pero pasan 5 segundos

      //2)
      // this.TransferToEmail(this.emailToXfer, TransferOptionsEnum.BLIND);//me fallo una vez //El lead tarda 1.5 segundos en escuchar a alguien es super rapido
      this.TransferToEmail(this.emailToXfer, TransferOptionsEnum.WARM); //el cliente tarda 4 segundos para escuhar a alguien

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
}
