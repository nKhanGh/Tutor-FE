import { useState, useEffect } from 'react';
import { X, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { storage } from '@/utils/storage';
import { useNotification } from '@/hooks/useNotification';
import type { Session } from '@/interfaces';

interface AddProgressModalProps {
    isOpen: boolean;
    onClose: () => void;
    /** ID của session nếu được mở từ dòng cụ thể (Optional) */
    preSelectedSessionId?: string;
    /** Callback để reload dữ liệu ở trang cha sau khi lưu thành công (Optional) */
    onSuccess?: () => void;
    /** ID của kỳ dạy hiện tại để lọc session (Optional) */
    teachingPeriodId?: string;
}

type EvaluationType = 'Xuất sắc' | 'Tốt' | 'Khá' | 'Cần cải thiện';

const AddProgressModal = ({
    isOpen,
    onClose,
    preSelectedSessionId,
    onSuccess,
    teachingPeriodId,
}: AddProgressModalProps) => {
    const { user } = useAuth();
    const { showSuccessNotification, showErrorNotification } =
        useNotification();

    // State dữ liệu
    const [eligibleSessions, setEligibleSessions] = useState<Session[]>([]);
    const [selectedSessionId, setSelectedSessionId] = useState<string>('');

    // State form
    const [content, setContent] = useState<string>('');
    const [evaluation, setEvaluation] = useState<EvaluationType>('Tốt');

    // Load danh sách các buổi học "Đã hoàn thành" nhưng "Chưa có biên bản"
    useEffect(() => {
        if (isOpen && user) {
            // Sử dụng setTimeout để tránh lỗi "setState synchronously within an effect"
            const timer = setTimeout(() => {
                const allSessions = storage.getSessionsForTutor(user.id);

                // Lọc các buổi: Completed VÀ Chưa có progressNote VÀ (nếu có teachingPeriodId thì phải khớp)
                const pendingSessions = allSessions
                    .filter((s) => {
                        const isCompleted = s.status === 'completed';
                        const noNote = !s.progressNote;
                        // <--- 2. THÊM LOGIC LỌC DƯỚI ĐÂY --->
                        const matchesPeriod = teachingPeriodId
                            ? s.teachingPeriodId === teachingPeriodId
                            : true;

                        return isCompleted && noNote && matchesPeriod;
                    })
                    .sort(
                        (a, b) =>
                            new Date(b.date).getTime() -
                            new Date(a.date).getTime(),
                    );

                setEligibleSessions(pendingSessions);

                // Logic chọn session mặc định
                if (preSelectedSessionId) {
                    // Nếu ID được truyền vào, set nó (kể cả nếu nó không nằm trong list lọc bên trên thì vẫn set để hiển thị form nếu cần xử lý logic khác)
                    // Tuy nhiên để an toàn UI, ta chỉ set nếu nó tồn tại hoặc cứ set và user tự xử lý
                    setSelectedSessionId(preSelectedSessionId);
                } else if (pendingSessions.length > 0) {
                    // Nếu không truyền ID, reset về rỗng để user tự chọn
                    setSelectedSessionId('');
                } else {
                    setSelectedSessionId('');
                }

                // Reset form
                setContent('');
                setEvaluation('Tốt');
            }, 0);

            return () => clearTimeout(timer);
        }
    }, [isOpen, user, preSelectedSessionId, teachingPeriodId]);

    const handleSave = () => {
        if (!selectedSessionId) {
            showErrorNotification('Vui lòng chọn buổi học để ghi nhận.');
            return;
        }
        if (!content.trim()) {
            showErrorNotification('Vui lòng nhập nội dung nhận xét.');
            return;
        }

        // Thực hiện lưu vào LocalStorage
        // Do storage.ts không export hàm updateSession cụ thể, ta tự implement logic update tại đây
        try {
            const allSessions = storage.getSessions();
            const sessionIndex = allSessions.findIndex(
                (s) => s.id === selectedSessionId,
            );

            if (sessionIndex !== -1) {
                // Cập nhật progressNote cho session
                allSessions[sessionIndex].progressNote = {
                    content: content.trim(),
                    evaluation: evaluation,
                };

                // Lưu ngược lại localStorage
                localStorage.setItem(
                    'tutor_app_sessions',
                    JSON.stringify(allSessions),
                );

                showSuccessNotification('Đã lưu biên bản thành công!');

                // Gọi callback nếu có để trang cha reload data
                if (onSuccess) {
                    onSuccess();
                }

                onClose();
            } else {
                showErrorNotification(
                    'Không tìm thấy buổi học này trong hệ thống.',
                );
            }
        } catch (error) {
            console.error(error);
            showErrorNotification('Có lỗi xảy ra khi lưu dữ liệu.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className='animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 font-bevietnam'>
            <div className='flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-xl bg-white shadow-xl'>
                {/* Header */}
                <div className='flex items-center justify-between border-b bg-white p-5'>
                    <h2 className='text-xl font-bold text-gray-800'>
                        Thêm Ghi Nhận Tiến Độ
                    </h2>
                    <button
                        onClick={onClose}
                        className='rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600'
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className='space-y-5 overflow-y-auto p-6'>
                    {/* Select Session */}
                    <div>
                        <label className='mb-2 block text-sm font-bold text-gray-700'>
                            Chọn buổi học đã diễn ra{' '}
                            <span className='text-red-500'>*</span>
                        </label>
                        <select
                            className='w-full rounded-lg border border-gray-300 p-3 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                            value={selectedSessionId}
                            onChange={(e) =>
                                setSelectedSessionId(e.target.value)
                            }
                            disabled={!!preSelectedSessionId} // Disable nếu đã được chọn từ bên ngoài
                        >
                            <option value=''>
                                -- Vui lòng chọn buổi học --
                            </option>
                            {eligibleSessions.map((session) => (
                                <option key={session.id} value={session.id}>
                                    {session.date} - {session.title} (
                                    {session.studentName})
                                </option>
                            ))}
                            {/* Nếu có preSelectedId nhưng không nằm trong eligible (ví dụ đã có note), hiển thị option ẩn để UX không bị gãy */}
                            {preSelectedSessionId &&
                                !eligibleSessions.find(
                                    (s) => s.id === preSelectedSessionId,
                                ) && (
                                    <option value={preSelectedSessionId}>
                                        Đang chọn buổi học hiện tại...
                                    </option>
                                )}
                        </select>
                        {eligibleSessions.length === 0 &&
                            !preSelectedSessionId && (
                                <p className='mt-2 flex items-center gap-1 text-xs text-orange-500'>
                                    <AlertCircle size={12} /> Không có buổi học
                                    nào cần ghi nhận lúc này.
                                </p>
                            )}
                    </div>

                    {/* Evaluation */}
                    <div>
                        <label className='mb-2 block text-sm font-bold text-gray-700'>
                            Trạng thái tiến độ chung{' '}
                            <span className='text-red-500'>*</span>
                        </label>
                        <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
                            {(
                                [
                                    'Xuất sắc',
                                    'Tốt',
                                    'Khá',
                                    'Cần cải thiện',
                                ] as EvaluationType[]
                            ).map((level) => (
                                <button
                                    key={level}
                                    type='button'
                                    onClick={() => setEvaluation(level)}
                                    className={`rounded-lg border px-1 py-2 text-sm font-medium transition-all ${
                                        evaluation === level
                                            ? 'border-[#0795DF] bg-blue-50 text-[#0795DF]'
                                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Comment */}
                    <div>
                        <label className='mb-2 block text-sm font-bold text-gray-700'>
                            Nhận xét buổi học{' '}
                            <span className='text-red-500'>*</span>
                        </label>
                        <textarea
                            rows={5}
                            placeholder='Nội dung đã trao đổi, đánh giá mức độ tiếp thu, bài tập về nhà...'
                            className='w-full resize-none rounded-lg border border-gray-300 p-3 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className='flex justify-end gap-3 border-t bg-gray-50 p-5'>
                    <button
                        onClick={onClose}
                        className='rounded-lg border border-gray-300 bg-white px-5 py-2.5 font-semibold text-gray-700 transition-colors hover:bg-gray-100'
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSave}
                        className='flex items-center gap-2 rounded-lg bg-[#0795DF] px-6 py-2.5 font-semibold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-600 active:scale-95'
                    >
                        <Check size={18} /> Lưu ghi nhận
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddProgressModal;
