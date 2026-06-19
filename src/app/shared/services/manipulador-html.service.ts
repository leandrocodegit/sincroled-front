import { EventEmitter, Injectable } from '@angular/core';
import interact from 'interactjs';
import { Subject } from 'rxjs';

var _updateDragg = new Subject<any>();
var _alterarRubrica = new Subject<any>();

@Injectable({
  providedIn: 'root',
})
export class ManipuladorHtmlService {

  public duplicar = new EventEmitter();
  public updateDragg$ = _updateDragg.asObservable();
  public updateRubrica$ = _alterarRubrica.asObservable();

  private _disabled: boolean = false;
  private _options: { resize: boolean; move: boolean; edit: boolean; pages: boolean; assinatura: boolean } = {
    resize: true,
    move: true,
    edit: true,
    pages: true,
    assinatura: false
  };

  constructor() { }

  resetMode() {
    this._options = { resize: true, move: true, edit: true, pages: true, assinatura: false };
    this._disabled = false;
  }

  disableMove() {
    this._options.move = false;
  }

  disableResize() {
    this._options.resize = false;
  }

  disableEdit() {
    this._options.edit = false;
  }

  disableEditPages() {
    this._options.pages = false;
  }

  modoAssinatura() {
    if (this._disabled)
      this._options = { resize: false, move: false, edit: false, pages: true, assinatura: false };
    else this._options = { resize: true, move: false, edit: false, pages: true, assinatura: true };
  }

  modoEdicao() {
    if (this._disabled)
      this._options = { resize: false, move: false, edit: false, pages: true, assinatura: false };
    else this._options = { resize: true, move: true, edit: true, pages: true, assinatura: false };
  }

  disabled() {
    this._options = { resize: false, move: false, edit: false, pages: false, assinatura: true };
    this._disabled = true;
  }

  public options(): { resize: boolean; move: boolean; edit: boolean; pages: boolean; assinatura: boolean } {
    return this._options;
  }

  enabled() {
    return !this._disabled;
  }

  updatePosicoes() {
    _updateDragg.next(true);
  }

  novaPosicao(newDraggable: any, posicoes: Map<number, Map<any, any>>) {

    interact(newDraggable)
      .draggable(this.getDraggable(posicoes))
      .resizable(this.getResize(posicoes));
  }


