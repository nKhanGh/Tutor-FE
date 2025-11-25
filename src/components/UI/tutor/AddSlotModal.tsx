import { useState, useEffect } from 'react';
import { X, CheckSquare, Square, Search, FileText } from 'lucide-react';
import { storage } from '@/utils/storage'; // Import storage để lấy docs
import type { Document } from '@/interfaces';

export interface RecurrenceConfig {
    isRecurring: boolean;
    frequency: number;
    unit: 'day' | 'week' | 'month';
    count: number;
}

interface AddSlotModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: {
        date: string;
        startTime: string;
        endTime: string;
        recurrence: RecurrenceConfig;
        attachedDocumentIds: number[]; // Thêm trường này
    }) => void;
}

const AddSlotModal = ({ isOpen, onClose, onSave }: AddSlotModalProps) => {
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    // Recurrence
    const [isRecurring, setIsRecurring] = useState(false);
    const [frequency, setFrequency] = useState<number>(1);
    const [unit, setUnit] = useState<'day' | 'week' | 'month'>('week');
    const [count, setCount] = useState<number>(4);

    // Documents Logic
    const [availableDocs, setAvailableDocs] = useState<Document[]>([]);
    const [selectedDocIds, setSelectedDocIds] = useState<number[]>([]);
    const [docSearch, setDocSearch] = useState('');

    // Load Documents
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                const docs = storage.getDocuments();
                setAvailableDocs(docs);
            }, 0);
        }
    }, [isOpen]);

    const toggleDoc = (id: number) => {
        setSelectedDocIds((prev) =>
            prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id],
        );
    };

    const filteredDocs = availableDocs.filter((d) =>
        d.title.toLowerCase().includes(docSearch.toLowerCase()),
    );

    if (!isOpen) return null;

    const handleSave = () => {
        if (!date || !startTime || !endTime) {
            alert('Vui lòng nhập đầy đủ thông tin thời gian');
            return;
        }
        if (startTime >= endTime) {
            alert('Thời gian kết thúc phải sau thời gian bắt đầu');
            return;
        }

        onSave({
            date,
            startTime,
            endTime,
            recurrence: {
                isRecurring,
                frequency: Number(frequency),
                unit,
                count: Number(count),
            },
            attachedDocumentIds: selectedDocIds, // Gửi danh sách tài liệu đã chọn
        });

        // Reset form
        setDate('');
        setStartTime('');
        setEndTime('');
        setIsRecurring(false);
        setSelectedDocIds([]);
        setDocSearch('');
    };

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 font-bevietnam'>
            <div className='animate-fade-in-up flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-xl bg-white shadow-xl'>
                <div className='flex flex-shrink-0 items-center justify-between border-b p-5'>
                    <h2 className='text-xl font-bold text-gray-800'>
                        Thêm khung giờ mới
                    </h2>
                    <button
                        onClick={onClose}
                        className='text-gray-400 hover:text-gray-600'
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className='flex-1 space-y-6 overflow-y-auto p-6'>
                    {/* 1. Thời gian */}
                    <div className='space-y-4'>
                        <h3 className='text-sm font-bold uppercase tracking-wider text-gray-500'>
                            1. Thời gian
                        </h3>
                        <div>
                            <label className='mb-2 block text-sm font-medium text-gray-700'>
                                Ngày bắt đầu
                            </label>
                            <input
                                type='date'
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className='w-full rounded-lg border border-gray-300 p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-400'
                            />
                        </div>
                        <div className='grid grid-cols-2 gap-4'>
                            <div>
                                <label className='mb-2 block text-sm font-medium text-gray-700'>
                                    Bắt đầu
                                </label>
                                <input
                                    type='time'
                                    value={startTime}
                                    onChange={(e) =>
                                        setStartTime(e.target.value)
                                    }
                                    className='w-full rounded-lg border border-gray-300 p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-400'
                                />
                            </div>
                            <div>
                                <label className='mb-2 block text-sm font-medium text-gray-700'>
                                    Kết thúc
                                </label>
                                <input
                                    type='time'
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    className='w-full rounded-lg border border-gray-300 p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-400'
                                />
                            </div>
                        </div>
                    </div>

                    {/* 2. Lặp lại */}
                    <div className='space-y-4'>
                        <div className='flex items-center justify-between'>
                            <h3 className='text-sm font-bold uppercase tracking-wider text-gray-500'>
                                2. Lặp lại
                            </h3>
                            <div className='flex items-center gap-2'>
                                <input
                                    type='checkbox'
                                    id='repeat'
                                    className='h-4 w-4'
                                    checked={isRecurring}
                                    onChange={(e) =>
                                        setIsRecurring(e.target.checked)
                                    }
                                />
                                <label
                                    htmlFor='repeat'
                                    className='cursor-pointer text-sm font-medium'
                                >
                                    Kích hoạt
                                </label>
                            </div>
                        </div>

                        {isRecurring && (
                            <div className='animate-fade-in space-y-3 rounded-lg border border-blue-100 bg-blue-50 p-4'>
                                <div className='flex items-center gap-2 text-sm'>
                                    <span>Lặp lại mỗi:</span>
                                    <input
                                        type='number'
                                        min='1'
                                        value={frequency}
                                        onChange={(e) =>
                                            setFrequency(Number(e.target.value))
                                        }
                                        className='w-14 rounded border p-1 text-center'
                                    />
                                    <select
                                        value={unit}
                                        onChange={(e) =>
                                            setUnit(
                                                e.target.value as
                                                    | 'month'
                                                    | 'week'
                                                    | 'day',
                                            )
                                        }
                                        className='rounded border p-1'
                                    >
                                        <option value='day'>Ngày</option>
                                        <option value='week'>Tuần</option>
                                        <option value='month'>Tháng</option>
                                    </select>
                                </div>
                                <div className='flex items-center gap-2 text-sm'>
                                    <span>Kết thúc sau:</span>
                                    <input
                                        type='number'
                                        min='1'
                                        max='50'
                                        value={count}
                                        onChange={(e) =>
                                            setCount(Number(e.target.value))
                                        }
                                        className='w-14 rounded border p-1 text-center'
                                    />
                                    <span>lần</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 3. Đính kèm tài liệu */}
                    <div className='space-y-4'>
                        <h3 className='text-sm font-bold uppercase tracking-wider text-gray-500'>
                            3. Tài liệu đính kèm (Tùy chọn)
                        </h3>
                        <div className='overflow-hidden rounded-xl border border-gray-200'>
                            <div className='flex items-center gap-2 border-b border-gray-200 bg-gray-50 p-3'>
                                <Search size={16} className='text-gray-400' />
                                <input
                                    type='text'
                                    placeholder='Tìm tài liệu trong thư viện...'
                                    className='w-full bg-transparent text-sm outline-none'
                                    value={docSearch}
                                    onChange={(e) =>
                                        setDocSearch(e.target.value)
                                    }
                                />
                            </div>
                            <div className='max-h-40 space-y-1 overflow-y-auto p-2'>
                                {filteredDocs.length === 0 ? (
                                    <p className='py-2 text-center text-xs text-gray-400'>
                                        Không tìm thấy tài liệu
                                    </p>
                                ) : (
                                    filteredDocs.map((doc) => (
                                        <div
                                            key={doc.id}
                                            onClick={() => toggleDoc(doc.id)}
                                            className={`flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors ${selectedDocIds.includes(doc.id) ? 'border border-blue-100 bg-blue-50' : 'hover:bg-gray-50'}`}
                                        >
                                            <div
                                                className={`${selectedDocIds.includes(doc.id) ? 'text-blue-600' : 'text-gray-300'}`}
                                            >
                                                {selectedDocIds.includes(
                                                    doc.id,
                                                ) ? (
                                                    <CheckSquare size={18} />
                                                ) : (
                                                    <Square size={18} />
                                                )}
                                            </div>
                                            <div className='min-w-0 flex-1'>
                                                <p
                                                    className={`truncate text-sm ${selectedDocIds.includes(doc.id) ? 'font-semibold text-blue-700' : 'text-gray-700'}`}
                                                >
                                                    {doc.title}
                                                </p>
                                                <p className='flex items-center gap-1 text-[10px] text-gray-400'>
                                                    <FileText size={10} />{' '}
                                                    {doc.type}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            <div className='border-t border-gray-200 bg-gray-50 p-2 text-right text-xs text-gray-500'>
                                Đã chọn: {selectedDocIds.length} tài liệu
                            </div>
                        </div>
                    </div>
                </div>

                <div className='flex flex-shrink-0 justify-end gap-3 border-t bg-gray-50 p-5'>
                    <button
                        onClick={onClose}
                        className='rounded-lg border border-gray-300 bg-white px-5 py-2.5 font-semibold text-gray-700 hover:bg-gray-50'
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSave}
                        className='rounded-lg bg-[#0795DF] px-5 py-2.5 font-semibold text-white shadow-lg shadow-blue-200 hover:bg-blue-600'
                    >
                        Lưu
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddSlotModal;
