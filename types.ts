
// Cliente
export interface CustomerModel {
    customer_id: number;
    name: string;
    cpf: string;
    phone: string | null;
    cep: string;
}

// Fornecedor
export interface SupplierModel {
    supplier_id: number;
    name: string;
    cnpj: string;
    phone: string | null;
}

// Categoria
export interface CategoryModel {
    category_id: number;
    name: string;
}

// Produto
export interface ProductModel {
    product_id: number;
    name: string;
    category_id: number;
    size: string;
    stock: number;
    sale_price: number;
    purchase_price: number;
    supplier_id: number;
}

// Venda
export interface SaleModel {
    sale_id: number;
    sale_date: string;
    customer_id: number;
}

// ItemVenda
export interface ItemSaleModel {
    item_sale_id: number;
    sale_id: number;
    product_id: number;
    quantity: number;
}

export enum PaymentMethod {
  DINHEIRO = 'dinheiro',
  CARTAO = 'cartao',
  PIX = 'pix',
  BOLETO = 'boleto',
}

// Metodo
export interface MethodModel {
    method_id: number;
    name: PaymentMethod;
}

// Pagamento
export interface PaymentModel {
    payment_id: number;
    method_id: number;
    sale_id: number;
}

// Payloads
export interface ItemSalePayload {
    product_id: number;
    quantity: number;
}

export interface SalePayload {
    saleData: Omit<SaleModel, 'sale_id' | 'sale_date'>;
    items: ItemSalePayload[];
    payment_method_id: number;
}
