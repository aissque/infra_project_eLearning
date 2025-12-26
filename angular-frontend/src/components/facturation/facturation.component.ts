import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { DatabaseService } from '../../services/database.service';
import { Client, Produit, InvoiceLine } from '../../models/data.models';
import { env } from '../../env';



@Component({  
  selector: 'app-facturation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl:`./facturation.html`,
  styles: [`
    .page-container {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    h1 {
      color: #2c3e50;
      margin-bottom: 2rem;
    }

    h3 {
      color: #34495e;
      margin-bottom: 1rem;
    }

    .invoice-header {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      margin-bottom: 2rem;
      padding: 1.5rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .client-select-group {
      display: flex;
      gap: 0.5rem;
    }

    .client-select-group select {
      flex: 1;
    }

    .add-product-section {
      margin-bottom: 2rem;
      padding: 1.5rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .product-form {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: 1rem;
      align-items: end;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-group label {
      margin-bottom: 0.5rem;
      color: #2c3e50;
      font-weight: 500;
    }

    .form-control {
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    .form-control:focus {
      outline: none;
      border-color: #3498db;
    }

    .btn {
      padding: 0.75rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.3s;
      white-space: nowrap;
    }

    .btn-primary {
      background-color: #3498db;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #2980b9;
    }

    .btn-success {
      background-color: #27ae60;
      color: white;
    }

    .btn-success:hover {
      background-color: #229954;
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
    }

    .btn-delete {
      background-color: #e74c3c;
      color: white;
    }

    .btn-delete:hover {
      background-color: #c0392b;
    }

    .btn-block {
      width: 100%;
      margin-top: 1rem;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .invoice-table {
      margin-bottom: 2rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      padding: 1.5rem;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
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

    .totals-section {
      display: flex;
      justify-content: flex-end;
    }

    .totals-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      padding: 1.5rem;
      min-width: 350px;
    }

    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 0.75rem 0;
      border-bottom: 1px solid #ecf0f1;
    }

    .total-row:last-of-type {
      border-bottom: none;
    }

    .total-label {
      font-weight: 500;
      color: #2c3e50;
    }

    .total-value {
      font-weight: 600;
      color: #34495e;
    }

    .total-ttc {
      margin-top: 0.5rem;
      padding-top: 1rem;
      border-top: 2px solid #34495e;
      font-size: 1.2rem;
    }

    .total-ttc .total-label,
    .total-ttc .total-value {
      color: #2c3e50;
      font-weight: 700;
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

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #ecf0f1;
    }
  `]
})
export class FacturationComponent implements OnInit {


  currency = env.currency;
  clients = signal<Client[]>([]);
  produits = signal<Produit[]>([]);
  invoiceLines = signal<InvoiceLine[]>([]);

  invoiceDate: string = new Date().toISOString().split('T')[0];
  selectedClientId: number | null = null;
  selectedProduitId: number | null = null;
  quantity: number = 1;
  price: number = 0;

  showClientModal = false;
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
    this.loadProduits();
  }

  async loadClients() {
    this.clients.set(await this.db.getClients());
  }

  async loadProduits() {
    this.produits.set(await this.db.getProduits());
  }



  onProduitSelect() {
    if (this.selectedProduitId) {
      const produit = this.produits().find(p => p.numerodeproduits === this.selectedProduitId);
      if (produit) {
        this.price = produit.price;
      }
    }
  }

  addToInvoice() {
    if (this.selectedProduitId && this.quantity > 0 && this.price > 0) {
      const produit = this.produits().find(p => p.numerodeproduits === this.selectedProduitId);
      if (produit) {
        const line: InvoiceLine = {
          produit: produit,
          quantite: this.quantity,
          prixUnitaire: this.price,
          total: this.quantity * this.price
        };
        this.invoiceLines().push(line);

        this.selectedProduitId = null;
        this.quantity = 1;
        this.price = 0;
      }
    }
  }

  removeLine(index: number) {
    this.invoiceLines().splice(index, 1);
  }

  get totalHT(): number {
    return this.invoiceLines().reduce((sum, line) => sum + line.total, 0);
  }

  get tva(): number {
    return this.totalHT * 0.20;
  }

  get totalTTC(): number {
    return this.totalHT + this.tva;
  }

  async saveInvoice() {
    if (!this.selectedClientId || this.invoiceLines().length === 0) {
      alert('Veuillez sélectionner un client et ajouter au moins un produit');
      return;
    }

    const factureId = await this.db.addFacture({
      date: this.invoiceDate,
      idclient: this.selectedClientId
    });

    for (const line of this.invoiceLines()) {
      await this.db.addLineCommande({
        numerodefacture: factureId as number,
        numerodeproduits: line.produit.numerodeproduits!,
        qte: line.quantite,
        price: line.prixUnitaire
      });
    }

    alert('Facture enregistrée avec succès!');
    this.resetForm();
  }

  resetForm() {
    this.invoiceLines.set([]);
    this.selectedClientId = null;
    this.selectedProduitId = null;
    this.quantity = 1;
    this.price = 0;
    this.invoiceDate = new Date().toISOString().split('T')[0];
  }

  openClientModal() {
    this.clientForm.reset();
    this.showClientModal = true;
  }

  closeClientModal() {
    this.showClientModal = false;
  }

  async saveClient() {
    if (this.clientForm.valid) {
      const clientData = this.clientForm.value;
      const newClientId = await this.db.addClient(clientData);
      await this.loadClients();
      this.selectedClientId = newClientId as number;
      this.closeClientModal();
    }
  }
}
