import { TransferEnum } from 'src/app/toky-sdk/toky-sdk';
import { TransferOptionsEnum } from 'toky-phone-js-sdk/dist/types/src/constants';
import { ICallAbstract } from '../interfaces/ICallAbstract';
import { IPort, PortStatus } from '../interfaces/IPort';

export abstract class CallAbstract implements ICallAbstract {
  tokySession: any;
  id: string;
  isWaitingTransfer: boolean;

  ports: IPort[] = [];

  public get callType(): string {
    return this._callType;
  }

  protected maxTimeRinging = 19000;

  protected port: IPort | null = null;

  protected numberToXfer = '+525585262096';
  //protected emailToXfer = 'misael__truehome.com.mx'; //'misael__truehome.com.mx' //'dessire.pena__truehome.com.mx'

  private _callType: string = '';

  constructor(ports: IPort[], id: string, callType: string) {
    this.id = id;
    this.isWaitingTransfer = false;
    this._callType = callType;
    this.ports = ports;
  }

  public Configuration(port: IPort, tokySession: any): void {
    this.setPort(port);
    this.setTokySession(tokySession);
    this.AddEventListenersCall();
  }

  abstract AddEventListenersCall(): void;

  public TransferToNumber(
    numberToTransfer: string,
    typeTransfer: TransferOptionsEnum
  ): void {
    const objToTransfer = {
      type: TransferEnum.NUMBER,
      destination: numberToTransfer,
      option: typeTransfer,
    };
    console.log('Transfieriendo a un numero Externo', objToTransfer);

    this.makeTransfer(objToTransfer);
  }

  public TransferToEmail(
    emailToTransfer: string,
    typeTransfer: TransferOptionsEnum
  ): void {
    const objToTransfer = {
      type: TransferEnum.AGENT,
      destination: emailToTransfer,
      option: typeTransfer,
    };
    console.log(
      'Transfieriendo a un Agente de Toky por su email',
      objToTransfer
    );

    this.makeTransfer(objToTransfer);
  }

  public AnswerInboundCall(): void {
    if (this.tokySession) {
      this.tokySession.acceptCall();
      this.port!.currentInfo.status = PortStatus.CONNECTED;
    }
  }

  public hangUp(): void {
    try {
      if (this.tokySession) {
        this.tokySession.endCall();
      }
    } catch (e) {
      console.error(e);
    }
  }

  protected setPort(port: IPort): void {
    try {
      this.port = port;
    } catch (err) {
      console.log(`+${this.id}-error-set-port-on-call `, err);
    }
  }

  protected setTokySession(tokySession: any) {
    if (tokySession) {
      this.tokySession = tokySession;
    } else {
      console.error(`+${this.id}-Es nulo o undefinido el toky sesion`);
    }
  }

  protected ClearAll(): void {
    this.tokySession = null;
    this.isWaitingTransfer = false;
    this.port!.freePort();
  }

  private makeTransfer(objToTransfer: {
    type: any;
    destination: string;
    option: any;
  }) {
    this.tokySession.makeTransfer(objToTransfer);
  }
}
