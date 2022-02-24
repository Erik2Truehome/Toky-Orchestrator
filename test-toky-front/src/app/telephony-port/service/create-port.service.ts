import { Injectable } from '@angular/core';
import { Port } from '../classes/Port';
import { TelephonyClient } from '../classes/TelephonyClient';
import {
  Agent,
  BusinessTarget,
  Country,
  CurrentInfoPort,
  IPort,
  Lead,
  PortRegistrationStatus,
  PortStatus,
  Telephone,
} from '../interfaces/IPort';
import { ITelephonyClient } from '../interfaces/ITelephonyClient';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class CreatePortService {
  constructor(private tokenService: TokenService) {}

  public async create(
    agentLinkedPort: Agent,
    type: string,
    acceptInboundCalls: boolean,
    callRecordingEnabled: boolean,
    country: Country,
    quantityOfPorts: number
  ): Promise<ITelephonyClient | undefined> {
    try {
      let newTelephonyClient: ITelephonyClient = new TelephonyClient(
        1,
        agentLinkedPort,
        country
      );

      await newTelephonyClient.createItsTokyClient(
        this.tokenService.accessToken,
        type,
        acceptInboundCalls,
        callRecordingEnabled
      );

      newTelephonyClient.createPoolPorts(quantityOfPorts);

      console.log('PoolCreated', newTelephonyClient);
      return newTelephonyClient;
    } catch (e) {
      console.log(e);
      return undefined;
    }
  }
}
