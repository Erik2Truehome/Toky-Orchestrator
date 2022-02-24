import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoftphoneActionsComponent } from './softphone-actions.component';

describe('SoftphoneActionsComponent', () => {
  let component: SoftphoneActionsComponent;
  let fixture: ComponentFixture<SoftphoneActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SoftphoneActionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SoftphoneActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
