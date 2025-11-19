import { useState, useEffect } from 'react';
import { FileText, Star, ExternalLink, Download } from 'lucide-react';
import { apiService } from '../../services/apiService';
import { PDF, Bookmark } from '../../types/api';

interface PDFSectionDesktopProps {
    productId: string;
}

export const PDFSectionDesktop = ({ productId }: PDFSectionDesktopProps) => {
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
        <div className="p-8">
            <div className="max-w-5xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Learning Resources</h1>
                    <p className="text-gray-600">Access reference materials and study guides</p>
                </div>

                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
                        {error}
                    </div>
                )}

                {!loading && !error && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {pdfs.map((pdf) => (
                            <div
                                key={pdf.id}
                                className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-8 h-8 text-blue-600" />
                                        <h3 className="text-lg font-semibold text-gray-900">{pdf.title}</h3>
                                    </div>
                                    <button
                                        onClick={() => toggleBookmark(pdf.id)}
                                        className="text-gray-400 hover:text-yellow-500 transition-colors"
                                    >
                                        <Star
                                            className={`w-5 h-5 ${bookmarkedIds.has(pdf.id) ? 'fill-yellow-400 text-yellow-400' : ''}`}
                                        />
                                    </button>
                                </div>

                                <div className="flex justify-between mt-4">
                                    <a
                                        href={pdf.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        View Online
                                    </a>
                                    <a
                                        href={pdf.fileUrl}
                                        download
                                        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                                    >
                                        <Download className="w-4 h-4" />
                                        Download
                                    </a>
                                </div>
                            </div>
                        ))}

                        {pdfs.length === 0 && (
                            <div className="col-span-2 text-center py-12">
                                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No resources available</h3>
                                <p className="text-gray-500">There are no PDF resources for this product yet.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
