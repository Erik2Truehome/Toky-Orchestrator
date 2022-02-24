import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Modulo que concentra todos los modudlos de primeNg
import { PrimengModule } from '../primeng/primeng.module';

//paginas dentro de mi aplicacion
import { FormsModule } from '@angular/forms';

import { MonitoringPageComponent } from './pages/monitoring-page/monitoring-page.component';
import { MonitoringTableComponent } from './monitoring-table/monitoring-table.component';
import { SoftphoneModule } from '../softphone/softphone.module';

//

@NgModule({
  declarations: [MonitoringPageComponent, MonitoringTableComponent],
  exports: [MonitoringPageComponent],
  imports: [CommonModule, FormsModule, PrimengModule, SoftphoneModule],
})
export class TelephonyPortModule {}
