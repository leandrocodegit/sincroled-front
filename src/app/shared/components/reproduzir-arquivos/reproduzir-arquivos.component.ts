import { Component, Input, OnInit } from '@angular/core';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { AccordionModule } from 'primeng/accordion';
import { SkeletonComponent } from '../skeleton/skeleton.component';
import { ImagePreloadComponent } from '../image-preload/image-preload.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-reproduzir-arquivo',
  imports: [
    PdfViewerModule,
    AccordionModule,
    SkeletonComponent,
    ImagePreloadComponent
  ],
  templateUrl: './reproduzir-arquivos.component.html',
  styleUrl: './reproduzir-arquivos.component.scss'
})
export class ReproduzirArquivosComponent implements OnInit {

  @Input() tarefa: any;
  @Input() file: any;
  @Input() isInstance = false;
  protected carregando = false;
  protected cols: any = [
    { header: 'Nome', field: 'name' }

  ]
  protected filtroSelect: any;
  protected pagina = {
    page: 0,
    first: 0,
    rows: 20,
    pageCount: 20
  };


  constructor(
  ) { }


  ngOnInit(): void {
    if (this.file?.iframe)
      this.carregando = false;
  }


  onPdfLoadComplete(pdf: any): void {
    this.carregando = false;
  }

  isVideo(type: any) {
    if (type?.includes('video'))
      return true;
    return false;
  }

  isImagem(type: any) {
    if (type?.includes('image'))
      return true;
    return false;
  }

  isPDF(type: any) {
    if (type?.includes('pdf'))
      return true;
    return false;
  }

}
