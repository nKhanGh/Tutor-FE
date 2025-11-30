import { useState, useEffect, useMemo } from 'react';
import Sidebar from '@/components/layouts/Sidebar';
import {
    Search,
    Filter,
    BookOpen,
    Download,
    Star,
    Eye,
    FileText,
    ExternalLink,
    Bookmark,
    BookmarkMinus,
} from 'lucide-react';
import { useNotification } from '@/hooks/useNotification';
import { storage } from '@/utils/storage';
import type { Document } from '@/interfaces';

const CATEGORIES = [
    { id: 'all', name: 'Tất cả' },
    { id: 'book', name: 'Giáo trình' },
    { id: 'slide', name: 'Slide' },
    { id: 'exam', name: 'Đề thi' },
    { id: 'note', name: 'Ghi chú' },
];

const AllDocuments = () => {
    const { showSuccessNotification } = useNotification();
    const [documents, setDocuments] = useState<Document[]>([]);
    const [activeCategory, setActiveCategory] = useState('Tất cả');
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch data với setTimeout để tránh lỗi setState đồng bộ
    useEffect(() => {
        const timer = setTimeout(() => {
            const data = storage.getDocuments();
            setDocuments(data);
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    const filteredDocs = useMemo(() => {
        return documents.filter((doc) => {
            const matchCat =
                activeCategory === 'Tất cả' || doc.type === activeCategory;
            const matchSearch =
                doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                doc.authors.toLowerCase().includes(searchTerm.toLowerCase());
            return matchCat && matchSearch;
        });
    }, [activeCategory, searchTerm, documents]);

    const handleDownload = (docId: number) => {
        storage.incrementDocumentDownloads(docId);
        setDocuments((prevDocs) =>
            prevDocs.map((doc) =>
                doc.id === docId
                    ? { ...doc, downloads: doc.downloads + 1 }
                    : doc,
            ),
        );
        handleAction(
            'tải xuống',
            documents.find((d) => d.id === docId)?.title || '',
        );
    };

    const handleView = (docId: number) => {
        storage.incrementDocumentViews(docId);
        setDocuments((prevDocs) =>
            prevDocs.map((doc) =>
                doc.id === docId ? { ...doc, views: doc.views + 1 } : doc,
            ),
        );
        handleAction('xem', documents.find((d) => d.id === docId)?.title || '');
    };

    const handleAction = (action: string, title: string) => {
        showSuccessNotification(`Đã ${action} tài liệu: ${title}`);
    };

    const handleToggleSave = (doc: Document) => {
        const newStatus = storage.toggleSaveDocument(doc.id);
        // Cập nhật state cục bộ để UI reflect ngay lập tức
        setDocuments((prev) =>
            prev.map((d) =>
                d.id === doc.id ? { ...d, isSaved: newStatus } : d,
            ),
        );
        showSuccessNotification(
            newStatus ? 'Đã lưu tài liệu.' : 'Đã bỏ lưu tài liệu.',
        );
    };

    return (
        <>
            <Sidebar />
            <div className='ml-[80px] min-h-screen bg-[#f4f7fc] p-6 font-bevietnam md:ml-[260px]'>
                <div className='mx-auto max-w-7xl'>
                    {/* Header */}
                    <div className='mb-8'>
                        <h1 className='mb-2 flex items-center gap-2 text-2xl font-bold text-gray-800'>
                            <BookOpen className='text-[#0795DF]' /> Thư viện Tài
                            liệu HCMUT
                        </h1>
                        <p className='text-gray-600'>
                            Kho tài liệu chính thống phục vụ học tập và nghiên
                            cứu.
                        </p>
                    </div>

                    {/* Search & Stats */}
                    <div className='mb-8 grid grid-cols-1 gap-6 lg:grid-cols-4'>
                        <div className='flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm lg:col-span-3'>
                            <Search className='text-gray-400' size={20} />
                            <input
                                type='text'
                                placeholder='Tìm kiếm tài liệu theo tên, tác giả, môn học...'
                                className='flex-1 text-gray-700 outline-none'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className='flex items-center justify-between rounded-xl bg-gradient-to-r from-[#0795DF] to-[#00C0EF] p-4 text-white shadow-md'>
                            <div>
                                <p className='text-xs font-medium opacity-90'>
                                    Tổng tài liệu
                                </p>
                                <p className='text-2xl font-bold'>
                                    {documents.length}
                                </p>
                            </div>
                            <FileText size={28} className='opacity-80' />
                        </div>
                    </div>

                    <div className='grid grid-cols-1 gap-8 lg:grid-cols-12'>
                        {/* Sidebar Filters */}
                        <div className='lg:col-span-3'>
                            <div className='sticky top-6 rounded-xl border border-gray-100 bg-white p-5 shadow-sm'>
                                <h3 className='mb-4 flex items-center gap-2 font-bold text-gray-800'>
                                    <Filter size={18} /> Danh mục
                                </h3>
                                <div className='space-y-1'>
                                    {CATEGORIES.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() =>
                                                setActiveCategory(cat.name)
                                            }
                                            className={`w-full rounded-lg px-4 py-2.5 text-left text-sm font-medium transition-all ${
                                                activeCategory === cat.name
                                                    ? 'bg-blue-50 text-[#0795DF] shadow-sm'
                                                    : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Document List */}
                        <div className='space-y-4 lg:col-span-9'>
                            {filteredDocs.length === 0 ? (
                                <div className='rounded-xl border border-dashed bg-white py-12 text-center text-gray-400'>
                                    Không tìm thấy tài liệu nào phù hợp.
                                </div>
                            ) : (
                                filteredDocs.map((doc) => (
                                    <div
                                        key={doc.id}
                                        className='relative flex flex-col gap-5 rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md sm:flex-row'
                                    >
                                        {/* Icon/Thumbnail */}
                                        <div
                                            className={`flex h-32 w-full items-center justify-center rounded-lg text-3xl font-bold text-white shadow-sm sm:w-24 ${doc.type === 'Giáo trình' ? 'bg-blue-500' : doc.type === 'Slide' ? 'bg-orange-400' : doc.type === 'Ghi chú' ? 'bg-green-500' : 'bg-red-400'}`}
                                        >
                                            {doc.type === 'Giáo trình'
                                                ? 'BOOK'
                                                : doc.type === 'Slide'
                                                  ? 'SL'
                                                  : doc.type === 'Ghi chú'
                                                    ? 'NOTE'
                                                    : 'EXAM'}
                                        </div>

                                        {/* Content */}
                                        <div className='flex-1'>
                                            <div className='flex items-start justify-between pr-10'>
                                                <div>
                                                    <h3 className='mb-1 cursor-pointer text-lg font-bold text-gray-800 hover:text-[#0795DF]'>
                                                        {doc.title}
                                                    </h3>
                                                    <p className='mb-2 text-sm text-gray-500'>
                                                        {doc.authors} •{' '}
                                                        {doc.year}
                                                    </p>
                                                </div>
                                                <span
                                                    className={`rounded px-2.5 py-1 text-xs font-bold ${
                                                        doc.type ===
                                                        'Giáo trình'
                                                            ? 'bg-blue-100 text-blue-700'
                                                            : doc.type ===
                                                                'Slide'
                                                              ? 'bg-orange-100 text-orange-700'
                                                              : doc.type ===
                                                                  'Ghi chú'
                                                                ? 'bg-green-100 text-green-700'
                                                                : 'bg-red-100 text-red-700'
                                                    }`}
                                                >
                                                    {doc.type}
                                                </span>
                                            </div>

                                            <div className='mb-4 flex items-center gap-4 text-xs text-gray-500'>
                                                <span className='flex items-center gap-1'>
                                                    <Eye size={14} />{' '}
                                                    {doc.views}
                                                </span>
                                                <span className='flex items-center gap-1'>
                                                    <Download size={14} />{' '}
                                                    {doc.downloads}
                                                </span>
                                                <span className='flex items-center gap-1 text-yellow-600'>
                                                    <Star
                                                        size={14}
                                                        fill='currentColor'
                                                    />{' '}
                                                    {doc.rating}
                                                </span>
                                                <span className='rounded bg-gray-100 px-2 py-0.5 font-mono text-gray-600'>
                                                    {doc.fileInfo}
                                                </span>
                                            </div>

                                            <div className='flex gap-3 border-t border-gray-50 pt-2'>
                                                <button
                                                    onClick={() =>
                                                        handleView(doc.id)
                                                    }
                                                    className='flex items-center gap-2 rounded-lg bg-[#0795DF] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-600'
                                                >
                                                    <ExternalLink size={16} />{' '}
                                                    Xem ngay
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDownload(doc.id)
                                                    }
                                                    className='flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50'
                                                >
                                                    <Download size={16} /> Tải
                                                    về
                                                </button>
                                            </div>
                                        </div>

                                        {/* Save Button absolute positioned */}
                                        <button
                                            onClick={() =>
                                                handleToggleSave(doc)
                                            }
                                            className={`absolute right-4 top-4 rounded-full p-2 transition-colors ${doc.isSaved ? 'bg-blue-50 text-[#0795DF]' : 'text-gray-300 hover:bg-gray-50'}`}
                                            title={
                                                doc.isSaved
                                                    ? 'Bỏ lưu'
                                                    : 'Lưu tài liệu'
                                            }
                                        >
                                            {doc.isSaved ? (
                                                <BookmarkMinus size={20} />
                                            ) : (
                                                <Bookmark size={20} />
                                            )}
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AllDocuments;
