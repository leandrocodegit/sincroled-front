
import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { ComandosIluminacaoComponent } from '../../cor/comandos-iluminacao/comandos-iluminacao.component';
import { ConfiguracaoSensorComponent } from '../configuracao-sensor/configuracao-sensor.component';
import { DispositivoFormComponent } from '../dispositivo-form/dispositivo-form.component';
import { Dispositivo } from '@/shared/sincroled/models/dispositivo.model';
import { DispositivoService } from '@/shared/sincroled/services/dispositivo.service';
import { DispositivoFormClienteComponent } from '../dipositivo-form-cliente/dipositivo-form-cliente.component';
import { ConfiguracaoParametroCorComponent } from '../../cor/configuracao-parametro-cor/configuracao-parametro-cor.component';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigurarWifiComponent } from '../configurar-wifi/configurar-wifi.component';
import { LabelCorComponent } from '@/shared/components/label-cor/label-cor.component';
import { AuthService } from '@/core/auth/services/auth.service';
import { SincronizarComponent } from '../sincronizar/sincronizar.component';
import { DebugMonitorComponent } from '../debug-monitor/debug-monitor.component';
import { MqttService } from 'ngx-mqtt';
import { MqttAppModule } from '@/mqtt-app.module';
import { NivelWIFIComponent } from '../nivel-wifi/nivel-wifi.component';
import { FormularioAgendaComponent } from '../../agenda/formulario-agenda/formulario-agenda.component';
import { ComandoSincronismoService } from '@/shared/services/ComandoSincronismoService';
import { MessageService } from 'primeng/api';
import { UpgradeComponent } from '../../firmware/upgrade/upgrade.component';
import { SincronizarTodosComponent } from '../sincronizar-todos/sincronizar-todos.component';
import { CdkCopyToClipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-lista-dispositivos',
  imports: [
    CommonModule,
    ButtonModule,
    TooltipModule,
    CdkCopyToClipboard,
    ComandosIluminacaoComponent,
    ConfiguracaoSensorComponent,
    DispositivoFormComponent,
    DispositivoFormClienteComponent,
    ConfiguracaoParametroCorComponent,
    ConfigurarWifiComponent,
    LabelCorComponent,
    SincronizarComponent,
    DebugMonitorComponent,
    MqttAppModule,
    NivelWIFIComponent,
    FormularioAgendaComponent,
    UpgradeComponent,
    SincronizarTodosComponent
  ],
  providers: [
    MqttService
  ],
  templateUrl: './lista-dispositivos.component.html',
  styleUrl: './lista-dispositivos.component.scss'
})
export class ListaDispositivosComponent {

  protected loading: boolean = false;
  protected isGridView: boolean = false;
  protected devices: Dispositivo[] = [];

  constructor(
    private readonly comandoService: ComandoSincronismoService,
    private dispositivoService: DispositivoService,
    private readonly activedRoute: ActivatedRoute,
    private readonly messageService: MessageService,
    public readonly authService: AuthService,
    private readonly location: Location,
    private readonly mqttSevice: MqttService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {

    this.activedRoute.queryParams.subscribe(param => {
      if (param['view'] && param['view'] == 'grid')
        this.isGridView = true
    })

    this.listarDispositivos(false);
    this.mqttSevice.observe(`device/update/v2/#`).subscribe((message: any) => {


      const jsonString = String.fromCharCode(...message.payload);
      const payload = JSON.parse(jsonString) as Dispositivo[];

      payload.forEach(device => {
        const dipositivo = this.devices.find(it => it.id === device.id);

        if (dipositivo) {
          dipositivo.conexao.status = device.conexao.status;
          dipositivo.conexao.wifiConectado = device.conexao.wifiConectado;
          dipositivo.conexao.statusMCU = device.conexao.statusMCU;
          dipositivo.conexao.wifiRssi = device.conexao.wifiRssi;
          if (device.operacao?.modoOperacao)
            dipositivo.operacao.modoOperacao = device.operacao.modoOperacao;
        }
      });
    });
  }

  listarDispositivos(noLoad?: boolean) {
    this.dispositivoService.listaTodosDispositivos(noLoad ?? false).subscribe(response => {
      this.devices = response.content;
    })
  }

  toggleView(gridView: boolean): void {
    this.isGridView = gridView;
    this.location.go(
      this.router.url.split('?')[0],
      `view=${this.isGridView ? 'grid' : 'list'}`
    );
  }

  executarComando(deviceId: string, comando: any) {
    this.loading = true;
    this.comandoService.enviarComando(deviceId, comando).subscribe({
      next: (evento) => {
        this.messageService.add(evento.toast);
      },
      complete: () => this.loading = false,
      error: () => this.loading = false
    })
    console.log(`Comando '${comando}' enviado para o dispositivo ${deviceId}`);
  }


}
