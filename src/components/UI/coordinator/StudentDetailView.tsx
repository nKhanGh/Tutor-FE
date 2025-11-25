import { ArrowLeft, BarChart } from 'lucide-react';
import type { StudentProfile } from '@/interfaces'; // Cập nhật import

interface StudentDetailViewProps {
    student: StudentProfile | null; // Cập nhật type
    onBack: () => void;
}

const StudentDetailView: React.FC<StudentDetailViewProps> = ({
    student,
    onBack,
}) => {
    // Mock stats trực tiếp ở đây thay vì import
    const stats = {
        tutors: 2,
        sessions: 15,
        courses: 4,
    };

    return (
        <div className='h-full'>
            <div className='mb-4 flex items-center gap-3'>
                <button
                    onClick={onBack}
                    className='flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-600 shadow-sm transition hover:bg-gray-100'
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 className='text-2xl font-bold text-gray-800'>
                    Thông tin sinh viên
                </h1>
            </div>
            <div className='overflow-hidden rounded-2xl bg-white shadow-sm'>
                <div className='flex items-center gap-4 bg-gradient-to-br from-[#00C0EF] to-[#0795DF] p-6'>
                    <div className='flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-white text-3xl font-bold text-blue-600'>
                        {student?.name.charAt(0)}
                    </div>
                    <div>
                        <h2 className='text-2xl font-bold text-white'>
                            {student?.name}
                        </h2>
                        <p className='text-base text-white opacity-90'>
                            Sinh viên - {student?.major}
                        </p>
                    </div>
                </div>
                <div className='grid grid-cols-1 gap-x-8 gap-y-6 p-6 md:grid-cols-3'>
                    <div>
                        <label className='text-sm text-gray-500'>MSSV</label>
                        <p className='font-medium text-gray-800'>
                            {student?.mssv}
                        </p>
                    </div>
                    <div>
                        <label className='text-sm text-gray-500'>
                            Họ và tên
                        </label>
                        <p className='font-medium text-gray-800'>
                            {student?.name}
                        </p>
                    </div>
                    <div>
                        <label className='text-sm text-gray-500'>
                            Ngày sinh
                        </label>
                        <p className='font-medium text-gray-800'>
                            {student?.dob}
                        </p>
                    </div>
                    <div>
                        <label className='text-sm text-gray-500'>
                            Giới tính
                        </label>
                        <p className='font-medium text-gray-800'>
                            {student?.gender}
                        </p>
                    </div>
                    <div>
                        <label className='text-sm text-gray-500'>Số CCCD</label>
                        <p className='font-medium text-gray-800'>
                            {student?.cccd}
                        </p>
                    </div>
                    <div>
                        <label className='text-sm text-gray-500'>
                            Số điện thoại
                        </label>
                        <p className='font-medium text-gray-800'>
                            {student?.phone}
                        </p>
                    </div>
                    <div>
                        <label className='text-sm text-gray-500'>Email</label>
                        <p className='font-medium text-gray-800'>
                            {student?.email}
                        </p>
                    </div>
                </div>

                <div className='border-t border-gray-100 p-6'>
                    <div className='mb-4 flex items-center gap-2'>
                        <BarChart size={20} className='text-gray-700' />
                        <h3 className='text-xl font-bold text-gray-800'>
                            Thống kê học tập
                        </h3>
                    </div>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                        <div className='rounded-xl bg-blue-100 p-4 text-center'>
                            <p className='text-3xl font-bold text-blue-600'>
                                {stats.tutors}
                            </p>
                            <p className='font-medium text-blue-600'>
                                Tutor hiện tại
                            </p>
                        </div>
                        <div className='rounded-xl bg-yellow-100 p-4 text-center'>
                            <p className='text-3xl font-bold text-yellow-700'>
                                {stats.sessions}
                            </p>
                            <p className='font-medium text-yellow-700'>
                                Buổi học
                            </p>
                        </div>
                        <div className='rounded-xl bg-green-100 p-4 text-center'>
                            <p className='text-3xl font-bold text-green-600'>
                                {stats.courses}
                            </p>
                            <p className='font-medium text-green-600'>
                                Khóa học hoàn thành
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDetailView;
