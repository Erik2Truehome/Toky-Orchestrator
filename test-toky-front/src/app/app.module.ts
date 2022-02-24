//imports from Angular
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//imports from my application
import { HttpClientModule } from '@angular/common/http';

import { SharedModule } from './shared/shared.module';
import { TelephonyPortModule } from './telephony-port/telephony-port.module';

import { AppComponent } from './app.component';
import { SoftphoneModule } from './softphone/softphone.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    TelephonyPortModule,
    SoftphoneModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
