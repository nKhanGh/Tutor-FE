import { useState, useEffect } from 'react';
import {
    X,
    Calendar,
    Clock,
    MapPin,
    Video,
    Link as LinkIcon,
    Download,
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
    // State lưu trữ tài liệu
    const [documents, setDocuments] = useState<Document[]>([]);

    // Effect load tài liệu
    useEffect(() => {
        const timer = setTimeout(() => {
            if (
                isOpen &&
                session?.attachedDocumentIds &&
                session.attachedDocumentIds.length > 0
            ) {
                // Dùng setTimeout để tránh lỗi setState synchronously within an effect
                const timer = setTimeout(() => {
                    const allDocs = storage.getDocuments();
                    // Lọc ra các docs có ID nằm trong danh sách attachedDocumentIds
                    const attachedDocs = allDocs.filter((doc) =>
                        session.attachedDocumentIds?.includes(doc.id),
                    );
                    setDocuments(attachedDocs);
                }, 0);
                return () => clearTimeout(timer);
            } else {
                // Reset nếu không có tài liệu
                setDocuments([]);
            }
        }, 0);
        return () => clearTimeout(timer);
    }, [isOpen, session]);

    if (!isOpen || !session) return null;

    return (
        <div className='animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 font-bevietnam'>
            <div className='flex max-h-[90vh] w-full max-w-md scale-100 transform flex-col overflow-hidden rounded-2xl bg-white shadow-2xl transition-all'>
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
                        Thông tin chi tiết buổi học
                    </p>
                </div>

                {/* Body - Thêm overflow-y-auto để cuộn nếu nội dung dài */}
                <div className='space-y-6 overflow-y-auto p-6'>
                    {/* Time & Date */}
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

                    {/* Student Info */}
                    <div className='flex items-start gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4'>
                        <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0795DF] font-bold text-white'>
                            {session.studentName.charAt(0)}
                        </div>
                        <div>
                            <p className='mb-0.5 text-xs font-bold uppercase text-gray-500'>
                                Sinh viên
                            </p>
                            <p className='font-bold text-gray-800'>
                                {session.studentName}
                            </p>
                            <p className='text-sm text-gray-500'>
                                MSSV: {session.studentId || 'N/A'}
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
                        <div className='break-all rounded-lg border border-gray-200 bg-gray-100 p-3 text-sm font-medium text-gray-700'>
                            {session.locationOrLink}
                        </div>
                    </div>

                    {/* --- PHẦN HIỂN THỊ TÀI LIỆU --- */}
                    {documents.length > 0 && (
                        <div className='space-y-2'>
                            <p className='flex items-center gap-2 text-sm font-bold text-gray-700'>
                                <LinkIcon
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
                                        {/* Nút tải giả lập */}
                                        <button className='p-2 text-gray-400 transition-colors hover:text-[#0795DF]'>
                                            <Download size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Status Badge */}
                    <div className='flex items-center justify-between border-t border-gray-100 pt-2'>
                        <span className='text-sm text-gray-500'>
                            Trạng thái:
                        </span>
                        <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${
                                session.status === 'upcoming'
                                    ? 'bg-blue-100 text-blue-700'
                                    : session.status === 'pending'
                                      ? 'bg-yellow-100 text-yellow-700'
                                      : 'bg-gray-100 text-gray-700'
                            }`}
                        >
                            {session.status === 'upcoming'
                                ? 'Sắp diễn ra'
                                : session.status === 'pending'
                                  ? 'Chờ duyệt'
                                  : session.status}
                        </span>
                    </div>
                </div>

                {/* Footer */}
                <div className='flex shrink-0 justify-end border-t bg-gray-50 p-4'>
                    <button
                        onClick={onClose}
                        className='rounded-lg border border-gray-300 bg-white px-6 py-2.5 font-semibold text-gray-700 transition-colors hover:bg-gray-50'
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SessionDetailModal;
