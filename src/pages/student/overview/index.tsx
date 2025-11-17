import Sidebar from '@/components/layouts/Sidebar';
import { Calendar, Users, Bell, Clock, MapPin, Video } from 'lucide-react';

const Overview = () => {
    const upcomingSessions = [
        {
            id: 1,
            title: 'Giải tích 2 - Biến đổi Laplace',
            teacher: 'TS. Đặng Phạm Gia Long',
            date: '2025-10-24',
            time: '09:00 - 10.30',
            type: 'video',
        },
        {
            id: 2,
            title: 'Hệ cơ sở dữ liệu - Đại số quan hệ',
            teacher: 'ThS. Cần Hoàng Hà',
            date: '2025-10-25',
            time: '19:00 - 20.30',
            type: 'location',
        },
        {
            id: 3,
            title: 'Lập trình nâng cao - Lập trình hàm',
            teacher: 'TS. Trương Thanh Nhàn',
            date: '2025-10-27',
            time: '13:00 - 14.30',
            type: 'location',
        },
    ];

    const consultations = [
        {
            id: 1,
            title: 'Tư vấn nghề nghiệp',
            teacher: 'TS. Nguyễn Văn Đức',
            date: '2025-11-7',
            time: '15:00 - 17.00',
        },
        {
            id: 2,
            title: 'Cải thiện khả năng tập trung',
            teacher: 'TS. Nguyễn Hữa Phùng',
            date: '2025-11-20',
            time: '15:00 - 17.00',
        },
    ];

    return (
        <>
            <Sidebar />
            <div className='ml-[80px] bg-blue-50 p-6 md:ml-[260px]'>
                <div className='flex-1'>
                    <div className='mb-8'>
                        <h1 className='mb-2 text-3xl font-bold text-gray-800'>
                            Chào mừng trở lại, Khang!
                        </h1>
                        <p className='text-gray-600'>
                            Bạn có 2 buổi học trong tuần này, hãy chuẩn bị thật
                            tốt nhé!
                        </p>
                    </div>

                    <div className='mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4'>
                        <div className='rounded-xl border border-gray-100 bg-white p-6 shadow-sm'>
                            <div className='flex items-center gap-4'>
                                <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-green-100'>
                                    <Calendar
                                        className='text-green-600'
                                        size={24}
                                    />
                                </div>
                                <div>
                                    <div className='text-3xl font-bold text-gray-800'>
                                        6
                                    </div>
                                    <div className='text-sm text-gray-600'>
                                        Khóa học hoàn thành
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='rounded-xl border border-gray-100 bg-white p-6 shadow-sm'>
                            <div className='flex items-center gap-4'>
                                <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100'>
                                    <Users
                                        className='text-blue-600'
                                        size={24}
                                    />
                                </div>
                                <div>
                                    <div className='text-3xl font-bold text-gray-800'>
                                        2
                                    </div>
                                    <div className='text-sm text-gray-600'>
                                        Tutor hỗ trợ
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='rounded-xl border border-gray-100 bg-white p-6 shadow-sm'>
                            <div className='flex items-center gap-4'>
                                <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100'>
                                    <Calendar
                                        className='text-orange-600'
                                        size={24}
                                    />
                                </div>
                                <div>
                                    <div className='text-3xl font-bold text-gray-800'>
                                        9
                                    </div>
                                    <div className='text-sm text-gray-600'>
                                        Buổi học trong tháng
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='rounded-xl border border-gray-100 bg-white p-6 shadow-sm'>
                            <div className='flex items-center gap-4'>
                                <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-red-100'>
                                    <Bell className='text-red-600' size={24} />
                                </div>
                                <div>
                                    <div className='text-3xl font-bold text-gray-800'>
                                        2
                                    </div>
                                    <div className='text-sm text-gray-600'>
                                        Buổi tư vấn sắp tới
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                        <div className='rounded-xl border border-gray-100 bg-white p-6 shadow-sm'>
                            <h2 className='mb-6 text-xl font-bold text-gray-800'>
                                Buổi học sắp tới
                            </h2>
                            <div className='space-y-4'>
                                {upcomingSessions.map((session) => (
                                    <div
                                        key={session.id}
                                        className='flex gap-4 rounded-lg p-4 transition-colors hover:bg-gray-50'
                                    >
                                        <div
                                            className={`flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100`}
                                        >
                                            {session.type === 'video' ? (
                                                <Video
                                                    className='text-blue-600'
                                                    size={24}
                                                />
                                            ) : (
                                                <MapPin
                                                    className='text-blue-600'
                                                    size={24}
                                                />
                                            )}
                                        </div>
                                        <div className='flex-1'>
                                            <h3 className='mb-1 font-semibold text-gray-800'>
                                                {session.title}
                                            </h3>
                                            <p className='mb-2 text-sm text-gray-600'>
                                                với {session.teacher}
                                            </p>
                                            <div className='flex items-center gap-4 text-xs text-gray-500'>
                                                <span className='flex items-center gap-1'>
                                                    <Calendar size={14} />
                                                    {session.date}
                                                </span>
                                                <span className='flex items-center gap-1'>
                                                    <Clock size={14} />
                                                    {session.time}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Consultations */}
                        <div className='rounded-xl border border-gray-100 bg-white p-6 shadow-sm'>
                            <h2 className='mb-6 text-xl font-bold text-gray-800'>
                                Buổi phỏng vấn sắp tới
                            </h2>
                            <div className='space-y-4'>
                                {consultations.map((session) => (
                                    <div
                                        key={session.id}
                                        className='flex gap-4 rounded-lg p-4 transition-colors hover:bg-gray-50'
                                    >
                                        <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100'>
                                            <MapPin
                                                className='text-blue-600'
                                                size={24}
                                            />
                                        </div>
                                        <div className='flex-1'>
                                            <h3 className='mb-1 font-semibold text-gray-800'>
                                                {session.title}
                                            </h3>
                                            <p className='mb-2 text-sm text-gray-600'>
                                                với {session.teacher}
                                            </p>
                                            <div className='flex items-center gap-4 text-xs text-gray-500'>
                                                <span className='flex items-center gap-1'>
                                                    <Calendar size={14} />
                                                    {session.date}
                                                </span>
                                                <span className='flex items-center gap-1'>
                                                    <Clock size={14} />
                                                    {session.time}
                                                </span>
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

export default Overview;
