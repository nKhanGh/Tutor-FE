import { useState, useEffect } from 'react';
import {
    X,
    Calendar,
    Clock,
    MapPin,
    Video,
    Link as LinkIcon,
    Download,
    AlertCircle,
    ArrowRight,
    MessageSquare,
    User,
    FileText,
} from 'lucide-react';
import type { Session, Document } from '@/interfaces';
import { storage } from '@/utils/storage';

interface SessionDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    session: Session | null;
}

const SessionDetailModal = ({
    isOpen,
    onClose,
    session,
}: SessionDetailModalProps) => {
    const [documents, setDocuments] = useState<Document[]>([]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (
                isOpen &&
                session?.attachedDocumentIds &&
                session.attachedDocumentIds.length > 0
            ) {
                const allDocs = storage.getDocuments();
                const attachedDocs = allDocs.filter((doc) =>
                    session.attachedDocumentIds?.includes(doc.id),
                );
                setDocuments(attachedDocs);
            } else {
                setDocuments([]);
            }
        }, 0);
        return () => clearTimeout(timer);
    }, [isOpen, session]);

    if (!isOpen || !session) return null;

    const { pendingChange } = session;
    // Kiểm tra xem có đang xin đổi lịch không
    const isRescheduling = pendingChange?.type === 'reschedule';

    return (
        <div className='animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 font-bevietnam backdrop-blur-sm'>
            <div className='animate-in fade-in zoom-in flex max-h-[90vh] w-full max-w-lg scale-100 transform flex-col overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-200'>
                {/* Header */}
                <div className='relative shrink-0 bg-gradient-to-r from-[#0795DF] to-[#00C0EF] p-6 text-white'>
                    <button
                        onClick={onClose}
                        className='absolute right-4 top-4 rounded-full bg-white/20 p-2 transition-colors hover:bg-white/30'
                    >
                        <X size={20} />
                    </button>
                    <h2 className='pr-8 text-xl font-bold'>{session.title}</h2>
                    <p className='mt-1 text-sm text-blue-100 opacity-90'>
                        Mã buổi học: #{session.id.slice(-6).toUpperCase()}
                    </p>
                </div>

                {/* Body */}
                <div className='custom-scrollbar space-y-6 overflow-y-auto p-6'>
                    {/* --- KHU VỰC THÔNG BÁO YÊU CẦU THAY ĐỔI --- */}
                    {pendingChange && (
                        <div
                            className={`rounded-xl border p-4 shadow-sm ${pendingChange.type === 'cancel' ? 'border-red-200 bg-red-50' : 'border-orange-200 bg-orange-50'}`}
                        >
                            <div className='mb-4 flex items-center gap-2 border-b border-black/5 pb-2'>
                                <AlertCircle
                                    size={20}
                                    className={
                                        pendingChange.type === 'cancel'
                                            ? 'text-red-600'
                                            : 'text-orange-600'
                                    }
                                />
                                <span
                                    className={`font-bold ${pendingChange.type === 'cancel' ? 'text-red-700' : 'text-orange-700'}`}
                                >
                                    {pendingChange.type === 'cancel'
                                        ? 'Yêu cầu HỦY đang chờ duyệt'
                                        : 'Yêu cầu ĐỔI LỊCH đang chờ duyệt'}
                                </span>
                            </div>

                            {/* GIAO DIỆN SO SÁNH TRỰC QUAN (Chỉ hiện khi Đổi lịch) */}
                            {isRescheduling && (
                                <div className='mb-3 flex items-center justify-between rounded-lg border border-orange-100 bg-white p-3'>
                                    {/* Bên Trái: Lịch Cũ */}
                                    <div className='flex w-5/12 flex-col items-center opacity-60'>
                                        <span className='mb-1 text-[10px] font-bold uppercase text-gray-500'>
                                            Lịch cũ
                                        </span>
                                        <div className='text-center text-sm font-medium text-gray-600 decoration-red-400 decoration-2'>
                                            <div>{session.date}</div>
                                            <div className='text-xs'>
                                                {session.time}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Ở Giữa: Mũi Tên */}
                                    <div className='flex w-2/12 justify-center text-orange-500'>
                                        <ArrowRight size={24} />
                                    </div>

                                    {/* Bên Phải: Lịch Mới */}
                                    <div className='flex w-5/12 flex-col items-center rounded border border-green-100 bg-green-50 py-1'>
                                        <span className='mb-1 text-[10px] font-bold uppercase text-green-600'>
                                            Lịch mới
                                        </span>
                                        <div className='text-center text-sm font-bold text-green-700'>
                                            <div>
                                                {pendingChange.newDate ||
                                                    session.date}
                                            </div>
                                            <div className='text-xs'>
                                                {pendingChange.newTime ||
                                                    session.time}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Lý do */}
                            <div
                                className={`flex gap-2 text-sm italic ${pendingChange.type === 'cancel' ? 'text-red-800' : 'text-orange-800'}`}
                            >
                                <MessageSquare
                                    size={16}
                                    className='mt-0.5 shrink-0'
                                />
                                <span>"{pendingChange.reason}"</span>
                            </div>
                        </div>
                    )}

                    {/* --- THÔNG TIN THỜI GIAN CỐ ĐỊNH --- */}
                    {/* Logic: Nếu đang đổi lịch (isRescheduling = true) thì ẨN phần này đi để đỡ rối */}
                    {!isRescheduling && (
                        <div className='flex gap-4'>
                            <div className='flex-1 rounded-xl border border-blue-100 bg-blue-50 p-3'>
                                <div className='mb-1 flex items-center gap-2 text-[#0795DF]'>
                                    <Calendar size={18} />
                                    <span className='text-xs font-bold uppercase'>
                                        Ngày
                                    </span>
                                </div>
                                <p className='font-semibold text-gray-800'>
                                    {session.date}
                                </p>
                            </div>
                            <div className='flex-1 rounded-xl border border-blue-100 bg-blue-50 p-3'>
                                <div className='mb-1 flex items-center gap-2 text-[#0795DF]'>
                                    <Clock size={18} />
                                    <span className='text-xs font-bold uppercase'>
                                        Thời gian
                                    </span>
                                </div>
                                <p className='font-semibold text-gray-800'>
                                    {session.time}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Person Info */}
                    <div className='flex items-start gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4'>
                        <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0795DF] font-bold text-white'>
                            <User size={20} />
                        </div>
                        <div>
                            <p className='mb-0.5 text-xs font-bold uppercase text-gray-500'>
                                {session.studentName
                                    ? 'Sinh viên'
                                    : 'Người tham gia'}
                            </p>
                            <p className='font-bold text-gray-800'>
                                {session.studentName || session.tutorName}
                            </p>
                            <p className='text-sm text-gray-500'>
                                ID: {session.studentId || session.tutorId}
                            </p>
                        </div>
                    </div>

                    {/* Location / Link */}
                    <div className='space-y-2'>
                        <p className='flex items-center gap-2 text-sm font-bold text-gray-700'>
                            {session.type === 'online' ? (
                                <Video size={18} className='text-purple-500' />
                            ) : (
                                <MapPin size={18} className='text-red-500' />
                            )}
                            {session.type === 'online'
                                ? 'Link phòng học'
                                : 'Địa điểm'}
                        </p>
                        <div className='flex items-center justify-between break-all rounded-lg border border-gray-200 bg-gray-100 p-3 text-sm font-medium text-gray-700'>
                            <span>{session.locationOrLink}</span>
                            {session.type === 'online' && (
                                <a
                                    href='#'
                                    className='flex items-center gap-1 text-xs text-blue-600 hover:underline'
                                >
                                    <LinkIcon size={12} /> Mở
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Documents */}
                    {documents.length > 0 && (
                        <div className='space-y-2 border-t border-gray-100 pt-2'>
                            <p className='flex items-center gap-2 text-sm font-bold text-gray-700'>
                                <FileText
                                    size={18}
                                    className='text-orange-500'
                                />
                                Tài liệu đính kèm
                            </p>
                            <div className='space-y-2'>
                                {documents.map((doc) => (
                                    <div
                                        key={doc.id}
                                        className='flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3 transition-colors hover:bg-gray-100'
                                    >
                                        <div
                                            className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded text-xs font-bold text-white ${
                                                doc.type === 'Slide'
                                                    ? 'bg-orange-400'
                                                    : 'bg-blue-500'
                                            }`}
                                        >
                                            {doc.type === 'Slide'
                                                ? 'SL'
                                                : 'DOC'}
                                        </div>
                                        <div className='min-w-0 flex-1'>
                                            <p
                                                className='truncate text-sm font-semibold text-gray-700'
                                                title={doc.title}
                                            >
                                                {doc.title}
                                            </p>
                                            <p className='text-xs text-gray-500'>
                                                {doc.fileInfo}
                                            </p>
                                        </div>
                                        <button className='p-2 text-gray-400 transition-colors hover:text-[#0795DF]'>
                                            <Download size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Status Text */}
                    <div className='flex items-center justify-center gap-2 border-t border-gray-100 pt-4'>
                        <span className='text-sm text-gray-500'>
                            Trạng thái hiện tại:
                        </span>
                        <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${
                                session.status === 'upcoming'
                                    ? 'bg-blue-100 text-blue-700'
                                    : session.status === 'pending'
                                      ? 'bg-yellow-100 text-yellow-700'
                                      : session.status.includes('cancelled')
                                        ? 'bg-red-100 text-red-700'
                                        : 'bg-green-100 text-green-700'
                            }`}
                        >
                            {session.status === 'upcoming'
                                ? 'Sắp diễn ra'
                                : session.status === 'pending'
                                  ? 'Chờ duyệt'
                                  : session.status === 'completed'
                                    ? 'Hoàn thành'
                                    : 'Đã hủy'}
                        </span>
                    </div>
                </div>

                {/* Footer */}
                <div className='flex shrink-0 justify-end border-t bg-gray-50 p-4'>
                    <button
                        onClick={onClose}
                        className='rounded-xl border border-gray-300 bg-white px-6 py-2.5 font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-100'
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SessionDetailModal;
