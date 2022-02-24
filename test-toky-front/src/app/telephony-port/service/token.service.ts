import { Injectable } from '@angular/core';

import axios, { AxiosResponse } from 'axios';

import {
  GenerateTokenSuccessRes,
  GeneratedTokenData,
} from '../interfaces/http-responses/generate-token-response';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  get accessToken(): string | undefined {
    return this._generatedTokenData?.access_token;
  }

  private _generatedTokenData: GeneratedTokenData | undefined;

  constructor() {}

  public async requestToken(
    agent_id: string,
    app_id: string,
    app_key: string,
    grant_type: string = 'app_id',
    scope: string = 'sdk'
  ): Promise<void> {
    const options = this.createBuildOptions(
      agent_id,
      app_id,
      app_key,
      grant_type,
      scope
    );

    let response: AxiosResponse<GenerateTokenSuccessRes>;
    try {
      console.log(` token to -> ${agent_id}`);
      response = await axios.request(options);

      console.log(`Obtained token to -> ${agent_id}`);
      if (response.data.success) {
        this._generatedTokenData = response.data.data;
        console.log(`Token saved to -> ${agent_id}`, this._generatedTokenData);
      }
    } catch (err) {
      console.log(err);
    }
    // finally {
    //   console.log('Request token executed');
    // }
  }

  private createBuildOptions(
    agent_id: string,
    app_id: string,
    app_key: string,
    grant_type: string,
    scope: string
  ): any {
    const options = {
      method: 'POST',
      url: 'https://api.toky.co/v1/access_token',
      headers: {
        Accept: 'application/json',
        'X-App-Key': app_key,
        'Content-Type': 'application/json',
      },
      data: {
        scope: scope,
        agent_id: agent_id,
        grant_type: grant_type,
        app_id: app_id,
      },
    };

    return options;
  }
}
