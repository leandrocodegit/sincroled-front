import { ClipboardModule } from '@angular/cdk/clipboard';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-visualizar-json',
  imports: [
    ClipboardModule
  ],
  templateUrl: './visualizar-json.component.html',
  styleUrl: './visualizar-json.component.scss'
})
export class VisualizarJsonComponent {

  @Input() json?: string;
}
