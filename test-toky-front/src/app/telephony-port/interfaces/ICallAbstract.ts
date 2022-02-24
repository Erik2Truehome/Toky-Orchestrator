import { TransferOptionsEnum } from 'toky-phone-js-sdk/dist/types/src/constants';
import { IPort } from './IPort';

export interface ICallAbstract {
  id: string;
  tokySession: any;
  ports: IPort[];

  //methods
  Configuration(port: IPort, tokySession: any): void;
  AddEventListenersCall(): void;

  hangUp(): void;
  AnswerInboundCall(): void;

  TransferToEmail(
    emailToTransfer: string,
    typeTransfer: TransferOptionsEnum
  ): void;

  TransferToNumber(
    numberToTransfer: string,
    typeTransfer: TransferOptionsEnum
  ): void;
}
