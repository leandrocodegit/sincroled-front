import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import * as Leaflet from 'leaflet';
import { DispositivoService } from '@/shared/sincroled/services/dispositivo.service';
import { Dispositivo } from '@/shared/sincroled/models/dispositivo.model';
import { LayoutService } from '@/shared/services/layout.service';

@Component({
  selector: 'app-content-mapa',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './content-mapa.component.html',
  styleUrls: ['./content-mapa.component.scss']
})
export class ContentMapaComponent implements OnInit, OnDestroy {

  @Input() cordenadas = { lat: -23.548789385634088, lng: -46.63357944308231 };
  @Input() edicao = false;
  @Input() height = '90vh';
  @Input() tag = false;
  @Output() load = new EventEmitter();

  protected dispositivos: Dispositivo[] = [];

  private markers: Map<string, any> = new Map();
  private circles: any[] = [];
  private mapa: any;

  constructor(
    private readonly dispositivoService: DispositivoService,
    private readonly route: Router,
    private readonly layoutService: LayoutService,
    @Inject(PLATFORM_ID) private readonly platformId: any
  ) { }

  ngOnInit(): void {

    if(this.layoutService.isMobile())
      this.height = '94vh';

    this.edicao = this.route.url.includes('/dispositivos/lista');
  }

  ngAfterViewInit(): void {
    if (!this.tag) {
      this.mapa = Leaflet.map('map').setView(this.cordenadas, 13);

      Leaflet.tileLayer('https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png', {
        maxZoom: 19,
      }).addTo(this.mapa);

      if (this.edicao) {
        this.adicionarMarcadorEdicao();
      } else {
        this.inicializarMarcadores();
      }

      this.addCenterButton();
      this.dispositivoService.ajutarPadding.emit();
    }
  }

  inicializarMarcadores(): void {
    this.dispositivoService.listaTodosDispositivos(false).subscribe(response => {
      this.dispositivos = response.content;
      this.carregarDispositivos(response.content);
    });
  }

  centralizarDispositivo(device: Dispositivo): void {
    const lat = device.conexao.latitude;
    const lng = device.conexao.longitude;
    if (lat && lng) {
      this.mapa.setView({ lat, lng }, 16, { animate: true, duration: 1 });
      this.markers.get(device.id)?.openPopup();
    }
  }

  private carregarDispositivos(dispositivos: Dispositivo[]): void {
    this.removerMarcadores();

    dispositivos.forEach(device => {
      const { latitude: lat, longitude: lng } = device.conexao;
      if (!lat || !lng || lat === 0 || lng === 0) return;
      this.adicionarDevice(device);
    });

    if (dispositivos.length) {
      const primeiro = dispositivos[0];
      this.centralizar({ lat: primeiro.conexao.latitude, lng: primeiro.conexao.longitude }, 13);
    }
  }

  private adicionarDevice(device: Dispositivo): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const param = this.resolverParametroAtivo(device);
    const cores = param?.corHexa ?? ['#94a3b8'];
    const corPrimaria = cores[0] ?? '#94a3b8';
    const corSecundaria = cores[1] ?? corPrimaria;
    const ativo = device.operacao?.modoOperacao !== 'DESLIGADO';
    const { fillColor, strokeColor } = this.resolverStatusCor(device);

    // Círculo de zona
    const fillOpacity = ativo ? 0.18 : 0.05;
    const strokeOpacity = 0.3;

    const circulo = Leaflet.circle(
      { lat: device.conexao.latitude, lng: device.conexao.longitude },
      {
        weight: 2,
        color: corPrimaria,
        opacity: strokeOpacity,
        fillColor: corPrimaria,
        fillOpacity,
        radius: 140
      }
    ).addTo(this.mapa);

    // Marcador SVG customizado
    const icon = this.criarIconeSvg(device.id, cores, ativo);

    const popup = this.criarPopupHtml(device, cores);

    const marker = Leaflet.marker(
      { lat: device.conexao.latitude, lng: device.conexao.longitude },
      { icon }
    )
      .addTo(this.mapa)
      .bindPopup(popup, { className: 'device-popup', maxWidth: 220 });

