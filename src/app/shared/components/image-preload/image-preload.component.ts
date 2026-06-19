import { Component, Input } from '@angular/core';
import { LoadComponent } from '../load/load.component';
import { NgIf } from '@angular/common';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@Component({
  selector: 'app-image-preload',
  imports: [
    LoadComponent,
    NgIf,
    PdfViewerModule
  ],
  templateUrl: './image-preload.component.html',
  styleUrl: './image-preload.component.scss'
})
export class ImagePreloadComponent {

  @Input() url!: string;
  @Input() iframe: boolean = false;
  @Input() assinatura: boolean = false;
  protected loaded = false;

  ngOnInit(): void {
    if (!this.iframe) {
      const img = new Image();
      img.src = this.getThumbail(this.url);
      img.onload = () => {
        this.loaded = true;
      };
    }
  }

  getThumbail(url?: string) {
    console.log(url, this.assinatura);

    if (!url && !this.assinatura)
      this.url = 'assets/icons/icons8-pasta-94.png';
    else if (!url && this.assinatura)
      this.url = 'assets/icons/icons8-processamento-64.png';
    return this.url;
  }
}
