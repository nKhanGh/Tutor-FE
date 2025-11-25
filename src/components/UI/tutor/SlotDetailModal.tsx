import React, { useEffect, useState } from 'react';
import {
    X,
    Calendar,
    Clock,
    User,
    BookOpen,
    Trash2,
    Link as LinkIcon,
} from 'lucide-react';
import { storage } from '@/utils/storage';
import type { AvailabilitySlot, Document } from '@/interfaces';

interface SlotDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    slot: AvailabilitySlot | null;
    onDelete: (slot: AvailabilitySlot) => void;
}

const SlotDetailModal: React.FC<SlotDetailModalProps> = ({
    isOpen,
    onClose,
    slot,
    onDelete,
}) => {
    const [documents, setDocuments] = useState<Document[]>([]);

    // Load thông tin tài liệu dựa trên ID đính kèm
    useEffect(() => {
        const timer = setTimeout(() => {
            if (isOpen && slot?.attachedDocumentIds) {
                // Sử dụng setTimeout để tránh lỗi setState synchronous
                const timer = setTimeout(() => {
                    const allDocs = storage.getDocuments();
                    const attachedDocs = allDocs.filter((doc) =>
                        slot.attachedDocumentIds?.includes(doc.id),
                    );
                    setDocuments(attachedDocs);
                }, 0);
                return () => clearTimeout(timer);
            } else {
                setDocuments([]);
            }
        }, 0);
        return () => clearTimeout(timer);
    }, [isOpen, slot]);

    if (!isOpen || !slot) return null;

    const isBooked = slot.status === 'booked';

    return (
        <div className='animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 font-bevietnam'>
            <div className='w-full max-w-lg scale-100 transform overflow-hidden rounded-xl bg-white shadow-xl transition-all'>
                {/* Header */}
                <div className='flex items-center justify-between border-b border-gray-100 p-6'>
                    <h2 className='text-xl font-bold text-gray-800'>
                        Chi tiết khung giờ
                    </h2>
                    <button
                        onClick={onClose}
                        className='rounded-full p-1 text-gray-400 transition-colors hover:text-gray-600'
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className='max-h-[60vh] overflow-y-auto p-6'>
                    <ul className='space-y-4'>
                        <li className='flex items-start gap-4 border-b border-gray-50 pb-4'>
                            <div className='mt-1 text-[#0795DF]'>
                                <Clock size={20} />
                            </div>
                            <div>
                                <span className='block text-sm font-medium text-gray-500'>
                                    Trạng thái
                                </span>
                                <span
                                    className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-bold ${
                                        isBooked
                                            ? 'bg-yellow-50 text-yellow-600'
                                            : 'bg-green-50 text-green-600'
                                    }`}
                                >
                                    {isBooked ? 'Đã được đặt' : 'Đang rảnh'}
                                </span>
                            </div>
                        </li>

                        <li className='flex items-start gap-4 border-b border-gray-50 pb-4'>
                            <div className='mt-1 text-[#0795DF]'>
                                <Calendar size={20} />
                            </div>
                            <div>
                                <span className='block text-sm font-medium text-gray-500'>
                                    Thời gian
                                </span>
                                <span className='block font-semibold text-gray-800'>
                                    {slot.date} | {slot.startTime} -{' '}
                                    {slot.endTime}
                                </span>
                            </div>
                        </li>

                        {isBooked && (
                            <li className='flex items-start gap-4 border-b border-gray-50 pb-4'>
                                <div className='mt-1 text-[#0795DF]'>
                                    <User size={20} />
                                </div>
                                <div>
                                    <span className='block text-sm font-medium text-gray-500'>
                                        Sinh viên đăng ký
                                    </span>
                                    <span className='block font-semibold text-gray-800'>
                                        {slot.bookedByStudentName || 'N/A'}
                                    </span>
                                </div>
                            </li>
                        )}

                        {slot.subject && (
                            <li className='flex items-start gap-4 border-b border-gray-50 pb-4'>
                                <div className='mt-1 text-[#0795DF]'>
                                    <BookOpen size={20} />
                                </div>
                                <div>
                                    <span className='block text-sm font-medium text-gray-500'>
                                        Chủ đề / Môn học
                                    </span>
                                    <span className='block font-semibold text-gray-800'>
                                        {slot.subject}
                                    </span>
                                    {slot.title && (
                                        <span className='text-sm text-gray-600'>
                                            Topic: {slot.title}
                                        </span>
                                    )}
                                </div>
                            </li>
                        )}

                        {/* DANH SÁCH TÀI LIỆU ĐÍNH KÈM */}
                        {documents.length > 0 && (
                            <li className='flex items-start gap-4 pt-2'>
                                <div className='mt-1 text-[#0795DF]'>
                                    <LinkIcon size={20} />
                                </div>
                                <div className='w-full'>
                                    <span className='mb-2 block text-sm font-medium text-gray-500'>
                                        Tài liệu đính kèm
                                    </span>
                                    <div className='space-y-2'>
                                        {documents.map((doc) => (
                                            <div
                                                key={doc.id}
                                                className='flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3'
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
                                                <div className='overflow-hidden'>
                                                    <p className='truncate text-sm font-semibold text-gray-700'>
                                                        {doc.title}
                                                    </p>
                                                    <p className='text-xs text-gray-500'>
                                                        {doc.fileInfo}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </li>
                        )}
                    </ul>
                </div>

                {/* Footer */}
                <div className='flex justify-between border-t border-gray-100 bg-gray-50 p-6'>
                    <button
                        onClick={() => onDelete(slot)}
                        className='flex items-center gap-2 rounded-lg bg-red-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-red-200 transition-all hover:bg-red-600 hover:shadow-lg'
                    >
                        <Trash2 size={18} /> Xóa khung giờ
                    </button>
                    <button
                        onClick={onClose}
                        className='rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50'
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SlotDetailModal;
