import Sidebar from '@/components/layouts/Sidebar';
import { useState, useMemo } from 'react';
import {
    Search,
    CircleX,
    BookOpen,
    Bookmark,
    Eye,
    ArrowDownToLine,
    Star,
} from 'lucide-react';
import { useNotification } from '@/hooks/useNotification';

// 1. MOCK DATA: Dữ liệu giả lập phong phú hơn
const MOCK_DOCS = [
    {
        id: 1,
        title: 'Data Structures and Algorithms in Python',
        authors: 'Michael T. Goodrich, Roberto Tamassia',
        type: 'Giáo trình',
        year: '2023',
        description:
            'Giáo trình toàn diện về cấu trúc dữ liệu và giải thuật sử dụng ngôn ngữ Python, phù hợp cho sinh viên năm 2.',
        views: 1234,
        downloads: 567,
        rating: 4.8,
        fileInfo: 'PDF • 8.5MB • 748 trang',
    },
    {
        id: 2,
        title: 'Computer Networking: A Top-Down Approach',
        authors: 'James F. Kurose, Keith W. Ross',
        type: 'Bài tập',
        year: '2022',
        description:
            'Tài liệu chuẩn cho môn Mạng máy tính. Tiếp cận từ tầng ứng dụng xuống tầng vật lý.',
        views: 2100,
        downloads: 890,
        rating: 4.9,
        fileInfo: 'PDF • 12.1MB • 850 trang',
    },
    {
        id: 3,
        title: 'Slide bài giảng Hệ Điều Hành - Chương 4: CPU Scheduling',
        authors: 'TS. Phạm Trần Vũ',
        type: 'Slide',
        year: '2024',
        description:
            'Slide bài giảng chi tiết về các thuật toán lập lịch cho CPU: FCFS, SJF, Round Robin...',
        views: 450,
        downloads: 120,
        rating: 4.5,
        fileInfo: 'PPTX • 2.3MB • 45 slide',
    },
    {
        id: 4,
        title: 'Tổng hợp đề thi Cuối kì Kiến trúc máy tính (2019-2023)',
        authors: 'CLB Học thuật CSE',
        type: 'Đề thi',
        year: '2023',
        description:
            'Tuyển tập đề thi và đáp án chi tiết các năm gần đây của môn Kiến trúc máy tính.',
        views: 5600,
        downloads: 3200,
        rating: 5.0,
        fileInfo: 'ZIP • 15MB • 10 files',
    },
    {
        id: 5,
        title: 'Bài tập lớn Môn Lập trình Web (Assignment 2)',
        authors: 'Nhóm 14 - L01',
        type: 'Bài tập',
        year: '2024',
        description:
            'Source code và báo cáo cho bài tập lớn xây dựng trang web bán hàng bằng ReactJS & NodeJS.',
        views: 89,
        downloads: 12,
        rating: 4.2,
        fileInfo: 'ZIP • 5MB',
    },
    {
        id: 6,
        title: 'Introduction to Artificial Intelligence',
        authors: 'Stuart Russell, Peter Norvig',
        type: 'Giáo trình',
        year: '2021',
        description:
            "Cuốn sách 'gối đầu giường' cho nhập môn Trí tuệ nhân tạo. Phiên bản mới nhất.",
        views: 3400,
        downloads: 1100,
        rating: 4.7,
        fileInfo: 'PDF • 20MB • 1150 trang',
    },
];

