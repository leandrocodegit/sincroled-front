import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebugMonitorComponent } from './debug-monitor.component';

describe('DebugMonitorComponent', () => {
  let component: DebugMonitorComponent;
  let fixture: ComponentFixture<DebugMonitorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DebugMonitorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DebugMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
