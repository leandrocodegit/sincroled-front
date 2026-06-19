import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GravadorTelaComponent } from './gravador-tela.component';

describe('GravadorTelaComponent', () => {
  let component: GravadorTelaComponent;
  let fixture: ComponentFixture<GravadorTelaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GravadorTelaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GravadorTelaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
