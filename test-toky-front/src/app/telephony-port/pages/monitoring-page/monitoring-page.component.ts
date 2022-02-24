import { Component, OnInit } from '@angular/core';
import { OptionUI } from '../../classes/OptionUI';
import { PortService } from '../../service/port.service';

@Component({
  selector: 'app-monitoring-page',
  templateUrl: './monitoring-page.component.html',
  styleUrls: ['./monitoring-page.component.css'],
})
export class MonitoringPageComponent implements OnInit {
  private readonly phoneNumberTEC: string = '+525585262096'; //numero por el que sacamos las llamadas a los leads

  //incio de opcion 1
  public lead_number_opt_1: string = '5530396748'; //'5530396748';
  //fin opcion 1

  //Inicio opcion 2
  public lead_number_1: string = '5530396748'; //'5530396748';
  public ivr_agent_assigned_1: string = this.phoneNumberTEC;

  public lead_number_2: string = '5514837767'; //carmen
  public ivr_agent_assigned_2: string = this.phoneNumberTEC;
  //fin opcion 2

  //inicio opcion 3
  public lead_numbers_opt_3: string = '5514837767'; //,5530396748,5959212310
  //fin opcion 3

  constructor(private portService: PortService) {}

  //inicio opcion 1

  public ReceiveLead_opt1(): void {
    const port = this.portService.ports.find((port) => port.idDatabase === 1);
    if (port) {
      port.configureOptionCallType(OptionUI.Op1_DirectCall);
      port.configureAgentAssigned('testEmail@truehome.com.mx');
      port.launchCall(this.phoneNumberTEC, this.lead_number_opt_1, '52');
    }
  }
  //fin opcion 1

  public ReceiveLead1(): void {
    const port = this.portService.ports.find((port) => port.idDatabase === 1);
    if (port) {
      port.configureOptionCallType(OptionUI.Op2_By_Ivr);
      port.configureAgentAssigned(this.ivr_agent_assigned_1);
      port.launchCall(this.phoneNumberTEC, this.lead_number_1, '52');
    }
  }
  public ReceiveLead2(): void {
    const port = this.portService.ports.find((port) => port.idDatabase === 1);
    if (port) {
      port.configureOptionCallType(OptionUI.Op2_By_Ivr);
      port.configureAgentAssigned(this.ivr_agent_assigned_2);
      port.launchCall(this.phoneNumberTEC, this.lead_number_2, '52');
    }
  }

  public ReceiveBothLeads(): void {
    this.ReceiveLead1();
    this.ReceiveLead2();
  }

  public ReceiveManyPhones_Opt3(): void {
    let phones: string[] = this.lead_numbers_opt_3.split(',');

    phones.forEach((item) => {
      this.portService.telephonyClients[0].launchCall(
        this.phoneNumberTEC,
        item,
        '52'
      );
    });
  }

  ngOnInit(): void {}
}
