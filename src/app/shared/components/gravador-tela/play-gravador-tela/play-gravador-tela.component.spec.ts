import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayGravadorTelaComponent } from './play-gravador-tela.component';

describe('PlayGravadorTelaComponent', () => {
  let component: PlayGravadorTelaComponent;
  let fixture: ComponentFixture<PlayGravadorTelaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayGravadorTelaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayGravadorTelaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
