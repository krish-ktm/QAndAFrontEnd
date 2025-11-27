import { useState, useEffect } from 'react';
import { ArrowLeft, MessageSquare, Brain, FileText, Layers, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/apiService';
import { Product, Progress, Topic } from '../../types/api';
import { QnASection } from './QnASection';
import { QuizSectionMobile } from './QuizSectionMobile';
import { PDFSection } from './PDFSection';
import { FlashcardSection } from './FlashcardSection';
import { RoadmapList } from '../roadmaps/RoadmapList';
import { RoadmapView } from '../roadmaps/RoadmapView';

interface WorkspaceMobileProps {
    productId: string;
    onBack: () => void;
}

type Section = 'qna' | 'quiz' | 'pdf' | 'flashcards' | 'roadmaps';

export const WorkspaceMobile = ({ productId, onBack }: WorkspaceMobileProps) => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState<Section>('qna');
    const [selectedRoadmapId, setSelectedRoadmapId] = useState<string | null>(null);
    const [quizView, setQuizView] = useState<'groups' | 'active'>('groups');
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [overallProgress, setOverallProgress] = useState<number>(0);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const [productRes, topicsRes, progressRes] = await Promise.all([
                    apiService.getProductDetail(productId),
                    apiService.getTopics(productId),
                    apiService.getProgress(),
                ]);

                if (productRes.success) {
                    setProduct(productRes.data);
                } else {
                    setError(productRes.message || 'Failed to load product');
                }

                if (topicsRes.success && progressRes.success) {
                    const topicIds = topicsRes.data.map((t: Topic) => t.id);
                    const progressForProduct = (progressRes.data as Progress[]).filter((p) =>
                        topicIds.includes(p.topicId)
                    );

                    if (progressForProduct.length > 0) {
                        const avg =
                            progressForProduct.reduce((sum, p) => sum + p.completionPercent, 0) /
                            progressForProduct.length;
                        setOverallProgress(Math.round(avg));
                    } else {
                        setOverallProgress(0);
                    }
                } else {
                    setOverallProgress(0);
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
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center p-4">
                <div className="bg-white p-6 rounded-lg shadow-md w-full">
                    <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
                    <p className="text-gray-700 mb-6 text-sm">{error || 'Product not found'}</p>
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
        { id: 'quiz' as Section, label: 'Quiz', icon: Brain },
        { id: 'pdf' as Section, label: 'PDF', icon: FileText },
        { id: 'flashcards' as Section, label: 'Cards', icon: Layers },
        { id: 'roadmaps' as Section, label: 'Roadmaps', icon: Compass },
    ];

    const handleBack = () => {
        if (activeSection === 'quiz' && quizView === 'active') {
            setQuizView('groups');
        } else {
            onBack();
        }
    };

    const getHeaderTitle = () => {
        if (activeSection === 'quiz' && quizView === 'active') {
            return 'Quiz Challenge';
        }
        return (
            <>
                {product.name} <span className="text-gray-400 mx-1">|</span> {sections.find(s => s.id === activeSection)?.label}
            </>
        );
    };

    return (
        <>
            <div className={`min-h-screen bg-gray-50 flex flex-col ${selectedRoadmapId ? 'hidden' : ''}`}>
                {/* Mobile Header */}
                <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
                    <button
                        onClick={handleBack}
                        className="p-2 -ml-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-sm font-bold text-gray-900 truncate max-w-[200px]">
                        {getHeaderTitle()}
                    </h1>
                    <div className="w-8 h-8 flex items-center justify-center">
                        <div className="relative w-8 h-8 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle
                                    cx="16"
                                    cy="16"
                                    r="14"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    fill="transparent"
                                    className="text-gray-200"
                                />
                                <circle
                                    cx="16"
                                    cy="16"
                                    r="14"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    fill="transparent"
                                    strokeDasharray={88}
                                    strokeDashoffset={88 - (88 * overallProgress) / 100}
                                    className="text-blue-600"
                                />
                            </svg>
                            <span className="absolute text-[10px] font-bold text-gray-700">
                                {overallProgress}%
                            </span>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto pb-20">
                    {activeSection === 'qna' && <QnASection productId={productId} />}
                    {activeSection === 'quiz' && (
                        <QuizSectionMobile
                            productId={productId}
                            view={quizView}
                            onViewChange={setQuizView}
                        />
                    )}
                    {activeSection === 'pdf' && <PDFSection productId={productId} />}
                    {activeSection === 'flashcards' && <FlashcardSection productId={productId} />}
                    {activeSection === 'roadmaps' && (
                        <RoadmapList
                            productId={productId}
                            onSelectRoadmap={setSelectedRoadmapId}
                        />
                    )}
                </main>

                {/* Bottom Navigation */}
                <nav className="bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-30 pb-safe">
                    <ul className="flex justify-around items-center h-16">
                        {sections.map((section) => {
                            const Icon = section.icon;
                            const isActive = activeSection === section.id;

                            return (
                                <li key={section.id} className="flex-1">
                                    <button
                                        onClick={() => setActiveSection(section.id)}
                                        className={`w-full h-full flex flex-col items-center justify-center gap-1 ${isActive ? 'text-blue-600' : 'text-gray-500'
                                            }`}
                                    >
                                        <Icon className={`w-6 h-6 ${isActive ? 'fill-current' : ''}`} strokeWidth={isActive ? 2 : 1.5} />
                                        <span className="text-[10px] font-medium">{section.label}</span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </div>

            {selectedRoadmapId && (
                <div className="fixed inset-0 z-50 bg-white">
                    <RoadmapView
                        roadmapId={selectedRoadmapId}
                        onBack={() => setSelectedRoadmapId(null)}
                    />
                </div>
            )}
        </>
    );
};
