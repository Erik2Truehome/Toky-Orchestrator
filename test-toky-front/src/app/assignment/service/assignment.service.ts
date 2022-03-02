import { Injectable } from '@angular/core';

import {
  BusinessTarget,
  Telephone,
  Lead,
  Agent,
} from 'src/app/telephony-port/interfaces/IPort';
import { IAssignment } from '../interfaces/IAssignment';
import { Assignment } from '../classes/Assignment';

@Injectable({
  providedIn: 'root',
})
export class AssignmentService {
  public assignments: IAssignment[];
  public agents: Agent[];

  private idAssignmentCount: number = 1;

  constructor() {
    this.assignments = [];
    this.agents = [];

    this.CreateAgents();

    try {
      this.MakeAssignation(
        1,
        '+52',
        'numero a 10 digitos',
        'clau.rodri@outlook.com',
        'Claudia',
        'Rodriguez'
      );

      this.MakeAssignation(
        1,
        '+52',
        '5959212310',
        'delfi.espinoza@outlook.com',
        'Delfino',
        'Espinoza'
      );

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
        'dessire.pena@truehome.com.mx',
        'Dessire',
        'Peñaflores',
        '+525585262096'
      );

      this.createAgent(
        1,
        'misael@truehome.com.mx',
        'Misael',
        'Monteroca',
        '+525585262096'
      );
    } catch (e) {
      console.error('Error creating Agents');
    }
  }

  private createAgent(
    agentId: number,
    mail: string,
    name: string,
    lastname: string,
    ivrPhone: string
  ): void {
    const newAgent: Agent = {
      id: agentId,
      email: mail,
      name: name,
      lastName: lastname,
      ivrPhone: ivrPhone,
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

      const newAssignment = new Assignment(
        this.idAssignmentCount.toString(),
        businessTarget
      );

      if (this.assignments.push(newAssignment) !== previousLength + 1) {
        throw new Error(
          'Error agregando un businesTarget even not entryed in catch'
        );
      }

      this.idAssignmentCount++;
    } catch (e) {
      throw new Error('Error agregando un bussinesTarget');
    }
  }
}
