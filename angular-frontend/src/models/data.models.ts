export interface Client {
  numerodeclient?: number;
  nome: string;
  tele: string;
  email: string;
}

export interface Produit {
  numerodeproduits?: number;
  nome: string;
  price: number;
}

export interface Facture {
  numerodefacture?: number;
  date: string;
  idclient: number;
}

export interface LineCommande {
  id?: number;
  numerodefacture: number;
  numerodeproduits: number;
  qte: number;
  price: number;
}

export interface InvoiceLine {
  produit: Produit;
  quantite: number;
  prixUnitaire: number;
  total: number;
}
