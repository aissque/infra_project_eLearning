import { Component, OnInit , signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatabaseService } from '../../services/database.service';
import { Produit } from '../../models/data.models';
import { env } from '../../env'

@Component({
  selector: 'app-gestion-produits',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: `./gproduits.html`,
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
export class GestionProduitsComponent implements OnInit {
  currency = env.currency
  produits = signal<Produit[]>([]);
  showModal = false;
  isEditMode = false;
  currentProduitId?: number;
  produitForm: FormGroup;

  constructor(
    private db: DatabaseService,
    private fb: FormBuilder
  ) {
    this.produitForm = this.fb.group({
      nome: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit() {
    this.loadProduits();
  }

  async loadProduits() {
    this.produits.set(await this.db.getProduits());
  }

  openModal() {
    this.isEditMode = false;
    this.produitForm.reset();
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.produitForm.reset();
    this.currentProduitId = undefined;
  }

  editProduit(produit: Produit) {
    this.isEditMode = true;
    this.currentProduitId = produit.numerodeproduits;
    this.produitForm.patchValue({
      nome: produit.nome,
      price: produit.price
    });
    this.showModal = true;
  }

  async saveProduit() {
    if (this.produitForm.valid) {
      const produitData = this.produitForm.value;

      if (this.isEditMode && this.currentProduitId) {
        await this.db.updateProduit(this.currentProduitId, produitData);
      } else {
        await this.db.addProduit(produitData);
      }

      await this.loadProduits();
      this.closeModal();
    }
  }

  async deleteProduit(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      await this.db.deleteProduit(id);
      await this.loadProduits();
    }
  }
}
