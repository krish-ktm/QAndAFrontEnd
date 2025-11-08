import { useState } from 'react';
import { FileText, Star, ExternalLink, Download } from 'lucide-react';
import { mockPDFs, PDF } from '../../data/mockData';

interface PDFSectionProps {
  productId: string;
}

export const PDFSection = ({ productId }: PDFSectionProps) => {
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(
    new Set(mockPDFs.filter((pdf) => pdf.bookmarked).map((pdf) => pdf.id))
  );

  const productPDFs = mockPDFs.filter((pdf) => pdf.productId === productId);

  const toggleBookmark = (id: string) => {
    const newBookmarked = new Set(bookmarkedIds);
    if (newBookmarked.has(id)) {
      newBookmarked.delete(id);
    } else {
      newBookmarked.add(id);
    }
    setBookmarkedIds(newBookmarked);
  };

  if (productPDFs.length === 0) {
    return (
      <div className="p-8">
        <div className="max-w-5xl mx-auto text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">No resources available for this product</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Learning Resources</h1>
          <p className="text-gray-600">Access reference materials and study guides</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {productPDFs.map((pdf: PDF) => {
            const isBookmarked = bookmarkedIds.has(pdf.id);

            return (
              <div
                key={pdf.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{pdf.title}</h3>
                        <p className="text-sm text-gray-500">PDF Document</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleBookmark(pdf.id)}
                      className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          isBookmarked ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex gap-3">
                    <a
                      href={pdf.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View
                    </a>
                    <a
                      href={pdf.url}
                      download
                      className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-gray-900 mb-2">Resource Tips</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Use bookmarks to save important resources for quick access</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Download PDFs for offline study and reference</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Resources are curated to complement the Q&A and quiz sections</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
