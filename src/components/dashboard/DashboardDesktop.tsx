import { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import { apiService } from '../../services/apiService';
import { Product } from '../../types/api';
import { ProductCard } from './ProductCard';

interface DashboardDesktopProps {
    onSelectProduct: (productId: string) => void;
}

export const DashboardDesktop = ({ onSelectProduct }: DashboardDesktopProps) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await apiService.getProducts();
                if (response.success) {
                    setProducts(response.data);
                } else {
                    setError(response.message || 'Failed to load products');
                }
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('An error occurred while loading products');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <BookOpen className="w-10 h-10 text-blue-600" />
                        <h1 className="text-4xl font-bold text-gray-900">My Learning Products</h1>
                    </div>
                    <p className="text-lg text-gray-600">
                        Select a product to continue your learning journey
                    </p>
                </div>

                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
                        {error}
                    </div>
                )}

                {!loading && !error && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product: Product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onSelect={() => onSelectProduct(product.id)}
                            />
                        ))}
                        {products.length === 0 && (
                            <div className="col-span-3 text-center py-12 text-gray-500">
                                No products available. Please check back later.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
