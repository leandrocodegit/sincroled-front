import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdicionarVariavelComponent } from './adicionar-variavel.component';

describe('AdicionarVariavelComponent', () => {
  let component: AdicionarVariavelComponent;
  let fixture: ComponentFixture<AdicionarVariavelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdicionarVariavelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdicionarVariavelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
