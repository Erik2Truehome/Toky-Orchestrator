import { Client } from 'toky-phone-js-sdk/dist/types/src/client';
import { Agent, Country, IPort } from './IPort';
import { TokyClient } from 'src/app/toky-sdk/toky-sdk';

export interface ITelephonyClient {
  id: number;
  agentLinked: Agent;
  tokyClient: any;
  country: Country;
  ports: IPort[];

  //methods
  createItsTokyClient(
    accessToken: string | undefined,
    type: string,
    acceptInboundCalls: boolean,
    callRecordingEnabled: boolean
  ): Promise<void>;

  createPoolPorts(cantityPorts: number): void;

  launchCall(
    phoneOutCompany: string,
    leadPhone: string,
    countryCode: string
  ): void;
}
