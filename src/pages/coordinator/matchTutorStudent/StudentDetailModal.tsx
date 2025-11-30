import type { ProgramRegistration, StudentProfile } from '@/interfaces';
import { X } from 'lucide-react';

const getAvatarProps = (name: string, index: number) => {
    const colors = [
        'bg-blue-500',
        'bg-green-500',
        'bg-indigo-500',
        'bg-orange-500',
        'bg-teal-500',
        'bg-purple-500',
        'bg-pink-500',
        'bg-red-500',
    ];

    const nameParts = name.split(' ');
    const initials =
        nameParts.length >= 2
            ? nameParts[0][0] + nameParts[nameParts.length - 1][0]
            : name.substring(0, 2).toUpperCase();

    return {
        initials,
        color: colors[index % colors.length],
    };
};

const StudentDetailModal = ({
    student,
    onClose,
    registration,
}: {
    student: StudentProfile;
    onClose: () => void;
    registration: ProgramRegistration;
}) => {
    const avatar = getAvatarProps(student.name, 1);
    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4'>
            <div className='relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white'>
                <button
                    onClick={onClose}
                    className='absolute right-4 top-4 text-white focus:outline-none'
                >
                    <X />
                </button>
                <div className='flex h-24 w-full items-center rounded-t-2xl bg-gradient-to-r from-indigo-600 to-blue-secondary p-12'>
                    <div
                        className={`flex h-14 w-14 items-center justify-center rounded-[12px] text-[20px] text-sm font-bold text-white shadow-sm ${student.avatarBg || avatar.color}`}
                    >
                        {avatar.initials}
                    </div>
                    <div className='ml-6 text-white'>
                        <div className='text-[20px] font-bold'>
                            {student.name}
                        </div>
                        <div>Sinh viên - {student.major}</div>
                    </div>
                </div>
                <div className='p-4'>
                    <div className='rounded-t-[20px] bg-blue-secondary p-4 text-[18px] font-bold text-white'>
                        Thông tin sinh viên
                    </div>
                    <div className='p-6'>
                        <div className='mb-4 grid grid-cols-1 gap-4 md:grid-cols-2'>
                            <div>
                                <p className='font-semibold'>
                                    Mã số sinh viên:
                                </p>
                                <p>{student.mssv}</p>
                            </div>
                            <div>
                                <p className='font-semibold'>Ho và tên</p>
                                <p>{student.name}</p>
                            </div>
                        </div>
                        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                            <div>
                                <p className='font-semibold'>Ngày sinh</p>
                                <p>{student.dob}</p>
                            </div>
                            <div>
                                <p className='font-semibold'>Giới tính</p>
                                <p>{student.gender}</p>
                            </div>
                            <div>
                                <p className='font-semibold'>Số CCCD</p>
                                <p>{student.cccd}</p>
                            </div>
                            <div>
                                <p className='font-semibold'>Số điện thoại</p>
                                <p>{student.phone}</p>
                            </div>
                            <div>
                                <p className='font-semibold'>Email</p>
                                <p>{student.email}</p>
                            </div>
                            <div>
                                <p className='font-semibold'>Khoa</p>
                                <p>{student.major}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='p-4'>
                    <div className='rounded-t-[20px] bg-blue-secondary p-4 text-[18px] font-bold text-white'>
                        Thông tin đã đăng ký
                    </div>
                    <div className='p-6'>
                        <div className='mb-4 grid grid-cols-1 gap-4 md:grid-cols-2'>
                            <div>
                                <p className='font-semibold'>
                                    Lĩnh vực cần hỗ trợ:
                                </p>
                                <p>
                                    {registration.subjects
                                        .reduce(
                                            (acc, subject) =>
                                                acc + subject + ', ',
                                            '',
                                        )
                                        .slice(0, -2)}
                                </p>
                            </div>
                            <div>
                                <p className='font-semibold'>Môn học cụ thể</p>
                                <p>{registration.specificSubjects}</p>
                            </div>
                            <div>
                                <p className='font-semibold'>
                                    Khó khăn hiện tại
                                </p>
                                <p>{registration.challenges}</p>
                            </div>
                            <div>
                                <p className='font-semibold'>
                                    Mục tiêu muón đạt được
                                </p>
                                <p>{registration.goals}</p>
                            </div>
                            <div>
                                <p className='font-semibold'>
                                    Tần suất học tập mong muốn
                                </p>
                                <p>{registration.frequency}</p>
                            </div>
                            <div>
                                <p className='font-semibold'>
                                    Hình thức học tập mong muốn
                                </p>
                                <p>{registration.format}</p>
                            </div>
                        </div>
                        <div>
                            <p className='font-semibold'>
                                Thời gian có thể tham gia
                            </p>
                            <p>{registration.availability}</p>
                        </div>
                        <div>
                            <p className='font-semibold'>Thông tin bổ sung</p>
                            <p>{registration.additionalInfo}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDetailModal;
