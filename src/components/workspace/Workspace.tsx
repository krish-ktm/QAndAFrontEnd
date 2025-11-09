import { useState, useEffect } from 'react';
import { ArrowLeft, MessageSquare, Brain, FileText } from 'lucide-react';
import { apiService } from '../../services/apiService';
import { Product } from '../../types/api';
import { QnASection } from './QnASection';
import { QuizSection } from './QuizSection';
import { PDFSection } from './PDFSection';

interface WorkspaceProps {
  productId: string;
  onBack: () => void;
}

type Section = 'qna' | 'quiz' | 'pdf';

export const Workspace = ({ productId, onBack }: WorkspaceProps) => {
  const [activeSection, setActiveSection] = useState<Section>('qna');
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await apiService.getProductDetail(productId);
        if (response.success) {
          setProduct(response.data);
        } else {
          setError(response.message || 'Failed to load product');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('An error occurred while loading product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error || 'Product not found'}</p>
          <button
            onClick={onBack}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const sections = [
    { id: 'qna' as Section, label: 'Q&A', icon: MessageSquare },
    { id: 'quiz' as Section, label: 'Quizzes', icon: Brain },
    { id: 'pdf' as Section, label: 'Resources', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Dashboard</span>
          </button>
          <h2 className="text-lg font-bold text-gray-900 line-clamp-2">{product.name}</h2>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;

              return (
                <li key={section.id}>
                  <button
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {section.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-2">Course Progress</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all"
                  style={{ width: `50%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-900">50%</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        {activeSection === 'qna' && <QnASection productId={productId} />}
        {activeSection === 'quiz' && <QuizSection productId={productId} />}
        {activeSection === 'pdf' && <PDFSection productId={productId} />}
      </main>
    </div>
  );
};
