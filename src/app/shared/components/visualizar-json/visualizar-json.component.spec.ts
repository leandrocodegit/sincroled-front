import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarJsonComponent } from './visualizar-json.component';

describe('VisualizarJsonComponent', () => {
  let component: VisualizarJsonComponent;
  let fixture: ComponentFixture<VisualizarJsonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisualizarJsonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualizarJsonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
