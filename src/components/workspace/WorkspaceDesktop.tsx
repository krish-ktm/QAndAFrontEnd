import { useState, useEffect } from 'react';
import { ArrowLeft, MessageSquare, Brain, FileText, Layers, Compass } from 'lucide-react';
import { apiService } from '../../services/apiService';
import { Product, Progress, Topic } from '../../types/api';
import { QnASection } from './QnASection';
import { QuizSection } from './QuizSection';
import { PDFSection } from './PDFSection';
import { FlashcardSection } from './FlashcardSection';
import { RoadmapList } from '../roadmaps/RoadmapList';
import { RoadmapView } from '../roadmaps/RoadmapView';

interface WorkspaceDesktopProps {
    productId: string;
    onBack: () => void;
}

type Section = 'qna' | 'quiz' | 'pdf' | 'flashcards' | 'roadmaps';

export const WorkspaceDesktop = ({ productId, onBack }: WorkspaceDesktopProps) => {
    const [activeSection, setActiveSection] = useState<Section>('qna');
    const [selectedRoadmapId, setSelectedRoadmapId] = useState<string | null>(null);
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isSidebarHovered, setIsSidebarHovered] = useState(false);
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
        { id: 'flashcards' as Section, label: 'Flashcards', icon: Layers },
        { id: 'roadmaps' as Section, label: 'Roadmaps', icon: Compass },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex relative">
            <aside
                className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out relative z-20 ${isSidebarHovered ? 'w-64' : 'w-16'
                    }`}
                style={{ willChange: 'width' }}
                onMouseEnter={() => setIsSidebarHovered(true)}
                onMouseLeave={() => setIsSidebarHovered(false)}
            >
                <div className="p-3 border-b border-gray-200">
                    <button
                        onClick={onBack}
                        className={`flex items-center gap-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition overflow-hidden ${isSidebarHovered ? 'px-4 py-3 w-full' : 'justify-center w-10 h-10'
                            }`}
                        title="Back to Dashboard"
                    >
                        <ArrowLeft className="w-5 h-5 flex-shrink-0" />
                        <span className={`text-sm font-medium whitespace-nowrap transition-opacity duration-300 ${isSidebarHovered ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
                            }`}>
                            Back to Dashboard
                        </span>
                    </button>
                </div>

                <nav className="flex-1 p-2">
                    <ul className="space-y-1">
                        {sections.map((section) => {
                            const Icon = section.icon;
                            const isActive = activeSection === section.id;

                            return (
                                <li key={section.id}>
                                    <button
                                        onClick={() => {
                                            setActiveSection(section.id);
                                            // Reset nested views when switching sections
                                            if (section.id !== 'roadmaps') setSelectedRoadmapId(null);
                                        }}
                                        className={`w-full flex items-center gap-3 rounded-lg transition overflow-hidden ${isActive
                                            ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                                            : 'text-gray-600 hover:bg-gray-50 hover:border-l-4 hover:border-gray-300'
                                            } ${isSidebarHovered ? 'px-4 py-3' : 'justify-center w-12 h-12'}`}
                                        title={section.label}
                                    >
                                        <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-blue-600' : ''}`} />
                                        <span className={`text-sm font-medium whitespace-nowrap transition-opacity duration-300 ${isSidebarHovered ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
                                            }`}>
                                            {section.label}
                                        </span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div className="p-3 border-t border-gray-200">
                    <div className={`flex items-center bg-gray-50 rounded-lg transition overflow-hidden ${isSidebarHovered ? 'px-4 py-3 w-full' : 'justify-center w-12 h-12'
                        }`}>
                        <div className="text-center">
                            <div className="text-xs font-bold text-gray-900">{overallProgress}%</div>
                            <div className={`text-left ml-3 transition-opacity duration-300 ${isSidebarHovered ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
                                }`}>
                                <div className="text-xs font-medium text-gray-700 whitespace-nowrap">Overall Progress</div>
                                <div className="w-32 bg-gray-200 rounded-full h-1.5 mt-2">
                                    <div className="bg-blue-600 h-full rounded-full" style={{ width: `${overallProgress}%` }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            <main className="flex-1 overflow-auto">
                {activeSection === 'qna' && <QnASection productId={productId} />}
                {activeSection === 'quiz' && <QuizSection productId={productId} />}
                {activeSection === 'pdf' && <PDFSection productId={productId} />}
                {activeSection === 'flashcards' && <FlashcardSection productId={productId} />}
                {activeSection === 'roadmaps' && (
                    selectedRoadmapId ? (
                        <RoadmapView
                            roadmapId={selectedRoadmapId}
                            onBack={() => setSelectedRoadmapId(null)}
                        />
                    ) : (
                        <RoadmapList
                            productId={productId}
                            onSelectRoadmap={setSelectedRoadmapId}
                        />
                    )
                )}
            </main>
        </div>
    );
};
