import React, { useState } from 'react';
import {
    Search,
    Star,
    Users,
    Video,
    X,
    Rocket,
    BookOpen,
    Award,
    Clock,
    Mail,
    Phone,
    ChevronRight,
} from 'lucide-react';
import Sidebar from '@/components/layouts/Sidebar';
import { useNotification } from '@/hooks/useNotification';

interface Tutor {
    id: string;
    name: string;
    avatar: string;
    avatarBg: string;
    department: string;
    role: string;
    rating: number;
    totalReviews: number;
    totalSessions: number;
    matchPercentage?: number;
    subjects: string[];
    onlineSupport: boolean;
    inPersonSupport: boolean;
    expertise: string;
    specialization: string;
    teachingStyle: string;
    achievements: string[];
    schedule: string;
    availableFormats: string[];
    contact: {
        email: string;
        phone: string;
    };
}

const ChooseTutor: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedDepartment, setSelectedDepartment] = useState<string>('');
    const [selectedRating, setSelectedRating] = useState<string>('');
    const [selectedLevel, setSelectedLevel] = useState<string>('');
    const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
    const [showAIRecommendation, setShowAIRecommendation] =
        useState<boolean>(false);
    const { showSuccessNotification } = useNotification();

    const tutors: Tutor[] = [
        {
            id: '1',
            name: 'TS. Đặng Phạm Gia Long',
            avatar: 'L',
            avatarBg: 'bg-blue-500',
            department: 'Khoa học máy tính',
            role: 'Giảng viên',
            rating: 4.9,
            totalReviews: 127,
            totalSessions: 192,
            matchPercentage: 85,
            subjects: ['Thuật toán', 'Cơ sở dữ liệu', 'Vật lí'],
            onlineSupport: true,
            inPersonSupport: true,
            expertise:
                'Tiến sĩ - Trường Đại học Bách Khoa - Đại học Quốc gia TP.HCM',
            specialization: 'Thuật toán, Cấu trúc dữ liệu & Giải thuật',
            teachingStyle:
                'Tương tác cao, khuyến khích thảo luận và tư duy phản biện. Kết hợp lý thuyết với thực hành dự án thực tế.',
            achievements: [
                'Giảng viên xuất sắc năm 2023',
                'Hướng dẫn 15+ đề tài NCKH',
                'Chứng chỉ Google Developer Expert',
            ],
            schedule: 'Thứ 2, 4, 6 (14:00 - 17:00)',
            availableFormats: [
                'Trực tiếp tại trường',
                'Online qua Google Meet',
            ],
            contact: {
                email: 'long@hcmut.edu.vn',
                phone: '0123456789',
            },
        },
        {
            id: '2',
            name: 'SV. Cấn Hoàng Hà',
            avatar: 'H',
            avatarBg: 'bg-yellow-500',
            department: 'Khoa học máy tính',
            role: 'Sinh viên',
            rating: 4.7,
            totalReviews: 102,
            totalSessions: 36,
            matchPercentage: 81,
            subjects: ['Toán học', 'Hóa học', 'Sinh học'],
            onlineSupport: true,
            inPersonSupport: true,
            expertise: 'Sinh viên năm 3 - Chuyên ngành Khoa học máy tính',
            specialization: 'Toán học, Lý thuyết số, Đại số tuyến tính',
            teachingStyle:
                'Thân thiện, dễ hiểu, tập trung vào việc xây dựng nền tảng vững chắc. Sử dụng nhiều ví dụ thực tế.',
            achievements: [
                'Sinh viên giỏi 3 năm liên tiếp',
                'Học bổng khuyến khích học tập',
                'Top 10 Olympic Toán học sinh viên',
            ],
            schedule: 'Thứ 3, 5, 7 (18:00 - 21:00)',
            availableFormats: [
                'Trực tiếp tại trường',
                'Online qua Google Meet',
            ],
            contact: {
                email: 'ha.can@hcmut.edu.vn',
                phone: '0987654321',
            },
        },
        {
            id: '3',
            name: 'ThS. Trương Thanh Nhân',
            avatar: 'N',
            avatarBg: 'bg-purple-500',
            department: 'Khoa học máy tính',
            role: 'Giảng viên',
            rating: 4.9,
            totalReviews: 336,
            totalSessions: 292,
            matchPercentage: 72,
            subjects: ['Giao tiếp', 'Lắng nghe', 'Giải quyết vấn đề'],
            onlineSupport: true,
            inPersonSupport: true,
            expertise:
                'Thạc sĩ - Trường Đại học Bách Khoa - Đại học Quốc gia TP.HCM',
            specialization: 'Kỹ năng mềm, Phát triển cá nhân, Tư duy phản biện',
            teachingStyle:
                'Tương tác cao, khuyến khích thảo luận và tư duy phản biện. Kết hợp lý thuyết với thực hành dự án thực tế.',
            achievements: [
                'Giảng viên xuất sắc năm 2022, 2023',
                'Hướng dẫn 20+ đề tài NCKH',
                'Chứng chỉ Google Developer Expert',
            ],
            schedule: 'Thứ 2, 4, 6 (14:00 - 17:00)',
            availableFormats: ['Phi học thuật'],
            contact: {
                email: 'nhan@hcmut.edu.vn',
                phone: '0123456789',
            },
        },
    ];

    const filteredTutors = tutors.filter((tutor) => {
        const matchesSearch =
            tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tutor.subjects.some((s) =>
                s.toLowerCase().includes(searchQuery.toLowerCase()),
            );
        const matchesDepartment =
            !selectedDepartment || tutor.department === selectedDepartment;
        const matchesRating =
            !selectedRating ||
            tutor.rating >= Number.parseFloat(selectedRating);
        const matchesLevel = !selectedLevel || tutor.role === selectedLevel;

        return (
            matchesSearch && matchesDepartment && matchesRating && matchesLevel
        );
    });

    return (
        <>
            <Sidebar />
            <div className='ml-[80px] min-h-screen bg-blue-50 p-6 md:ml-[260px]'>
                <div className='mx-auto max-w-7xl'>
                    {/* Header */}
                    <div className='mb-6 flex items-start justify-between'>
                        <div>
                            <h1 className='mb-2 text-3xl font-bold text-gray-800'>
                                Lựa chọn tutor
                            </h1>
                            <p className='text-gray-600'>
                                Hãy lựa chọn những tutor thích hợp nhất với bạn
                            </p>
                        </div>
                        <button
                            className={`bg-blue-500 px-6 py-3 ${showAIRecommendation ? 'bg-gradient-to-r from-blue-700 to-[#00C0EF] text-white' : 'bg-blue-300 text-black'} flex items-center gap-2 rounded-lg font-semibold transition-colors hover:border-[2px] hover:border-blue-700 hover:text-blue-700`}
                            onClick={() =>
                                setShowAIRecommendation(!showAIRecommendation)
                            }
                        >
                            <Star size={20} />
                            {showAIRecommendation
                                ? 'Gợi ý AI đã bật'
                                : 'Bật gợi ý AI'}
                        </button>
                    </div>

                    {/* Search and Filters */}
                    <div className='mb-6 rounded-2xl bg-white p-6 shadow-sm'>
                        <div className='mb-4 flex gap-4'>
                            <div className='relative flex-1'>
                                <Search
                                    className='absolute left-4 top-1/2 -translate-y-1/2 transform text-gray-400'
                                    size={20}
                                />
                                <input
                                    type='text'
                                    placeholder='Tìm kiếm theo từ khóa hoặc tên môn học...'
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className='w-full rounded-lg border border-gray-300 py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-400'
                                />
                            </div>
                            <button className='hidden rounded-lg bg-blue-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-600 lg:block'>
                                Tìm kiếm
                            </button>
                        </div>

                        <div className='grid grid-cols-2 gap-4 lg:grid-cols-3'>
                            <select
                                value={selectedDepartment}
                                onChange={(e) =>
                                    setSelectedDepartment(e.target.value)
                                }
                                className='rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400'
                            >
                                <option value=''>Khoa</option>
                                <option value='Khoa học máy tính'>
                                    Khoa học máy tính
                                </option>
                                <option value='Điện - Điện tử'>
                                    Điện - Điện tử
                                </option>
                                <option value='Cơ khí'>Cơ khí</option>
                            </select>

                            <select
                                value={selectedRating}
                                onChange={(e) =>
                                    setSelectedRating(e.target.value)
                                }
                                className='rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400'
                            >
                                <option value=''>Đánh giá</option>
                                <option value='4.5'>4.5+ sao</option>
                                <option value='4.0'>4.0+ sao</option>
                                <option value='3.5'>3.5+ sao</option>
                            </select>

                            <select
                                value={selectedLevel}
                                onChange={(e) =>
                                    setSelectedLevel(e.target.value)
                                }
                                className='rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400'
                            >
                                <option value=''>Trình độ</option>
                                <option value='Giảng viên'>Giảng viên</option>
                                <option value='Sinh viên'>Sinh viên</option>
                            </select>
                            <button className='block rounded-lg bg-blue-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-600 lg:hidden'>
                                Tìm kiếm
                            </button>
                        </div>
                    </div>

                    {/* AI Recommendation Banner */}
                    {showAIRecommendation && (
                        <div className='mb-6 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 p-6 text-white shadow-sm'>
                            <Star className='flex-shrink-0' size={24} />
                            <span className='font-semibold'>
                                Các tutor được sắp xếp theo độ phù hợp với hồ sơ
                                của bạn
                            </span>
                        </div>
                    )}

                    {/* Results Count */}
                    <h2 className='mb-6 text-xl font-bold text-gray-800'>
                        {filteredTutors.length} Tutor phù hợp
                    </h2>

                    {/* Tutor List */}
                    <div className='space-y-4'>
                        {filteredTutors.map((tutor) => (
                            <div
                                key={tutor.id}
                                className='rounded-2xl bg-white px-4 py-6 shadow-sm transition-shadow hover:shadow-md lg:p-6'
                            >
                                <div className='flex items-start gap-2 md:gap-4'>
                                    {/* Avatar */}
                                    <div
                                        className={`h-16 w-16 ${tutor.avatarBg} flex flex-shrink-0 items-center justify-center rounded-2xl text-2xl font-bold text-white`}
                                    >
                                        {tutor.avatar}
                                    </div>

                                    {/* Info */}
                                    <div className='flex-1'>
                                        <div className='mb-2 flex items-start justify-between'>
                                            <div>
                                                <h3 className='text-xl font-bold text-gray-800'>
                                                    {tutor.name}
                                                </h3>
                                                <p className='text-sm text-blue-600'>
                                                    {tutor.department} -{' '}
                                                    {tutor.role}
                                                </p>
                                            </div>
                                            {tutor.matchPercentage &&
                                                showAIRecommendation && (
                                                    <div className='flex items-center gap-1 rounded-full bg-gradient-to-r from-blue-200 to-cyan-200 px-2 py-1 text-sm font-semibold text-blue-600'>
                                                        <Star
                                                            size={16}
                                                            fill='currentColor'
                                                        />
                                                        {tutor.matchPercentage}%
                                                        <span className='hidden md:block'>
                                                            phù hợp
                                                        </span>
                                                    </div>
                                                )}
                                        </div>

                                        <div className='mb-3 flex items-center gap-1 text-sm text-gray-600 md:gap-4'>
                                            <span className='flex items-center gap-1'>
                                                <Star
                                                    size={16}
                                                    className='text-yellow-500'
                                                    fill='currentColor'
                                                />
                                                {tutor.rating}
                                            </span>
                                            <span>
                                                ({tutor.totalReviews} đánh giá)
                                            </span>
                                            <span className='flex items-center gap-1'>
                                                <Users size={16} />
                                                {tutor.totalSessions} buổi học
                                            </span>
                                        </div>

                                        <div className='mb-3 flex flex-wrap gap-2'>
                                            {tutor.subjects.map((subject) => (
                                                <span
                                                    key={subject}
                                                    className='rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-600'
                                                >
                                                    {subject}
                                                </span>
                                            ))}
                                        </div>

                                        <div className='flex flex-col items-start gap-4 lg:flex-row'>
                                            {tutor.onlineSupport && (
                                                <span className='flex items-center gap-1 rounded-lg bg-green-50 px-3 py-1 text-sm text-green-600'>
                                                    <Video size={16} />
                                                    Hỗ trợ online
                                                </span>
                                            )}
                                            {tutor.inPersonSupport && (
                                                <span className='flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1 text-sm text-gray-600'>
                                                    {tutor.availableFormats.includes(
                                                        'Phi học thuật',
                                                    )
                                                        ? 'Phi học thuật'
                                                        : 'Học thuật'}
                                                </span>
                                            )}
                                            <button
                                                onClick={() =>
                                                    setSelectedTutor(tutor)
                                                }
                                                className='ml-auto flex items-center gap-1 text-sm font-semibold text-blue-500 hover:text-blue-600'
                                            >
                                                Xem chi tiết
                                                <ChevronRight size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {selectedTutor && (
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
                                        {selectedTutor.avatar}
                                    </div>
                                    <div>
                                        <h2 className='mb-1 text-2xl font-bold'>
                                            {selectedTutor.name}
                                        </h2>
                                        <p className='text-blue-100'>
                                            {selectedTutor.role} -{' '}
                                            {selectedTutor.department}
                                        </p>
                                        <div className='mt-2 flex items-center gap-4'>
                                            <span className='flex items-center gap-1'>
                                                <Star size={16} fill='white' />
                                                {selectedTutor.rating}/5.0
                                            </span>
                                            <span className='flex items-center gap-1'>
                                                <Users size={16} />
                                                {
                                                    selectedTutor.totalSessions
                                                }{' '}
                                                buổi học
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='p-8'>
                                <div className='mb-6'>
                                    <div className='mb-3 flex items-center gap-2'>
                                        <Rocket
                                            className='text-blue-500'
                                            size={20}
                                        />
                                        <h3 className='font-bold text-gray-800'>
                                            Trình độ chuyên môn
                                        </h3>
                                    </div>
                                    <p className='ml-7 text-gray-700'>
                                        {selectedTutor.expertise}
                                    </p>
                                    <p className='ml-7 mt-1 text-gray-700'>
                                        Chuyên viên nghiên cứu học máy tại VinAI
                                        Research
                                    </p>
                                </div>

                                {/* Specialization */}
                                <div className='mb-6'>
                                    <div className='mb-3 flex items-center gap-2'>
                                        <Users
                                            className='text-blue-500'
                                            size={20}
                                        />
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
                                        <BookOpen
                                            className='text-blue-500'
                                            size={20}
                                        />
                                        <h3 className='font-bold text-gray-800'>
                                            Môn học hỗ trợ
                                        </h3>
                                    </div>
                                    <div className='ml-7 flex flex-wrap gap-2'>
                                        {selectedTutor.subjects.map(
                                            (subject) => (
                                                <span
                                                    key={subject}
                                                    className='rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-600'
                                                >
                                                    {subject}
                                                </span>
                                            ),
                                        )}
                                    </div>
                                </div>

                                {/* Teaching Style */}
                                <div className='mb-6'>
                                    <div className='mb-3 flex items-center gap-2'>
                                        <Star
                                            className='text-blue-500'
                                            size={20}
                                        />
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
                                        <Award
                                            className='text-blue-500'
                                            size={20}
                                        />
                                        <h3 className='font-bold text-gray-800'>
                                            Thành tựu đạt được
                                        </h3>
                                    </div>
                                    <div className='ml-7 space-y-2'>
                                        {selectedTutor.achievements.map(
                                            (achievement) => (
                                                <div
                                                    key={achievement}
                                                    className='flex items-center gap-2 text-gray-700'
                                                >
                                                    <div className='h-2 w-2 rounded-full bg-green-500'></div>
                                                    {achievement}
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>

                                {/* Schedule */}
                                <div className='mb-6'>
                                    <div className='mb-3 flex items-center gap-2'>
                                        <Clock
                                            className='text-blue-500'
                                            size={20}
                                        />
                                        <h3 className='font-bold text-gray-800'>
                                            Lịch rảnh tuần này
                                        </h3>
                                    </div>
                                    <p className='ml-7 text-gray-700'>
                                        {selectedTutor.schedule}
                                    </p>
                                    <div className='ml-7 mt-2 space-y-1'>
                                        {selectedTutor.availableFormats.map(
                                            (format) => (
                                                <div
                                                    key={format}
                                                    className='flex items-center gap-2 text-gray-700'
                                                >
                                                    <div className='h-2 w-2 rounded-full bg-green-500'></div>
                                                    {format}
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>

                                {/* Contact */}
                                <div className='mb-6'>
                                    <h3 className='mb-3 font-bold text-gray-800'>
                                        Liên hệ
                                    </h3>
                                    <div className='space-y-2'>
                                        <div className='flex items-center gap-2 text-blue-600'>
                                            <Mail size={20} />
                                            <span>
                                                {selectedTutor.contact.email}
                                            </span>
                                        </div>
                                        <div className='flex items-center gap-2 text-blue-600'>
                                            <Phone size={20} />
                                            <span>
                                                {selectedTutor.contact.phone}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className='mt-8 flex gap-4'>
                                    <button
                                        onClick={() => {
                                            showSuccessNotification?.(
                                                'Bạn đã chọn Tutor này!',
                                            );
                                            setSelectedTutor(null);
                                        }}
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
                )}
            </div>
        </>
    );
};

export default ChooseTutor;
