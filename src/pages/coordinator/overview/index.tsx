import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/layouts/Sidebar';
import {
    Users,
    UserCheck,
    Bell,
    Calendar,
    BookOpen,
    Clock,
} from 'lucide-react';
import {
    mockCoordinatorStats,
    mockPendingTutors,
    mockPendingRequests,
} from '@/interfaces/Coordinator';

const Overview = () => {
    const navigate = useNavigate();

    const getStatStyle = (key: string) => {
        switch (key) {
            case 'student_support':
                return {
                    icon: <Users size={24} />,
                    color: 'text-blue-500',
                    bg: 'bg-blue-100',
                };
            case 'tutor_active':
                return {
                    icon: <UserCheck size={24} />,
                    color: 'text-blue-500',
                    bg: 'bg-blue-100',
                };
            case 'pending_match':
                return {
                    icon: <Bell size={24} />,
                    color: 'text-red-500',
                    bg: 'bg-red-100',
                };
            default:
                return {
                    icon: <Users size={24} />,
                    color: 'text-gray-500',
                    bg: 'bg-gray-100',
                };
        }
    };

    return (
        <>
            <Sidebar />
            <div className='ml-[80px] min-h-screen bg-blue-50 p-6 pt-8 font-sans md:ml-[260px]'>
                {/* --- HEADER --- */}
                <div className='mb-8 flex items-center justify-between'>
                    <div>
                        <h1 className='text-2xl font-bold text-gray-800'>
                            Chào mừng trở lại, Nhân!
                        </h1>
                        <p className='text-sm text-gray-500'>
                            Đây là bảng điều khiển của bạn hôm nay.
                        </p>
                    </div>
                    <button
                        onClick={() =>
                            navigate('/coordinator/match-tutor-student')
                        }
                        className='flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 font-medium text-white shadow-sm transition-colors hover:bg-blue-600'
                    >
                        <span>+</span> Ghép cặp Tutor - Sinh viên
                    </button>
                </div>

                {/* --- STATS CARDS --- */}
                <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-3'>
                    {mockCoordinatorStats.map((stat, index) => {
                        const style = getStatStyle(stat.key);
                        return (
                            <div
                                key={index}
                                className='flex items-center justify-between rounded-xl border border-gray-100 bg-white p-5 shadow-sm'
                            >
                                <div>
                                    <p className='text-3xl font-bold text-gray-800'>
                                        {stat.value}
                                    </p>
                                    <p className='mt-1 text-sm text-gray-500'>
                                        {stat.label}
                                    </p>
                                </div>
                                <div
                                    className={`rounded-full p-3 ${style.bg} ${style.color}`}
                                >
                                    {style.icon}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* --- MAIN CONTENT --- */}
                <div className='grid grid-cols-1 gap-8 lg:grid-cols-12'>
                    {/* CỘT TRÁI: Tutor mới cần duyệt */}
                    <div className='rounded-xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-5'>
                        <div className='mb-4 flex items-center justify-between'>
                            <h2 className='text-lg font-bold text-gray-800'>
                                Tutor mới cần duyệt
                            </h2>
                            <button
                                onClick={() =>
                                    navigate('/coordinator/tutor-management')
                                }
                                className='cursor-pointer text-sm text-blue-500 hover:underline'
                            >
                                Xem tất cả
                            </button>
                        </div>

                        {/* Danh sách Tutor cần duyệt */}
                        <div className='flex flex-col gap-4'>
                            {/* 👇 SỬ DỤNG INDEX ĐỂ GÁN ID 4 VÀ 5 */}
                            {mockPendingTutors.map((tutor, index) => {
                                // Logic: Nếu là người đầu tiên (index 0) -> targetId = 4
                                //        Nếu là người thứ hai (index 1) -> targetId = 5
                                const targetId = index === 0 ? 4 : 5;

                                return (
                                    <div
                                        key={tutor.id}
                                        onClick={() =>
                                            navigate(
                                                '/coordinator/tutor-management',
                                                {
                                                    state: {
                                                        openProfileId: targetId, // Sử dụng targetId đã tính toán ở trên
                                                        tab: 'pending',
                                                    },
                                                },
                                            )
                                        }
                                        className='cursor-pointer rounded-lg border border-gray-100 p-4 transition-colors hover:bg-gray-50'
                                    >
                                        {/* ... nội dung card tutor giữ nguyên ... */}
                                        <div className='flex items-start justify-between'>
                                            <div>
                                                <h3 className='font-semibold text-gray-800'>
                                                    {tutor.name}
                                                </h3>
                                                <div className='mt-1 flex items-center gap-2 text-xs text-gray-500'>
                                                    <Calendar size={14} />
                                                    <span>
                                                        Đăng ký: {tutor.date}
                                                    </span>
                                                </div>
                                                <div className='mt-1 flex items-center gap-2 text-xs text-gray-500'>
                                                    <BookOpen size={14} />
                                                    {/* Lưu ý: Kiểm tra lại tên trường 'major' hoặc 'expertise' trong data của bạn */}
                                                    <span>
                                                        Chuyên ngành:{' '}
                                                        {tutor.major}
                                                    </span>
                                                </div>
                                            </div>
                                            <button className='rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 transition-colors hover:bg-green-200'>
                                                Xem hồ sơ
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* CỘT PHẢI: Yêu cầu cần xử lý */}
                    <div className='rounded-xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-7'>
                        <div className='mb-4 flex items-center justify-between'>
                            <h2 className='text-lg font-bold text-gray-800'>
                                Yêu cầu cần xử lý
                            </h2>
                        </div>

                        <div className='flex flex-col gap-4'>
                            {mockPendingRequests.map((req) => (
                                <div
                                    key={req.id}
                                    onClick={() =>
                                        navigate(
                                            '/coordinator/match-tutor-student',
                                            { state: { targetId: req.id } },
                                        )
                                    }
                                    className='flex cursor-pointer items-start gap-4 rounded-lg border-b border-gray-100 p-3 transition-colors last:border-0 hover:bg-gray-50'
                                >
                                    <div
                                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold text-white ${req.id === 1 ? 'bg-blue-500' : req.id === 2 ? 'bg-green-500' : 'bg-orange-500'}`}
                                    >
                                        {req.name.split(' ').pop()?.charAt(0)}
                                    </div>

                                    <div className='flex-1'>
                                        <h3 className='text-sm font-semibold text-gray-800'>
                                            {req.name}
                                        </h3>
                                        <p className='mt-1 line-clamp-1 text-xs text-gray-500'>
                                            {req.request}
                                        </p>
                                        <div className='mt-2 flex items-center gap-2 text-xs text-gray-400'>
                                            <Clock size={12} />
                                            <span>{req.time}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Overview;
