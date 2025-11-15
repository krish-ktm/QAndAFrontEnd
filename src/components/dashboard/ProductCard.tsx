import { ArrowRight, Tag } from 'lucide-react';
import { Product as ApiProduct, Progress, Topic } from '../../types/api';
import { useState, useEffect } from 'react';
import { apiService } from '../../services/apiService';

interface ProductCardProps {
  product: ApiProduct;
  onSelect: () => void;
}

export const ProductCard = ({ product, onSelect }: ProductCardProps) => {
  const [progress, setProgress] = useState<number>(0);
  const [tags, setTags] = useState<string[]>([]);
  
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const [progressRes, topicsRes] = await Promise.all([
          apiService.getProgress(),
          apiService.getTopics(product.id),
        ]);

        if (progressRes.success && topicsRes.success) {
          const topicsForProduct = topicsRes.data.map((t: Topic) => t.id);
          const progressForProduct = (progressRes.data as Progress[]).filter((p) =>
            topicsForProduct.includes(p.topicId)
          );

          if (progressForProduct.length > 0) {
            const avg =
              progressForProduct.reduce((sum, p) => sum + p.completionPercent, 0) /
              progressForProduct.length;
            setProgress(Math.round(avg));
          } else {
            setProgress(0);
          }
        } else {
          setProgress(0);
        }
      } catch {
        setProgress(0);
      }
    };

    loadProgress();

    // Generate tags from product name and description
    const generatedTags = [];
    if (product.name.includes('Data')) generatedTags.push('Data');
    if (product.name.includes('System')) generatedTags.push('System Design');
    if (product.name.includes('Algorithm')) generatedTags.push('Algorithms');
    if (product.description.includes('interview')) generatedTags.push('Interview Prep');
    
    setTags(generatedTags.length > 0 ? generatedTags : ['Learning']);
  }, [product]);
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden group">
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition">
          {product.name}
        </h3>

        <p className="text-gray-600 mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
            >
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <button
          onClick={onSelect}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2 group-hover:gap-3"
        >
          Open Course
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
