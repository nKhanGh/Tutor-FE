import Sidebar from '@/components/layouts/Sidebar';
import { useState, useEffect } from 'react';
import {
    Search,
    Eye,
    ArrowDownToLine,
    Star,
    BookmarkMinus,
} from 'lucide-react';
import { useNotification } from '@/hooks/useNotification';
import { storage } from '@/utils/storage';
import type { Document } from '@/interfaces';

const SavedDocuments = () => {
    const { showSuccessNotification } = useNotification();
    const [documents, setDocuments] = useState<Document[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Load data (Async simulation)
    useEffect(() => {
        const timer = setTimeout(() => {
            const savedDocs = storage.getSavedDocuments();
            setDocuments(savedDocs);
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    const handleRemove = (id: number) => {
        if (window.confirm('Bạn có chắc muốn bỏ lưu tài liệu này?')) {
            storage.toggleSaveDocument(id);
            // Cập nhật UI bằng cách lọc bỏ item vừa xóa
            setDocuments((prev) => prev.filter((doc) => doc.id !== id));
            showSuccessNotification('Đã xóa tài liệu khỏi danh sách đã lưu.');
        }
    };

    const filteredDocs = documents.filter((doc) =>
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return (
        <>
            <Sidebar />
            <div className='ml-[80px] min-h-screen bg-[#f4f7fc] p-6 font-bevietnam md:ml-[260px]'>
                <div className='mx-auto max-w-7xl'>
                    <div className='mb-8'>
                        <h1 className='mb-2 flex items-center gap-2 text-2xl font-bold text-gray-800'>
                            <BookmarkMinus className='text-[#0795DF]' /> Tài
                            liệu đã lưu
                        </h1>
                        <p className='text-gray-600'>
                            Danh sách các tài liệu bạn đã đánh dấu để xem sau.
                        </p>
                    </div>

                    <div className='mb-8 flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm'>
                        <Search className='text-gray-400' size={20} />
                        <input
                            type='text'
                            placeholder='Tìm trong tài liệu đã lưu...'
                            className='flex-1 text-gray-700 outline-none'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className='grid grid-cols-1 gap-4'>
                        {filteredDocs.length === 0 ? (
                            <div className='rounded-xl border border-dashed bg-white py-12 text-center text-gray-400'>
                                {searchTerm
                                    ? 'Không tìm thấy tài liệu.'
                                    : 'Bạn chưa lưu tài liệu nào.'}
                            </div>
                        ) : (
                            filteredDocs.map((doc) => (
                                <div
                                    key={doc.id}
                                    className='flex flex-col items-center gap-5 rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md sm:flex-row'
                                >
                                    <div
                                        className={`flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg text-xl font-bold text-white shadow-sm sm:h-20 sm:w-20 ${doc.type === 'Giáo trình' ? 'bg-blue-500' : doc.type === 'Slide' ? 'bg-orange-400' : 'bg-green-500'}`}
                                    >
                                        {doc.type === 'Giáo trình'
                                            ? 'BK'
                                            : doc.type === 'Slide'
                                              ? 'SL'
                                              : 'NT'}
                                    </div>

                                    <div className='w-full flex-1'>
                                        <div className='mb-1 flex items-start justify-between'>
                                            <h3 className='line-clamp-1 cursor-pointer text-lg font-bold text-gray-800 hover:text-[#0795DF]'>
                                                {doc.title}
                                            </h3>
                                            <span className='whitespace-nowrap rounded bg-gray-100 px-2 py-1 text-xs font-bold text-gray-600'>
                                                {doc.type}
                                            </span>
                                        </div>
                                        <p className='mb-2 text-sm text-gray-500'>
                                            {doc.authors} • {doc.year}
                                        </p>

                                        <div className='flex items-center gap-4 text-xs text-gray-400'>
                                            <span className='flex items-center gap-1'>
                                                <Eye size={14} /> {doc.views}
                                            </span>
                                            <span className='flex items-center gap-1'>
                                                <ArrowDownToLine size={14} />{' '}
                                                {doc.downloads}
                                            </span>
                                            <span className='flex items-center gap-1 text-yellow-500'>
                                                <Star
                                                    size={14}
                                                    fill='currentColor'
                                                />{' '}
                                                {doc.rating}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleRemove(doc.id)}
                                        className='rounded-full p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500'
                                        title='Bỏ lưu'
                                    >
                                        <BookmarkMinus size={20} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default SavedDocuments;
