import { Injectable } from '@angular/core';
import { AssignmentService } from 'src/app/assignment/service/assignment.service';
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
  constructor(
    private tokenService: TokenService,
    private assignmentService: AssignmentService
  ) {}

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
        country,
        this.assignmentService.assignments //le paso las asignaciones
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
