import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { IndicadorComponent } from './pages/indicador/indicador.component';

const routes: Routes = [
  {path: 'indicadores', component: HomeComponent},
  {path: 'indicador/:codigo', component: IndicadorComponent},
  {path: '**', pathMatch: 'full', redirectTo: 'indicadores'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
