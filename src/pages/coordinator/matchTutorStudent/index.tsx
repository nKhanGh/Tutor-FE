import { useState, useEffect } from 'react';
import Sidebar from '@/components/layouts/Sidebar';
import { Star, Users, Video, BookOpen, ChevronRight, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { storage } from '@/utils/storage';
import type {
    ProgramRegistration,
    StudentProfile,
    TutorProfile,
} from '@/interfaces';
import StudentDetailModal from './StudentDetailModal';
import TutorDetailModal from '@/components/UI/tutor/tutorDetailModal';
import { useNotification } from '@/hooks/useNotification';

const MatchTutorStudent = () => {
    const location = useLocation();

    // State quản lý danh sách yêu cầu và tutors
    const [studentRequests, setStudentRequests] = useState<
        ProgramRegistration[]
    >([]);
    const [suggestedTutors, setSuggestedTutors] = useState<TutorProfile[]>([]);
    const [selectedStudent, setSelectedStudent] =
        useState<StudentProfile | null>(null);
    const [selectedTutor, setSelectedTutor] = useState<TutorProfile | null>(
        null,
    );
    const [openStudentDetailModal, setOpenStudentDetailModal] = useState(false);
    const [showSubjectModal, setShowSubjectModal] = useState(false);
    const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
    const { showSuccessNotification, showErrorNotification } =
        useNotification();

    const [selectedId, setSelectedId] = useState<string | null>(() => {
        return location.state?.targetId?.toString() || null;
    });

    const handleConfirmSubject = () => {
        if (selectedSubjects.length === 0) {
            showErrorNotification('Vui lòng chọn ít nhất một môn học!');
            return;
        }

        if (!selectedStudent || !selectedTutor) return;

        try {
            // Tạo teaching period cho từng môn học được chọn
            const reg = storage.getRegistrationByStudentId(selectedStudent.id);
            if (!reg) {
                showErrorNotification(
                    'Bạn cần hoàn thành đăng ký học tập trước khi chọn Tutor!',
                );
                return;
            }
            selectedSubjects.forEach((subject) => {
                storage.startTeachingPeriod(
                    selectedTutor.id,
                    selectedStudent.id,
                    subject,
                );
            });

            showSuccessNotification(
                `Đã ghép cặp Tutor ${selectedTutor.name} với sinh viên ${selectedStudent?.name} cho ${selectedSubjects.length} môn học!`,
            );
            setShowSubjectModal(false);
            setSelectedTutor(null);
            setSelectedStudent(null);
            setSelectedSubjects([]);
            loadData();
        } catch (error) {
            showErrorNotification('Có lỗi xảy ra khi tạo lịch học!');
            console.error(error);
        }
    };

    const toggleSubject = (subject: string) => {
        setSelectedSubjects((prev) =>
            prev.includes(subject)
                ? prev.filter((s) => s !== subject)
                : [...prev, subject],
        );
    };

    // Tạo helper function để tính rating
    const calculateTutorStats = (tutors: TutorProfile[]) => {
        return tutors.map((tutor) => {
            const sessions = storage.getSessionsForTutor(tutor.id);
            const completed = sessions.filter((s) => s.status === 'completed');
            const rated = sessions.filter((s) => s.review);
            const totalStars = rated.reduce(
                (acc, cur) => acc + (cur.review?.rating || 0),
                0,
            );
            const rating = rated.length
                ? parseFloat((totalStars / rated.length).toFixed(1))
                : 0;

            return {
                ...tutor,
                matchPercentage: tutor.matchPercentage ?? 0,
                totalSessions: completed.length,
                totalReviews: rated.length,
                rating: rating,
            };
        });
    };

    const loadData = () => {
        const notHandling = storage.getNotHandledStudents();
        setStudentRequests(notHandling);
        const student = storage.getAllStudents().find((s) => {
            const reg = notHandling.find((req) => req.studentId === s.id);
            return reg !== undefined;
        });
        setSelectedStudent(student || null);

        if (selectedId) {
            const numericId = parseInt(selectedId);
            const selectedReg = notHandling.find(
                (req) => parseInt(req.id.replace('#TM', '')) === numericId,
            );

            if (selectedReg) {
                const recommended = storage.getRecommendedTutors(
                    selectedReg.studentId,
                );
                setSuggestedTutors(calculateTutorStats(recommended));
            }
        } else if (notHandling.length > 0) {
            handleSelectStudent(notHandling[0].id, notHandling);
        }
    };
    useEffect(() => {
        loadData();
    }, [selectedId]);

    const handleSelectStudent = (
        regId: string,
        datas?: ProgramRegistration[],
    ) => {
        const numericId = regId.replace('#TM', '');
        setSelectedId(numericId);

        const selectedReg = datas
            ? datas.find((req) => req.id === regId)
            : studentRequests?.find((req) => req.id === regId);

        if (selectedReg) {
            const recommended = storage.getRecommendedTutors(
                selectedReg.studentId,
            );
            // ✅ Sử dụng cùng hàm tính rating
            setSuggestedTutors(calculateTutorStats(recommended));
        }
    };

    const selectedRegistration = studentRequests.find(
        (s) => s.id.replace('#TM', '') === selectedId,
    );

    const handleOpenStudentDetails = () => {
        const student = storage
            .getAllStudents()
            .find((s) => s.id === selectedRegistration?.studentId);
        setSelectedStudent(student || null);
        setOpenStudentDetailModal(true);
    };

    // Helper function để tạo avatar color và initials
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

    return (
        <>
            <Sidebar />
            <div className='ml-[80px] min-h-screen bg-white p-4 pt-6 font-sans md:ml-[260px] md:p-8'>
                <div className='grid h-full grid-cols-1 gap-8 lg:grid-cols-12'>
                    {/* --- CỘT TRÁI: DANH SÁCH --- */}
                    <div className='flex flex-col lg:col-span-4'>
                        <h2 className='text-xl font-bold text-gray-800'>
                            Yêu cầu cần xử lý
                        </h2>
                        <p className='text-gray-500'>
                            Danh sách các yêu cầu chưa được xử lý.
                        </p>

                        {/* List Students */}
                        <div className='mt-4 flex flex-col gap-3'>
                            {studentRequests.length === 0 ? (
                                <div className='rounded-xl border border-gray-200 bg-gray-50 p-6 text-center text-gray-500'>
                                    Chưa có yêu cầu nào cần xử lý
                                </div>
                            ) : (
                                studentRequests.map((request, index) => {
                                    const avatar = getAvatarProps(
                                        request.studentName,
                                        index,
                                    );
                                    const requestId = request.id.replace(
                                        '#TM',
                                        '',
                                    );

                                    return (
                                        <div
                                            key={request.id}
                                            onClick={() =>
                                                handleSelectStudent(request.id)
                                            }
                                            className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-all duration-200 ${
                                                selectedId === requestId
                                                    ? 'border-blue-400 bg-blue-50 shadow-sm ring-1 ring-blue-200'
                                                    : 'border-transparent bg-white hover:border-gray-200 hover:bg-gray-50'
                                            }`}
                                        >
                                            <div
                                                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white shadow-sm ${avatar.color}`}
                                            >
                                                {avatar.initials}
                                            </div>
                                            <span
                                                className={`text-sm font-medium ${selectedId === requestId ? 'text-blue-700' : 'text-gray-700'}`}
                                            >
                                                {request.studentName}
                                            </span>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* --- CỘT PHẢI: CHI TIẾT --- */}
                    <div className='flex flex-col gap-8 lg:col-span-8'>
                        {selectedRegistration && (
                            <div className='relative rounded-2xl border border-blue-100 bg-blue-50 p-6'>
                                <div className='mb-6 flex items-center gap-2 border-b border-blue-100 pb-4'>
                                    <Users
                                        className='text-blue-600'
                                        size={24}
                                    />
                                    <h3 className='text-lg font-bold text-gray-800'>
                                        Thông tin sinh viên
                                    </h3>
                                </div>

                                <div className='space-y-4 text-sm md:text-base'>
                                    <div className='grid grid-cols-12 gap-2'>
                                        <span className='col-span-12 font-semibold text-blue-900 sm:col-span-4'>
                                            Tên sinh viên:
                                        </span>
                                        <span className='col-span-12 font-medium text-gray-700 sm:col-span-8'>
                                            {selectedRegistration.studentName}
                                        </span>
                                    </div>
                                    <div className='grid grid-cols-12 gap-2'>
                                        <span className='col-span-12 font-semibold text-blue-900 sm:col-span-4'>
                                            Môn học đăng ký:
                                        </span>
                                        <span className='col-span-12 text-gray-700 sm:col-span-8'>
                                            {selectedRegistration.subjects.join(
                                                ', ',
                                            )}
                                        </span>
                                    </div>
                                    <div className='grid grid-cols-12 gap-2'>
                                        <span className='col-span-12 font-semibold text-blue-900 sm:col-span-4'>
                                            Môn cụ thể:
                                        </span>
                                        <span className='col-span-12 text-gray-700 sm:col-span-8'>
                                            {selectedRegistration.specificSubjects ||
                                                'Chưa chỉ định'}
                                        </span>
                                    </div>
                                    <div className='grid grid-cols-12 gap-2'>
                                        <span className='col-span-12 font-semibold text-blue-900 sm:col-span-4'>
                                            Tần suất mong muốn:
                                        </span>
                                        <span className='col-span-12 text-gray-700 sm:col-span-8'>
                                            {selectedRegistration.frequency}
                                        </span>
                                    </div>
                                    <div className='grid grid-cols-12 gap-2'>
                                        <span className='col-span-12 font-semibold text-blue-900 sm:col-span-4'>
                                            Hình thức:
                                        </span>
                                        <span className='col-span-12 text-gray-700 sm:col-span-8'>
                                            {selectedRegistration.format}
                                        </span>
                                    </div>
                                    <div className='grid grid-cols-12 gap-2'>
                                        <span className='col-span-12 font-semibold text-blue-900 sm:col-span-4'>
                                            Mục tiêu:
                                        </span>
                                        <span className='col-span-12 rounded-lg border border-blue-100 bg-white/50 p-3 italic text-gray-600 sm:col-span-8'>
                                            "{selectedRegistration.goals}"
                                        </span>
                                    </div>
                                    {selectedRegistration.additionalInfo && (
                                        <div className='grid grid-cols-12 gap-2'>
                                            <span className='col-span-12 font-semibold text-blue-900 sm:col-span-4'>
                                                Thông tin bổ sung:
                                            </span>
                                            <span className='col-span-12 rounded-lg border border-blue-100 bg-white/50 p-3 italic text-gray-600 sm:col-span-8'>
                                                "
                                                {
                                                    selectedRegistration.additionalInfo
                                                }
                                                "
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <button
                                    className='ml-auto mt-8 flex items-center gap-1 text-sm font-bold text-blue-600 hover:underline'
                                    onClick={handleOpenStudentDetails}
                                >
                                    Xem chi tiết <ChevronRight size={16} />
                                </button>
                            </div>
                        )}

                        {/* List Tutors */}
                        <div>
                            <h3 className='mb-5 flex items-center gap-2 text-xl font-bold text-gray-800'>
                                Tutor phù hợp theo gợi ý AI
                                <span className='rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white'>
                                    Beta
                                </span>
                            </h3>
                            <div className='flex flex-col gap-4'>
                                {suggestedTutors.length === 0 ? (
                                    <div className='rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center text-gray-500'>
                                        Chưa có tutor phù hợp. Vui lòng thử lại
                                        sau.
                                    </div>
                                ) : (
                                    suggestedTutors.map((tutor) => (
                                        <div
                                            key={tutor.id}
                                            className='group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-lg'
                                        >
                                            <div className='flex flex-col items-start justify-between gap-4 sm:flex-row'>
                                                <div className='flex w-full gap-4'>
                                                    <div
                                                        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-xl font-bold text-white shadow-md ${tutor.avatarBg}`}
                                                    >
                                                        {tutor.name
                                                            .split(' ')
                                                            .pop()
                                                            ?.charAt(0)}
                                                    </div>
                                                    <div className='flex-1'>
                                                        <div className='flex items-start justify-between'>
                                                            <div>
                                                                <h4 className='text-lg font-bold text-gray-900 transition-colors group-hover:text-blue-600'>
                                                                    {tutor.name}
                                                                </h4>
                                                                <p className='text-xs font-bold uppercase tracking-wide text-blue-500'>
                                                                    {
                                                                        tutor.major
                                                                    }
                                                                </p>
                                                            </div>
                                                            <div className='flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700 sm:hidden'>
                                                                <Star
                                                                    size={12}
                                                                    className='fill-blue-700'
                                                                />
                                                                {
                                                                    tutor.matchPercentage
                                                                }
                                                                %
                                                            </div>
                                                        </div>
                                                        <div className='mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-500'>
                                                            <span className='flex items-center gap-1 rounded-md bg-gray-50 px-2 py-0.5 font-bold text-gray-800'>
                                                                <Star
                                                                    size={14}
                                                                    className='fill-yellow-400 text-yellow-400'
                                                                />
                                                                {tutor.rating >
                                                                0
                                                                    ? tutor.rating.toFixed(
                                                                          1,
                                                                      )
                                                                    : 'Mới'}
                                                            </span>
                                                            <span className='text-xs'>
                                                                (
                                                                {
                                                                    tutor.totalReviews
                                                                }{' '}
                                                                đánh giá)
                                                            </span>
                                                            <div className='h-1 w-1 rounded-full bg-gray-300'></div>
                                                            <span className='flex items-center gap-1 text-xs'>
                                                                <Users
                                                                    size={14}
                                                                />
                                                                {
                                                                    tutor.totalSessions
                                                                }{' '}
                                                                buổi dạy
                                                            </span>
                                                        </div>
                                                        <div className='mt-3 flex flex-wrap gap-2'>
                                                            {tutor.subjects
                                                                .slice(0, 4)
                                                                .map(
                                                                    (
                                                                        subject,
                                                                        idx,
                                                                    ) => (
                                                                        <span
                                                                            key={
                                                                                idx
                                                                            }
                                                                            className='rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600'
                                                                        >
                                                                            {
                                                                                subject
                                                                            }
                                                                        </span>
                                                                    ),
                                                                )}
                                                        </div>
                                                        <div className='mt-3 flex flex-wrap gap-3'>
                                                            {tutor.availableFormats.map(
                                                                (
                                                                    format,
                                                                    idx,
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            idx
                                                                        }
                                                                        className='flex items-center gap-1.5 rounded-md border border-green-100 bg-green-50 px-2.5 py-1.5 text-xs font-bold text-green-700'
                                                                    >
                                                                        {format
                                                                            .toLowerCase()
                                                                            .includes(
                                                                                'online',
                                                                            ) ? (
                                                                            <Video
                                                                                size={
                                                                                    12
                                                                                }
                                                                            />
                                                                        ) : (
                                                                            <BookOpen
                                                                                size={
                                                                                    12
                                                                                }
                                                                            />
                                                                        )}
                                                                        {format}
                                                                    </div>
                                                                ),
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='hidden shrink-0 flex-col items-end gap-10 sm:flex'>
                                                    <div className='flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-4 py-1.5 text-sm font-bold text-blue-700 shadow-sm'>
                                                        <Star
                                                            size={16}
                                                            className='fill-blue-700'
                                                        />
                                                        {tutor.matchPercentage}%
                                                        phù hợp
                                                    </div>
                                                    <button
                                                        onClick={() =>
                                                            setSelectedTutor(
                                                                tutor,
                                                            )
                                                        }
                                                        className='flex items-center text-sm font-medium text-gray-400 transition-colors hover:text-blue-600 hover:underline'
                                                    >
                                                        Xem chi tiết
                                                        <ChevronRight
                                                            size={16}
                                                        />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {openStudentDetailModal && selectedStudent && (
                <StudentDetailModal
                    student={selectedStudent}
                    registration={selectedRegistration!}
                    onClose={() => {
                        setOpenStudentDetailModal(false);
                        console.log(selectedStudent);
                    }}
                />
            )}
            {selectedTutor && (
                <TutorDetailModal
                    selectedTutor={selectedTutor}
                    setSelectedTutor={setSelectedTutor}
                    onChoose={() => {
                        setShowSubjectModal(true);
                    }}
                />
            )}
            {showSubjectModal && selectedTutor && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4'>
                    <div className='w-full max-w-md rounded-2xl bg-white p-6 shadow-xl'>
                        <div className='mb-4 flex items-center justify-between'>
                            <h3 className='text-xl font-bold text-gray-800'>
                                Chọn môn học
                            </h3>
                            <button
                                onClick={() => {
                                    setShowSubjectModal(false);
                                    setSelectedSubjects([]);
                                }}
                                className='rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100'
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <p className='mb-4 text-sm text-gray-600'>
                            Chọn môn học bạn muốn ghép cặp cho{' '}
                            <span className='font-semibold'>
                                {selectedStudent?.name}
                            </span>{' '}
                            với{' '}
                            <span className='font-semibold'>
                                {selectedTutor.name}
                            </span>
                        </p>

                        <div className='mb-6 space-y-2'>
                            {selectedTutor.subjects.map((subject) => (
                                <label
                                    key={subject}
                                    className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 p-4 transition-all ${
                                        selectedSubjects.includes(subject)
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <input
                                        type='checkbox'
                                        name='subject'
                                        value={subject}
                                        onChange={() => toggleSubject(subject)}
                                        className='h-4 w-4 text-blue-600'
                                    />
                                    <span className='font-medium text-gray-800'>
                                        {subject}
                                    </span>
                                </label>
                            ))}
                        </div>

                        <div className='flex gap-3'>
                            <button
                                onClick={handleConfirmSubject}
                                disabled={selectedSubjects.length === 0}
                                className={`flex-1 rounded-lg py-3 font-semibold text-white transition-colors ${
                                    selectedSubjects.length > 0
                                        ? 'bg-blue-600 hover:bg-blue-700'
                                        : 'cursor-not-allowed bg-gray-300'
                                }`}
                            >
                                Xác nhận ({selectedSubjects.length} môn)
                            </button>
                            <button
                                onClick={() => {
                                    setShowSubjectModal(false);
                                    setSelectedSubjects([]);
                                }}
                                className='rounded-lg border-2 border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50'
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default MatchTutorStudent;
