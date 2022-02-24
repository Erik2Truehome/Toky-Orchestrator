import { ICallAbstract } from './ICallAbstract';

export interface ICallTransfer extends ICallAbstract {
  idPortMainCall: number;
  isSuccesTransfer: boolean;
}