const SavedDocument = () => {
    const { showSuccessNotification } = useNotification();
    // 1. Khởi tạo state với dữ liệu ban đầu là MOCK_DOCS
    const [documents, setDocuments] = useState(MOCK_DOCS);

    // 2. STATE: Quản lý trạng thái lọc và tìm kiếm
    const [searchTerm, setSearchTerm] = useState('');

    // 3. LOGIC FILTER: Tự động tính toán danh sách hiển thị khi state thay đổi
    const filteredDocs = useMemo(() => {
        return documents.filter((doc) => {
            // Lọc theo từ khoá tìm kiếm (không phân biệt hoa thường)
            const matchSearch =
                doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                doc.authors.toLowerCase().includes(searchTerm.toLowerCase());

            return matchSearch;
        });
    }, [searchTerm, documents]);

    // Hàm xử lý mô phỏng hành động
    const handleAction = (actionName: string, docTitle: string) => {
        showSuccessNotification(`${actionName} tài liệu: "${docTitle}"`);
    };

    const handleRemove = (id: number) => {
        // Hỏi xác nhận trước khi xóa (Optional)
        const isConfirm = window.confirm(
            'Bạn có chắc muốn bỏ lưu tài liệu này?',
        );
        if (!isConfirm) return;

        // Cập nhật state: Giữ lại các doc có id KHÁC với id cần xóa
        setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    };

    return (
        <div className='flex min-h-screen bg-[#F9FAFB] text-gray-600'>
            <Sidebar />

            <div className='ml-[260px] w-full p-8'>
                {/* --- SEARCH BAR --- */}
                <div className='mb-8 w-[800px] rounded-xl border border-gray-300 bg-white p-1.5 shadow-sm'>
                    <div className='relative flex h-12 w-full items-center rounded-lg'>
                        {/* Search Icon */}
                        <div className='grid h-full w-12 place-items-center text-gray-400'>
                            <Search />
                        </div>
                        {/* Search Input */}
                        <input
                            className='h-full w-full pr-4 text-gray-700 outline-none placeholder:text-gray-400'
                            type='text'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)} // Cập nhật state khi gõ
                            placeholder='Tìm kiếm sách, tài liệu, giáo trình, tác giả...'
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className='mr-4 text-gray-400 hover:text-gray-600'
                            >
                                <CircleX onClick={() => setSearchTerm('')} />
                            </button>
                        )}
                    </div>
                </div>

                {/* --- MAIN LAYOUT --- */}
                <div className='grid grid-cols-12 gap-8'>
                    {/* SAVED-DOCUMENT LIST */}
                    <div className='col-span-9'>
                        <div className='mb-4 rounded-lg bg-[#00C0EF]/10 p-4'>
                            <div className='font-bevietnam text-xl text-gray-700'>
                                Tài liệu đã lưu của bạn
                            </div>
                            <div className='text-sm text-[#0795DF]'>
                                Bạn đã lưu {documents.length} tài liệu. Các tài
                                liệu này sẽ được đồng bộ trên tất cả thiết bị.
                            </div>
                        </div>

                        {filteredDocs.length > 0 ? (
                            <div className='flex flex-col gap-6'>
                                {filteredDocs.map((doc) => (
                                    <div
                                        key={doc.id}
                                        className='group flex gap-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md'
                                    >
                                        {/* Icon Tài liệu */}
                                        <div
                                            className={`flex h-36 w-28 flex-shrink-0 flex-col items-center justify-center rounded-lg border bg-gray-50 text-gray-300 transition-colors ${
                                                doc.type === 'Slide'
                                                    ? 'border-orange-300'
                                                    : doc.type === 'Đề thi'
                                                      ? 'border-red-300'
                                                      : doc.type === 'Bài tập'
                                                        ? 'border-green-300'
                                                        : 'border-blue-300'
                                            }`}
                                        >
                                            <BookOpen
                                                className={`mb-2 h-10 w-10 ${
                                                    doc.type === 'Slide'
                                                        ? 'text-orange-300'
                                                        : doc.type === 'Đề thi'
                                                          ? 'text-red-300'
                                                          : doc.type ===
                                                              'Bài tập'
                                                            ? 'text-green-300'
                                                            : 'text-blue-300'
                                                }`}
                                            />
                                            <span className='text-[10px] font-bold uppercase tracking-wider text-gray-400'>
                                                {doc.type}
                                            </span>
                                        </div>
                                        {/* Info */}
                                        <div className='flex flex-1 flex-col justify-between py-1'>
                                            <div>
                                                <div className='flex items-start justify-between'>
                                                    <h3
                                                        onClick={() =>
                                                            handleAction(
                                                                'Xem chi tiết',
                                                                doc.title,
                                                            )
                                                        }
                                                        className='mb-1 line-clamp-1 cursor-pointer text-lg font-bold text-gray-800'
                                                        title={doc.title}
                                                    >
                                                        {doc.title}
                                                    </h3>
                                                    {/* Bookmark icon */}
                                                    <button className='text-gray-300 hover:text-yellow-400'>
                                                        <Bookmark className='h-5 w-5' />
                                                    </button>
                                                </div>

                                                <p className='mb-2 text-sm font-medium text-gray-500'>
                                                    {doc.authors}
                                                </p>

                                                <div className='mb-3 flex items-center gap-3'>
                                                    <span
                                                        className={`rounded-md px-2.5 py-0.5 text-xs font-semibold ${
                                                            doc.type === 'Slide'
                                                                ? 'bg-orange-100 text-orange-700'
                                                                : doc.type ===
                                                                    'Đề thi'
                                                                  ? 'bg-red-100 text-red-700'
                                                                  : doc.type ===
                                                                      'Bài tập'
                                                                    ? 'bg-green-100 text-green-700'
                                                                    : 'bg-sky-100 text-sky-700'
                                                        }`}
                                                    >
                                                        {doc.type}
                                                    </span>
                                                    <span className='text-xs text-gray-400'>
                                                        |
                                                    </span>
                                                    <span className='text-xs font-medium text-gray-500'>
                                                        Năm {doc.year}
                                                    </span>
                                                </div>

                                                <p className='mb-4 line-clamp-2 text-sm leading-relaxed text-gray-600'>
                                                    {doc.description}
                                                </p>

                                                {/* Stats */}
                                                <div className='flex items-center gap-6 text-xs text-gray-500'>
                                                    <div
                                                        className='flex items-center gap-1.5'
                                                        title='Lượt xem'
                                                    >
                                                        <Eye className='h-4 w-4' />
                                                        {doc.views.toLocaleString()}
                                                    </div>
                                                    <div
                                                        className='flex items-center gap-1.5'
                                                        title='Lượt tải'
                                                    >
                                                        <ArrowDownToLine className='h-4 w-4' />
                                                        {doc.downloads.toLocaleString()}
                                                    </div>
                                                    <div
                                                        className='flex items-center gap-1.5 font-bold text-yellow-500'
                                                        title='Đánh giá'
                                                    >
                                                        <Star className='h-4 w-4 fill-current' />
                                                        {doc.rating}
                                                    </div>
                                                    <span className='ml-auto rounded bg-gray-100 px-2 py-1 font-mono text-[10px] text-gray-600'>
                                                        {doc.fileInfo}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Buttons */}
                                            <div className='mt-5 flex gap-3 pt-4'>
                                                <button
                                                    onClick={() =>
                                                        handleAction(
                                                            'Xem',
                                                            doc.title,
                                                        )
                                                    }
                                                    className='rounded-lg bg-[#0795DF] px-4 py-2 text-sm font-medium text-white shadow-sm transition-all'
                                                >
                                                    Mở
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleRemove(doc.id)
                                                    }
                                                    className='flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-100'
                                                >
                                                    Bỏ lưu
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className='mt-20 text-center text-gray-500'>
                                Không tìm thấy tài liệu phù hợp.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SavedDocument;