  addZone(element: any, pagina: any) {
    const newElement = document.createElement("div");
    newElement.setAttribute('data-page-number', pagina);
    newElement.id = `zone-${pagina}`;
    newElement.className = "inner-dropzone";
    newElement.style.position = 'absolute';
    newElement.style.width = `100%`;
    newElement.style.height = `100%`;
    newElement.style.minHeight = `55px`;
    newElement.style.top = `0`;
    newElement.style.left = `0`;
    newElement.style.borderRadius = `5px`;
    newElement.style.border = `${this._options.assinatura ? 'none' : 'dotted 3px dotted rgb(255 200 82)'}`;

    element.appendChild(newElement);

    // === Criar tooltip ===
    if (!this._disabled && !this._options.assinatura) {
      const tooltip = document.createElement("div");
      tooltip.className = "tooltip-mouse";
      tooltip.innerHTML = `
    <div class="flex flex-col justify-between grow">
      <div class="flex flex-col justify-between w-full relative">
        <div class="flex justify-between">
          <span class="material-symbols-outlined expand-left-top" style="color: #ffcc80ff">arrows_more_down</span>
          <span class="material-symbols-outlined expand-right-top" style="color: #ffcc80ff">arrows_more_down</span>
        </div>
        <div class="grow flex justify-center items-center  absolute bottom-[25%] top-[25%] left-[6%] left-[6%] h-max">
          <div class="flex flex-col justify-between items-center gap-0">
              ${this._options.assinatura ? '' : '<img class="box-assign" src="assets/icons/assign.png"/>'}
           </div>
        </div>
        <div class="flex justify-between">
          <span class="material-symbols-outlined expand-left-bottom" style="color: #ffcc80ff">arrows_more_down</span>
          <span class="material-symbols-outlined expand-right-bottom" style="color: #ffcc80ff">arrows_more_down</span>
        </div>
      </div>
    </div>
  `;
      tooltip.style.position = "absolute";
      tooltip.style.color = "#fff";
      tooltip.style.borderRadius = "5px";
      tooltip.style.pointerEvents = "none"; // não intercepta clique
      tooltip.style.opacity = "0";
      tooltip.style.transition = "opacity 0.2s";
      tooltip.style.border = `${this._options.assinatura ? 'solid' : 'dotted'}`;
      tooltip.style.borderWidth = `2px`;
      tooltip.style.borderColor = "#ffbf5fe1";
      tooltip.style.background = ``;
      tooltip.style.width = '25%';
      tooltip.style.pointerEvents = "none";
      newElement.appendChild(tooltip);

      // === Eventos ===
      newElement.addEventListener("mousemove", (e: MouseEvent) => {
        // só mostra se o mouse estiver no elemento principal, não em um filho
        if (e.target === newElement) {
          const dropzoneRect = newElement.getBoundingClientRect();
          const leftPercent = ((e.clientX - dropzoneRect.left) / dropzoneRect.width) * 100 - 13.5;
          const topPercent = ((e.clientY - dropzoneRect.top) / dropzoneRect.height) * 100 - 3.0;

          tooltip.style.left = `${leftPercent}%`;
          tooltip.style.top = `${topPercent}%`;
          tooltip.style.opacity = "1";
        } else {
          tooltip.style.opacity = "0";
        }
      });

      newElement.addEventListener("mouseleave", () => {
        tooltip.style.opacity = "0";
      });

      newElement.addEventListener("mouseleave", () => {
        tooltip.style.opacity = "0";
      });
    }

    return newElement;
  }

