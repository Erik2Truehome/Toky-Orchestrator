import { NgModule } from '@angular/core';

//PRIME NG

import { CardModule } from 'primeng/card';

import { FieldsetModule } from 'primeng/fieldset';

//PRIME NG para app de truehome
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ProgressBarModule } from 'primeng/progressbar';
import { InputTextModule } from 'primeng/inputtext';

import { SliderModule } from 'primeng/slider';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
  exports: [
    ButtonModule,
    RippleModule,
    CardModule,
    MenubarModule,
    FieldsetModule,
    TableModule,
    ToastModule,
    ProgressBarModule,
    InputTextModule,

    // CalendarModule,
    // SliderModule,
    // MultiSelectModule,
    // ContextMenuModule,
    // DialogModule,
    // DropdownModule,
  ],
})
export class PrimengModule {}
