import { Injectable, OnDestroy } from "@angular/core";
import { MessageService } from "primeng/api";
import { ManipuladorHtmlService } from "./manipulador-html.service";
import { PDFDocumentProxy } from "ng2-pdf-viewer";
import interact from "interactjs";
import { Subject, Subscription } from "rxjs";
export interface PosicaoPin {
  id: string;
  pagina: number;
  top: number;
  left: number;
  width: number;
  height: number;
  signatario: any;
  drag?: any;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class PosicaoAssinaturaService implements OnDestroy {
  // Estado interno encapsulado na classe
  private readonly _posicoes: Map<number, Map<string, any>> = new Map();
  private _signatarioSelecionado: any;
  private readonly _updateDragg = new Subject<boolean>();
  private readonly _pageComplete = new Subject<boolean>();
  private readonly _subs = new Subscription();

  public isInit = false;
  public totalPages = 0;
  public updateDragg$ = this._updateDragg.asObservable();
  public pageComplete$ = this._pageComplete.asObservable();


  constructor(
    private manipuladorHtmlService: ManipuladorHtmlService,
    private messageService: MessageService
  ) {
    this.registrarSubscribers();
  }

  ngOnDestroy() {
    this._subs.unsubscribe();
  }

  private registrarSubscribers() {
    this._subs.add(
      this.manipuladorHtmlService.updateDragg$.subscribe(() => this._updateDragg.next(true))
    );

    this._subs.add(
      this.manipuladorHtmlService.duplicar.subscribe(data => this.duplicarPosicao(data))
    );
  }

  private duplicarPosicao(data: any) {
    const paginaOrigem = Number.parseInt(data.pagina);
    const posicaoOriginal = this._posicoes.get(paginaOrigem)?.get(data.zone);

    if (!posicaoOriginal) return;

    for (let i = 1; i <= this.totalPages; i++) {
      if (i === paginaOrigem) continue;

      const id = crypto.randomUUID();
      const pageContainer = document.querySelector(`div.page[data-page-number="${i}"]`);

      if (!pageContainer) continue;

      const newDraggable = this.manipuladorHtmlService.addDraggle(
        pageContainer,
        {
          signatario: posicaoOriginal.signatario,
          left: posicaoOriginal.left,
          top: posicaoOriginal.top,
        },
        id,
        i,
        this._posicoes,

        posicaoOriginal.width, posicaoOriginal.height
      );

      this.adicionarPosicaoAoMapa(i, id, {
        ...posicaoOriginal,
        id,
        pagina: i,
        drag: newDraggable
      });

      this.manipuladorHtmlService.novaPosicao(newDraggable, this._posicoes);
    }

    this.messageService.add({
      severity: 'info',
      summary: 'Copiado',
      detail: `Assinatura de ${posicaoOriginal.signatario.email} replicada.`
    });
  }

  public carregarPdf(pdf: PDFDocumentProxy) {
    this.totalPages = pdf.numPages;
    if (this.totalPages == 1)
      this.manipuladorHtmlService.disableEditPages()
    for (let i = 1; i <= this.totalPages; i++) {
      if (!this._posicoes.has(i)) this._posicoes.set(i, new Map());
    }
    this.initializeInteract();
  }

  public pageRendered(event: any) {
    if (this.manipuladorHtmlService.enabled()) {
      const pageNumber = event.pageNumber;
      const zone = this.manipuladorHtmlService.addZone(event.source.div, pageNumber);
      this.isInit = true;
      this.refazerPosicoes(zone, pageNumber);
    }
  }

  public selecionarSignatario(value: any) {
    this._signatarioSelecionado = value;
  }

  private initializeInteract() {

    if (this.manipuladorHtmlService.enabled()) {
      let lastTapTime = 0;
      const self = this; // Referência para usar dentro do callback do interact

      interact('.inner-dropzone').unset();
      if (this.manipuladorHtmlService.options().edit)
        interact('.inner-dropzone').on('tap', (event) => {
          const currentTime = Date.now();
          const tapLength = currentTime - lastTapTime;

          if (tapLength < 1000 && tapLength > 0) {
            self.handleDoubleTap(event);
          }
          lastTapTime = currentTime;
        });
    }
  }

  private handleDoubleTap(event: any) {
    const pagina = event.target.getAttribute('data-page-number');

    if (!this._signatarioSelecionado?.email) {
      this.messageService.add({ severity: 'warn', summary: 'Erro', detail: 'Selecione um signatário' });
      return;
    }

    const id = crypto.randomUUID();
    const dropzoneRect = event.currentTarget.getBoundingClientRect();
    const containerRect = document.getElementById('zone-' + pagina)!.getBoundingClientRect();

    const leftPercent = ((event.clientX - dropzoneRect.left) / containerRect.width) * 100 - 13.5;
    const topPercent = ((event.clientY - dropzoneRect.top) / containerRect.height) * 100 - 3.0;

    const config = { signatario: this._signatarioSelecionado, id, left: leftPercent, top: topPercent };
    const newDraggable = this.manipuladorHtmlService.addDraggle(
      event,
      config,
      id,
      pagina,
      this._posicoes);

    this.adicionarPosicaoAoMapa(Number(pagina), id, {
      id,
      pagina: Number(pagina),
      top: topPercent,
      left: leftPercent,
      width: newDraggable.getBoundingClientRect().width,
      height: newDraggable.getBoundingClientRect().height,
      page_width: containerRect.width,
      page_height: containerRect.height,
      position_d4sing_x: containerRect.width * (leftPercent / 100),
      position_d4sing_y: containerRect.height * (topPercent / 100),
      drag: newDraggable,
      width_percent: (Number(newDraggable.getBoundingClientRect().width) / containerRect.width) * 100,
      height_percent: (Number(newDraggable.getBoundingClientRect().height) / containerRect.height) * 100,
      signatario: { ...this._signatarioSelecionado }
    });

    this.manipuladorHtmlService.novaPosicao(newDraggable, this._posicoes);
    this._updateDragg.next(true);
  }

  private adicionarPosicaoAoMapa(pagina: number, id: string, dados: PosicaoPin) {
    if (!this._posicoes.has(pagina)) this._posicoes.set(pagina, new Map());
    this._posicoes.get(pagina)!.set(id, dados);
  }

  public refazerPosicoes(pageContainer: any, pageNumber: number) {
    const posicoesPagina = this._posicoes.get(pageNumber);
    if (!posicoesPagina || !pageContainer) return;

    posicoesPagina.forEach((posicao, key) => {
      if (posicao.drag) posicao.drag.remove();

      const newDraggable = this.manipuladorHtmlService.addDraggle(
        pageContainer, { signatario: posicao.signatario, left: posicao.left, top: posicao.top }, key, pageNumber, this._posicoes, posicao.width, posicao.height
      );

      posicao.drag = newDraggable;
      this.manipuladorHtmlService.novaPosicao(newDraggable, this._posicoes);
    });

    this._pageComplete.next(true);


    // this.manipuladorHtmlService.disablePixel();
  }

  public getPosicoes() { return this._posicoes; }

  public reset() {
    console.log('Reset');

    this._posicoes.clear();
    this._signatarioSelecionado = undefined;
  }

  public setSignatarioSelecionado(value: any) {

    this._signatarioSelecionado = value;

  }

  public getSignatarioSelecionado() {
    return this._signatarioSelecionado;
  }


  public initPosicoesD4sign(pins: any[], signatarios: Map<string, any>) {

    let posicoes: any[] = [];
    //  this.manipuladorHtmlService.enablePixel();
    pins.forEach(element => {
      var pagina = Number(element.pagina);

      posicoes.push({
        id: crypto.randomUUID(),
        width: element.width,
        height: element.height,
        pagina: Number(element.pagina),
        position_d4sing_x: Number(element.position_x),
        position_d4sing_y: Number(element.position_y),
        left: Number(element.position_x) / Number(element.page_width) * 100,
        top: Number(element.position_y) / Number(element.page_height) * 100,
        page_width: String(element.page_width),
        page_height: String(element.page_height),
        signatario: {
          email: element.email,
          color: signatarios.get(element.email)?.color
        }
      });
    });

    console.log(posicoes);

    return posicoes;
  }
}


