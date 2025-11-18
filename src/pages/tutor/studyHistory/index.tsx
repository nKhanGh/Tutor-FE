import Sidebar from '@/components/layouts/Sidebar';
import CancellationReasonModal from '@/components/UI/CanellationReasonModal';
import FeedbackModal from '@/components/UI/FeedbackModal';
import type { Session } from '@/interfaces/Sesson';
import { Search } from 'lucide-react';
import { useState } from 'react';

const StudyHistory = () => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [selectedSession, setSelectedSession] = useState<Session | null>(
        null,
    );
    const [feedbackModalOpen, setFeedbackModalOpen] = useState<boolean>(false); // Dùng cho "Xem biên bản"
    const [reasonModalOpen, setReasonModalOpen] = useState<boolean>(false);

    // Sửa lại dữ liệu để khớp với hình ảnh (trang Tutor)
    const [sessions] = useState<Session[]>([
        {
            id: '1',
            date: '18/10/2025',
            time: '15:00 - 16:30',
            title: 'Đại số tuyến tính - Không gian vector', // Sửa title
            student: 'Nguyễn Hữu Khang', // Sửa tutor -> student
            status: 'completed',
            canViewReason: false,
            // Thêm review (biên bản) để nút "Xem biên bản" xuất hiện
            review: {
                rating: 5,
                comment: 'Biên bản buổi học...',
            },
        },
        {
            id: '2',
            date: '17/10/2025',
            time: '09:00 - 10:30',
            title: 'Vật lý 1 - Điện trường tĩnh',
            student: 'Đặng Phạm Gia Long', // Sửa tutor -> student
            status: 'completed',
            canViewReason: false,
            review: {
                rating: 5,
                comment: 'Biên bản buổi học...',
            },
        },
        {
            id: '3',
            date: '16/10/2025',
            time: '14:00 - 15:30',
            title: 'Giải tích 2 - Tích phân đường',
            student: 'Trương Thanh Nhân', // Sửa tutor -> student
            status: 'cancelled-tutor',
            canViewReason: true,
            cancellationReason:
                'Tôi cảm thấy không khỏe nên cần đi bệnh viện gấp, xin lỗi sinh viên và nhà trường vì sự bất tiện này.',
        },
        {
            id: '4',
            date: '14/10/2025',
            time: '10:00 - 11:30',
            title: 'Công nghệ phần mềm - Activity Diagram',
            student: 'Cấn Hoàng Hà', // Sửa tutor -> student
            status: 'cancelled-student',
            canViewReason: true,
            cancellationReason:
                'Gia đình có việc quan trọng nên tôi phải về quê gấp, chân thành xin lỗi nhà trường và giảng viên hướng dẫn, tôi sẽ tìm buổi khác phù hợp',
        },
        {
            id: '5',
            date: '13/10/2025',
            time: '15:00 - 16:30',
            title: 'Đại số tuyến tính - Định thức & Ma trận nghịch đảo',
            student: 'Nguyễn Hữu Khang', // Sửa tutor -> student
            status: 'completed',
            canViewReason: false,
            review: {
                rating: 4,
                comment: 'Biên bản buổi học...',
            },
        },
    ]);

    // (Bỏ hàm updateSessionFeedback vì không cần)

    const getStatusBadge = (status: Session['status']) => {
        switch (status) {
            case 'completed':
                return (
                    <span className='rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-600 sm:px-3 sm:text-sm'>
                        Hoàn thành
                    </span>
                );
            case 'cancelled-tutor':
                return (
                    <span className='rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-600 sm:px-3 sm:text-sm'>
                        Đã hủy (Tutor)
                    </span>
                );
            case 'cancelled-student':
                return (
                    <span className='rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-600 sm:px-3 sm:text-sm'>
                        Đã hủy (SV)
                    </span>
                );
            default:
                return null;
        }
    };

    const handleOpenFeedback = (session: Session) => {
        // Dùng cho "Xem biên bản"
        setSelectedSession(session);
        setFeedbackModalOpen(true);
    };

    const handleOpenReason = (session: Session) => {
        setSelectedSession(session);
        setReasonModalOpen(true);
    };

    const filteredSessions = sessions.filter((session) => {
        // ==== 1. Lọc theo text ====
        const matchesTitle = session.title
            .toLowerCase()
            .includes(searchQuery.toLowerCase());

        const matchesStudent =
            session.student &&
            session.student.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesText = matchesTitle || matchesStudent;

        // ==== 2. Lọc theo ngày (ĐÃ SỬA LẠI LOGIC) ====

        // Tạo ngày của session (chuẩn lúc 00:00:00)
        const [d, m, y] = session.date.split('/').map(Number);
        const sessionDate = new Date(y, m - 1, d);

        // Mặc định là cho qua
        let matchesDate = true;

        // Nếu có ngày bắt đầu (startDate)
        if (startDate) {
            const [yS, mS, dS] = startDate.split('-').map(Number);
            const start = new Date(yS, mS - 1, dS);

            // Nếu ngày session < ngày bắt đầu -> LOẠI
            if (sessionDate < start) {
                matchesDate = false;
            }
        }

        // Nếu có ngày kết thúc (endDate)
        if (endDate) {
            const [yE, mE, dE] = endDate.split('-').map(Number);
            const end = new Date(yE, mE - 1, dE);

            // Nếu ngày session > ngày kết thúc -> LOẠI
            if (sessionDate > end) {
                matchesDate = false;
            }
        }

        // (Bạn có thể bỏ comment dòng console.log dưới đây để xem nó lọc thế nào)
        // console.log(`Session: ${session.date}, Start: ${startDate}, End: ${endDate}, Keep: ${matchesText && matchesDate}`);

        // ==== 3. Trả về kết quả ====
        return matchesText && matchesDate;
    });

    return (
        <>
            <Sidebar />
            <div className='ml-[80px] min-h-screen bg-blue-50 p-3 pt-4 sm:p-4 md:ml-[260px] md:p-6'>
                <div className='mx-auto max-w-7xl'>
                    {/* Header */}
                    <div className='mb-4 md:mb-6'>
                        <h1 className='mb-2 text-3xl font-bold text-gray-800'>
                            Lịch sử buổi học
                        </h1>
                        <p className='text-base text-gray-600'>
                            Xem lại tất cả các buổi tư vấn đã diễn ra.
                        </p>
                    </div>

                    {/* Search and Filters */}
                    <div className='mb-4 rounded-2xl bg-white p-3 shadow-sm sm:p-4 md:mb-6 md:p-6'>
                        <div className='flex flex-col gap-3 sm:gap-4 lg:flex-row'>
                            <div className='relative flex-1'>
                                <Search
                                    className='absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400 sm:left-4'
                                    size={20}
                                />
                                <input
                                    type='text'
                                    placeholder='Tìm theo môn học, sinh viên...' // Sửa placeholder
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className='w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 sm:py-3 sm:pl-12 sm:pr-4 sm:text-base'
                                />
                            </div>
                            <div className='flex items-center gap-2 sm:gap-4'>
                                <input
                                    type='date'
                                    value={startDate}
                                    onChange={(e) =>
                                        setStartDate(e.target.value)
                                    }
                                    className='flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 sm:px-4 sm:py-3 sm:text-base'
                                />
                                <span className='text-gray-500'>-</span>
                                <input
                                    type='date'
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className='flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 sm:px-4 sm:py-3 sm:text-base'
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sessions - Desktop Table View */}
                    <div className='hidden overflow-hidden rounded-2xl bg-white shadow-sm lg:block'>
                        <table className='w-full'>
                            <thead className='border-b bg-gray-50'>
                                <tr>
                                    <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-gray-600'>
                                        NGÀY & GIỜ
                                    </th>
                                    <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-gray-600'>
                                        CHỦ ĐỀ
                                    </th>
                                    <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-gray-600'>
                                        SINH VIÊN {/* Sửa TUTOR -> SINH VIÊN */}
                                    </th>
                                    <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-gray-600'>
                                        TRẠNG THÁI
                                    </th>
                                    <th className='px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-gray-600'>
                                        HÀNH ĐỘNG
                                    </th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-gray-100'>
                                {filteredSessions.map((session) => (
                                    <tr
                                        key={session.id}
                                        className='transition-colors hover:bg-gray-50'
                                    >
                                        <td className='px-6 py-4'>
                                            <div className='font-semibold text-gray-800'>
                                                {session.date}
                                            </div>
                                            <div className='text-sm text-gray-600'>
                                                {session.time}
                                            </div>
                                        </td>
                                        <td className='px-6 py-4'>
                                            <div className='font-medium text-gray-800'>
                                                {session.title}
                                            </div>
                                        </td>
                                        <td className='px-6 py-4'>
                                            <div className='text-gray-800'>
                                                {session.student}{' '}
                                                {/* Sửa session.tutor -> session.student */}
                                            </div>
                                        </td>
                                        <td className='px-6 py-4'>
                                            <div className='flex items-center gap-2'>
                                                {getStatusBadge(session.status)}
                                            </div>
                                        </td>
                                        <td className='px-6 py-4'>
                                            {/* Sửa lại logic nút bấm cho khớp hình */}
                                            <div className='flex flex-col gap-2'>
                                                {/* Bỏ nút "Phản hồi" (canFeedback) */}

                                                {session.review && (
                                                    <button
                                                        onClick={() =>
                                                            handleOpenFeedback(
                                                                session,
                                                            )
                                                        }
                                                        className='rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-200'
                                                    >
                                                        Xem biên bản{' '}
                                                        {/* Sửa text */}
                                                    </button>
                                                )}
                                                {session.canViewReason && (
                                                    <button
                                                        onClick={() =>
                                                            handleOpenReason(
                                                                session,
                                                            )
                                                        }
                                                        className='rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-200'
                                                    >
                                                        Xem lý do
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Load More Button */}
                        <div className='border-t p-6 text-center'>
                            <button className='rounded-lg bg-blue-50 px-6 py-3 font-semibold text-blue-600 transition-colors hover:bg-blue-100'>
                                Xem thêm các buổi cũ hơn
                            </button>
                        </div>
                    </div>

                    {/* Sessions - Mobile Card View */}
                    <div className='space-y-3 sm:space-y-4 lg:hidden'>
                        {filteredSessions.map((session) => (
                            <div
                                key={session.id}
                                className='rounded-xl bg-white p-4 shadow-sm sm:p-5'
                            >
                                {/* Header */}
                                <div className='mb-3 flex items-start justify-between'>
                                    <div className='flex-1'>
                                        <div className='mb-1 text-sm font-semibold text-gray-800 sm:text-base'>
                                            {session.date}
                                        </div>
                                        <div className='text-xs text-gray-600 sm:text-sm'>
                                            {session.time}
                                        </div>
                                    </div>
                                    {getStatusBadge(session.status)}
                                </div>

                                {/* Content */}
                                <div className='mb-3 border-b border-gray-100 pb-3'>
                                    <div className='mb-2 text-sm font-medium text-gray-800 sm:text-base'>
                                        {session.title}
                                    </div>
                                    <div className='text-xs text-gray-600 sm:text-sm'>
                                        Sinh viên: {session.student} {/* Sửa */}
                                    </div>
                                </div>

                                {/* Actions (Sửa cho khớp hình) */}
                                <div className='flex flex-wrap gap-2'>
                                    {/* Bỏ nút "Phản hồi" */}
                                    {session.review && (
                                        <button
                                            onClick={() =>
                                                handleOpenFeedback(session)
                                            }
                                            className='min-w-[140px] flex-1 rounded-lg bg-blue-100 px-3 py-2 text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-200 sm:text-sm'
                                        >
                                            Xem biên bản {/* Sửa text */}
                                        </button>
                                    )}
                                    {session.canViewReason && (
                                        <button
                                            onClick={() =>
                                                handleOpenReason(session)
                                            }
                                            className='min-w-[140px] flex-1 rounded-lg bg-blue-100 px-3 py-2 text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-200 sm:text-sm'
                                        >
                                            Xem lý do
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Load More Button */}
                        <div className='pt-2'>
                            <button className='w-full rounded-lg bg-blue-50 px-6 py-3 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-100 sm:text-base'>
                                Xem thêm các buổi cũ hơn
                            </button>
                        </div>
                    </div>
                </div>

                {/* Modals */}
            </div>
            <FeedbackModal
                isOpen={feedbackModalOpen}
                onClose={() => setFeedbackModalOpen(false)}
                session={selectedSession}
            />
            <CancellationReasonModal
                isOpen={reasonModalOpen}
                onClose={() => setReasonModalOpen(false)}
                session={selectedSession}
            />
            {/* Bỏ SendingFeedbackModal */}
        </>
    );
};

export default StudyHistory;
