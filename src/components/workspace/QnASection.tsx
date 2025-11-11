import { useState, useMemo, useEffect } from 'react';
import { apiService } from '../../services/apiService';
import { QnA, Topic } from '../../types/api';
import { TopicSidebar } from './TopicSidebar';
import { FilterBar } from './FilterBar';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';
import { EmptyState } from './EmptyState';
import { Pagination } from './Pagination';
import { CardView } from './CardView';

interface QnASectionProps {
  productId: string;
}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
export const QnASection = ({ productId }: QnASectionProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  // State for API data
  const [topics, setTopics] = useState<Topic[]>([]);
  const [qnas, setQnas] = useState<QnA[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
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
  
  // Fetch QnAs for the selected topic
  useEffect(() => {
    if (!selectedTopicId) return;
    
    const fetchQnAs = async () => {
      setLoading(true);
      try {
        const response = await apiService.getQnA(productId, { topicId: selectedTopicId });
        if (response.success) {
          setQnas(response.data.items);
          
          // In a real app, we would fetch bookmarks from the API
          // For now, we'll just set random QnAs as bookmarked
          const randomBookmarks = new Set<string>();
          response.data.items.forEach(qna => {
            if (Math.random() > 0.7) {
              randomBookmarks.add(qna.id);
            }
          });
          setBookmarkedIds(randomBookmarks);
        } else {
          setError(response.message || 'Failed to load Q&As');
        }
      } catch (err) {
        console.error('Error fetching Q&As:', err);
        setError('An error occurred while loading Q&As');
      } finally {
        setLoading(false);
      }
    };
    
    fetchQnAs();
  }, [productId, selectedTopicId]);
  
  // Use qnas instead of productQnA
  const productQnA = qnas;

  // productQnA is now computed based on selectedTopicId above

  const allCompanies = useMemo(() => {
    const companies = new Set<string>();
    productQnA.forEach((qna) => qna.companyTags.forEach((c: string) => companies.add(c)));
    return Array.from(companies).sort();
  }, [productQnA]);

  const filteredQnA = useMemo(() => {
    return productQnA.filter((qna) => {
      const matchesSearch =
        searchQuery === '' ||
        qna.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        qna.answer.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCompany =
        selectedCompany === 'all' || qna.companyTags.includes(selectedCompany);

      // Convert level to lowercase for comparison
      const qnaLevel = qna.level.toLowerCase();
      const matchesDifficulty =
        selectedDifficulty === 'all' || qnaLevel === selectedDifficulty.toLowerCase();

      return matchesSearch && matchesCompany && matchesDifficulty;
    });
  }, [productQnA, searchQuery, selectedCompany, selectedDifficulty]);

  const totalPages = Math.ceil(filteredQnA.length / itemsPerPage);
  const paginatedQnA = filteredQnA.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
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
    setSearchQuery('');
    setSelectedCompany('all');
    setSelectedDifficulty('all');
  };

  // Show loading state
  if (loading) {
    return <LoadingState />;
  }
  
  // Show error state
  if (error) {
    return <ErrorState error={error} onRetry={() => window.location.reload()} />;
  }
  
  return (
    <div className="p-6 lg:p-8">
      <div className="flex gap-6 lg:gap-8">
        <TopicSidebar
          topics={topics}
          selectedTopicId={selectedTopicId}
          onSelect={(id) => {
            setSelectedTopicId(id);
            setCurrentPage(1);
          }}
        />
        <main className="flex-1 max-w-6xl">
          <div className="mb-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Q&A Repository</h1>
              <p className="text-gray-600">Browse and search through curated interview questions</p>
            </div>
          </div>

          <FilterBar
            searchQuery={searchQuery}
            onSearch={(val) => {
              setSearchQuery(val);
              setCurrentPage(1);
            }}
            topics={topics}
            selectedTopicId={selectedTopicId}
            onTopicChange={(val) => {
              setSelectedTopicId(val);
              setCurrentPage(1);
            }}
            companies={allCompanies}
            selectedCompany={selectedCompany}
            onCompanyChange={(val) => {
              setSelectedCompany(val);
              setCurrentPage(1);
            }}
            selectedDifficulty={selectedDifficulty}
            onDifficultyChange={(val) => {
              setSelectedDifficulty(val);
              setCurrentPage(1);
            }}
          />

          <div className="flex items-center justify-between mb-6">
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-900">{filteredQnA.length}</span> question{filteredQnA.length !== 1 ? 's' : ''}
            </div>

            {filteredQnA.length > 0 && (
              <div className="text-xs text-gray-500">
                Page {currentPage} of {totalPages}
              </div>
            )}
          </div>

        <CardView 
            qnas={paginatedQnA}
            expandedIds={expandedIds}
            bookmarkedIds={bookmarkedIds}
            toggleExpand={toggleExpand}
            toggleBookmark={toggleBookmark}
          />

        {totalPages > 1 && (
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={setCurrentPage} 
          />
        )}
        
        {filteredQnA.length === 0 && (
          <EmptyState onClearFilters={handleClearFilters} />
        )}
        </main>
      </div>
    </div>
  );
};
