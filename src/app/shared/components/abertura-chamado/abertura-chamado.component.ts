import { Component, signal, OnInit, ViewChild, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG Modules
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { FileUploadModule } from 'primeng/fileupload';
import { DialogModule } from 'primeng/dialog';
import { MessagesModule } from 'primeng/messages';
import { GravadorTelaComponent } from '../gravador-tela/gravador-tela.component';
import { DrawerModule } from 'primeng/drawer';
import { TextareaModule } from 'primeng/textarea';
import { DomSanitizer } from '@angular/platform-browser';

declare function initCapturador(): void;

interface TipoChamado {
  label: string;
  value: string;
}

@Component({
  selector: 'app-abertura-chamado',
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    TextareaModule,
    ButtonModule,
    DropdownModule,
    CheckboxModule,
    FileUploadModule,
    MessagesModule,
    GravadorTelaComponent,
    DrawerModule,
    DialogModule
  ],
  templateUrl: './abertura-chamado.component.html',
  styleUrl: './abertura-chamado.component.scss'
})
export class AberturaChamadoComponent {

  @Input() styleClass = '!text-sm transition text-gray-400 m-1';

  protected visible = false;
  protected assunto = signal<string>('');
  protected descricao = signal<string>('');
  protected tipoSelecionado = signal<TipoChamado | null>(null);
  protected anexarLogs = signal<boolean>(true);
  protected capturadoTela = false;

  // Opções para o dropdown
  protected tiposChamado: TipoChamado[] = [
    { label: 'Bug / Erro', value: 'bug' },
    { label: 'Nova Funcionalidade', value: 'feature' },
    { label: 'Melhoria', value: 'improvement' },
    { label: 'Suporte Geral', value: 'support' },
  ];

  // Controle do modal de captura
  protected showCaptureModal = signal<boolean>(false);
  protected screenshotData = signal<string | null>(null); // Para guardar a URL da captura

  // Mensagens de feedback
  protected messages = signal<any[]>([]);
  protected arquivoCapturado = signal<File | null>(null);
  protected videoPreviewUrl = signal<string | null>(null);

  // Referência ao seu componente de gravador de tela
  @ViewChild(GravadorTelaComponent) gravadorTelaComponent!: GravadorTelaComponent;

  constructor(private sanitizer: DomSanitizer) { }

ngOnInit() {
    // Escuta o evento que o JS dispara
    window.addEventListener('capturaFinalizada', this.handleCaptura.bind(this));
  }

  ngOnDestroy() {
    // Limpa o listener ao fechar a tela para evitar vazamento de memória
    window.removeEventListener('capturaFinalizada', this.handleCaptura.bind(this));
  }

  limparCaptura() {
    this.arquivoCapturado.set(null);
    this.videoPreviewUrl.set(null);
    this.capturadoTela = false;
  }

  handleCaptura(event: any) {
    const { file, url } = event.detail;

    this.arquivoCapturado.set(file);
    this.capturadoTela = true;
    // Sanitiza a URL para que o Angular permita o uso no [src] do vídeo
    const safeUrl: any = this.sanitizer.bypassSecurityTrustUrl(url);
    this.videoPreviewUrl.set(safeUrl);

  }

  abrirModalCaptura() {
    this.showCaptureModal.set(true);
    this.gravadorTelaComponent.iniciarCaptura();
  }

  // Método chamado quando a captura de tela é finalizada no seu componente
  onScreenshotCaptured(event: string) {
    this.screenshotData.set(event); // Assume que o evento é a URL da imagem
    this.showCaptureModal.set(false); // Fecha o modal após a captura
    this.messages.set([{ severity: 'success', summary: 'Sucesso', detail: 'Captura de tela anexada!' }]);
  }

  // Enviar o chamado (lógica de envio ao backend)
  enviarChamado() {
    this.messages.set([]); // Limpa mensagens anteriores

    if (!this.assunto() || !this.descricao() || !this.tipoSelecionado()) {
      this.messages.set([{ severity: 'error', summary: 'Erro', detail: 'Por favor, preencha todos os campos obrigatórios.' }]);
      return;
    }

    const payload = {
      assunto: this.assunto(),
      descricao: this.descricao(),
      tipo: this.tipoSelecionado()?.value,
      anexarLogs: this.anexarLogs(),
      capturaDeTela: this.screenshotData()
    };

    this.messages.set([{ severity: 'success', summary: 'Chamado Aberto', detail: 'Seu chamado foi enviado com sucesso!' }]);
    this.resetForm();
  }

  resetForm() {
    this.assunto.set('');
    this.descricao.set('');
    this.tipoSelecionado.set(null);
    this.anexarLogs.set(true);
    this.screenshotData.set(null);
  }
}
