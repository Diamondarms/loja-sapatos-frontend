
import React, { useState, useEffect, useCallback } from 'react';
import { getProducts, createProduct, deleteProduct, getCategories, getSuppliers, updateProductStock } from '../services/api';
import { ProductModel, CategoryModel, SupplierModel } from '../types';
import { Modal, LoadingSpinner } from '../components/common';

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [suppliers, setSuppliers] = useState<SupplierModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductModel | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: '', category_id: '', size: '', stock: '0', sale_price: '0.00', purchase_price: '0.00', supplier_id: ''
  });
  const [stockUpdate, setStockUpdate] = useState({ id: 0, quantity: 0 });

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getProducts();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError('Falha ao carregar produtos.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    getCategories().then(setCategories);
    getSuppliers().then(setSuppliers);
  }, [fetchProducts]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.category_id || !newProduct.supplier_id) {
        alert("Nome, Categoria e Fornecedor são obrigatórios.");
        return;
    }
    try {
      const productPayload = {
        ...newProduct,
        category_id: parseInt(newProduct.category_id),
        stock: parseInt(newProduct.stock),
        sale_price: parseFloat(newProduct.sale_price),
        purchase_price: parseFloat(newProduct.purchase_price),
        supplier_id: parseInt(newProduct.supplier_id)
      };
      await createProduct(productPayload);
      setIsModalOpen(false);
      fetchProducts();
      setNewProduct({ name: '', category_id: '', size: '', stock: '0', sale_price: '0.00', purchase_price: '0.00', supplier_id: '' });
    } catch (err) {
      alert('Falha ao criar produto.');
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja deletar este produto?')) {
      try {
        await deleteProduct(id);
        fetchProducts();
      } catch (err) {
        alert('Falha ao deletar produto.');
        console.error(err);
      }
    }
  };
  
  const handleStockUpdateSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
          await updateProductStock(stockUpdate.id, stockUpdate.quantity);
          setIsStockModalOpen(false);
          fetchProducts();
      } catch(err) {
          alert('Falha ao atualizar estoque.');
          console.error(err);
      }
  };

  const openStockModal = (product: ProductModel) => {
    setStockUpdate({ id: product.product_id, quantity: product.stock });
    setIsStockModalOpen(true);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Produtos</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
          Adicionar Produto
        </button>
      </div>

      {isLoading ? <LoadingSpinner /> : error ? <p className="text-red-500">{error}</p> : (
        <div className="bg-white dark:bg-slate-800 shadow-md rounded-lg overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 uppercase">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Nome</th>
                <th className="p-4">Tamanho</th>
                <th className="p-4">Estoque</th>
                <th className="p-4">Preço Venda</th>
                <th className="p-4">Preço Compra</th>
                <th className="p-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.product_id} className="border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="p-4">{product.product_id}</td>
                  <td className="p-4">{product.name}</td>
                  <td className="p-4">{product.size}</td>
                  <td className="p-4">{product.stock}</td>
                  <td className="p-4">R$ {product.sale_price}</td>
                  <td className="p-4">R$ {product.purchase_price}</td>
                  <td className="p-4 space-x-2">
                    <button onClick={() => openStockModal(product)} className="text-yellow-600 hover:text-yellow-800">Editar Estoque</button>
                    <button onClick={() => handleDelete(product.product_id)} className="text-red-600 hover:text-red-800">Deletar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal title="Adicionar Novo Produto" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" placeholder="Nome" value={newProduct.name} onChange={handleInputChange} required className="w-full p-2 border rounded bg-slate-200 dark:bg-slate-700" />
          <select name="category_id" value={newProduct.category_id} onChange={handleInputChange} required className="w-full p-2 border rounded bg-slate-200 dark:bg-slate-700">
            <option value="">Selecione a Categoria</option>
            {categories.map(c => <option key={c.category_id} value={c.category_id}>{c.name}</option>)}
          </select>
          <select name="supplier_id" value={newProduct.supplier_id} onChange={handleInputChange} required className="w-full p-2 border rounded bg-slate-200 dark:bg-slate-700">
            <option value="">Selecione o Fornecedor</option>
            {suppliers.map(s => <option key={s.supplier_id} value={s.supplier_id}>{s.name}</option>)}
          </select>
          <input type="text" name="size" placeholder="Tamanho" value={newProduct.size} onChange={handleInputChange} required className="w-full p-2 border rounded bg-slate-200 dark:bg-slate-700" />
          <input type="number" name="stock" placeholder="Estoque" value={newProduct.stock} onChange={handleInputChange} required className="w-full p-2 border rounded bg-slate-200 dark:bg-slate-700" />
          <input type="number" step="0.01" name="sale_price" placeholder="Preço de Venda" value={newProduct.sale_price} onChange={handleInputChange} required className="w-full p-2 border rounded bg-slate-200 dark:bg-slate-700" />
          <input type="number" step="0.01" name="purchase_price" placeholder="Preço de Compra" value={newProduct.purchase_price} onChange={handleInputChange} required className="w-full p-2 border rounded bg-slate-200 dark:bg-slate-700" />
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Salvar</button>
        </form>
      </Modal>

      <Modal title="Atualizar Estoque" isOpen={isStockModalOpen} onClose={() => setIsStockModalOpen(false)}>
        <form onSubmit={handleStockUpdateSubmit} className="space-y-4">
          <label>Nova Quantidade de Estoque</label>
          <input type="number" value={stockUpdate.quantity} onChange={(e) => setStockUpdate(prev => ({...prev, quantity: parseInt(e.target.value)}))} required className="w-full p-2 border rounded bg-slate-200 dark:bg-slate-700"/>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Atualizar Estoque</button>
        </form>
      </Modal>
    </div>
  );
};

export default ProductsPage;
