import { CustomerModel, ProductModel, SalePayload, SupplierModel, CategoryModel, MethodModel, SaleModel } from '../types';

const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:3333';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
  }
  // By awaiting the JSON parsing, we return the data directly.
  // The 'async' keyword then wraps it in a Promise, which helps TypeScript's type inference.
  return await response.json();
}

// Products
// FIX: Explicitly passed the generic type to handleResponse to match the function's return type.
export const getProducts = (): Promise<ProductModel[]> => fetch(`${API_BASE_URL}/Products`).then(response => handleResponse<ProductModel[]>(response));
export const createProduct = (product: Omit<ProductModel, 'product_id'>) => 
  fetch(`${API_BASE_URL}/Products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  }).then(handleResponse);
export const updateProductStock = (id: number, quantity: number) =>
  fetch(`${API_BASE_URL}/Products/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity }),
  }).then(handleResponse);
export const deleteProduct = (id: number) => 
  fetch(`${API_BASE_URL}/Products/${id}`, { method: 'DELETE' });

// Suppliers
// FIX: Explicitly passed the generic type to handleResponse to match the function's return type.
export const getSuppliers = (): Promise<SupplierModel[]> => fetch(`${API_BASE_URL}/Suppliers`).then(response => handleResponse<SupplierModel[]>(response));
export const createSupplier = (supplier: Omit<SupplierModel, 'supplier_id'>) =>
  fetch(`${API_BASE_URL}/Suppliers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(supplier),
  }).then(handleResponse);
export const deleteSupplier = (id: number) =>
  fetch(`${API_BASE_URL}/Suppliers/${id}`, { method: 'DELETE' });

// Customers
// FIX: Explicitly passed the generic type to handleResponse to match the function's return type.
export const getCustomers = (): Promise<CustomerModel[]> => fetch(`${API_BASE_URL}/Customers`).then(response => handleResponse<CustomerModel[]>(response));
export const createCustomer = (customer: Omit<CustomerModel, 'customer_id'>) =>
  fetch(`${API_BASE_URL}/Customers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(customer),
  }).then(handleResponse);
export const updateCustomerPhone = (id: number, new_phone: string) =>
  fetch(`${API_BASE_URL}/Customers/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ new_phone }),
  }).then(handleResponse);
export const deleteCustomer = (id: number) =>
  fetch(`${API_BASE_URL}/Customers/${id}`, { method: 'DELETE' });

// Sales
// FIX: Explicitly passed the generic type to handleResponse to match the function's return type.
export const getSales = (): Promise<SaleModel[]> => fetch(`${API_BASE_URL}/Sales`).then(response => handleResponse<SaleModel[]>(response));
export const createSale = (saleData: SalePayload) =>
  fetch(`${API_BASE_URL}/Sales`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(saleData),
  }).then(handleResponse);

// Categories & Methods
// FIX: Explicitly passed the generic type to handleResponse to match the function's return type.
export const getCategories = (): Promise<CategoryModel[]> => fetch(`${API_BASE_URL}/Categories`).then(response => handleResponse<CategoryModel[]>(response));
// FIX: Explicitly passed the generic type to handleResponse to match the function's return type.
export const getMethods = (): Promise<MethodModel[]> => fetch(`${API_BASE_URL}/Methods`).then(response => handleResponse<MethodModel[]>(response));

// Reports
export const getReport = (url: string) => fetch(`${API_BASE_URL}${url}`).then(handleResponse);
