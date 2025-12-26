import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FacturationComponent } from './components/facturation/facturation.component';
import { GestionProduitsComponent } from './components/gproduits/gestion-produits.component';
import { GestionClientsComponent } from './components/gclients/gestion-clients.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <app-navbar> </app-navbar>
    <router-outlet></router-outlet>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background-color: #ecf0f1;
    }
  `]
})
export class App {}

bootstrapApplication(App, {
  providers: [
    provideRouter([
      { path: '', redirectTo: '/facturation', pathMatch: 'full' },
      { path: 'facturation', component: FacturationComponent },
      { path: 'gestion_produits', component: GestionProduitsComponent },
      { path: 'gestion_clients', component: GestionClientsComponent }
    ])
  ]
});
