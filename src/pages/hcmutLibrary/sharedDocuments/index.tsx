import { useState } from 'react';
import Sidebar from '@/components/layouts/Sidebar';

const SharedDocument = () => {
    // Mock data cho danh sách tài liệu đã chia sẻ
    const [sharedDocs] = useState([
        {
            id: 1,
            title: 'Data Structures and Algorithms in Python',
            authors: 'Michael T. Goodrich, Roberto Tamassia',
            type: 'Giáo trình',
            year: '2023',
            description:
                'Comprehensive guide to data structures and algorithms using Python programming language.',
            views: 1234,
            downloads: 567,
            rating: 4.8,
            fileInfo: 'PDF • 8.5MB • 748 trang',
        },
        {
            id: 2,
            title: 'Computer Networking: A Top-Down Approach',
            authors: 'James F. Kurose, Keith W. Ross',
            type: 'Giáo trình',
            year: '2022',
            description:
                'Tài liệu chuẩn cho môn Mạng máy tính. Tiếp cận từ tầng ứng dụng xuống tầng vật lý.',
            views: 2100,
            downloads: 890,
            rating: 4.9,
            fileInfo: 'PDF • 12.1MB • 850 trang',
        },
    ]);

    return (
        <div className='flex min-h-screen bg-[#F9FAFB] font-sans text-gray-600'>
            {/* Sidebar Navigation */}
            <Sidebar />

            {/* Main Content Area */}
            <div className='ml-[260px] w-full p-8 transition-all duration-300'>
                {/* 1. SEARCH BAR */}
                <div className='mb-6'>
                    <div className='relative flex h-12 w-full items-center overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all focus-within:ring-2 focus-within:ring-blue-100'>
                        <div className='grid h-full w-12 place-items-center text-gray-400'>
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                className='h-5 w-5'
                                fill='none'
                                viewBox='0 0 24 24'
                                stroke='currentColor'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                                />
                            </svg>
                        </div>
                        <input
                            className='peer h-full w-full pr-4 text-sm text-gray-700 outline-none'
                            type='text'
                            id='search'
                            placeholder='Tìm kiếm sách, tài liệu, giáo trình, ...'
                        />
                    </div>
                </div>

                {/* 2. BLUE INFO ALERT */}
                <div className='mb-8 flex flex-col items-start justify-between gap-2 rounded-lg border border-sky-100 bg-sky-50 p-4 sm:flex-row sm:items-center'>
                    <div className='text-sm text-sky-800'>
                        <span className='block font-semibold sm:inline'>
                            Tài liệu đã chia sẻ của bạn
                        </span>
                        <span className='block text-xs text-sky-600 sm:ml-2 sm:inline sm:text-sm'>
                            Quản lý và chia sẻ tài liệu học tập của bạn với cộng
                            đồng HCMUT
                        </span>
                    </div>
                </div>

                {/* 3. UPLOAD FORM CARD */}
                <div className='mb-10 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm'>
                    {/* Header */}
                    <div className='mb-8 flex items-center gap-3'>
                        <div className='rounded-lg bg-indigo-50 p-2 text-indigo-600'>
                            <svg
                                className='h-6 w-6'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12'
                                />
                            </svg>
                        </div>
                        <h2 className='text-xl font-bold text-gray-900'>
                            Chia sẻ tài liệu mới
                        </h2>
                    </div>

                    {/* Drag & Drop Zone */}
                    <div className='mb-8'>
                        <label className='mb-2 block text-sm font-bold text-gray-900'>
                            Tệp tài liệu <span className='text-red-500'>*</span>
                        </label>
                        <div className='flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50/50 p-10 text-center transition-colors hover:border-blue-400 hover:bg-gray-50'>
                            {/* Folder Icon */}
                            <div className='mb-4 h-16 w-16'>
                                <svg
                                    viewBox='0 0 24 24'
                                    fill='none'
                                    xmlns='http://www.w3.org/2000/svg'
                                    className='h-full w-full fill-current text-yellow-400'
                                >
                                    <path d='M3 7C3 5.89543 3.89543 5 5 5H9.58579C9.851 5 10.1054 5.10536 10.2929 5.29289L12.7071 7.70711C12.8946 7.89464 13.149 8 13.4142 8H19C20.1046 8 21 8.89543 21 10V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V7Z' />
                                </svg>
                            </div>
                            <p className='mb-1 text-lg font-medium text-gray-800'>
                                Kéo thả tệp vào đây
                            </p>
                            <p className='mb-4 text-sm text-gray-500'>hoặc</p>
                            <button className='rounded-lg bg-[#0099D6] px-6 py-2.5 font-medium text-white shadow-sm transition-all hover:bg-[#0088C0] active:scale-95'>
                                Chọn tệp từ máy tính
                            </button>
                            <p className='mt-4 text-xs text-gray-400'>
                                Hỗ trợ PDF, Word, Powerpoint, Excel (Tối đa
                                500MB)
                            </p>
                        </div>
                    </div>

                    {/* Input Fields Grid */}
                    <div className='mb-8 grid grid-cols-1 gap-8 md:grid-cols-2'>
                        {/* Col 1 */}
                        <div className='space-y-6'>
                            <div>
                                <label className='mb-2 block text-sm font-bold text-gray-900'>
                                    Tiêu đề tài liệu{' '}
                                    <span className='text-red-500'>*</span>
                                </label>
                                <input
                                    type='text'
                                    placeholder='VD: Cấu trúc dữ liệu Chương 1'
                                    className='w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition-all placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                                />
                            </div>
                            <div>
                                <label className='mb-2 block text-sm font-bold text-gray-900'>
                                    Môn học{' '}
                                    <span className='text-red-500'>*</span>
                                </label>
                                <input
                                    type='text'
                                    placeholder='VD: Cấu trúc dữ liệu'
                                    className='w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition-all placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                                />
                            </div>
                        </div>

                        {/* Col 2 */}
                        <div className='space-y-6'>
                            <div>
                                <label className='mb-2 block text-sm font-bold text-gray-900'>
                                    Danh mục{' '}
                                    <span className='text-red-500'>*</span>
                                </label>
                                <input
                                    type='text'
                                    placeholder='VD: Giáo trình, Slide, Đề thi...'
                                    className='w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition-all placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                                />
                            </div>
                            <div>
                                <label className='mb-2 block text-sm font-bold text-gray-900'>
                                    Tác giả / Nguồn
                                </label>
                                <input
                                    type='text'
                                    placeholder='VD: PGS/TS Nguyễn Văn A'
                                    className='w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition-all placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                                />
                            </div>
                        </div>
                    </div>

                    {/* Description Textarea */}
                    <div className='mb-8'>
                        <label className='mb-2 block text-sm font-bold text-gray-900'>
                            Mô tả
                        </label>
                        <textarea
                            rows={4}
                            placeholder='Mô tả sơ lược về tài liệu ...'
                            className='w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none transition-all placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                        ></textarea>
                    </div>

                    {/* Action Buttons */}
                    <div className='flex justify-end gap-4 border-t border-gray-100 pt-4'>
                        <button className='rounded-lg bg-gray-200 px-8 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-300'>
                            Hủy
                        </button>
                        <button className='rounded-lg bg-[#0099D6] px-8 py-2.5 font-medium text-white shadow-md shadow-blue-200 transition-all hover:bg-[#0088C0] active:scale-95'>
                            Chia sẻ tài liệu
                        </button>
                    </div>
                </div>

                {/* 4. SHARED LIST SECTION */}
                <div className='rounded-2xl border border-gray-100 bg-white p-8 shadow-sm'>
                    <div className='mb-6 flex items-center gap-3'>
                        <div className='rounded bg-green-50 p-1.5 text-green-600'>
                            <svg
                                className='h-6 w-6'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
                                />
                            </svg>
                        </div>
                        <h2 className='text-xl font-bold text-gray-900'>
                            Tài liệu bạn đã chia sẻ ({sharedDocs.length})
                        </h2>
                    </div>

                    <div className='space-y-6'>
                        {sharedDocs.map((doc) => (
                            <div
                                key={doc.id}
                                className='flex gap-6 border-b border-gray-100 pb-6 last:border-0 last:pb-0'
                            >
                                {/* Icon/Thumbnail */}
                                <div className='flex h-32 w-24 flex-shrink-0 items-center justify-center rounded-lg border border-gray-100 bg-gray-50 text-blue-500'>
                                    <svg
                                        className='h-10 w-10'
                                        fill='none'
                                        stroke='currentColor'
                                        viewBox='0 0 24 24'
                                    >
                                        <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            strokeWidth={1.5}
                                            d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
                                        />
                                    </svg>
                                </div>

                                {/* Content */}
                                <div className='flex-1'>
                                    <div className='flex items-start justify-between'>
                                        <div>
                                            <h3 className='text-lg font-bold text-gray-900'>
                                                {doc.title}
                                            </h3>
                                            <p className='mb-2 text-sm text-gray-500'>
                                                {doc.authors}
                                            </p>
                                        </div>
                                    </div>

                                    <div className='mb-2 flex items-center gap-3'>
                                        <span className='rounded bg-sky-100 px-2 py-0.5 text-xs font-semibold text-sky-600'>
                                            {doc.type}
                                        </span>
                                        <span className='text-xs text-gray-500'>
                                            {doc.year}
                                        </span>
                                    </div>

                                    <p className='mb-3 line-clamp-1 text-sm text-gray-600'>
                                        {doc.description}
                                    </p>

                                    {/* Stats & Info */}
                                    <div className='mb-4 flex items-center gap-5 text-xs text-gray-400'>
                                        <span className='flex items-center gap-1'>
                                            <svg
                                                className='h-3.5 w-3.5'
                                                fill='none'
                                                stroke='currentColor'
                                                viewBox='0 0 24 24'
                                            >
                                                <path
                                                    strokeLinecap='round'
                                                    strokeLinejoin='round'
                                                    strokeWidth={2}
                                                    d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                                                />
                                                <path
                                                    strokeLinecap='round'
                                                    strokeLinejoin='round'
                                                    strokeWidth={2}
                                                    d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                                                />
                                            </svg>{' '}
                                            {doc.views}
                                        </span>
                                        <span className='flex items-center gap-1'>
                                            <svg
                                                className='h-3.5 w-3.5'
                                                fill='none'
                                                stroke='currentColor'
                                                viewBox='0 0 24 24'
                                            >
                                                <path
                                                    strokeLinecap='round'
                                                    strokeLinejoin='round'
                                                    strokeWidth={2}
                                                    d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4'
                                                />
                                            </svg>{' '}
                                            {doc.downloads}
                                        </span>
                                        <span className='flex items-center gap-1 text-yellow-500'>
                                            <svg
                                                className='h-3.5 w-3.5 fill-current'
                                                viewBox='0 0 20 20'
                                            >
                                                <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                                            </svg>{' '}
                                            {doc.rating}
                                        </span>
                                        <span className='ml-auto'>
                                            {doc.fileInfo}
                                        </span>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className='flex gap-3'>
                                        <button className='rounded bg-[#0099D6] px-6 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[#0088C0]'>
                                            Mở
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SharedDocument;
