import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';
import { Client, Produit, Facture, LineCommande } from '../models/data.models';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService extends Dexie {
  clients!: Table<Client, number>;
  produits!: Table<Produit, number>;
  factures!: Table<Facture, number>;
  linecommandes!: Table<LineCommande, number>;

  constructor() {
    super('GestionVenteDB');

    this.version(1).stores({
      clients: '++numerodeclient, nome, tele, email',
      produits: '++numerodeproduits, nome, price',
      factures: '++numerodefacture, date, idclient',
      linecommandes: '++id, numerodefacture, numerodeproduits, qte, price'
    });

    this.clients = this.table('clients');
    this.produits = this.table('produits');
    this.factures = this.table('factures');
    this.linecommandes = this.table('linecommandes');

    this.seedInitialData();
  }

  private async seedInitialData() {
    const clientCount = await this.clients.count();
    const produitCount = await this.produits.count();

    if (clientCount === 0) {
      await this.clients.bulkAdd([
        { nome: 'Mehdi', tele: '0666666666', email: 'mehdi@email.com' },
        { nome: 'ilyass', tele: '0626262626', email: 'ilyass@email.com' }
      ]);
    }

    if (produitCount === 0) {
      await this.produits.bulkAdd([
        { nome: 'stylo', price: 2 },
        { nome: 'gomme ', price: 4.5 },
      ]);
    }
  }

  async getClients() {
    return await this.clients.toArray();
  }

  async addClient(client: Client) {
    return await this.clients.add(client);
  }

  async updateClient(id: number, client: Client) {
    return await this.clients.update(id, client);
  }

  async deleteClient(id: number) {
    return await this.clients.delete(id);
  }

  async getProduits() {
    return await this.produits.toArray();
  }

  async addProduit(produit: Produit) {
    return await this.produits.add(produit);
  }

  async updateProduit(id: number, produit: Produit) {
    return await this.produits.update(id, produit);
  }

  async deleteProduit(id: number) {
    return await this.produits.delete(id);
  }

  async getFactures() {
    return await this.factures.toArray();
  }

  async addFacture(facture: Facture) {
    return await this.factures.add(facture);
  }

  async getLineCommandesByFacture(numerodefacture: number) {
    return await this.linecommandes.where('numerodefacture').equals(numerodefacture).toArray();
  }

  async addLineCommande(line: LineCommande) {
    return await this.linecommandes.add(line);
  }

  async deleteLineCommande(id: number) {
    return await this.linecommandes.delete(id);
  }
}
