import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: `./navbar.html`,
  styles: [`
    .navbar {
      background-color: #2c3e50;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .nav-brand h2 {
      color: white;
      margin: 0;
      font-size: 1.5rem;
    }

    .nav-menu {
      list-style: none;
      display: flex;
      gap: 2rem;
      margin: 0;
      padding: 0;
    }

    .nav-menu a {
      color: #ecf0f1;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: background-color 0.3s;
    }

    .nav-menu a:hover {
      background-color: #34495e;
    }

    .nav-menu a.active {
      background-color: #3498db;
      color: white;
    }
  `]
})
export class NavbarComponent {}
