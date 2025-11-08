import { useState, useMemo } from 'react';
import { Search, Star, ChevronDown, ChevronUp, Building2, TrendingUp } from 'lucide-react';
import { mockQnA, QnA } from '../../data/mockData';

interface QnASectionProps {
  productId: string;
}

export const QnASection = ({ productId }: QnASectionProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(
    new Set(mockQnA.filter(q => q.bookmarked).map(q => q.id))
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const productQnA = mockQnA.filter((qna) => qna.productId === productId);

  const allCompanies = useMemo(() => {
    const companies = new Set<string>();
    productQnA.forEach((qna) => qna.company.forEach((c) => companies.add(c)));
    return Array.from(companies).sort();
  }, [productQnA]);

  const filteredQnA = useMemo(() => {
    return productQnA.filter((qna) => {
      const matchesSearch =
        searchQuery === '' ||
        qna.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        qna.answer.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCompany =
        selectedCompany === 'all' || qna.company.includes(selectedCompany);

      const matchesDifficulty =
        selectedDifficulty === 'all' || qna.difficulty === selectedDifficulty;

      return matchesSearch && matchesCompany && matchesDifficulty;
    });
  }, [productQnA, searchQuery, selectedCompany, selectedDifficulty]);

  const totalPages = Math.ceil(filteredQnA.length / itemsPerPage);
  const paginatedQnA = filteredQnA.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
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
    switch (difficulty) {
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

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Q&A Repository</h1>
          <p className="text-gray-600">Browse and search through curated interview questions</p>
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

        <div className="space-y-4">
          {paginatedQnA.map((qna: QnA) => {
            const isExpanded = expandedIds.has(qna.id);
            const isBookmarked = bookmarkedIds.has(qna.id);

            return (
              <div
                key={qna.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition"
              >
                <div className="p-6">
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
                        qna.difficulty
                      )}`}
                    >
                      {qna.difficulty.charAt(0).toUpperCase() + qna.difficulty.slice(1)}
                    </span>
                    {qna.company.map((company) => (
                      <span
                        key={company}
                        className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
                      >
                        {company}
                      </span>
                    ))}
                  </div>

                  {isExpanded && (
                    <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-700 leading-relaxed">{qna.answer}</p>
                    </div>
                  )}

                  <button
                    onClick={() => toggleExpand(qna.id)}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition"
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

        {totalPages > 1 && (
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
      </div>
    </div>
  );
};
