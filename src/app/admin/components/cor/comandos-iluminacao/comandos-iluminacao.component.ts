import { ComandoSincronismoService, SincronismoEvento, SincronismoStatus } from '@/shared/services/ComandoSincronismoService';
import { Tipoconfiguracao } from '@/shared/sincroled/models/constantes/tipo-configuracao';
import { Cor } from '@/shared/sincroled/models/cor.model';
import { CorService } from '@/shared/sincroled/services/cor.service';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-comandos-iluminacao',
  imports: [
    CommonModule,
    DialogModule,
    DataViewModule,
    ButtonModule,
    TooltipModule
  ],
  templateUrl: './comandos-iluminacao.component.html',
  styleUrl: './comandos-iluminacao.component.scss'
})
export class ComandosIluminacaoComponent implements OnInit, OnDestroy {

  @Input({ required: true }) deviceId?: string;
  @Output() onSendCommand = new EventEmitter<Cor>();

  protected listaComandos: Cor[] = [];
  protected view = false;

  /** ID do card que está sendo enviado no momento */
  protected enviandoId = signal<string | null>(null);

  /** Status atual do comando em andamento */
  protected statusAtual = signal<SincronismoStatus>('AGUARDANDO');

  private service = inject(ComandoSincronismoService);
  private messageService = inject(MessageService);
  private corService = inject(CorService);
  protected sub?: Subscription;

  ngOnInit(): void { }

  listaCores(): void {
    if (!this.listaComandos.length) {
      this.corService.listaCores(['PRESET']).subscribe({
        next: response => { this.listaComandos = response.content; }
      });
    }
  }

  obterGradienteCores(comando: Cor): string {
    const pinos = (comando.parametros ?? []).filter((p: any) => p?.corHexa?.length);

    if (!pinos.length) return '#1e1e2e';

    if (pinos.length === 1) {
      const [c1, c2] = pinos[0].corHexa as string[];
      return c2
        ? `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)`
        : c1;
    }

    // N pinos — cada faixa ocupa 1/N com gradiente interno c1 → c2
    const pct = 100 / pinos.length;
    const partes: string[] = [];

    pinos.forEach((pino: any, idx: number) => {
      const inicio = idx * pct;
      const fim = (idx + 1) * pct;
      const [c1, c2]: string[] = pino.corHexa;

      if (c2) {
        // Mini-gradiente: c1 predomina (70%), c2 aparece no final da faixa
        const meio = inicio + pct * 0.65;
        partes.push(`${c1} ${inicio.toFixed(2)}%`);
        partes.push(`${c2} 50%`);
        // Hard stop para separar o próximo pino
        if (idx < pinos.length - 1) {
          partes.push(`${c2} ${fim.toFixed(2)}%`);
        }
      } else {
        // Só uma cor — faixa sólida com hard stops
        partes.push(`${c1} ${inicio.toFixed(2)}%`);
        partes.push(`${c1} ${fim.toFixed(2)}%`);
      }
    });

    return `linear-gradient(90deg, ${partes.join(', ')})`;
  }

  /** Gradiente suave para um único pino (efeito diagonal) */
  private gradientePino(cores: string[]): string {
    if (!cores?.length) return '#1e1e2e';
    if (cores.length === 1) return cores[0];
    return `linear-gradient(135deg, ${cores.join(', ')})`;
  }


  selecionarComando(cor: Cor): void {
    // Bloqueia novo envio enquanto um já está em andamento
    if (this.enviandoId() !== null) return;

    if (!this.deviceId) {
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Device não identificado.' });
      return;
    }

    this.enviarComando(false, cor);
  }

  enviarComando(cancelar: boolean, cor?: Cor): void {
    if (cor)
      this.enviandoId.set(cor.id);
    this.statusAtual.set('ENVIANDO');

    // Cancela subscription anterior se houver
    this.sub?.unsubscribe();

    this.sub = this.service.enviarCor(cor?.id ?? '', this.deviceId!, cancelar, Tipoconfiguracao.LED).subscribe({
      next: (evento: SincronismoEvento) => {
        this.statusAtual.set(evento.status);
        this.messageService.add(evento.toast);
      },
      error: (e: SincronismoEvento) => {
        this.statusAtual.set(e.status);
        this.enviandoId.set(null); // libera o card

      },
      complete: () => {
        this.enviandoId.set(null); // libera o card após SUCESSO ou WARN
        this.onSendCommand.emit(cor);
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
