import { CommonModule } from '@angular/common';
import { Component, computed, Input } from '@angular/core';
import { Conexao } from '@/shared/sincroled/models/dispositivo.model';



@Component({
  selector: 'app-nivel-wifi',
  imports: [
    CommonModule
  ],
  templateUrl: './nivel-wifi.component.html',
  styleUrl: './nivel-wifi.component.scss'
})
export class NivelWIFIComponent {

  @Input({ required: true }) conexao?: Conexao;

  public sinalConfig() {
    const dbm = this.conexao?.wifiRssi || 0;

    if (!this.conexao?.wifiConectado || dbm === 0)
      return { barras: 0, classe: 'text-gray-500', descricao: 'Sem sinal' };

    if (dbm >= -60)
      return { barras: 4, classe: 'text-green-500', descricao: 'Excelente' };
    else if (dbm >= -70)
      return { barras: 3, classe: 'text-green-400', descricao: 'Bom' };
    else if (dbm >= -80)
      return { barras: 2, classe: 'text-yellow-500', descricao: 'Regular' };
    else if (dbm >= -90)
      return { barras: 1, classe: 'text-orange-500', descricao: 'Fraco' };
    else
      return { barras: 0, classe: 'text-red-500', descricao: 'Sem Sinal / Crítico' };
  }
}
