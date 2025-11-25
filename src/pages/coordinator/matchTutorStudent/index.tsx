import { useState } from 'react';
import Sidebar from '@/components/layouts/Sidebar';
import {
    Filter,
    Star,
    Users,
    Video,
    BookOpen,
    ChevronRight,
} from 'lucide-react';
import {
    mockStudentRequests,
    mockSuggestedTutors,
} from '@/interfaces/Coordinator';
import { useLocation } from 'react-router-dom';

const MatchTutorStudent = () => {
    const location = useLocation();

    const [selectedId, setSelectedId] = useState<number | null>(() => {
        return location.state?.targetId || null;
    });

    const selectedStudent =
        mockStudentRequests.find((s) => s.id === selectedId) ||
        mockStudentRequests[0];

    return (
        <>
            <Sidebar />
            <div className='ml-[80px] min-h-screen bg-white p-4 pt-6 font-sans md:ml-[260px] md:p-8'>
                <div className='grid h-full grid-cols-1 gap-8 lg:grid-cols-12'>
                    {/* --- CỘT TRÁI: DANH SÁCH --- */}
                    <div className='flex flex-col gap-4 lg:col-span-4'>
                        <h2 className='text-xl font-bold text-gray-800'>
                            Yêu cầu cần xử lý
                        </h2>

                        {/* Dropdown Môn học */}
                        <div className='relative mb-2'>
                            <button className='flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-gray-700 shadow-sm transition-colors hover:border-blue-400'>
                                <span className='flex items-center gap-2 font-medium'>
                                    <Filter size={18} /> Môn học
                                </span>
                                <ChevronRight
                                    size={18}
                                    className='rotate-90 text-gray-400'
                                />
                            </button>
                        </div>

                        {/* List Students */}
                        <div className='flex flex-col gap-3'>
                            {mockStudentRequests.map((student) => (
                                <div
                                    key={student.id}
                                    onClick={() => setSelectedId(student.id)}
                                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-all duration-200 ${
                                        selectedId === student.id
                                            ? 'border-blue-400 bg-blue-50 shadow-sm ring-1 ring-blue-200'
                                            : 'border-transparent bg-white hover:border-gray-200 hover:bg-gray-50'
                                    }`}
                                >
                                    <div
                                        className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white shadow-sm ${student.avatarColor}`}
                                    >
                                        {student.avatarInitials}
                                    </div>
                                    <span
                                        className={`text-sm font-medium ${selectedId === student.id ? 'text-blue-700' : 'text-gray-700'}`}
                                    >
                                        {student.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* --- CỘT PHẢI: CHI TIẾT --- */}
                    <div className='flex flex-col gap-8 lg:col-span-8'>
                        {selectedStudent && (
                            <div className='relative rounded-2xl border border-blue-100 bg-blue-50 p-6'>
                                <div className='mb-6 flex items-center gap-2 border-b border-blue-100 pb-4'>
                                    <Users
                                        className='text-blue-600'
                                        size={24}
                                    />
                                    <h3 className='text-lg font-bold text-gray-800'>
                                        Thông tin sinh viên
                                    </h3>
                                </div>

                                <div className='space-y-4 text-sm md:text-base'>
                                    <div className='grid grid-cols-12 gap-2'>
                                        <span className='col-span-12 font-semibold text-blue-900 sm:col-span-4'>
                                            Tên sinh viên:
                                        </span>
                                        <span className='col-span-12 font-medium text-gray-700 sm:col-span-8'>
                                            {selectedStudent.name}
                                        </span>
                                    </div>
                                    <div className='grid grid-cols-12 gap-2'>
                                        <span className='col-span-12 font-semibold text-blue-900 sm:col-span-4'>
                                            Lĩnh vực cần hỗ trợ:
                                        </span>
                                        <span className='col-span-12 text-gray-700 sm:col-span-8'>
                                            {selectedStudent.major}
                                        </span>
                                    </div>
                                    <div className='grid grid-cols-12 gap-2'>
                                        <span className='col-span-12 font-semibold text-blue-900 sm:col-span-4'>
                                            Tần suất mong muốn:
                                        </span>
                                        <span className='col-span-12 text-gray-700 sm:col-span-8'>
                                            {selectedStudent.frequency}
                                        </span>
                                    </div>
                                    <div className='grid grid-cols-12 gap-2'>
                                        <span className='col-span-12 font-semibold text-blue-900 sm:col-span-4'>
                                            Thông tin bổ sung:
                                        </span>
                                        <span className='col-span-12 rounded-lg border border-blue-100 bg-white/50 p-3 italic text-gray-600 sm:col-span-8'>
                                            "{selectedStudent.description}"
                                        </span>
                                    </div>
                                </div>
                                <button className='absolute bottom-6 right-6 flex items-center gap-1 text-sm font-bold text-blue-600 hover:underline'>
                                    Xem chi tiết <ChevronRight size={16} />
                                </button>
                            </div>
                        )}

                        {/* List Tutors */}
                        <div>
                            <h3 className='mb-5 flex items-center gap-2 text-xl font-bold text-gray-800'>
                                Tutor phù hợp theo gợi ý AI
                                <span className='rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white'>
                                    Beta
                                </span>
                            </h3>
                            <div className='flex flex-col gap-4'>
                                {mockSuggestedTutors.map((tutor) => (
                                    <div
                                        key={tutor.id}
                                        className='group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-lg'
                                    >
                                        <div className='flex flex-col items-start justify-between gap-4 sm:flex-row'>
                                            <div className='flex w-full gap-4'>
                                                <div
                                                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-xl font-bold text-white shadow-md ${tutor.id === 101 ? 'bg-blue-600' : 'bg-yellow-500'}`}
                                                >
                                                    {tutor.name
                                                        .split(' ')
                                                        .pop()
                                                        ?.charAt(0)}
                                                </div>
                                                <div className='flex-1'>
                                                    <div className='flex items-start justify-between'>
                                                        <div>
                                                            <h4 className='text-lg font-bold text-gray-900 transition-colors group-hover:text-blue-600'>
                                                                {tutor.name}
                                                            </h4>
                                                            <p className='text-xs font-bold uppercase tracking-wide text-blue-500'>
                                                                {tutor.title}
                                                            </p>
                                                        </div>
                                                        <div className='flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700 sm:hidden'>
                                                            <Star
                                                                size={12}
                                                                className='fill-blue-700'
                                                            />{' '}
                                                            {
                                                                tutor.matchPercentage
                                                            }
                                                            %
                                                        </div>
                                                    </div>
                                                    <div className='mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-500'>
                                                        <span className='flex items-center gap-1 rounded-md bg-gray-50 px-2 py-0.5 font-bold text-gray-800'>
                                                            <Star
                                                                size={14}
                                                                className='fill-yellow-400 text-yellow-400'
                                                            />{' '}
                                                            {tutor.rating}
                                                        </span>
                                                        <span className='text-xs'>
                                                            ({tutor.reviewCount}{' '}
                                                            đánh giá)
                                                        </span>
                                                        <div className='h-1 w-1 rounded-full bg-gray-300'></div>
                                                        <span className='flex items-center gap-1 text-xs'>
                                                            <Users size={14} />{' '}
                                                            {
                                                                tutor.teachingHours
                                                            }{' '}
                                                            buổi dạy
                                                        </span>
                                                    </div>
                                                    <div className='mt-3 flex flex-wrap gap-2'>
                                                        {tutor.tags.map(
                                                            (tag, idx) => (
                                                                <span
                                                                    key={idx}
                                                                    className='rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600'
                                                                >
                                                                    {tag}
                                                                </span>
                                                            ),
                                                        )}
                                                    </div>
                                                    <div className='mt-3 flex flex-wrap gap-3'>
                                                        {tutor.badges.map(
                                                            (badge, idx) => (
                                                                <div
                                                                    key={idx}
                                                                    className='flex items-center gap-1.5 rounded-md border border-green-100 bg-green-50 px-2.5 py-1.5 text-xs font-bold text-green-700'
                                                                >
                                                                    {badge.includes(
                                                                        'online',
                                                                    ) ? (
                                                                        <Video
                                                                            size={
                                                                                12
                                                                            }
                                                                        />
                                                                    ) : (
                                                                        <BookOpen
                                                                            size={
                                                                                12
                                                                            }
                                                                        />
                                                                    )}{' '}
                                                                    {badge}
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='hidden shrink-0 flex-col items-end gap-10 sm:flex'>
                                                <div className='flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 text-sm font-bold text-blue-700 shadow-sm'>
                                                    <Star
                                                        size={16}
                                                        className='fill-blue-700'
                                                    />{' '}
                                                    {tutor.matchPercentage}% phù
                                                    hợp
                                                </div>
                                                <button className='flex items-center text-sm font-medium text-gray-400 transition-colors hover:text-blue-600 hover:underline'>
                                                    Xem chi tiết{' '}
                                                    <ChevronRight size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MatchTutorStudent;
