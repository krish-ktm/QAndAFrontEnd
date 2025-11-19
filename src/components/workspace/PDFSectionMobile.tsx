import { useState, useEffect } from 'react';
import { FileText, Star, ExternalLink, Download } from 'lucide-react';
import { apiService } from '../../services/apiService';
import { PDF, Bookmark } from '../../types/api';

interface PDFSectionMobileProps {
    productId: string;
}

export const PDFSectionMobile = ({ productId }: PDFSectionMobileProps) => {
    const [pdfs, setPdfs] = useState<PDF[]>([]);
    const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPDFs = async () => {
            try {
                const [pdfRes, bookmarksRes] = await Promise.all([
                    apiService.getPDFs(productId),
                    apiService.getBookmarks(),
                ]);

                if (pdfRes.success) {
                    setPdfs(pdfRes.data);

                    if (bookmarksRes.success) {
                        const bookmarkIds = new Set<string>();
                        (bookmarksRes.data as Bookmark[]).forEach((bm) => {
                            if (bm.pdfId) {
                                bookmarkIds.add(bm.pdfId);
                            }
                        });
                        setBookmarkedIds(bookmarkIds);
                    } else {
                        setBookmarkedIds(new Set());
                    }
                } else {
                    setError(pdfRes.message || 'Failed to load PDFs');
                }
            } catch (err) {
                console.error('Error fetching PDFs:', err);
                setError('An error occurred while loading PDFs');
            } finally {
                setLoading(false);
            }
        };

        fetchPDFs();
    }, [productId]);

    const toggleBookmark = (id: string) => {
        const newBookmarked = new Set(bookmarkedIds);
        if (newBookmarked.has(id)) {
            newBookmarked.delete(id);
        } else {
            newBookmarked.add(id);
        }
        setBookmarkedIds(newBookmarked);
    };

    return (
        <div className="p-4 pb-20">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Resources</h1>
                <p className="text-sm text-gray-600">Reference materials and guides</p>
            </div>

            {loading && (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
                    {error}
                </div>
            )}

            {!loading && !error && (
                <div className="space-y-4">
                    {pdfs.map((pdf) => (
                        <div
                            key={pdf.id}
                            className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm active:scale-[0.99] transition-transform"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-50 p-2 rounded-lg">
                                        <FileText className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <h3 className="text-base font-semibold text-gray-900 line-clamp-2">{pdf.title}</h3>
                                </div>
                                <button
                                    onClick={() => toggleBookmark(pdf.id)}
                                    className="text-gray-400 hover:text-yellow-500 transition-colors p-1"
                                >
                                    <Star
                                        className={`w-5 h-5 ${bookmarkedIds.has(pdf.id) ? 'fill-yellow-400 text-yellow-400' : ''}`}
                                    />
                                </button>
                            </div>

                            <div className="flex gap-3 mt-4">
                                <a
                                    href={pdf.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium active:bg-blue-100 transition-colors"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    View
                                </a>
                                <a
                                    href={pdf.fileUrl}
                                    download
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 text-gray-700 rounded-lg text-sm font-medium active:bg-gray-100 transition-colors"
                                >
                                    <Download className="w-4 h-4" />
                                    Download
                                </a>
                            </div>
                        </div>
                    ))}

                    {pdfs.length === 0 && (
                        <div className="text-center py-12">
                            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FileText className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-base font-medium text-gray-900 mb-1">No resources available</h3>
                            <p className="text-sm text-gray-500">Check back later for new materials.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
