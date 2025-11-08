import { BookOpen } from 'lucide-react';
import { mockProducts, Product } from '../../data/mockData';
import { ProductCard } from './ProductCard';

interface DashboardProps {
  onSelectProduct: (productId: string) => void;
}

export const Dashboard = ({ onSelectProduct }: DashboardProps) => {
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockProducts.map((product: Product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={() => onSelectProduct(product.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