  addDraggle(event: any, config: any, id: string, pagina: any, posicoes: Map<number, Map<any, any>>, width?: any, height?: any) {

    if (!posicoes)
      return;

    const newDraggable = document.createElement('div');
    newDraggable.id = id;
    newDraggable.setAttribute('data-posicao', id);
    newDraggable.setAttribute('data-mail', config.signatario.email);
    newDraggable.setAttribute('data-page-number', pagina);
    newDraggable.classList.add('draggable-sign', 'drag-drop');
    newDraggable.style.textAlign = 'center';


    const options = `
                <div class="flex gap-2 absolute top-[-27px] justify-end w-full">
                ${this._options.edit ? `
                  <div class="group inline-block">
                    <span style="background: ${config.signatario.color}e0" data-posicao="${id}" data-mail="${config.signatario.email}"
                      class="remover material-symbols-outlined cursor-pointer text-white p-[3px] rounded !text-[15px]">
                      cancel
                    </span>
                    <div
                      class="tooltip-assign flex items-center gap-2 absolute bottom-full left-1/2 -translate-x-1/2 mb-8
                              p-4 text-white bg-gray-800 rounded-lg shadow-lg
                              opacity-0 hidden group-hover:opacity-90 group-hover:flex transition-opacity duration-300 whitespace-nowrap">
                      <span style="color: rgb(124 164 181);" class="material-symbols-outlined icon-dragg">
                        cancel
                      </span> Remover posição
                    </div>
                  </div>
                  <div class="group inline-block">
                    <span style="background: ${config.signatario.color}e0" data-posicao="${id}" data-mail="${config.signatario.email}"
                      class="remover-todos material-symbols-outlined cursor-pointer text-white p-[3px] rounded !text-[15px]">
                      contract_delete
                    </span>
                    <div
                      class="tooltip-assign flex items-center gap-2 absolute bottom-full left-1/2 -translate-x-1/2 mb-8
                              p-4 text-white bg-gray-800 rounded-lg shadow-lg
                              opacity-0 hidden group-hover:opacity-90 group-hover:flex transition-opacity duration-300 whitespace-nowrap">
                      <span style="color: rgb(124 164 181);" class="material-symbols-outlined icon-dragg">
                        contract_delete
                      </span> Remover de todas as páginas
                    </div>
                  </div>
                  ${this._options.pages ? `
                  <div class="group inline-block">
                    <span style="background: ${config.signatario.color}e0" data-posicao="${id}"
                      class="copiar material-symbols-outlined cursor-pointer text-white p-[3px] rounded !text-[15px]">
                      copy_all
                    </span>
                    <div
                      class="tooltip-assign flex items-center gap-2 border absolute bottom-full left-1/2 -translate-x-1/2 mb-8
                              p-4 text-white bg-gray-800 rounded-lg shadow-lg
                              opacity-0 hidden group-hover:opacity-90 group-hover:flex transition-opacity duration-300 whitespace-nowrap">
                      <span style="color: rgb(124 164 181);" class="material-symbols-outlined icon-dragg">
                        copy_all
                      </span> Copiar para todas as páginas
                    </div>
                    </div>` : ''}
                     ` : ''}
                    ${this._options.assinatura ? `
                      <div class="group inline-block">
                      <span style="background: ${config.signatario.color}e0" data-posicao="${id}"
                        class="alterar-rubrica material-symbols-outlined cursor-pointer text-white p-[2px] rounded !text-[15px]">
                        signature
                      </span>
                      <div
                        class="tooltip-assign flex items-center gap-2 border absolute bottom-full left-1/2 -translate-x-1/2 mb-8
                              p-4 text-white bg-gray-800 rounded-lg shadow-lg
                              opacity-0 hidden group-hover:opacity-90 group-hover:flex transition-opacity duration-300 whitespace-nowrap">
                        <span style="color: rgb(124 164 181);" class="material-symbols-outlined icon-dragg">
                          signature
                        </span> Alterar rubrica
                      </div>
                  </div>` : ''}
                  </div>
                `

    newDraggable.innerHTML =
      `
       ${!this._disabled ? options : ''}
    <div class="flex flex-col justify-between w-full grow h-full relative">

      <div class="flex flex-col justify-between grow w-full h-full" ${config?.signatario?.rubrica ? `style="background-image: url(${config?.signatario?.rubrica});background-size: contain; background-repeat: no-repeat; background-position: center"` : ''}>
        <div class="flex justify-between">
          <span class="material-symbols-outlined expand-left-top" style="color: ${config.signatario.color}">arrows_more_down</span>
          <span class="material-symbols-outlined expand-right-top" style="color: ${config.signatario.color}">arrows_more_down</span>
        </div>
        <div class="grow flex justify-center items-center absolute bottom-[25%] top-[25%] left-[6%] right-[6%] h-max">
          <div class="flex flex-col justify-between items-center">
              ${this._options.assinatura ? `` : `${config?.signatario?.rubrica ? '' : '<img class="box-assign" src="assets/icons/assign.png"/>'}`}
                <span style="
                    font-family: monospace;
                    color: ${config.signatario.color};
                    font-size: calc(0.5em + 6px);
                    position: absolute;
                    /* Novas propriedades para truncar com ... */
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    /* Defina a largura máxima permitida para o e-mail */
                    max-width: 95%;
                    display: block;
                ">
                    ${this._options.assinatura ? `${!config?.signatario?.rubrica ? 'Assinar Aqui' : ''}` : `${config?.signatario?.rubrica ? '' : config.signatario?.email}`}
                </span>
              </div>
        </div>
       <div class="flex justify-between">
          <span class="material-symbols-outlined expand-left-bottom" style="color: ${config.signatario.color}">arrows_more_down</span>
          <span class="material-symbols-outlined expand-right-bottom" style="color: ${config.signatario.color}">arrows_more_down</span>
        </div>
      </div>
    </div>`;

    let xLeft;
    let yTop;

    if (event?.currentTarget?.getBoundingClientRect()) {
      xLeft = config.left;
      yTop = config.top;
    } else {
      xLeft = posicoes.get(pagina).get(id).left;
      yTop = posicoes.get(pagina).get(id).top;
    }

    newDraggable.style.position = 'absolute';
    newDraggable.style.left = `${xLeft}%`;
    newDraggable.style.top = `${yTop}%`;
    newDraggable.style.border = `${this._options.assinatura ? 'solid' : 'dotted'}`;
    newDraggable.style.width = '25%';
    //newDraggable.style.height = '5%';
    //newDraggable.style.minHeight = '50px';
    newDraggable.style.borderWidth = `2px`;
    newDraggable.style.borderColor = `${config.signatario.color}`;
    newDraggable.style.background = `${config.signatario.color}35`;

    const removerBtn = newDraggable.querySelector('.remover');
    if (removerBtn) {
      removerBtn.addEventListener('click', (e) => {
        const zone = removerBtn.getAttribute('data-posicao');
        posicoes.get(Number.parseInt(pagina)).delete(zone);
        e.stopPropagation();
        newDraggable.remove();
        _updateDragg.next(true)
      });
    }

    const removerTotosBtn = newDraggable.querySelector('.remover-todos');
    if (removerTotosBtn) {
      removerTotosBtn.addEventListener('click', (e) => {
        const email = removerTotosBtn.getAttribute('data-mail');
        this.removerTodos(email, posicoes);
        e.stopPropagation();
        newDraggable.remove();
        _updateDragg.next(true)
      });
    }

    const copiarBtn = newDraggable.querySelector('.copiar');
    if (copiarBtn) {
      copiarBtn.addEventListener('click', (e) => {
        const zone = copiarBtn.getAttribute('data-posicao');
        const email = copiarBtn.getAttribute('data-mail');
        const pagina = newDraggable.getAttribute('data-page-number');

        this.duplicar.emit({
          pagina: pagina,
          zone: zone,
          email: email
        })
        e.stopPropagation();
        _updateDragg.next(true)
      });
    }

    const alterarRubrica = newDraggable.querySelector('.alterar-rubrica');
    if (alterarRubrica) {
      alterarRubrica.addEventListener('click', (e) => {
        e.stopPropagation();
        _alterarRubrica.next(true)
      });
    }



    if (event?.currentTarget) {
      event.currentTarget.appendChild(newDraggable);
    } else {
      event.appendChild(newDraggable);
    }
    return newDraggable;
  }


