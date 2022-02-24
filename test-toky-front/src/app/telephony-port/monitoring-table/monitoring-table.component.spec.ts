import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringTableComponent } from './monitoring-table.component';

describe('MonitoringPortComponent', () => {
  let component: MonitoringTableComponent;
  let fixture: ComponentFixture<MonitoringTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MonitoringTableComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoringTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
