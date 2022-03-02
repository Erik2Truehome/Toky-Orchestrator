import { ICall } from '../interfaces/ICall';
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
import { OptionUI } from './OptionUI';

export class Port implements IPort {
  idDatabase: number;
  agentLinked: Agent;
  currentInfo: CurrentInfoPort;
  country: Country;
  call: ICall | null = null;

  constructor(idDatabase: number, agentLinked: Agent, country: Country) {
    this.idDatabase = idDatabase;
    this.agentLinked = agentLinked;
    this.currentInfo = this.SetInfoDefault();
    this.country = country;
  }

  private SetInfoDefault(): CurrentInfoPort {
    let phoneLead1: Telephone = {
      areaCode: '+52',
      number: '',
    };

    let lead1: Lead = {
      email: '',
      name: 'Fernando',
      lastname: 'Cervantes',
      telephone: phoneLead1,
    };

    let agentAssigned1: Agent = {
      id: -2,
      email: '',
      name: 'pedro',
      lastName: 'Peñaflores',
    };

    let businessTarget1: BusinessTarget = {
      lead: lead1,
      agentAssigned: agentAssigned1,
    };

    let currentInfo: CurrentInfoPort = {
      registrationStatus: PortRegistrationStatus.UNREGISTERED,
      status: PortStatus.CREATED,
      businessTarget: businessTarget1,
    };

    return currentInfo;
  }

  public freePort(): void {
    this.currentInfo.status = PortStatus.READY;
    this.currentInfo.businessTarget!.lead.telephone.number = '';
    this.currentInfo.businessTarget!.agentAssigned.email = '';
    this.call = null;
  }

  public configureAgentAssigned(emailAgent: string): void {
    this.currentInfo.businessTarget!.agentAssigned.email = emailAgent;
  }
}
