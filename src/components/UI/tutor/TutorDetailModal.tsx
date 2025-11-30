import type { TutorProfile } from '@/interfaces';
import { getUserInitials } from '@/utils/helpers';
import {
    Award,
    BookOpen,
    Clock,
    Mail,
    Phone,
    Rocket,
    Star,
    Users,
    X,
} from 'lucide-react';

const TutorDetailModal = ({
    selectedTutor,
    setSelectedTutor,
    onChoose,
}: {
    selectedTutor: TutorProfile;
    setSelectedTutor: React.Dispatch<React.SetStateAction<TutorProfile | null>>;
    onChoose: () => void;
}) => {
    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4'>
            <div className='max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white'>
                <div className='relative bg-gradient-to-r from-blue-500 to-cyan-400 p-8'>
                    <button
                        onClick={() => setSelectedTutor(null)}
                        className='absolute right-4 top-4 rounded-lg p-2 text-white transition-colors hover:bg-white hover:bg-opacity-20'
                    >
                        <X size={24} />
                    </button>
                    <div className='flex items-center gap-4 text-white'>
                        <div
                            className={`h-20 w-20 ${selectedTutor.avatarBg} flex items-center justify-center rounded-2xl text-3xl font-bold`}
                        >
                            {selectedTutor.avatar ? (
                                <img
                                    src={selectedTutor.avatar}
                                    alt={selectedTutor.name}
                                    className='h-full w-full object-cover'
                                />
                            ) : (
                                getUserInitials(selectedTutor.name)
                            )}
                        </div>
                        <div>
                            <h2 className='mb-1 text-2xl font-bold'>
                                {selectedTutor.name}
                            </h2>
                            <p className='text-blue-100'>
                                {selectedTutor.role === 'tutor'
                                    ? 'Giảng viên'
                                    : 'Sinh viên'}{' '}
                                - {selectedTutor.major}
                            </p>
                            <div className='mt-2 flex items-center gap-4'>
                                <span className='flex items-center gap-1'>
                                    <Star size={16} fill='white' />
                                    {selectedTutor.rating}/5.0
                                </span>
                                <span className='flex items-center gap-1'>
                                    <Users size={16} />
                                    {selectedTutor.totalSessions} buổi học
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='p-8'>
                    <div className='mb-6'>
                        <div className='mb-3 flex items-center gap-2'>
                            <Rocket className='text-blue-500' size={20} />
                            <h3 className='font-bold text-gray-800'>
                                Trình độ chuyên môn
                            </h3>
                        </div>
                        {selectedTutor?.professional?.length !== 0 &&
                            selectedTutor?.professional?.map((prof) => (
                                <p key={prof} className='ml-7 text-gray-700'>
                                    {prof}
                                </p>
                            ))}
                    </div>

                    {/* Specialization */}
                    <div className='mb-6'>
                        <div className='mb-3 flex items-center gap-2'>
                            <Users className='text-blue-500' size={20} />
                            <h3 className='font-bold text-gray-800'>
                                Lĩnh vực chuyên môn
                            </h3>
                        </div>
                        <p className='ml-7 text-gray-700'>
                            {selectedTutor.specialization}
                        </p>
                    </div>

                    {/* Subjects */}
                    <div className='mb-6'>
                        <div className='mb-3 flex items-center gap-2'>
                            <BookOpen className='text-blue-500' size={20} />
                            <h3 className='font-bold text-gray-800'>
                                Môn học hỗ trợ
                            </h3>
                        </div>
                        <div className='ml-7 flex flex-wrap gap-2'>
                            {selectedTutor.subjects.map((subject) => (
                                <span
                                    key={subject}
                                    className='rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-600'
                                >
                                    {subject}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Teaching Style */}
                    <div className='mb-6'>
                        <div className='mb-3 flex items-center gap-2'>
                            <Star className='text-blue-500' size={20} />
                            <h3 className='font-bold text-gray-800'>
                                Phong cách giảng dạy
                            </h3>
                        </div>
                        <p className='ml-7 text-gray-700'>
                            {selectedTutor.teachingStyle}
                        </p>
                    </div>

                    {/* Achievements */}
                    <div className='mb-6'>
                        <div className='mb-3 flex items-center gap-2'>
                            <Award className='text-blue-500' size={20} />
                            <h3 className='font-bold text-gray-800'>
                                Thành tựu đạt được
                            </h3>
                        </div>
                        <div className='ml-7 space-y-2'>
                            {selectedTutor.achievements.map((achievement) => (
                                <div
                                    key={achievement}
                                    className='flex items-center gap-2 text-gray-700'
                                >
                                    <div className='h-2 w-2 rounded-full bg-green-500'></div>
                                    {achievement}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Schedule */}
                    <div className='mb-6'>
                        <div className='mb-3 flex items-center gap-2'>
                            <Clock className='text-blue-500' size={20} />
                            <h3 className='font-bold text-gray-800'>
                                Lịch rảnh tuần này
                            </h3>
                        </div>
                        <p className='ml-7 text-gray-700'>
                            {selectedTutor.scheduleDescription}
                        </p>
                        <div className='ml-7 mt-2 space-y-1'>
                            {selectedTutor.availableFormats.map((format) => (
                                <div
                                    key={format}
                                    className='flex items-center gap-2 text-gray-700'
                                >
                                    <div className='h-2 w-2 rounded-full bg-green-500'></div>
                                    {format === 'Offline'
                                        ? 'Trực tiếp tại trường'
                                        : 'Trực tuyến qua Zoom hoặc Google Meet'}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Contact */}
                    <div className='mb-6'>
                        <h3 className='mb-3 font-bold text-gray-800'>
                            Liên hệ
                        </h3>
                        <div className='space-y-2'>
                            <div className='flex items-center gap-2'>
                                <Mail className='text-blue-600' size={20} />
                                <span className='text-gray-800'>
                                    {selectedTutor.contactInfo[0]}
                                </span>
                            </div>
                            <div className='flex items-center gap-2'>
                                <Phone className='text-blue-600' size={20} />
                                <span className='text-gray-800'>
                                    {selectedTutor.contactInfo[1]}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className='mt-8 flex gap-4'>
                        <button
                            onClick={onChoose}
                            className='flex-1 rounded-lg bg-red-500 py-3 font-semibold text-white transition-colors hover:bg-red-600'
                        >
                            Chọn Tutor này
                        </button>
                        <button
                            onClick={() => setSelectedTutor(null)}
                            className='rounded-lg border-2 border-gray-300 px-8 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50'
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TutorDetailModal;
