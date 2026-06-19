import { AuthService } from '@/core/auth/services/auth.service';
import { Dispositivo } from '@/shared/sincroled/models/dispositivo.model';
import { DispositivoService } from '@/shared/sincroled/services/dispositivo.service';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MqttService } from 'ngx-mqtt';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';

@Component({
  selector: 'app-upgrade',
  imports: [
    CommonModule,
    FileUploadModule,
    DialogModule,
    ButtonModule
  ],
  templateUrl: './upgrade.component.html',
  styleUrl: './upgrade.component.scss'
})
export class UpgradeComponent {

  @Input() device?: Dispositivo;
  @Input() loading = false;
  protected view = false;
  protected mensagens: string[] = [];
  private atualizarPayload = false;
  private initObserve = false;

  constructor(
    private dispositivoService: DispositivoService,
    public readonly authService: AuthService,
    private readonly mqttSevice: MqttService
  ) { }


  onUpload(event: any) {
    event.files 

    if (this.device?.id)
      this.dispositivoService.uploadFirmware(this.device?.id, event.files[0]).subscribe(response => {

        if (this.device?.id && response.id) {
          this.atualizarPayload = true;
          this.mensagens.push('Iniciando atualização')
          if (this.device?.id)
          this.dispositivoService.updateFirmware(this.device?.id).subscribe({
            complete: () => {
              this.mensagens.push('Iniciando atualização')
            },
            error: (err) => {

            }
          });
        }
      })
  }

}
