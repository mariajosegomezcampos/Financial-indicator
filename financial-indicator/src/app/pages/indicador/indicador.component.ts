import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { IndicadoresService } from 'src/app/services/indicadores.service';
import { ChartDataSets, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import Swal from 'sweetalert2'
import { FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-indicador',
  templateUrl: './indicador.component.html',
  styleUrls: ['./indicador.component.scss']
})
export class IndicadorComponent implements OnInit, OnDestroy {
  indicador: any = {};
  valorIndicadorFechaUnica = null;
  valorIndicadorAnnioUnico: any[] = [];
  indicadorValor: number[] = [];
  indicadorFecha: string[] = [];
  anniosDeIndicadores: string[] = [];
  selectorFecha!: FormControl;
  selectorAnnio!: FormControl;
  codigoIndicador!: string;
  unSubsIndicador!: Subscription;
  unSubsFecha!: Subscription;
  unSubsAnnio!: Subscription;

  public lineChartData: ChartDataSets[] = [];
  public lineChartLabels: Label[] = [];

  public lineChartColors: Color[] = [
    { // grey
      backgroundColor: 'transparent',
      borderColor: 'rgba(3, 3, 181, 1)',
      pointBackgroundColor: 'rgba(3, 3, 181, 1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(3, 3, 181,0.8)'
    }
  ];
  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';

  constructor(
    private acRoute: ActivatedRoute,
    private indicadoresService: IndicadoresService,
    private router: Router
  ) { 
    this.mostrarModal();
    this.unSubsIndicador = this.acRoute.params
      .pipe(
        switchMap(({codigo}) => {
          this.codigoIndicador = codigo;
          return this.indicadoresService.getIndicadorEconomico(codigo)
        }),
        map(indicador => {
          const {autor, version, ...item} = indicador;
          return item;
        }),
      )
      .subscribe((indicador) => {
        this.indicador = indicador;

        this.indicador.serie.forEach((item: any) => {   
          const fecha = this.formatearFecha(item.fecha);
          this.indicadorValor.push(item.valor);
          this.indicadorFecha.push(fecha);
        });

        this.lineChartData = [{data: this.indicadorValor, label: `Nombre: ${this.indicador.nombre} --- Unidad de medida: ${this.indicador.unidad_medida}`}];
        this.lineChartLabels = this.indicadorFecha;
        Swal.close();
      });
      // Reactive Form Selectores
      this.selectorFecha = new FormControl('');
      this.selectorAnnio = new FormControl('');
  }

  ngOnInit(): void {
    this.anniosDeIndicadores = this.crearAnniosDeIndicadores();
    this.selectorFechaFunction();
    this.selectorAnnioFunction();
    // this.selectorAnnio.valueChanges.subscribe(console.log);
  }

  ngOnDestroy(): void {
    this.unSubsIndicador.unsubscribe();
    this.unSubsFecha.unsubscribe();
  }

  selectorFechaFunction(): void {
    this.unSubsFecha = this.selectorFecha.valueChanges
      .pipe(
        switchMap((fecha: string) => {
          this.mostrarModal();
          return this.indicadoresService.getIndicadorEconomicoPorFecha(this.codigoIndicador, fecha)
        }),
        map((indicador) => indicador.serie[0].valor)
      )
      .subscribe((indicador) => {
        this.valorIndicadorFechaUnica = indicador;
        Swal.close();
      })
  }

  selectorAnnioFunction(): void {
    
    this.unSubsAnnio = this.selectorAnnio.valueChanges
      .pipe(
        switchMap((annio: string) => {
          console.log(annio);
          this.mostrarModal();
          return this.indicadoresService.getIndicadorEconomicoPorAnnio(this.codigoIndicador, annio)
        }),
        map((indicador) => indicador.serie)
      ).subscribe((indicador) => {
        this.valorIndicadorAnnioUnico = indicador;
        console.log(this.valorIndicadorAnnioUnico.length);
        Swal.close();
      })
  }

  formatearFecha(date: string): string {
    const fecha = new Date(date);
    const dia = fecha.getDate();
    const mes = fecha.getMonth() + 1;
    const annio = fecha.getFullYear();
    if(mes < 10) {
      return `${dia}-0${mes}-${annio}`;
    }else {
      return `${dia}-${mes}-${annio}`;

    }
  }

  redireccion(path: string): void {
    this.router.navigate([path]);
  }

  mostrarModal(): void {
    Swal.fire({
      title: 'Espere por Favor',
      imageUrl: '/assets/b-chile.png',
      imageWidth: 150,
      imageHeight: 150,
      imageAlt: 'Logo Banco de Chile',
      allowEscapeKey: false,
      allowOutsideClick: false,
    });
    Swal.showLoading();
  }
  
  crearAnniosDeIndicadores(): string[] {
    let annioInicial = 2000;
    const annioActual = new Date().getFullYear();
    let arrayAnnios = [];
    for(annioInicial; annioInicial <= annioActual; annioInicial++) {
      arrayAnnios.push(String(annioInicial));
    }
    return arrayAnnios;
  }

}