  removerTodos(email: string, posicoes: Map<number, Map<any, any>>) {

    if (!posicoes)
      return;

    Array.from(posicoes.keys()).forEach(page => {
      Array.from(posicoes.get(page).keys()).forEach(key => {
        const posicao = posicoes.get(page).get(key);
        if (posicoes.get(page).get(key).signatario.email == email) {
          if (posicao?.drag)
            posicao?.drag.remove();
          posicoes.get(page).delete(key);
        }
      })
    })
  }


  addPosicao(posicao: any, element: any) {
    const newDraggable = document.createElement('div');
    newDraggable.id = posicao.id;
    newDraggable.classList.add('posicao-print', 'min-h-[55px]');
    newDraggable.style.textAlign = 'center';
    newDraggable.style.minHeight = '55px';
    newDraggable.innerHTML = `
    <span id="label">Assinatura</span>`;
    newDraggable.style.position = 'absolute';
    newDraggable.style.left = `${posicao.lef}%`;
    newDraggable.style.top = `${posicao.top}%`;
    element.appendChild(newDraggable);
    return newDraggable;
  }

  private getDraggable(posicoes: any) {
    return {
      autoScroll: false,
      inertia: false,
      modifiers: [
        interact.modifiers.snap({
          targets: [interact.snappers.grid({ x: 0, y: 0 })],
          range: Infinity,
          relativePoints: [{ x: 0, y: 0 }]
        }),
        interact.modifiers.restrict({
          restriction: 'parent',
          elementRect: { top: 0, left: 0, bottom: 1, right: 1 },
          endOnly: false
        })
      ],
      listeners:
        this.getMove(posicoes)
    }
  }

