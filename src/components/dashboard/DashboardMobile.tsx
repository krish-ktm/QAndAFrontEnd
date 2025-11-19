import { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import { apiService } from '../../services/apiService';
import { Product } from '../../types/api';
import { ProductCard } from './ProductCard';

interface DashboardMobileProps {
    onSelectProduct: (productId: string) => void;
}

export const DashboardMobile = ({ onSelectProduct }: DashboardMobileProps) => {
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
            <div className="px-4 py-6">
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="w-8 h-8 text-blue-600" />
                        <h1 className="text-2xl font-bold text-gray-900">My Products</h1>
                    </div>
                    <p className="text-sm text-gray-600">
                        Continue your learning journey
                    </p>
                </div>

                {loading && (
                    <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4 text-sm">
                        {error}
                    </div>
                )}

                {!loading && !error && (
                    <div className="flex flex-col gap-4">
                        {products.map((product: Product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onSelect={() => onSelectProduct(product.id)}
                            />
                        ))}
                        {products.length === 0 && (
                            <div className="text-center py-8 text-gray-500 text-sm">
                                No products available.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
