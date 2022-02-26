import { Injectable } from '@angular/core';

import {
  BusinessTarget,
  Telephone,
  Lead,
  Agent,
} from 'src/app/telephony-port/interfaces/IPort';

@Injectable({
  providedIn: 'root',
})
export class AssignmentService {
  public assignments: BusinessTarget[];
  public agents: Agent[];
  constructor() {
    this.assignments = [];
    this.agents = [];

    this.CreateAgents();

    try {
      this.MakeAssignation(
        1,
        '+52',
        '5530396748',
        'pedro.robles@outlook.com',
        'Pedro',
        'Robles'
      );

      this.MakeAssignation(
        0,
        '+52',
        '5514837767',
        'rosa.martinez@outlook.com',
        'Rosa',
        'Martinez'
      );
    } catch (e) {
      console.error('Error to Add BusinessTarget');
    }
  }

  private CreateAgents(): void {
    try {
      this.createAgent(
        0,
        'dessire.pena__truehome.com.mx',
        'Dessire',
        'Peñaflores'
      );

      this.createAgent(1, 'misael__truehome.com.mx', 'Misael', 'Monteroca');
    } catch (e) {
      console.error('Error creating Agents');
    }
  }

  private createAgent(
    agentId: number,
    mail: string,
    name: string,
    lastname: string
  ): void {
    const newAgent: Agent = {
      id: agentId,
      email: mail,
      name: name,
      lastName: lastname,
    };
    this.agents.push(newAgent);
  }

  private MakeAssignation(
    agentAssignedId: number,
    areaCodeLeadPhone: string,
    leadPhone: string,
    leadEmail: string,
    leadName: string,
    leadLastname: string
  ): void {
    const leadTelephone: Telephone = {
      areaCode: areaCodeLeadPhone,
      number: leadPhone,
    };

    const leadToAssign: Lead = {
      email: leadEmail,
      name: leadName,
      lastname: leadLastname,
      telephone: leadTelephone,
    };

    const businessTarget: BusinessTarget = {
      agentAssigned: this.agents.find((item) => item.id === agentAssignedId)!,
      lead: leadToAssign,
    };

    this.AddAssignationToSingletonArray(businessTarget);
  }

  private AddAssignationToSingletonArray(businessTarget: BusinessTarget): void {
    try {
      const previousLength = this.assignments.length;

      if (this.assignments.push(businessTarget) !== previousLength + 1) {
        throw new Error(
          'Error agregando un businesTarget even not entryed in catch'
        );
      }
    } catch (e) {
      throw new Error('Error agregando un bussinesTarget');
    }
  }
}
