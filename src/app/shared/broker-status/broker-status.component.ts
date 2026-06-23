import { MqttAppModule } from '@/mqtt-app.module';
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MqttConnectionState, MqttService } from 'ngx-mqtt';
import { TooltipModule } from 'primeng/tooltip';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-broker-status',
  template: `
    <i pTooltip="Conectado" class="pi pi-globe text-green-500 !text-[1.2rem]" *ngIf="conectado"></i>
    <i pTooltip="Desconectado" class="pi pi-globe text-red-500 !text-[1.2rem]" *ngIf="!conectado"></i>
  `,
  imports: [
    CommonModule,
    MqttAppModule,
    TooltipModule
  ],
  providers: [
    MqttService,
  ]
})
export class BrokerStatusComponent implements OnInit, OnDestroy {
  conectado = false;
  private stateSubscription?: Subscription;

  constructor(private readonly mqttService: MqttService) { }

  ngOnInit(): void {
    // mqttService.state é um BehaviorSubject<MqttConnectionState>
    this.stateSubscription = this.mqttService.state.subscribe(
      (state: MqttConnectionState) => {
        // 0 = CONNECTING, 1 = CONNECTED, 2 = DISCONNECTING, 3 = CLOSED
        this.conectado = state === MqttConnectionState.CONNECTED;
        console.log('Status da conexão MQTT:', MqttConnectionState[state]);
      }
    );
  }

  ngOnDestroy(): void {
    this.stateSubscription?.unsubscribe();
  }
}
