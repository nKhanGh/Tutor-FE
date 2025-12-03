import React, { useState, useEffect } from 'react';
import { X, Edit, AlertCircle } from 'lucide-react';
import Sidebar from '@/components/layouts/Sidebar';
import { useNotification } from '@/hooks/useNotification';
import { useAuth } from '@/contexts/AuthContext';
import { storage } from '@/utils/storage';
import { type ProgramRegistration, type StudentProfile } from '@/interfaces';

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

const RegisterProgram: React.FC = () => {
    const { user } = useAuth();
    const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(
        null,
    );
    const { showSuccessNotification, showErrorNotification } =
        useNotification();

    const [isRegistered, setIsRegistered] = useState<boolean>(false);
    const [registrationData, setRegistrationData] =
        useState<ProgramRegistration | null>(null);

    // Form State
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

    const [errors, setErrors] = useState<FormErrors>({
        subjects: '',
        specificSubjects: '',
        challenges: '',
        goals: '',
    });

    // Load dữ liệu từ Storage khi component mount
    useEffect(() => {
        const timer = setTimeout(() => {
            if (user) {
                const savedReg = storage.getRegistrationByStudentId(user.id);
                if (savedReg) {
                    setRegistrationData(savedReg);
                    setIsRegistered(true);
                    // Fill form data để nếu user muốn edit thì có sẵn
                    setFormData({
                        subjects: savedReg.subjects,
                        specificSubjects: savedReg.specificSubjects,
                        challenges: savedReg.challenges,
                        goals: savedReg.goals,
                        frequency: savedReg.frequency,
                        format: savedReg.format,
                        availability: savedReg.availability,
                        additionalInfo: savedReg.additionalInfo,
                    });
                }
                const allStudents = storage.getAllStudents();
                const profile =
                    allStudents.find((s) => s.id === user.id) || null;
                setStudentProfile(profile);
            }
        }, 0);
        return () => clearTimeout(timer);
    }, [user]);

    const subjectOptions = [
        'Toán học',
        'Tiếng Anh',
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

    const handleSubjectToggle = (subject: string) => {
        setFormData((prev) => ({
            ...prev,
            subjects: prev.subjects.includes(subject)
                ? prev.subjects.filter((s) => s !== subject)
                : [...prev.subjects, subject],
        }));
        if (errors.subjects) setErrors((prev) => ({ ...prev, subjects: '' }));
    };

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (field in errors)
            setErrors((prev) => ({ ...prev, [field as keyof FormErrors]: '' }));
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {
            subjects: '',
            specificSubjects: '',
            challenges: '',
            goals: '',
        };
        let isValid = true;

        if (formData.subjects.length === 0) {
            newErrors.subjects = 'Vui lòng chọn ít nhất một lĩnh vực';
            isValid = false;
        }
        if (!formData.specificSubjects.trim()) {
            newErrors.specificSubjects = 'Vui lòng nhập môn học cụ thể';
            isValid = false;
        }
        if (!formData.challenges.trim()) {
            newErrors.challenges = 'Vui lòng mô tả khó khăn';
            isValid = false;
        }
        if (!formData.goals.trim()) {
            newErrors.goals = 'Vui lòng nhập mục tiêu';
            isValid = false;
        }

        setErrors(newErrors);
        if (!isValid)
            showErrorNotification(
                'Vui lòng kiểm tra lại các thông tin bắt buộc',
            );
        return isValid;
    };

    const handleSubmit = () => {
        if (!user) return;
        if (validateForm()) {
            const newReg: ProgramRegistration = {
                id: registrationData?.id || `#TM${Date.now()}`,
                studentId: user.id,
                studentName: user.name,
                ...formData,
                status: 'pending',
                createdAt:
                    registrationData?.createdAt ||
                    new Date().toLocaleDateString('vi-VN'),
            };
            storage.saveRegistration(newReg);
            setRegistrationData(newReg);
            setIsRegistered(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            showSuccessNotification('Đăng ký thành công!');
        }
    };

    // Render: Màn hình ĐÃ ĐĂNG KÝ
    if (isRegistered && registrationData) {
        return (
            <>
                <Sidebar />
                <div className='ml-[80px] min-h-screen bg-blue-50 sm:p-4 md:ml-[260px] md:p-6'>
                    <div className='mx-auto'>
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
                                    {registrationData.id}
                                </div>
                            </div>
                            <div className='rounded-2xl border-l-4 border-blue-400 bg-white p-6 shadow-sm'>
                                <div className='mb-1 text-sm text-gray-600'>
                                    Ngày đăng kí
                                </div>
                                <div className='text-xl font-bold text-gray-800'>
                                    {registrationData.createdAt}
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
                                <div className='mb-6 grid grid-cols-2 gap-6 lg:grid-cols-2'>
                                    <div>
                                        <div className='mb-1 text-sm font-semibold text-gray-700'>
                                            Mã số sinh viên
                                        </div>
                                        <div className='text-gray-800'>
                                            {studentProfile?.mssv}
                                        </div>
                                    </div>
                                    <div>
                                        <div className='mb-1 text-sm font-semibold text-gray-700'>
                                            Họ và tên
                                        </div>
                                        <div className='text-gray-800'>
                                            {studentProfile?.name}
                                        </div>
                                    </div>
                                    <div className='lg:hidden'>
                                        <div className='mb-1 text-sm font-semibold text-gray-700'>
                                            Ngày sinh
                                        </div>
                                        <div className='text-gray-800'>
                                            {studentProfile?.dob}
                                        </div>
                                    </div>
                                </div>
                                <div className='mb-6 grid grid-cols-2 gap-6 lg:grid-cols-3'>
                                    <div className='hidden lg:block'>
                                        <div className='mb-1 text-sm font-semibold text-gray-700'>
                                            Ngày sinh
                                        </div>
                                        <div className='text-gray-800'>
                                            {studentProfile?.dob}
                                        </div>
                                    </div>
                                    <div>
                                        <div className='mb-1 text-sm font-semibold text-gray-700'>
                                            Giới tính
                                        </div>
                                        <div className='text-gray-800'>
                                            {studentProfile?.gender}
                                        </div>
                                    </div>
                                    <div>
                                        <div className='mb-1 text-sm font-semibold text-gray-700'>
                                            Số CCCD
                                        </div>
                                        <div className='text-gray-800'>
                                            {studentProfile?.cccd}
                                        </div>
                                    </div>
                                </div>
                                <div className='grid gap-6 lg:grid-cols-3'>
                                    <div>
                                        <div className='mb-1 text-sm font-semibold text-gray-700'>
                                            Số điện thoại
                                        </div>
                                        <div className='text-gray-800'>
                                            {studentProfile?.phone}
                                        </div>
                                    </div>
                                    <div>
                                        <div className='mb-1 text-sm font-semibold text-gray-700'>
                                            Email
                                        </div>
                                        <div className='text-gray-800'>
                                            {studentProfile?.email}
                                        </div>
                                    </div>
                                    <div>
                                        <div className='mb-1 text-sm font-semibold text-gray-700'>
                                            Khoa
                                        </div>
                                        <div className='text-gray-800'>
                                            {studentProfile?.major}
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
                                onClick={() => setIsRegistered(false)}
                                className='flex items-center gap-2 rounded-lg border-2 border-blue-500 bg-white px-1 py-3 font-semibold text-blue-500 transition-colors hover:bg-blue-50 md:px-6'
                            >
                                <Edit size={20} />
                                Cập nhật thông tin
                            </button>
                            <button
                                onClick={() => {
                                    if (window.confirm('Hủy đăng ký?')) {
                                        const periods =
                                            storage.getTeachingActivePeriodsForStudent(
                                                user!.id,
                                            );
                                        if (periods.length > 0) {
                                            showErrorNotification(
                                                'Không thể hủy đăng ký khi đang trong kỳ dạy với Tutor. Vui lòng liên hệ điều phối viên để được hỗ trợ.',
                                            );
                                            return;
                                        }
                                        setIsRegistered(false);
                                        storage.deleteRegistrationByStudentId(
                                            user!.id,
                                        );
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
                                }}
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

    // Render: Form ĐĂNG KÝ
    return (
        <>
            <Sidebar />
            <div className='ml-[80px] min-h-screen bg-blue-50 p-3 pt-4 font-bevietnam sm:p-4 md:ml-[260px] md:p-6'>
                <div className='mx-auto'>
                    <div className='mb-8'>
                        <h1 className='mb-2 text-3xl font-bold text-gray-800'>
                            Đăng ký tham gia Tutor/Mentor
                        </h1>
                        <p className='text-gray-600'>
                            Điền thông tin để chúng tôi tìm kiếm Tutor phù hợp
                            nhất cho bạn.
                        </p>
                    </div>

                    <div className='overflow-hidden rounded-2xl bg-white shadow-sm'>
                        <div className='space-y-8 p-8'>
                            {/* Section 1 */}
                            <section>
                                <h3 className='mb-4 border-b pb-2 text-lg font-bold text-gray-800'>
                                    1. Nhu cầu học tập
                                </h3>
                                <div className='space-y-6'>
                                    <div>
                                        <label className='mb-3 block text-sm font-semibold text-gray-700'>
                                            Lĩnh vực cần hỗ trợ{' '}
                                            <span className='text-red-500'>
                                                *
                                            </span>
                                        </label>
                                        <div className='grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4'>
                                            {subjectOptions.map((sub) => (
                                                <label
                                                    htmlFor={`subject-${sub}`}
                                                    key={sub}
                                                    className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 transition-all ${formData.subjects.includes(sub) ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200 hover:bg-gray-50'}`}
                                                >
                                                    <input
                                                        id={`subject-${sub}`}
                                                        type='checkbox'
                                                        className='h-4 w-4 rounded text-blue-600 focus:ring-blue-500'
                                                        checked={formData.subjects.includes(
                                                            sub,
                                                        )}
                                                        onChange={() =>
                                                            handleSubjectToggle(
                                                                sub,
                                                            )
                                                        }
                                                    />
                                                    <span className='text-sm text-gray-700'>
                                                        {sub}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                        {errors.subjects && (
                                            <p className='mt-2 flex items-center gap-1 text-sm text-red-500'>
                                                <AlertCircle size={14} />{' '}
                                                {errors.subjects}
                                            </p>
                                        )}
                                    </div>

                                    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                                        <div>
                                            <label
                                                htmlFor='specificSubjects'
                                                className='mb-2 block text-sm font-semibold text-gray-700'
                                            >
                                                Môn học cụ thể{' '}
                                                <span className='text-red-500'>
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                id='specificSubjects'
                                                type='text'
                                                className={`w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500 ${errors.specificSubjects ? 'border-red-500' : 'border-gray-300'}`}
                                                placeholder='VD: Giải tích 1, Cấu trúc dữ liệu...'
                                                value={
                                                    formData.specificSubjects
                                                }
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        'specificSubjects',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            {errors.specificSubjects && (
                                                <p className='mt-1 text-sm text-red-500'>
                                                    {errors.specificSubjects}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label
                                                htmlFor='goals'
                                                className='mb-2 block text-sm font-semibold text-gray-700'
                                            >
                                                Mục tiêu đạt được{' '}
                                                <span className='text-red-500'>
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                id='goals'
                                                type='text'
                                                className={`w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500 ${errors.goals ? 'border-red-500' : 'border-gray-300'}`}
                                                placeholder='VD: Đạt điểm A, Hiểu rõ bản chất...'
                                                value={formData.goals}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        'goals',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            {errors.goals && (
                                                <p className='mt-1 text-sm text-red-500'>
                                                    {errors.goals}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor='challenges'
                                            className='mb-2 block text-sm font-semibold text-gray-700'
                                        >
                                            Khó khăn hiện tại{' '}
                                            <span className='text-red-500'>
                                                *
                                            </span>
                                        </label>
                                        <textarea
                                            id='challenges'
                                            rows={3}
                                            className={`w-full resize-none rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500 ${errors.challenges ? 'border-red-500' : 'border-gray-300'}`}
                                            placeholder='Mô tả ngắn gọn khó khăn bạn đang gặp phải...'
                                            value={formData.challenges}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    'challenges',
                                                    e.target.value,
                                                )
                                            }
                                        ></textarea>
                                        {errors.challenges && (
                                            <p className='mt-1 text-sm text-red-500'>
                                                {errors.challenges}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </section>

                            {/* Section 2 */}
                            <section>
                                <h3 className='mb-4 border-b pb-2 text-lg font-bold text-gray-800'>
                                    2. Thời gian & Hình thức
                                </h3>
                                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                                    <div>
                                        <label
                                            htmlFor='format'
                                            className='mb-2 block text-sm font-semibold text-gray-700'
                                        >
                                            Hình thức học
                                        </label>
                                        <select
                                            id='format'
                                            className='w-full rounded-lg border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-blue-500'
                                            value={formData.format}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    'format',
                                                    e.target.value,
                                                )
                                            }
                                        >
                                            <option value=''>
                                                -- Chọn hình thức --
                                            </option>
                                            <option value='Online'>
                                                Trực tuyến (Online)
                                            </option>
                                            <option value='Offline'>
                                                Trực tiếp (Offline)
                                            </option>
                                            <option value='Hybrid'>
                                                Linh hoạt
                                            </option>
                                        </select>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor='frequency'
                                            className='mb-2 block text-sm font-semibold text-gray-700'
                                        >
                                            Tần suất mong muốn
                                        </label>
                                        <select
                                            id='frequency'
                                            className='w-full rounded-lg border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-blue-500'
                                            value={formData.frequency}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    'frequency',
                                                    e.target.value,
                                                )
                                            }
                                        >
                                            <option value=''>
                                                -- Chọn tần suất --
                                            </option>
                                            <option value='1 buổi/tuần'>
                                                1 buổi / tuần
                                            </option>
                                            <option value='2 buổi/tuần'>
                                                2 buổi / tuần
                                            </option>
                                            <option value='3 buổi/tuần'>
                                                3 buổi / tuần
                                            </option>
                                        </select>
                                    </div>
                                    <div className='md:col-span-2'>
                                        <label
                                            htmlFor='availability'
                                            className='mb-2 block text-sm font-semibold text-gray-700'
                                        >
                                            Thời gian rảnh (Dự kiến)
                                        </label>
                                        <input
                                            id='availability'
                                            type='text'
                                            className='w-full rounded-lg border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-blue-500'
                                            placeholder='VD: Thứ 2 (13h-17h), Thứ 6 (Cả ngày)...'
                                            value={formData.availability}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    'availability',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                    <div className='md:col-span-2'>
                                        <label
                                            htmlFor='additionalInfo'
                                            className='mb-2 block text-sm font-semibold text-gray-700'
                                        >
                                            Thông tin bổ sung{' '}
                                        </label>
                                        <textarea
                                            id='additionalInfo'
                                            rows={3}
                                            className={`w-full resize-none rounded-lg border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-blue-500`}
                                            placeholder='Mô tả thêm thông tin bạn muốn cung cấp...'
                                            value={formData.additionalInfo}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    'additionalInfo',
                                                    e.target.value,
                                                )
                                            }
                                        ></textarea>
                                    </div>
                                </div>
                            </section>

                            <div className='flex justify-center pt-4'>
                                <button
                                    onClick={handleSubmit}
                                    className='transform rounded-full bg-[#0795DF] px-8 py-3 font-bold text-white shadow-lg transition-all hover:bg-blue-600 hover:shadow-xl active:scale-95'
                                >
                                    Gửi đăng ký ngay
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RegisterProgram;
