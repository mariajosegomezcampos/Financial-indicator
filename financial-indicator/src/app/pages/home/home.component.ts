import { Component, OnDestroy, OnInit } from '@angular/core';
import { IndicadoresService } from 'src/app/services/indicadores.service';
import { map } from 'rxjs/operators';
import { Indicador } from 'src/app/interfaces/indicador.interface';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  indicadores: Indicador[] = [];
  arrowUpward: boolean = true;
  unSubsIndicadores!: Subscription;
  constructor(
    private indicadoresService: IndicadoresService,
    private router: Router
  ) {
    this.mostrarModal();
    this.unSubsIndicadores = this.indicadoresService.getIndicadoresEconomicos()
      .pipe(
        map(indicadores => {
          console.log(indicadores);
          return Object.values(indicadores).filter((indicador) => {
            return typeof indicador === 'object';
          });
        })
      )
      .subscribe((indicadores: Indicador[]) => {
        this.indicadores = indicadores;
        this.ordernarPorNombre();
        Swal.close();
      });


  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.unSubsIndicadores.unsubscribe();
  }

  ordernarPorNombre(): void {
    this.arrowUpward = !this.arrowUpward;
    if(this.arrowUpward) {
      this.indicadores.sort((a, b) => {
        if (a.nombre > b.nombre) {
          return 1;
        }
        if (a.nombre < b.nombre) {
          return -1;
        }
        return 0;
      });
      console.log(true);
    } else {
      this.indicadores.sort((a, b) => {
        if (a.nombre < b.nombre) {
          return 1;
        }
        if (a.nombre > b.nombre) {
          return -1;
        }
        return 0;
      });
    }
  }

  indicadorDetalle(codigo: string): void {
    this.router.navigate(['indicador', codigo]);
    
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


}
