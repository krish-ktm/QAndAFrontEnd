import { useState, useMemo, useRef, useEffect } from 'react';
import { Search, Star, ChevronDown, ChevronUp, Building2, TrendingUp, BookOpen, Rows, Columns } from 'lucide-react';
import { apiService } from '../../services/apiService';
import { QnA, Topic } from '../../types/api';

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
  const [viewMode, setViewMode] = useState<'vertical' | 'horizontal' | 'grid'>('vertical');
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const horizontalScrollRef = useRef<HTMLDivElement>(null);
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
  
  // Add keyboard navigation for horizontal view
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode !== 'horizontal') return;
      
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        setCurrentItemIndex(prev => Math.min(paginatedQnA.length - 1, prev + 1));
        if (horizontalScrollRef.current) {
          const cardWidth = horizontalScrollRef.current.scrollWidth / paginatedQnA.length;
          horizontalScrollRef.current.scrollTo({
            left: cardWidth * Math.min(paginatedQnA.length - 1, currentItemIndex + 1),
            behavior: 'smooth',
          });
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        setCurrentItemIndex(prev => Math.max(0, prev - 1));
        if (horizontalScrollRef.current) {
          const cardWidth = horizontalScrollRef.current.scrollWidth / paginatedQnA.length;
          horizontalScrollRef.current.scrollTo({
            left: cardWidth * Math.max(0, currentItemIndex - 1),
            behavior: 'smooth',
          });
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, currentItemIndex, paginatedQnA.length]);
  
  // Reset current item index when changing view modes
  useEffect(() => {
    setCurrentItemIndex(0);
  }, [viewMode]);

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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-700';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-700';
      case 'advanced':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-5xl mx-auto text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Q&A content...</p>
        </div>
      </div>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <div className="p-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6">
            <h3 className="text-lg font-medium mb-2">Error</h3>
            <p>{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-8">
      <div className="flex gap-8">
        {/* Topic sidebar */}
        <aside className="hidden md:block w-60 shrink-0">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {topics.map((topic) => {
              const isActive = topic.id === selectedTopicId;
              return (
                <button
                  key={topic.id}
                  onClick={() => {
                    setSelectedTopicId(topic.id);
                    setCurrentPage(1);
                  }}
                  className={`w-full text-left px-4 py-3 text-sm transition border-b border-gray-200 last:border-b-0 ${isActive ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-gray-50 text-gray-700'}`}
                >
                  {topic.name}
                </button>
              );
            })}
          </div>
        </aside>
        <main className="flex-1 max-w-5xl">
          <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Q&A Repository</h1>
              <p className="text-gray-600">Browse and search through curated interview questions</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-1.5 shadow-sm hover:shadow transition-all">
              <div className="flex items-center gap-1">
                {/* List view */}
                <button
                  onClick={() => setViewMode('vertical')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                    viewMode === 'vertical'
                      ? 'bg-gray-200 text-gray-800 font-medium shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  aria-label="Vertical list view"
                  title="Vertical list view"
                >
                  <Rows className="w-5 h-5" />
                  <span className="hidden sm:inline">List</span>
                </button>

                {/* Flash-card view */}
                <button
                  onClick={() => setViewMode('horizontal')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                    viewMode === 'horizontal'
                      ? 'bg-gray-200 text-gray-800 font-medium shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  aria-label="Flash-card view"
                  title="Flash-card view"
                >
                  <Columns className="w-5 h-5" />
                  <span className="hidden sm:inline">Flash&nbsp;Cards</span>
                </button>
              </div>
            </div>
          </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search questions or answers..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3">
              <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={selectedTopicId}
                  onChange={(e) => {
                    setSelectedTopicId(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  {topics.map((topic: Topic) => (
                    <option key={topic.id} value={topic.id}>
                      {topic.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={selectedCompany}
                  onChange={(e) => {
                    setSelectedCompany(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">All Companies</option>
                  {allCompanies.map((company) => (
                    <option key={company} value={company}>
                      {company}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={selectedDifficulty}
                  onChange={(e) => {
                    setSelectedDifficulty(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredQnA.length} question{filteredQnA.length !== 1 ? 's' : ''}
          </div>
        </div>

        {viewMode === 'vertical' ? (
          <div className="space-y-4">
            {paginatedQnA.map((qna: QnA) => {
              const isExpanded = expandedIds.has(qna.id);
              const isBookmarked = bookmarkedIds.has(qna.id);

              return (
                <div
                  key={qna.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md hover:border-gray-300 transition-all duration-300"
                >
                  <div className="p-6 relative">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex-1">
                        {qna.question}
                      </h3>
                      <button
                        onClick={() => toggleBookmark(qna.id)}
                        className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-lg transition"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            isBookmarked ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full ${getDifficultyColor(
                            qna.level
                          )}`}
                        >
                          {qna.level.charAt(0) + qna.level.slice(1).toLowerCase()}
                        </span>
                        {qna.companyTags.map((company: string) => (
                          <span
                            key={company}
                            className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
                          >
                            {company}
                          </span>
                        ))}
                    </div>

                    {isExpanded && (
                      <div className="mb-4 p-4 bg-gray-50 rounded-lg space-y-4">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">{qna.answer}</p>
                        {qna.exampleCode && (
                          <pre className="bg-gray-800 text-gray-100 text-sm p-4 rounded-lg overflow-x-auto">
                            {qna.exampleCode}
                          </pre>
                        )}
                      </div>
                    )}

                    <button
                      onClick={() => toggleExpand(qna.id)}
                      className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium transition"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="w-5 h-5" />
                          Hide Answer
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-5 h-5" />
                          Show Answer
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : viewMode === 'horizontal' ? (
          <div className="relative">
            <div 
              ref={horizontalScrollRef}
              className="flex overflow-hidden snap-x snap-mandatory py-6"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {paginatedQnA.map((qna: QnA, index: number) => {
                const isExpanded = expandedIds.has(qna.id);
                const isBookmarked = bookmarkedIds.has(qna.id);

                return (
                  <div
                    key={qna.id}
                    className="flex-shrink-0 w-full snap-center px-4"
                  >
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl hover:border-gray-300 transition-all duration-300 h-full">
                      <div className="p-6 flex flex-col h-full bg-gradient-to-br from-white to-gray-50">
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <h3 className="text-lg font-semibold text-gray-900 flex-1">
                            {qna.question}
                          </h3>
                          <button
                            onClick={() => toggleBookmark(qna.id)}
                            className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-lg transition"
                          >
                            <Star
                              className={`w-5 h-5 ${
                                isBookmarked ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'
                              }`}
                            />
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full ${
                              getDifficultyColor(qna.level)
                            }`}
                          >
                            {qna.level.charAt(0) + qna.level.slice(1).toLowerCase()}
                          </span>
                          {qna.companyTags.map((company: string) => (
                            <span
                              key={company}
                              className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
                            >
                              {company}
                            </span>
                          ))}
                        </div>

                        {isExpanded && (
                          <div className="mb-4 p-4 bg-gray-50 rounded-lg space-y-4">
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{qna.answer}</p>
                            {qna.exampleCode && (
                              <pre className="bg-gray-800 text-gray-100 text-sm p-4 rounded-lg overflow-x-auto">
                                {qna.exampleCode}
                              </pre>
                            )}
                          </div>
                        )}

                        <div className="mt-auto pt-2 flex justify-between items-center">
                          <button
                            onClick={() => toggleExpand(qna.id)}
                            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium transition"
                          >
                            {isExpanded ? (
                              <>
                                <ChevronUp className="w-5 h-5" />
                                Hide Answer
                              </>
                            ) : (
                              <>
                                <ChevronDown className="w-5 h-5" />
                                Show Answer
                              </>
                            )}
                          </button>
                          
                          <div className="text-sm text-gray-500">
                            {index + 1} of {paginatedQnA.length}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex justify-center items-center gap-4">
              <button
                onClick={() => {
                  setCurrentItemIndex(Math.max(0, currentItemIndex - 1));
                  if (horizontalScrollRef.current) {
                    const cardWidth = horizontalScrollRef.current.scrollWidth / paginatedQnA.length;
                    horizontalScrollRef.current.scrollTo({
                      left: cardWidth * Math.max(0, currentItemIndex - 1),
                      behavior: 'smooth',
                    });
                  }
                }}
                disabled={currentItemIndex === 0}
                className="px-5 py-2 bg-white border border-gray-300 rounded-lg font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                aria-label="Previous question"
              >
                Previous
              </button>
              
              <div className="flex gap-2 bg-white py-2 px-4 rounded-lg shadow-sm border border-gray-100">
                {paginatedQnA.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentItemIndex(index);
                      if (horizontalScrollRef.current) {
                        const cardWidth = horizontalScrollRef.current.scrollWidth / paginatedQnA.length;
                        horizontalScrollRef.current.scrollTo({
                          left: cardWidth * index,
                          behavior: 'smooth',
                        });
                      }
                    }}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${currentItemIndex === index 
                      ? 'bg-gray-800 scale-125' 
                      : 'bg-gray-200 hover:bg-gray-300'}`}
                    aria-label={`Go to question ${index + 1}`}
                  />
                ))}
              </div>
              
              <button
                onClick={() => {
                  setCurrentItemIndex(Math.min(paginatedQnA.length - 1, currentItemIndex + 1));
                  if (horizontalScrollRef.current) {
                    const cardWidth = horizontalScrollRef.current.scrollWidth / paginatedQnA.length;
                    horizontalScrollRef.current.scrollTo({
                      left: cardWidth * Math.min(paginatedQnA.length - 1, currentItemIndex + 1),
                      behavior: 'smooth',
                    });
                  }
                }}
                disabled={currentItemIndex === paginatedQnA.length - 1}
                className="px-5 py-2 bg-white border border-gray-300 rounded-lg font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                aria-label="Next question"
              >
                Next
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paginatedQnA.map((qna: QnA) => {
              const isExpanded = expandedIds.has(qna.id);
              const isBookmarked = bookmarkedIds.has(qna.id);

              return (
                <div
                  key={qna.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md hover:border-gray-300 transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1"
                >
                  <div className="p-5 flex-1 flex flex-col bg-gradient-to-br from-white to-gray-50/30">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3 className="text-base font-semibold text-gray-900 flex-1 line-clamp-2">
                        {qna.question}
                      </h3>
                      <button
                        onClick={() => toggleBookmark(qna.id)}
                        className="flex-shrink-0 p-1.5 hover:bg-gray-100 rounded-lg transition"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            isBookmarked ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-3">
                      <span
                        className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
                          getDifficultyColor(qna.level)
                        }`}
                      >
                        {qna.level.charAt(0) + qna.level.slice(1).toLowerCase()}
                      </span>
                      {qna.companyTags.slice(0, 2).map((company: string) => (
                        <span
                          key={company}
                          className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
                        >
                          {company}
                        </span>
                      ))}
                      {qna.companyTags.length > 2 && (
                        <span className="px-2.5 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                          +{qna.companyTags.length - 2} more
                        </span>
                      )}
                    </div>

                    {isExpanded && (
                      <div className="mb-3 p-3 bg-gray-50 rounded-lg flex-1 overflow-auto max-h-40">
                        <p className="text-sm text-gray-700 leading-relaxed">{qna.answer}</p>
                      </div>
                    )}

                    <div className="mt-auto pt-2">
                      <button
                        onClick={() => toggleExpand(qna.id)}
                        className="flex items-center gap-1.5 text-sm text-gray-700 hover:text-gray-900 font-medium transition"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="w-4 h-4" />
                            Hide Answer
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4" />
                            Show Answer
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {viewMode !== 'horizontal' && totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-lg transition ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Next
            </button>
          </div>
        )}

        {/* Custom CSS for hiding scrollbars is applied via Tailwind classes */}
        
        {filteredQnA.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No questions found matching your filters</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCompany('all');
                setSelectedDifficulty('all');
              }}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
        </main>
      </div>
    </div>
  );
};
