import React, { useState } from 'react';
import { X, Edit } from 'lucide-react';
import Sidebar from '@/components/layouts/Sidebar';
import { useNotification } from '@/hooks/useNotification';

interface FormData {
    subjects: string[];
    specificSubjects: string;
    challenges: string;
    goals: string;
    frequency: string;
    format: string;
    availability: string;
    additionalInfo: string;
}

interface FormErrors {
    subjects: string;
    specificSubjects: string;
    challenges: string;
    goals: string;
}

type SubjectOption =
    | 'Toán học'
    | 'Tiếng anh'
    | 'Vật lý'
    | 'Lập trình'
    | 'Sinh học'
    | 'Cơ học'
    | 'Hóa học'
    | 'Chính trị'
    | 'Điện tử'
    | 'Kỹ năng mềm'
    | 'Kỹ năng nghiên cứu'
    | 'Khác';

const RegisterProgram: React.FC = () => {
    const [isRegistered, setIsRegistered] = useState<boolean>(false);
    const [formData, setFormData] = useState<FormData>({
        subjects: [],
        specificSubjects: '',
        challenges: '',
        goals: '',
        frequency: '',
        format: '',
        availability: '',
        additionalInfo: '',
    });
    const { showSuccessNotification, showErrorNotification } =
        useNotification();

    const [errors, setErrors] = useState<FormErrors>({
        subjects: '',
        specificSubjects: '',
        challenges: '',
        goals: '',
    });

    const subjectOptions: SubjectOption[] = [
        'Toán học',
        'Tiếng anh',
        'Vật lý',
        'Lập trình',
        'Sinh học',
        'Cơ học',
        'Hóa học',
        'Chính trị',
        'Điện tử',
        'Kỹ năng mềm',
        'Kỹ năng nghiên cứu',
        'Khác',
    ];

    const handleSubjectToggle = (subject: SubjectOption): void => {
        setFormData((prev) => ({
            ...prev,
            subjects: prev.subjects.includes(subject)
                ? prev.subjects.filter((s) => s !== subject)
                : [...prev.subjects, subject],
        }));
        if (errors.subjects) {
            setErrors((prev) => ({ ...prev, subjects: '' }));
        }
    };

    const handleInputChange = (field: keyof FormData, value: string): void => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (field in errors) {
            setErrors((prev) => ({ ...prev, [field as keyof FormErrors]: '' }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {
            subjects: '',
            specificSubjects: '',
            challenges: '',
            goals: '',
        };

        if (formData.subjects.length === 0) {
            newErrors.subjects =
                'Vui lòng chọn ít nhất một lĩnh vực cần hỗ trợ';
            showErrorNotification?.(
                'Vui lòng chọn ít nhất một lĩnh vực cần hỗ trợ',
            );
        }
        if (!formData.specificSubjects.trim()) {
            newErrors.specificSubjects = 'Vui lòng nhập các môn học cụ thể';
            showErrorNotification?.('Vui lòng nhập các môn học cụ thể');
        }

        if (!formData.challenges.trim()) {
            newErrors.challenges = 'Vui lòng mô tả khó khăn hiện tại của bạn';
            showErrorNotification?.('Vui lòng mô tả khó khăn hiện tại của bạn');
        }

        if (!formData.goals.trim()) {
            newErrors.goals = 'Vui lòng nhập mục tiêu muốn đạt được';
            showErrorNotification?.('Vui lòng nhập mục tiêu muốn đạt được');
        }

        setErrors(newErrors);
        return Object.values(newErrors).every((error) => error === '');
    };

    const handleSubmit = (): void => {
        if (validateForm()) {
            setIsRegistered(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            showSuccessNotification?.('Đăng ký thành công!');
        }
    };

    const handleEdit = (): void => {
        setIsRegistered(false);
    };

    const handleCancel = (): void => {
        if (globalThis.confirm('Bạn có chắc chắn muốn hủy đăng ký?')) {
            setIsRegistered(false);
            setFormData({
                subjects: [],
                specificSubjects: '',
                challenges: '',
                goals: '',
                frequency: '',
                format: '',
                availability: '',
                additionalInfo: '',
            });
        }
    };

    if (isRegistered) {
        return (
            <>
                <Sidebar />
                <div className='ml-[80px] min-h-screen bg-blue-50 p-6 md:ml-[260px]'>
                    <div className='mx-auto max-w-6xl'>
                        {/* Header */}
                        <div className='mb-8'>
                            <h1 className='mb-2 text-3xl font-bold text-gray-800'>
                                Đăng ký vào hệ thống Tutor!
                            </h1>
                            <p className='text-gray-600'>
                                Bạn đã đăng kí vào hệ thống tutor thành công
                            </p>
                        </div>

                        {/* Info Cards */}
                        <div className='mb-8 grid gap-6 lg:grid-cols-3'>
                            <div className='rounded-2xl border-l-4 border-blue-400 bg-white p-6 shadow-sm'>
                                <div className='mb-1 text-sm text-gray-600'>
                                    Mã Đăng kí
                                </div>
                                <div className='text-xl font-bold text-gray-800'>
                                    #TM2025001
                                </div>
                            </div>
                            <div className='rounded-2xl border-l-4 border-blue-400 bg-white p-6 shadow-sm'>
                                <div className='mb-1 text-sm text-gray-600'>
                                    Ngày đăng kí
                                </div>
                                <div className='text-xl font-bold text-gray-800'>
                                    25/10/2025
                                </div>
                            </div>
                            <div className='rounded-2xl border-l-4 border-blue-400 bg-white p-6 shadow-sm'>
                                <div className='mb-1 text-sm text-gray-600'>
                                    Lĩnh vực
                                </div>
                                <div className='text-xl font-bold text-gray-800'>
                                    {formData.subjects.slice(0, 3).join(', ')}
                                    {formData.subjects.length > 3 ? '...' : ''}
                                </div>
                            </div>
                        </div>

                        {/* Student Info */}
                        <div className='mb-6 overflow-hidden rounded-2xl bg-white shadow-sm'>
                            <div className='bg-blue-400 px-6 py-4 text-white'>
                                <h2 className='text-xl font-bold'>
                                    Thông tin sinh viên
                                </h2>
                            </div>
                            <div className='p-6'>
                                <div className='mb-6 grid grid-cols-2 gap-6 lg:grid-cols-3'>
                                    <div>
                                        <div className='mb-1 text-sm font-semibold text-gray-700'>
                                            Mã số sinh viên
                                        </div>
                                        <div className='text-gray-800'>
                                            2311449
                                        </div>
                                    </div>
                                    <div>
                                        <div className='mb-1 text-sm font-semibold text-gray-700'>
                                            Họ và tên lót
                                        </div>
                                        <div className='text-gray-800'>
                                            Nguyễn Hữu
                                        </div>
                                    </div>
                                    <div>
                                        <div className='mb-1 text-sm font-semibold text-gray-700'>
                                            Tên
                                        </div>
                                        <div className='text-gray-800'>
                                            Khang
                                        </div>
                                    </div>
                                    <div className='lg:hidden'>
                                        <div className='mb-1 text-sm font-semibold text-gray-700'>
                                            Ngày sinh
                                        </div>
                                        <div className='text-gray-800'>
                                            14/10/2005
                                        </div>
                                    </div>
                                </div>
                                <div className='mb-6 grid grid-cols-2 gap-6 lg:grid-cols-3'>
                                    <div className='hidden lg:block'>
                                        <div className='mb-1 text-sm font-semibold text-gray-700'>
                                            Ngày sinh
                                        </div>
                                        <div className='text-gray-800'>
                                            14/10/2005
                                        </div>
                                    </div>
                                    <div>
                                        <div className='mb-1 text-sm font-semibold text-gray-700'>
                                            Giới tính
                                        </div>
                                        <div className='text-gray-800'>Nam</div>
                                    </div>
                                    <div>
                                        <div className='mb-1 text-sm font-semibold text-gray-700'>
                                            Số CCCD
                                        </div>
                                        <div className='text-gray-800'>
                                            056205123456
                                        </div>
                                    </div>
                                </div>
                                <div className='grid gap-6 lg:grid-cols-3'>
                                    <div>
                                        <div className='mb-1 text-sm font-semibold text-gray-700'>
                                            Số điện thoại
                                        </div>
                                        <div className='text-gray-800'>
                                            0123456789
                                        </div>
                                    </div>
                                    <div>
                                        <div className='mb-1 text-sm font-semibold text-gray-700'>
                                            Email
                                        </div>
                                        <div className='text-gray-800'>
                                            kh.nkh14@hcmut.edu.vn
                                        </div>
                                    </div>
                                    <div>
                                        <div className='mb-1 text-sm font-semibold text-gray-700'>
                                            Khoa
                                        </div>
                                        <div className='text-gray-800'>
                                            Khoa học & kĩ thuật máy tính
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Registration Info */}
                        <div className='mb-8 overflow-hidden rounded-2xl bg-white shadow-sm'>
                            <div className='bg-blue-400 px-6 py-4 text-white'>
                                <h2 className='text-xl font-bold'>
                                    Thông tin đã đăng kí
                                </h2>
                            </div>
                            <div className='p-6'>
                                <div className='mb-6 grid gap-8 md:grid-cols-2'>
                                    <div>
                                        <div className='mb-2 text-sm font-semibold text-gray-700'>
                                            Lĩnh vực cần hỗ trợ
                                        </div>
                                        <div className='text-gray-800'>
                                            {formData.subjects.join(', ')}
                                        </div>
                                    </div>
                                    <div>
                                        <div className='mb-2 text-sm font-semibold text-gray-700'>
                                            Môn học cụ thể
                                        </div>
                                        <div className='text-gray-800'>
                                            {formData.specificSubjects}
                                        </div>
                                    </div>
                                </div>
                                <div className='mb-6 grid gap-8 md:grid-cols-2'>
                                    <div>
                                        <div className='mb-2 text-sm font-semibold text-gray-700'>
                                            Khó khăn hiện tại
                                        </div>
                                        <div className='text-gray-800'>
                                            {formData.challenges}
                                        </div>
                                    </div>
                                    <div>
                                        <div className='mb-2 text-sm font-semibold text-gray-700'>
                                            Mục tiêu muốn đạt được
                                        </div>
                                        <div className='text-gray-800'>
                                            {formData.goals}
                                        </div>
                                    </div>
                                </div>
                                <div className='mb-6 grid gap-8 md:grid-cols-2'>
                                    <div>
                                        <div className='mb-2 text-sm font-semibold text-gray-700'>
                                            Tần suất buổi học mong muốn
                                        </div>
                                        <div className='text-gray-800'>
                                            {formData.frequency ||
                                                'Chưa cung cấp'}
                                        </div>
                                    </div>
                                    <div>
                                        <div className='mb-2 text-sm font-semibold text-gray-700'>
                                            Hình thức học tập mong muốn
                                        </div>
                                        <div className='text-gray-800'>
                                            {formData.format || 'Chưa cung cấp'}
                                        </div>
                                    </div>
                                </div>
                                <div className='mb-6'>
                                    <div className='mb-2 text-sm font-semibold text-gray-700'>
                                        Thời gian có thể tham gia
                                    </div>
                                    <div className='text-gray-800'>
                                        {formData.availability ||
                                            'Chưa cung cấp'}
                                    </div>
                                </div>
                                <div>
                                    <div className='mb-2 text-sm font-semibold text-gray-700'>
                                        Thông tin bổ sung
                                    </div>
                                    <div className='text-gray-800'>
                                        {formData.additionalInfo ||
                                            'Không có thông tin bổ sung'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className='flex justify-center gap-2 md:gap-4'>
                            <button
                                onClick={handleEdit}
                                className='flex items-center gap-2 rounded-lg border-2 border-blue-500 bg-white px-1 py-3 font-semibold text-blue-500 transition-colors hover:bg-blue-50 md:px-6'
                            >
                                <Edit size={20} />
                                Cập nhật thông tin
                            </button>
                            <button
                                onClick={handleCancel}
                                className='flex items-center gap-2 rounded-lg border-2 border-red-500 bg-white px-6 py-3 font-semibold text-red-500 transition-colors hover:bg-red-50'
                            >
                                <X size={20} />
                                Hủy đăng ký
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Sidebar />
            <div className='ml-[80px] min-h-screen bg-blue-50 p-6 md:ml-[260px]'>
                <div className='mx-auto w-full'>
                    {/* Header */}
                    <div className='mb-8'>
                        <h1 className='mb-2 text-3xl font-bold text-gray-800'>
                            Đăng ký vào hệ thống Tutor!
                        </h1>
                        <p className='text-gray-600'>
                            Hãy điền những thông tin cần thiết để chúng tôi có
                            thể hiểu rõ nhu cầu của bạn và đề xuất tutor phù hợp
                            nhất
                        </p>
                    </div>

                    {/* Form Section 1 */}
                    <div className='mb-6 overflow-hidden rounded-2xl bg-white shadow-sm'>
                        <div className='bg-blue-400 px-6 py-4 text-white'>
                            <h2 className='text-xl font-bold'>
                                Thông tin nhu cầu học tập
                            </h2>
                        </div>
                        <div className='p-6'>
                            {/* Subject Selection */}
                            <div className='mb-6'>
                                <label className='mb-2 block text-sm font-semibold text-gray-700'>
                                    Lĩnh vực cần hỗ trợ{' '}
                                    <span className='text-red-500'>*</span>
                                </label>
                                <p className='mb-3 text-xs text-gray-500'>
                                    Chọn các môn học hoặc lĩnh vực bạn muốn cải
                                    thiện (có thể chọn nhiều)
                                </p>
                                <div className='grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4'>
                                    {subjectOptions.map(
                                        (subject: SubjectOption) => (
                                            <label
                                                key={subject}
                                                className='flex cursor-pointer items-center gap-2 rounded-lg border p-3 hover:bg-gray-50'
                                            >
                                                <input
                                                    type='checkbox'
                                                    checked={formData.subjects.includes(
                                                        subject,
                                                    )}
                                                    onChange={() =>
                                                        handleSubjectToggle(
                                                            subject,
                                                        )
                                                    }
                                                    className='h-4 w-4'
                                                />
                                                <span className='text-sm text-gray-700'>
                                                    {subject}
                                                </span>
                                            </label>
                                        ),
                                    )}
                                </div>
                                {errors.subjects && (
                                    <p className='mt-2 text-sm text-red-500'>
                                        ⚠ {errors.subjects}
                                    </p>
                                )}
                            </div>

                            {/* Two Column Layout */}
                            <div className='mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2'>
                                <div>
                                    <label className='mb-2 block text-sm font-semibold text-gray-700'>
                                        Các môn học cụ thể{' '}
                                        <span className='text-red-500'>*</span>
                                    </label>
                                    <textarea
                                        value={formData.specificSubjects}
                                        onChange={(e) =>
                                            handleInputChange(
                                                'specificSubjects',
                                                e.target.value,
                                            )
                                        }
                                        placeholder='Ví dụ: Giải tích 1'
                                        className={`h-32 w-full resize-none rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.specificSubjects ? 'border-red-500' : ''}`}
                                    />
                                    {errors.specificSubjects && (
                                        <p className='mt-1 text-sm text-red-500'>
                                            ⚠ {errors.specificSubjects}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className='mb-2 block text-sm font-semibold text-gray-700'>
                                        Khó khăn hiện tại{' '}
                                        <span className='text-red-500'>*</span>
                                    </label>
                                    <textarea
                                        value={formData.challenges}
                                        onChange={(e) =>
                                            handleInputChange(
                                                'challenges',
                                                e.target.value,
                                            )
                                        }
                                        placeholder='Ví dụ: Khó khăn trong việc áp lập trình'
                                        className={`h-32 w-full resize-none rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.challenges ? 'border-red-500' : ''}`}
                                    />
                                    {errors.challenges && (
                                        <p className='mt-1 text-sm text-red-500'>
                                            ⚠ {errors.challenges}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Goals */}
                            <div className='mb-6'>
                                <label className='mb-2 block text-sm font-semibold text-gray-700'>
                                    Mục tiêu muốn đạt được{' '}
                                    <span className='text-red-500'>*</span>
                                </label>
                                <textarea
                                    value={formData.goals}
                                    onChange={(e) =>
                                        handleInputChange(
                                            'goals',
                                            e.target.value,
                                        )
                                    }
                                    placeholder='Ví dụ: Cải thiện điểm số từ B lên A+, nâng cao kĩ năng lập trình, chuẩn bị tốt cho kì thi cuối kì'
                                    className={`h-24 w-full resize-none rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.goals ? 'border-red-500' : ''}`}
                                />
                                {errors.goals && (
                                    <p className='mt-1 text-sm text-red-500'>
                                        ⚠ {errors.goals}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Form Section 2 */}
                    <div className='mb-8 overflow-hidden rounded-2xl bg-white shadow-sm'>
                        <div className='bg-blue-400 px-6 py-4 text-white'>
                            <h2 className='text-xl font-bold'>
                                Lịch trình và hình thức học tập
                            </h2>
                        </div>
                        <div className='p-6'>
                            <div className='mb-6 grid grid-cols-1 gap-6 md:grid-cols-2'>
                                <div>
                                    <label
                                        htmlFor='frequency'
                                        className='mb-2 block text-sm font-semibold text-gray-700'
                                    >
                                        Tần suất buổi học mong muốn
                                    </label>
                                    <select
                                        id='frequency'
                                        value={formData.frequency}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                frequency: e.target.value,
                                            })
                                        }
                                        className='w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-400'
                                    >
                                        <option value=''>
                                            -- Chọn tần suất --
                                        </option>
                                        <option value='1 buổi/tuần'>
                                            1 buổi/tuần
                                        </option>
                                        <option value='2 buổi/tuần'>
                                            2 buổi/tuần
                                        </option>
                                        <option value='3 buổi/tuần'>
                                            3 buổi/tuần
                                        </option>
                                        <option value='Linh hoạt'>
                                            Linh hoạt
                                        </option>
                                    </select>
                                </div>
                                <div>
                                    <label
                                        htmlFor='format'
                                        className='mb-2 block text-sm font-semibold text-gray-700'
                                    >
                                        Hình thức học tập mong muốn
                                    </label>
                                    <select
                                        id='format'
                                        value={formData.format}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                format: e.target.value,
                                            })
                                        }
                                        className='w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-400'
                                    >
                                        <option value=''>
                                            -- Chọn hình thức --
                                        </option>
                                        <option value='Trực tuyến'>
                                            Trực tuyến
                                        </option>
                                        <option value='Trực tiếp'>
                                            Trực tiếp
                                        </option>
                                        <option value='Linh hoạt theo nhu cầu'>
                                            Linh hoạt theo nhu cầu
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div className='mb-6'>
                                <label
                                    htmlFor='availability'
                                    className='mb-2 block text-sm font-semibold text-gray-700'
                                >
                                    Thời gian có thể tham gia
                                </label>
                                <textarea
                                    id='availability'
                                    value={formData.availability}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            availability: e.target.value,
                                        })
                                    }
                                    placeholder='Ví dụ: Thứ 2, 4 khung giờ 15h-17h'
                                    className='h-24 w-full resize-none rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-400'
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor='additionalInfo'
                                    className='mb-2 block text-sm font-semibold text-gray-700'
                                >
                                    Thông tin bổ sung
                                </label>
                                <textarea
                                    id='additionalInfo'
                                    name='additionalInfo'
                                    value={formData.additionalInfo}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            additionalInfo: e.target.value,
                                        })
                                    }
                                    placeholder='Thông tin bổ sung về yêu cầu, sở thích,... để chúng tôi tìm kiếm tutor phù hợp'
                                    className='h-32 w-full resize-none rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-400'
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className='flex justify-center'>
                    <button
                        onClick={handleSubmit}
                        className='flex items-center gap-2 rounded-lg bg-blue-500 px-8 py-3 font-semibold text-white transition-colors hover:bg-blue-600'
                    >
                        ✓ Đăng kí ngay
                    </button>
                </div>
            </div>
        </>
    );
};

export default RegisterProgram;
