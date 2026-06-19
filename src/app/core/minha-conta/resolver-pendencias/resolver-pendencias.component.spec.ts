import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResolverPendenciasComponent } from './resolver-pendencias.component';

describe('ResolverPendenciasComponent', () => {
  let component: ResolverPendenciasComponent;
  let fixture: ComponentFixture<ResolverPendenciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResolverPendenciasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResolverPendenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
