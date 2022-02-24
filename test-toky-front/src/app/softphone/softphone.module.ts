import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SoftphoneActionsComponent } from './softphone-actions/softphone-actions.component';
import { PrimengModule } from '../primeng/primeng.module';
import { FormsModule, NgModel } from '@angular/forms';

@NgModule({
  declarations: [SoftphoneActionsComponent],
  imports: [CommonModule, FormsModule, PrimengModule],
  exports: [SoftphoneActionsComponent],
})
export class SoftphoneModule {}
