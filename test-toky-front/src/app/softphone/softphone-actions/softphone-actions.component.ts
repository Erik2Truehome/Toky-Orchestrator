import { Component, OnInit } from '@angular/core';
import { PortService } from '../../telephony-port/service/port.service';

@Component({
  selector: 'app-softphone-actions',
  templateUrl: './softphone-actions.component.html',
  styleUrls: ['./softphone-actions.component.css'],
})
export class SoftphoneActionsComponent implements OnInit {
  public transferringPhone: string = '5514837767';
  public transferringEmail: string = '';

  constructor(private portService: PortService) {}

  ngOnInit(): void {}

  public hangUpCurrentCall(): void {
    const port = this.portService.ports.find((port) => port.idDatabase === 1);
    if (port) {
      port.hangUp();
    }
  }

  public tranferToNumber(): void {
    const port = this.portService.ports.find((port) => port.idDatabase === 1);
    if (port) {
      port.TransferToNumber(this.transferringPhone, 'warm'); //blind or warm, la mejor es la warm, porque en blind el cliente final deja de escuchar el audio de espera
    }
  }

  public tranferToEmail(): void {
    const port = this.portService.ports.find((port) => port.idDatabase === 1);
    if (port) {
      port.TransferToEmail(this.transferringEmail, 'warm'); //blind or warm, la mejor es la warm, porque en blind el cliente final deja de escuchar el audio de espera
    }
  }

  public AnswerInboundCall(): void {
    const port = this.portService.ports.find((port) => port.idDatabase === 1);
    if (port) {
      port.AnswerInboundCall(); //blind or warm, la mejor es la warm, porque en blind el cliente final deja de escuchar el audio de espera
    }
  }
}
