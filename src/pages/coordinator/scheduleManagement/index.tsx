import { useState } from 'react';
import Sidebar from '@/components/layouts/Sidebar';
import { Star, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import {
    mockSchedulerTutors,
    mockWeeklySchedule,
} from '@/interfaces/Coordinator';

const SchedulerManagement = () => {
    // State: Lưu người đang được chọn (null = chưa chọn ai -> hiện danh sách)
    const [selectedTutor, setSelectedTutor] = useState<
        (typeof mockSchedulerTutors)[0] | null
    >(null);

    return (
        <>
            <Sidebar />
            <div className='ml-[80px] min-h-screen bg-blue-50 p-6 font-sans md:ml-[260px] md:p-8'>
                {/* --- TRƯỜNG HỢP 1: CHƯA CHỌN AI -> HIỆN DANH SÁCH TUTOR --- */}
                {!selectedTutor ? (
                    <div className='animate-fade-in'>
                        <h2 className='mb-6 text-2xl font-bold text-gray-800'>
                            Quản lí lịch trình tutor
                        </h2>
                        <div className='flex flex-col gap-4'>
                            {mockSchedulerTutors.map((tutor) => (
                                <div
                                    key={tutor.id}
                                    onClick={() => setSelectedTutor(tutor)}
                                    className='group flex cursor-pointer items-center gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md'
                                >
                                    {/* Avatar */}
                                    <div
                                        className={`h-12 w-12 rounded-lg ${tutor.avatarColor} flex items-center justify-center text-xl font-bold text-white shadow-sm transition-transform group-hover:scale-105`}
                                    >
                                        {tutor.initial}
                                    </div>
                                    {/* Info */}
                                    <div>
                                        <h3 className='text-lg font-bold text-gray-900 transition-colors group-hover:text-blue-600'>
                                            {tutor.name}
                                        </h3>
                                        <p className='text-sm font-medium text-blue-500'>
                                            {tutor.title}
                                        </p>
                                        <div className='mt-1 flex items-center gap-4 text-sm text-gray-500'>
                                            <span className='flex items-center gap-1 font-bold text-gray-800'>
                                                <Star
                                                    size={14}
                                                    className='fill-yellow-400 text-yellow-400'
                                                />{' '}
                                                {tutor.rating}
                                            </span>
                                            <span>
                                                ({tutor.reviewCount} đánh giá)
                                            </span>
                                            <span className='flex items-center gap-1'>
                                                <Users size={14} />{' '}
                                                {tutor.lessonCount} buổi học
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    /* --- TRƯỜNG HỢP 2: ĐÃ CHỌN -> HIỆN LỊCH CHI TIẾT --- */
                    <div className='animate-fade-in'>
                        {/* Header: Nút Back + Tiêu đề */}
                        <div className='sticky top-4 z-10 mb-6 flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm'>
                            <button
                                onClick={() => setSelectedTutor(null)}
                                className='flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-gray-600 transition-colors hover:bg-blue-100 hover:text-blue-600'
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <h2 className='text-xl font-bold text-gray-800'>
                                Lịch rảnh tutor
                            </h2>
                        </div>

                        {/* Thông tin Tutor (Card trên cùng) */}
                        <div className='mb-6 flex items-center gap-5 rounded-xl border border-gray-100 bg-white p-6 shadow-sm'>
                            <div
                                className={`h-14 w-14 rounded-xl ${selectedTutor.avatarColor} flex items-center justify-center text-2xl font-bold text-white shadow-md`}
                            >
                                {selectedTutor.initial}
                            </div>
                            <div>
                                <h3 className='text-xl font-bold text-gray-900'>
                                    {selectedTutor.name}
                                </h3>
                                <p className='font-medium text-blue-500'>
                                    {selectedTutor.title}
                                </p>
                                <div className='mt-1 flex items-center gap-4 text-sm text-gray-500'>
                                    <span className='flex items-center gap-1 font-bold text-gray-800'>
                                        <Star
                                            size={14}
                                            className='fill-yellow-400 text-yellow-400'
                                        />{' '}
                                        {selectedTutor.rating}
                                    </span>
                                    <span>
                                        ({selectedTutor.reviewCount} đánh giá)
                                    </span>
                                    <span className='flex items-center gap-1'>
                                        <Users size={14} />{' '}
                                        {selectedTutor.lessonCount} buổi học
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Lịch (Calendar View) */}
                        <div className='overflow-x-auto rounded-xl border border-gray-100 bg-white p-6 shadow-sm'>
                            {/* Thanh điều hướng ngày */}
                            <div className='mb-8 flex min-w-[600px] items-center gap-4 border-b border-gray-100 pb-4'>
                                <button className='flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200'>
                                    <ChevronLeft size={16} />
                                </button>
                                <span className='select-none font-bold text-gray-700'>
                                    20/10/2025 - 26/10/2025
                                </span>
                                <button className='flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200'>
                                    <ChevronRight size={16} />
                                </button>
                            </div>

                            {/* Lưới lịch (Grid) */}
                            <div className='grid min-w-[800px] grid-cols-7 gap-4 text-center'>
                                {/* Header Ngày */}
                                {mockWeeklySchedule.map((day, index) => (
                                    <div
                                        key={index}
                                        className='mb-4 flex flex-col gap-1'
                                    >
                                        <span className='text-xs font-bold uppercase tracking-wider text-gray-500'>
                                            {day.dayName}
                                        </span>
                                        <span
                                            className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold ${day.dayName === 'Thứ 5' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-800'} `}
                                        >
                                            {day.date}
                                        </span>
                                    </div>
                                ))}

                                {/* Slots (Giờ) */}
                                {mockWeeklySchedule.map((day, index) => (
                                    <div
                                        key={index}
                                        className='flex min-h-[200px] flex-col gap-3 border-r border-dashed border-gray-200 px-1 last:border-0'
                                    >
                                        {day.slots.map((slot, idx) => (
                                            <div
                                                key={idx}
                                                className={`rounded-lg border px-2 py-2.5 text-xs font-bold shadow-sm transition-transform hover:-translate-y-0.5 ${
                                                    slot.status === 'free'
                                                        ? 'border-teal-200 bg-teal-50 text-teal-600' // Style màu xanh (Rảnh)
                                                        : 'border-red-200 bg-red-50 text-red-500' // Style màu đỏ (Bận)
                                                }`}
                                            >
                                                {slot.time}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default SchedulerManagement;
