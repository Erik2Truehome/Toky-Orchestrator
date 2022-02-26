import { APP_ID, Injectable, OnInit } from '@angular/core';

//Toky
//const TokySDK = require('toky-phone-js-sdk');
import { OptionUI } from '../classes/OptionUI';

import { Agent, Country } from '../interfaces/IPort';
import { ITelephonyClient } from '../interfaces/ITelephonyClient';
import { CreatePortService } from './create-port.service';

import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class PortService {
  public ports: any[];
  public telephonyClients: any[] = [];

  private APP_ID: string = '8cb5c73194b59381bc8da3380c502d25';
  private APP_KEY: string =
    'f63da3431de5ae0360d6d37d8865cad2f579fc558c43dbca8c122949af282f5b';

  private agentIdEmail = 'erik.montes+demo@truehome.com.mx'; //'erik.montes+demo@truehome.com.mx'; ////'dessire.pena@truehome.com.mx' //'misael@truehome.com.mx'

  constructor(
    private tokenService: TokenService,
    private createPortService: CreatePortService
  ) {
    this.ports = [];

    this.Initialize();
  }

  async Initialize(): Promise<void> {
    await this.generateToken();
    await this.createTokyClients();
  }

  private async generateToken() {
    try {
      await this.tokenService.requestToken(
        this.agentIdEmail,
        this.APP_ID,
        this.APP_KEY
      );
    } catch (err) {
      console.error(err);
    }
  }

  private async createTokyClients() {
    let mexico: Country = {
      code: '1545',
      name: 'México',
    };

    let agentLinkedPort: Agent = {
      id: -1,
      email: this.agentIdEmail,
      name: 'Erik',
      lastName: 'Montes',
    };

    try {
      let telephonyClient1: ITelephonyClient | undefined =
        await this.createPortService.create(
          agentLinkedPort,
          'agent',
          true, //true-> para poder recibir el invite de una inbound call or false
          true, //graba las llamadas
          mexico,
          10
        );

      this.telephonyClients.push(telephonyClient1);

      if (telephonyClient1) {
        console.log('si');
        // this.ports.push(telephonyClient1.ports);
        this.ports = [...telephonyClient1.ports];
      }

      console.log('los puertos actuales', this.ports);
    } catch (e) {
      console.error(e);
    }
  }
}
