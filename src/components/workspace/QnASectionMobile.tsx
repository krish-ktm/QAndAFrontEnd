import { useState, useMemo, useEffect, useRef } from 'react';
import { Filter } from 'lucide-react';
import { apiService } from '../../services/apiService';
import { QnA, Topic, Bookmark } from '../../types/api';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';
import { EmptyState } from './EmptyState';
import { CardView } from './CardView';
import { Dropdown } from '../ui/Dropdown';
import { TopicSelectorMobile } from './TopicSelectorMobile';
import { PaginationMobile } from './PaginationMobile';

interface QnASectionMobileProps {
    productId: string;
}

export const QnASectionMobile = ({ productId }: QnASectionMobileProps) => {
    const [selectedCompany, setSelectedCompany] = useState<string>('all');
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
    const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
    const [showFilters, setShowFilters] = useState(false);
    const [overflowVisible, setOverflowVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const scrollContainerRef = useRef<HTMLDivElement>(null);

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

        // Reset pagination when topic changes
        setCurrentPage(1);

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

    // Pagination Logic
    const totalPages = Math.ceil(filteredQnA.length / itemsPerPage);
    const paginatedQnA = filteredQnA.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCompany, selectedDifficulty]);

    // Scroll to top on page change
    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [currentPage]);

    // Handle overflow visibility for smooth animation
    useEffect(() => {
        if (showFilters) {
            const timer = setTimeout(() => setOverflowVisible(true), 300);
            return () => clearTimeout(timer);
        } else {
            setOverflowVisible(false);
        }
    }, [showFilters]);

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
            {/* Topic Selector - Sticky Header */}
            <TopicSelectorMobile
                topics={topics}
                selectedTopicId={selectedTopicId}
                onSelectTopic={setSelectedTopicId}
            />

            <div ref={scrollContainerRef} className="p-4 flex-1 overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Questions</h2>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 font-medium">
                            {filteredQnA.length} found
                        </span>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`p-2 rounded-lg transition-all duration-300 ease-out hover:-translate-y-0.5 active:scale-95 ${showFilters || selectedCompany !== 'all' || selectedDifficulty !== 'all'
                                ? 'bg-blue-50 text-blue-600'
                                : 'bg-gray-100 text-gray-600'
                                }`}
                        >
                            <Filter className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${showFilters ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                    <div className={`overflow-hidden ${overflowVisible ? 'overflow-visible' : ''}`}>
                        <div className="bg-gray-50 p-2 rounded-lg mb-4 space-y-2">
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
                    </div>
                </div>

                <CardView
                    qnas={paginatedQnA}
                    expandedIds={expandedIds}
                    bookmarkedIds={bookmarkedIds}
                    toggleExpand={toggleExpand}
                    toggleBookmark={toggleBookmark}
                    isLoading={loadingTopicId !== ''}
                />

                {filteredQnA.length > 0 && (
                    <PaginationMobile
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                )}

                {filteredQnA.length === 0 && !loadingTopicId && (
                    <EmptyState onClearFilters={handleClearFilters} />
                )}
            </div>
        </div>
    );
};
