import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispositivoFormComponent } from './dispositivo-form.component';

describe('DispositivoFormComponent', () => {
  let component: DispositivoFormComponent;
  let fixture: ComponentFixture<DispositivoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DispositivoFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DispositivoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
