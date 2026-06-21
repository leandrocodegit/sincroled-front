import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SincronizarTodosComponent } from './sincronizar-todos.component';

describe('SincronizarTodosComponent', () => {
  let component: SincronizarTodosComponent;
  let fixture: ComponentFixture<SincronizarTodosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SincronizarTodosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SincronizarTodosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
