
import React, { useState, useEffect } from 'react';
import { getReport, getSuppliers, getProducts, getCustomers } from '../services/api';
import { SupplierModel, ProductModel, CustomerModel } from '../types';
import { Card } from '../components/common';

const ReportResult: React.FC<{ data: any, loading: boolean }> = ({ data, loading }) => {
    if (loading) return <p className="text-blue-500">Gerando...</p>;
    if (!data) return null;
    return <pre className="mt-4 bg-slate-100 dark:bg-slate-900 p-4 rounded-lg text-sm overflow-x-auto">{JSON.stringify(data, null, 2)}</pre>;
};

const ReportsPage: React.FC = () => {
    const [suppliers, setSuppliers] = useState<SupplierModel[]>([]);
    const [products, setProducts] = useState<ProductModel[]>([]);
    const [customers, setCustomers] = useState<CustomerModel[]>([]);

    const [profitPeriod, setProfitPeriod] = useState({ begin_date: '', final_date: '' });
    const [profitPeriodResult, setProfitPeriodResult] = useState<any>(null);
    const [profitPeriodLoading, setProfitPeriodLoading] = useState(false);

    const [profitSupplier, setProfitSupplier] = useState({ begin_date: '', final_date: '', supplier_id: '' });
    const [profitSupplierResult, setProfitSupplierResult] = useState<any>(null);
    const [profitSupplierLoading, setProfitSupplierLoading] = useState(false);

    const [profitProduct, setProfitProduct] = useState({ id: '' });
    const [profitProductResult, setProfitProductResult] = useState<any>(null);
    const [profitProductLoading, setProfitProductLoading] = useState(false);

    const [mostUsedMethodResult, setMostUsedMethodResult] = useState<any>(null);
    const [mostUsedMethodLoading, setMostUsedMethodLoading] = useState(false);
    
    const [mostPurchasesCustomerResult, setMostPurchasesCustomerResult] = useState<any>(null);
    const [mostPurchasesCustomerLoading, setMostPurchasesCustomerLoading] = useState(false);

    const [productsByCustomer, setProductsByCustomer] = useState({ id: '' });
    const [productsByCustomerResult, setProductsByCustomerResult] = useState<any>(null);
    const [productsByCustomerLoading, setProductsByCustomerLoading] = useState(false);

    const [customersByProduct, setCustomersByProduct] = useState({ id: '' });
    const [customersByProductResult, setCustomersByProductResult] = useState<any>(null);
    const [customersByProductLoading, setCustomersByProductLoading] = useState(false);

    useEffect(() => {
        getSuppliers().then(setSuppliers);
        getProducts().then(setProducts);
        getCustomers().then(setCustomers);
    }, []);

    const generateReport = async (url: string, setLoading: React.Dispatch<React.SetStateAction<boolean>>, setResult: React.Dispatch<React.SetStateAction<any>>) => {
        setLoading(true);
        setResult(null);
        try {
            const data = await getReport(url);
            setResult(data);
        } catch (error) {
            console.error("Failed to generate report", error);
            setResult({ error: "Falha ao gerar relatório." });
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Relatórios</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                <Card title="Lucro por Período">
                    <input type="date" value={profitPeriod.begin_date} onChange={e => setProfitPeriod({...profitPeriod, begin_date: e.target.value})} className="w-full p-2 border rounded bg-slate-200 dark:bg-slate-700 mb-2"/>
                    <input type="date" value={profitPeriod.final_date} onChange={e => setProfitPeriod({...profitPeriod, final_date: e.target.value})} className="w-full p-2 border rounded bg-slate-200 dark:bg-slate-700 mb-2"/>
                    <button onClick={() => generateReport(`/Reports/profit/period?begin_date=${profitPeriod.begin_date}&final_date=${profitPeriod.final_date}`, setProfitPeriodLoading, setProfitPeriodResult)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">Gerar</button>
                    <ReportResult data={profitPeriodResult} loading={profitPeriodLoading} />
                </Card>

                <Card title="Lucro por Fornecedor">
                    <input type="date" value={profitSupplier.begin_date} onChange={e => setProfitSupplier({...profitSupplier, begin_date: e.target.value})} className="w-full p-2 border rounded bg-slate-200 dark:bg-slate-700 mb-2"/>
                    <input type="date" value={profitSupplier.final_date} onChange={e => setProfitSupplier({...profitSupplier, final_date: e.target.value})} className="w-full p-2 border rounded bg-slate-200 dark:bg-slate-700 mb-2"/>
                    <select value={profitSupplier.supplier_id} onChange={e => setProfitSupplier({...profitSupplier, supplier_id: e.target.value})} className="w-full p-2 border rounded bg-slate-200 dark:bg-slate-700 mb-2">
                        <option value="">Selecione Fornecedor</option>
                        {suppliers.map(s => <option key={s.supplier_id} value={s.supplier_id}>{s.name}</option>)}
                    </select>
                    <button onClick={() => generateReport(`/Reports/profit/supplier?begin_date=${profitSupplier.begin_date}&final_date=${profitSupplier.final_date}&supplier_id=${profitSupplier.supplier_id}`, setProfitSupplierLoading, setProfitSupplierResult)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">Gerar</button>
                    <ReportResult data={profitSupplierResult} loading={profitSupplierLoading} />
                </Card>

                <Card title="Lucro por Produto">
                    <select value={profitProduct.id} onChange={e => setProfitProduct({id: e.target.value})} className="w-full p-2 border rounded bg-slate-200 dark:bg-slate-700 mb-2">
                        <option value="">Selecione Produto</option>
                        {products.map(p => <option key={p.product_id} value={p.product_id}>{p.name}</option>)}
                    </select>
                    <button onClick={() => generateReport(`/Reports/profit/product/${profitProduct.id}`, setProfitProductLoading, setProfitProductResult)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">Gerar</button>
                    <ReportResult data={profitProductResult} loading={profitProductLoading} />
                </Card>

                <Card title="Método de Pagamento Mais Usado">
                    <button onClick={() => generateReport('/Reports/method/most-used', setMostUsedMethodLoading, setMostUsedMethodResult)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">Gerar</button>
                    <ReportResult data={mostUsedMethodResult} loading={mostUsedMethodLoading} />
                </Card>
                
                <Card title="Cliente com Mais Compras">
                    <button onClick={() => generateReport('/Reports/customer/most-purchases', setMostPurchasesCustomerLoading, setMostPurchasesCustomerResult)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">Gerar</button>
                    <ReportResult data={mostPurchasesCustomerResult} loading={mostPurchasesCustomerLoading} />
                </Card>

                 <Card title="Produtos Comprados por Cliente">
                    <select value={productsByCustomer.id} onChange={e => setProductsByCustomer({id: e.target.value})} className="w-full p-2 border rounded bg-slate-200 dark:bg-slate-700 mb-2">
                        <option value="">Selecione Cliente</option>
                        {customers.map(c => <option key={c.customer_id} value={c.customer_id}>{c.name}</option>)}
                    </select>
                    <button onClick={() => generateReport(`/Reports/customer-products/${productsByCustomer.id}`, setProductsByCustomerLoading, setProductsByCustomerResult)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">Gerar</button>
                    <ReportResult data={productsByCustomerResult} loading={productsByCustomerLoading} />
                </Card>

                <Card title="Clientes que Compraram Produto">
                    <select value={customersByProduct.id} onChange={e => setCustomersByProduct({id: e.target.value})} className="w-full p-2 border rounded bg-slate-200 dark:bg-slate-700 mb-2">
                        <option value="">Selecione Produto</option>
                        {products.map(p => <option key={p.product_id} value={p.product_id}>{p.name}</option>)}
                    </select>
                    <button onClick={() => generateReport(`/Reports/product-customers/${customersByProduct.id}`, setCustomersByProductLoading, setCustomersByProductResult)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">Gerar</button>
                    <ReportResult data={customersByProductResult} loading={customersByProductLoading} />
                </Card>

            </div>
        </div>
    );
};

export default ReportsPage;
