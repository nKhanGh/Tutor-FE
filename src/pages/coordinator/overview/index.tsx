import { useNavigate } from 'react-router-dom';
import Sidebar from '@/components/layouts/Sidebar';
import { Users, UserCheck, Bell, Clock } from 'lucide-react';
import { mockCoordinatorStats } from '@/interfaces/Coordinator';
import { storage } from '@/utils/storage';

const Overview = () => {
    const navigate = useNavigate();

    const pendingRequests = storage.getNotHandledStudents();

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
                        className='flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-primary to-blue-secondary px-4 py-2 font-medium text-white shadow-sm transition-colors hover:bg-blue-600'
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
                    {/* CỘT PHẢI: Yêu cầu cần xử lý */}
                    <div className='rounded-xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-7'>
                        <div className='mb-4 flex items-center justify-between'>
                            <h2 className='text-lg font-bold text-gray-800'>
                                Ghép cặp cần xử lý
                            </h2>
                        </div>

                        <div className='flex flex-col gap-4'>
                            {pendingRequests.length > 0 &&
                                pendingRequests.map((req) => (
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
                                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold text-white ${storage.getUserById(req.studentId)?.avatarBg}`}
                                        >
                                            {req.studentName
                                                .split(' ')
                                                .pop()
                                                ?.charAt(0)}
                                        </div>

                                        <div className='flex-1'>
                                            <h3 className='text-sm font-semibold text-gray-800'>
                                                {req.studentName}
                                            </h3>
                                            <p className='mt-1 line-clamp-1 text-xs text-gray-500'>
                                                Muốn tìm giảng viên cho môn học{' '}
                                                {req.subjects.reduce(
                                                    (acc, sub) =>
                                                        acc +
                                                        (acc ? ', ' : '') +
                                                        sub,
                                                    '',
                                                )}
                                                .
                                            </p>
                                            <div className='mt-2 flex items-center gap-2 text-xs text-gray-400'>
                                                <Clock size={12} />
                                                Lịch học mong muốn:
                                                <span>{req.availability}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            {pendingRequests.length === 0 && (
                                <p className='mt-4 text-center text-gray-500'>
                                    Không có yêu cầu cần xử lý.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Overview;