  private getMove(posicoes: any): any {

    if (!this._options.move)
      return;

    return {
      move(event: any) {
        const target = event.target;
        const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
        const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
        target.style.transform = `translate(${x}px, ${y}px)`;
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
      },
      end(event: any) {
        let pagina = event.target.getAttribute('data-page-number');
        if (pagina == 'null') pagina = event.getAttribute('data-page-number');
        if (pagina != 'null') {
          const draggableRect = event.target.getBoundingClientRect();
          const containerRect = document.getElementById('zone-' + pagina)!.getBoundingClientRect();
          const leftPercent = ((draggableRect.left - containerRect.left) / containerRect.width) * 100;
          const topPercent = ((draggableRect.top - containerRect.top) / containerRect.height) * 100;
          const posicaoId = event.target.getAttribute('data-posicao');
          const posicao = posicoes.get(Number.parseInt(pagina))?.get(posicaoId);

          if (posicao) {
            const leftDiv = event.target?.style?.left?.replace('%', '');
            const topDiv = event.target?.style?.top?.replace('%', '');

            posicao.left = leftPercent;
            posicao.top = topPercent;
            posicao.left_percent = leftPercent;
            posicao.top_percent = topPercent;
            posicao.left_pixel = containerRect.width * (Number(leftDiv) / 100);
            posicao.top_pixel = containerRect.height * (Number(topDiv) / 100);
            posicao.default_left_pixel = 790 * (Number(leftDiv) / 100);
            posicao.default_top_pixel = containerRect.height * (Number(topDiv) / 100);
            posicao.draggable_left = leftDiv;
            posicao.draggable_top = topDiv;

            if (!posicao?.page_width) posicao.page_width = containerRect.width;
            if (!posicao?.page_height) posicao.page_height = containerRect.height;

            posicao.position_d4sing_x = posicao.page_width * (leftPercent / 100);
            posicao.position_d4sing_y = posicao.page_height * (topPercent / 100);
            posicao.update = true;
            posicao.width_percent = (Number(posicao.width) / posicao.page_width) * 100;
            posicao.height_percent = (Number(posicao.height) / posicao.page_height) * 100;

            posicoes.get(Number.parseInt(pagina)).set(posicaoId, posicao);
            _updateDragg.next(true);
          }
        }
      }
    }
  }

  private getResize(posicoes: any) {

    if (!this._options.resize)
      return;

    return {
      edges: {
        top: '.expand-left-top, .expand-right-top',
        left: '.expand-left-bottom, .expand-left-top',
        bottom: '.expand-left-bottom, .expand-right-bottom',
        right: '.expand-right-bottom, .expand-right-top',
      },
      modifiers: [
        interact.modifiers.restrictSize({
          min: { width: 80, height: 35 },
          max: { width: 350, height: 200 }
        })
      ],
      listeners: {
        move(event: any) {
          const target = event.target;
          let x = (parseFloat(target.getAttribute('data-x')) || 0);
          let y = (parseFloat(target.getAttribute('data-y')) || 0);

          target.style.width = event.rect.width + 'px';
          target.style.height = event.rect.height + 'px';

          let pagina = event.target.getAttribute('data-page-number');

          if (pagina == 'null')
            pagina = event.getAttribute('data-page-number');

          const posicaoId = event.target.getAttribute('data-posicao');
          var posicao = posicoes.get(Number.parseInt(pagina)).get(posicaoId);

          if (posicao) {
            posicao.width = event.rect.width;
            posicao.height = event.rect.height;
          }

          posicoes.get(Number.parseInt(pagina)).set(posicao.id, posicao)
          x += event.deltaRect.left;
          y += event.deltaRect.top;

          posicao.width_percent = (Number(posicao.width) / posicao.page_width) * 100;
          posicao.height_percent = (Number(posicao.height) / posicao.page_height) * 100;

          target.style.transform = `translate(${x}px, ${y}px)`;
          target.setAttribute('data-x', x);
          target.setAttribute('data-y', y);
        }
      }
    }
  }

}
