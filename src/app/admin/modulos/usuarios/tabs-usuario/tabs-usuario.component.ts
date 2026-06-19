import { Location } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TabsModule } from 'primeng/tabs';

@Component({
  selector: 'app-tabs-usuario',
  standalone: true,
  imports: [RouterModule, TabsModule],
  templateUrl: './tabs-usuario.component.html',
  styleUrl: './tabs-usuario.component.scss',
})
export class TabsUsuarioComponent implements OnInit {

  protected tab = 'users';

  private readonly activeRoute = inject(ActivatedRoute);
  private readonly router      = inject(Router);
  private readonly location    = inject(Location);

  ngOnInit(): void {
    this.activeRoute.params
      .pipe(takeUntilDestroyed())
      .subscribe(params => {
        this.tab = params?.['tab'] ?? this.tab;
      });
  }

  selectTab(tab: string): void {
    if (!tab) return;
    this.tab = tab;
    this.router.navigate(['/painel/users', tab]);
  }
}
