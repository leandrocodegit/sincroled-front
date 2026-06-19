import { ConfiguracaoParametroCorComponent } from '@/admin/components/cor/configuracao-parametro-cor/configuracao-parametro-cor.component';
import { Cor } from '@/shared/sincroled/models/cor.model';
import { Dispositivo } from '@/shared/sincroled/models/dispositivo.model';
import { Parametro } from '@/shared/sincroled/models/parametro.model';
import { coerceArray } from '@angular/cdk/coercion';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';


@Component({
  selector: 'app-label-cor',
  standalone: true,
  imports: [
    CommonModule,
    ConfiguracaoParametroCorComponent
  ],
  templateUrl: './label-cor.component.html',
  styleUrl: './label-cor.component.scss'
})
export class LabelCorComponent implements OnInit {

  @Input() device?: Dispositivo;
  @Input() cor?: Cor;
  @Input() parametro?: Parametro;
  @Input() agrupar = false;

  ngOnInit(): void {

   if(this.agrupar && this.cor?.parametros.length == 1){
    this.agrupar = false;
    this.parametro = this.cor.parametros[0];
   }
  }

}