    this.markers.set(device.id, marker);
  }

  private resolverParametroAtivo(device: Dispositivo): any {
    const modo = device.operacao?.modoOperacao;
    if (modo === 'TEMPORIZADOR') return device.operacao?.corTemporizador?.parametros?.[0];
    if (modo === 'AGENDA') return device.operacao?.agenda?.cor?.parametros?.[0];
    return device.cor?.parametros?.[0];
  }

  private resolverStatusCor(device: Dispositivo): { fillColor: string; strokeColor: string } {
    const modo = device.operacao?.modoOperacao;
    if (!modo || modo === 'DESLIGADO') return { fillColor: '#94a3b8', strokeColor: '#94a3b8' };
    if (modo === 'TEMPORIZADOR') return { fillColor: '#f59e0b', strokeColor: '#f59e0b' };
    return { fillColor: '#22c55e', strokeColor: '#22c55e' };
  }

  private criarIconeSvg(id: string, cores: string[], ativo: boolean): Leaflet.DivIcon {
    const corPrincipal = cores[0] ?? '#6366f1';
    const corR = cores[0] ?? '#ef4444';
    const corG = cores[1] ?? '#22c55e';
    const corB = cores[2] ?? '#3b82f6';
    const opacity = ativo ? 1 : 0.35;

    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="58" viewBox="0 0 48 58">
      <path d="M24 2 C11 2 4 11 4 20 C4 32 24 54 24 54 C24 54 44 32 44 20 C44 11 37 2 24 2Z"
        fill="${corPrincipal}" stroke="${corPrincipal}" stroke-width="1" opacity="${opacity}"/>
      <circle cx="24" cy="20" r="11" fill="white" opacity="${ativo ? 0.15 : 0.05}"/>
      <circle cx="24" cy="20" r="7" fill="white" opacity="${ativo ? 0.9 : 0.4}"/>
      <circle cx="20" cy="18" r="2.5" fill="${corR}" opacity="${ativo ? 1 : 0.2}"/>
      <circle cx="28" cy="18" r="2.5" fill="${corG}" opacity="${ativo ? 1 : 0.2}"/>
      <circle cx="24" cy="24" r="2.5" fill="${corB}" opacity="${ativo ? 1 : 0.2}"/>
      <circle cx="20" cy="18" r="0.9" fill="white" opacity="${ativo ? 0.7 : 0}"/>
      <circle cx="28" cy="18" r="0.9" fill="white" opacity="${ativo ? 0.7 : 0}"/>
      <circle cx="24" cy="24" r="0.9" fill="white" opacity="${ativo ? 0.7 : 0}"/>
    </svg>`;

    return Leaflet.divIcon({
      html: svg,
      className: '',
      iconSize: [48, 58],
      iconAnchor: [24, 58],
      popupAnchor: [0, -60]
    });
  }

  private criarPopupHtml(device: Dispositivo, cores: string[]): string {
    const param = this.resolverParametroAtivo(device);
    const modo = device.operacao?.modoOperacao ?? 'FIXO';
    const leds = param?.leds ?? '-';
    const intensidade = param?.intensidade ?? '-';
    const dots = cores.slice(0, 4)
      .map(c => `<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${c};margin-right:3px;"></span>`)
      .join('');

    return `
      <div style="font-family:system-ui,sans-serif;min-width:170px;">
        <div style="font-size:13px;font-weight:600;margin-bottom:4px;">${device.nome.toUpperCase()}</div>
        <div style="font-size:11px;color:#64748b;margin-bottom:8px;">Modo: <b style="color:#1e293b">${modo}</b></div>
        <div style="margin-bottom:6px;">${dots}</div>
        <div style="display:flex;justify-content:space-between;font-size:10px;color:#94a3b8;">
          <span>${leds} LEDs</span>
          <span>Intensidade: ${intensidade}/255</span>
        </div>
      </div>`;
  }

  private adicionarMarcadorEdicao(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.removerMarcadores();

    const icon = Leaflet.icon({ iconUrl: 'assets/images/pin.png', iconSize: [60, 60] });
    const marker = Leaflet.marker(this.cordenadas, { draggable: true, icon, opacity: 0.85 }).addTo(this.mapa);
    marker.bindTooltip('Arraste o pino', { permanent: false }).openTooltip();
    marker.on('drag', (event: any) => {
      this.dispositivoService.mapaEdit.emit(event.target.getLatLng());
      this.cordenadas = event.target.getLatLng();
    });
    this.markers.set('edicao', marker);
  }

  private addCenterButton(): void {
    const btn = new Leaflet.Control({ position: 'topright' });
    btn.onAdd = () => {
      const el = Leaflet.DomUtil.create('button', 'leaflet-bar leaflet-control');
      el.innerHTML = '⌖ Centralizar';
      Object.assign(el.style, { background: '#fff', padding: '4px 10px', fontSize: '11px', cursor: 'pointer', border: '1px solid #e2e8f0', borderRadius: '8px' });
      el.onclick = () => this.mapa.setView(this.cordenadas, 14);
      return el;
    };
    btn.addTo(this.mapa);
  }

  removerMarcadores(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.markers.forEach(m => this.mapa.removeLayer(m));
    this.circles.forEach(c => this.mapa.removeLayer(c));
    this.markers.clear();
    this.circles = [];
  }

  centralizar(loc: { lat: number; lng: number }, zoom: number): void {
    if (isPlatformBrowser(this.platformId)) {
      this.mapa.setView(loc, zoom, { animate: true, duration: 1 });
    }
  }

  ngOnDestroy(): void {
    this.dispositivoService.ajutarPadding.emit(true);
    if (this.mapa) this.mapa.remove();
  }
}
