import { useState, useMemo, useEffect } from 'react';
import { Filter } from 'lucide-react';
import { apiService } from '../../services/apiService';
import { QnA, Topic, Bookmark } from '../../types/api';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';
import { EmptyState } from './EmptyState';
import { CardView } from './CardView';
import { Dropdown } from '../ui/Dropdown';

interface QnASectionMobileProps {
    productId: string;
}

export const QnASectionMobile = ({ productId }: QnASectionMobileProps) => {
    const [selectedCompany, setSelectedCompany] = useState<string>('all');
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
    const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
    const [showFilters, setShowFilters] = useState(false);

    // State for API data
    const [topics, setTopics] = useState<Topic[]>([]);
    const [qnas, setQnas] = useState<QnA[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Fetch topics for the product
    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const response = await apiService.getTopics(productId);
                if (response.success) {
                    setTopics(response.data);
                    if (response.data.length > 0) {
                        setSelectedTopicId(response.data[0].id);
                    }
                } else {
                    setError(response.message || 'Failed to load topics');
                }
            } catch (err) {
                console.error('Error fetching topics:', err);
                setError('An error occurred while loading topics');
            }
        };

        fetchTopics();
    }, [productId]);

    // Selected topic
    const [selectedTopicId, setSelectedTopicId] = useState<string>('');
    const [loadingTopicId, setLoadingTopicId] = useState<string>('');

    // Fetch QnAs for the selected topic and apply bookmarks from mock data
    useEffect(() => {
        if (!selectedTopicId) return;

        const fetchQnAs = async () => {
            setLoadingTopicId(selectedTopicId);
            try {
                const [qnaRes, bookmarksRes] = await Promise.all([
                    apiService.getQnA(productId, { topicId: selectedTopicId }),
                    apiService.getBookmarks(),
                ]);

                if (qnaRes.success) {
                    setQnas(qnaRes.data.items);

                    if (bookmarksRes.success) {
                        const bookmarkIds = new Set<string>();
                        (bookmarksRes.data as Bookmark[]).forEach((bm) => {
                            if (bm.qnaId) {
                                bookmarkIds.add(bm.qnaId);
                            }
                        });
                        setBookmarkedIds(bookmarkIds);
                    } else {
                        setBookmarkedIds(new Set());
                    }
                } else {
                    setError(qnaRes.message || 'Failed to load Q&As');
                }
            } catch (err) {
                console.error('Error fetching Q&As:', err);
                setError('An error occurred while loading Q&As');
            } finally {
                setLoadingTopicId('');
            }
        };

        fetchQnAs();
    }, [productId, selectedTopicId]);

    // Use qnas instead of productQnA
    const productQnA = qnas;

    const allCompanies = useMemo(() => {
        const companies = new Set<string>();
        productQnA.forEach((qna) => qna.companyTags.forEach((c: string) => companies.add(c)));
        return Array.from(companies).sort();
    }, [productQnA]);

    const filteredQnA = useMemo(() => {
        return productQnA.filter((qna) => {
            const matchesCompany =
                selectedCompany === 'all' || qna.companyTags.includes(selectedCompany);

            // Convert level to lowercase for comparison
            const qnaLevel = qna.level.toLowerCase();
            const matchesDifficulty =
                selectedDifficulty === 'all' || qnaLevel === selectedDifficulty.toLowerCase();

            return matchesCompany && matchesDifficulty;
        });
    }, [productQnA, selectedCompany, selectedDifficulty]);

    const toggleExpand = (id: string) => {
        setExpandedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const toggleBookmark = (id: string) => {
        const newBookmarked = new Set(bookmarkedIds);
        if (newBookmarked.has(id)) {
            newBookmarked.delete(id);
        } else {
            newBookmarked.add(id);
        }
        setBookmarkedIds(newBookmarked);
    };

    const handleClearFilters = () => {
        setSelectedCompany('all');
        setSelectedDifficulty('all');
    };

    // Show error state
    if (error) {
        return <ErrorState error={error} onRetry={() => window.location.reload()} />;
    }

    // Show loading state while topics are being fetched
    if (topics.length === 0 && !error) {
        return <LoadingState />;
    }

    const companyOptions = [
        { value: 'all', label: 'All Companies' },
        ...allCompanies.map(c => ({ value: c, label: c }))
    ];

    const difficultyOptions = [
        { value: 'all', label: 'All Levels' },
        { value: 'beginner', label: 'Beginner' },
        { value: 'intermediate', label: 'Intermediate' },
        { value: 'advanced', label: 'Advanced' }
    ];

    return (
        <div className="flex flex-col h-full">
            {/* Topic Selection - Horizontal Scroll */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="flex overflow-x-auto p-3 gap-2 no-scrollbar">
                    {topics.map((topic) => (
                        <button
                            key={topic.id}
                            onClick={() => setSelectedTopicId(topic.id)}
                            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedTopicId === topic.id
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {topic.name}
                        </button>
                    ))}
                </div>
            </div>

            <div className="p-4 flex-1 overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Questions</h2>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`p-2 rounded-lg transition-colors ${showFilters || selectedCompany !== 'all' || selectedDifficulty !== 'all'
                                ? 'bg-blue-50 text-blue-600'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                    >
                        <Filter className="w-5 h-5" />
                    </button>
                </div>

                {showFilters && (
                    <div className="bg-gray-50 p-4 rounded-lg mb-4 space-y-3 animate-in fade-in slide-in-from-top-2">
                        <Dropdown
                            options={companyOptions}
                            value={selectedCompany}
                            onChange={setSelectedCompany}
                            placeholder="Select Company"
                            className="w-full"
                        />
                        <Dropdown
                            options={difficultyOptions}
                            value={selectedDifficulty}
                            onChange={setSelectedDifficulty}
                            placeholder="Select Difficulty"
                            className="w-full"
                        />
                    </div>
                )}

                <div className="mb-4 text-sm text-gray-500">
                    {filteredQnA.length} questions found
                </div>

                <CardView
                    qnas={filteredQnA}
                    expandedIds={expandedIds}
                    bookmarkedIds={bookmarkedIds}
                    toggleExpand={toggleExpand}
                    toggleBookmark={toggleBookmark}
                    isLoading={loadingTopicId !== ''}
                />

                {filteredQnA.length === 0 && (
                    <EmptyState onClearFilters={handleClearFilters} />
                )}
            </div>
        </div>
    );
};
