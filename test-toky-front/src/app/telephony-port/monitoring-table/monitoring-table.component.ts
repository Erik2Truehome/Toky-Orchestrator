import { Component, OnInit } from '@angular/core';
import { Port } from '../classes/Port';
import {
  IPort,
  Agent,
  BusinessTarget,
  CurrentInfoPort,
  Lead,
  PortRegistrationStatus,
  PortStatus,
  Telephone,
  Country,
} from '../interfaces/IPort';

import { PortService } from '../service/port.service';

@Component({
  selector: 'app-monitoring-table',
  templateUrl: './monitoring-table.component.html',
  styleUrls: ['./monitoring-table.component.css'],
})
export class MonitoringTableComponent {
  // public ports: IPort[];

  get ports(): IPort[] {
    // console.log('en la tabla', this.portService.ports);
    return [...this.portService.ports];
  }

  public selectedPort: IPort | null;

  public A: PortRegistrationStatus = PortRegistrationStatus.REGISTERED;

  constructor(private portService: PortService) {
    // this.ports = portService.ports;
    this.selectedPort = null;
  }
}
