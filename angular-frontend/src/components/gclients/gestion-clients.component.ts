import { Component, OnInit , signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatabaseService } from '../../services/database.service';
import { Client } from '../../models/data.models';

@Component({
  selector: 'app-gestion-clients',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: `./gclients.html`,
  styles: [`
    .page-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .page-header h1 {
      margin: 0;
      color: #2c3e50;
    }

    .table-container {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
    }

    .data-table th,
    .data-table td {
      padding: 1rem;
      text-align: left;
      border-bottom: 1px solid #ecf0f1;
    }

    .data-table th {
      background-color: #34495e;
      color: white;
      font-weight: 600;
    }

    .data-table tbody tr:hover {
      background-color: #f8f9fa;
    }

    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.3s;
    }

    .btn-primary {
      background-color: #3498db;
      color: white;
    }

    .btn-primary:hover {
      background-color: #2980b9;
    }

    .btn-secondary {
      background-color: #95a5a6;
      color: white;
    }

    .btn-secondary:hover {
      background-color: #7f8c8d;
    }

    .btn-sm {
      padding: 0.3rem 0.6rem;
      font-size: 0.85rem;
      margin-right: 0.5rem;
    }

    .btn-edit {
      background-color: #f39c12;
      color: white;
    }

    .btn-edit:hover {
      background-color: #e67e22;
    }

    .btn-delete {
      background-color: #e74c3c;
      color: white;
    }

    .btn-delete:hover {
      background-color: #c0392b;
    }

    .modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      border-radius: 8px;
      width: 90%;
      max-width: 500px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid #ecf0f1;
    }

    .modal-header h2 {
      margin: 0;
      color: #2c3e50;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 2rem;
      cursor: pointer;
      color: #95a5a6;
      line-height: 1;
    }

    .close-btn:hover {
      color: #2c3e50;
    }

    form {
      padding: 1.5rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      color: #2c3e50;
      font-weight: 500;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      box-sizing: border-box;
    }

    .form-control:focus {
      outline: none;
      border-color: #3498db;
    }

    .error {
      color: #e74c3c;
      font-size: 0.85rem;
      margin-top: 0.25rem;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #ecf0f1;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class GestionClientsComponent implements OnInit {
 

  clients = signal<Client[]>([]);
  showModal = false;
  isEditMode = false;
  currentClientId?: number;
  clientForm: FormGroup;

  constructor(
    private db: DatabaseService,
    private fb: FormBuilder
  ) {
    this.clientForm = this.fb.group({
      nome: ['', Validators.required],
      tele: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
    this.loadClients();
  }

  async loadClients() {
  
     this.clients.set(await this.db.getClients());
  }

  openModal() {
    this.isEditMode = false;
    this.clientForm.reset();
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.clientForm.reset();
    this.currentClientId = undefined;
  }

  editClient(client: Client) {
    this.isEditMode = true;
    this.currentClientId = client.numerodeclient;
    this.clientForm.patchValue({
      nome: client.nome,
      tele: client.tele,
      email: client.email
    });
    this.showModal = true;
  }

  async saveClient() {
    if (this.clientForm.valid) {
      const clientData = this.clientForm.value;

      if (this.isEditMode && this.currentClientId) {
        await this.db.updateClient(this.currentClientId, clientData);
      } else {
        await this.db.addClient(clientData);
      }

      await this.loadClients();
      this.closeModal();
    }
  }

  async deleteClient(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      await this.db.deleteClient(id);
      await this.loadClients();
    }
  }
}
