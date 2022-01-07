import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Indicador } from '../interfaces/indicador.interface';

@Injectable({
  providedIn: 'root'
})
export class IndicadoresService {
  base = 'https://mindicador.cl/api';
  constructor(
    private http: HttpClient
  ) { }

  getIndicadoresEconomicos(): Observable<Indicador[]> {
    const url = this.base;
    return this.http.get<Indicador[]>(url);
  }

  getIndicadorEconomico(codigo: string): Observable<any> {
    const url = `${this.base}/${codigo}`;
    return this.http.get(url);
  }

  getIndicadorEconomicoPorFecha(codigo: string, fecha: string): Observable<any> {
    const url = `${this.base}/${codigo}/${fecha}`;
    return this.http.get(url);
  }

  getIndicadorEconomicoPorAnnio(codigo: string, annio: string): Observable<any> {
    const url = `${this.base}/${codigo}/${annio}`;
    return this.http.get(url);
  }


}
