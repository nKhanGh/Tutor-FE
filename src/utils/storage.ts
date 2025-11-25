// src/utils/storage.ts
import type {
    User,
    AvailabilitySlot,
    Session,
    TutorProfile,
    StudentProfile,
    ProgramRegistration,
    TutorRequest,
    TeachingPeriod,
    Document,
} from '@/interfaces';

const KEYS = {
    USERS: 'tutor_app_users',
    SLOTS: 'tutor_app_slots',
    SESSIONS: 'tutor_app_sessions',
    DOCUMENTS: 'tutor_app_documents',
    REGISTRATIONS: 'tutor_app_registrations',
    TUTOR_REQUESTS: 'tutor_app_tutor_requests',
    CURRENT_USER: 'tutor_app_current_user',
    TEACHING_PERIODS: 'tutor_app_teaching_periods',
    IS_INIT: 'tutor_app_is_init',
};

// --- HELPER: DATA DICTIONARY ---
const SUBJECT_TOPICS: Record<string, string[]> = {
    'Cấu trúc dữ liệu & Giải thuật': [
        'Danh sách liên kết',
        'Stack & Queue',
        'Cây nhị phân (BST)',
        'Đồ thị (Graph)',
        'Sắp xếp & Tìm kiếm',
    ],
    'Nguyên lý ngôn ngữ lập trình': [
        'Cú pháp & Ngữ nghĩa',
        'Kiểu dữ liệu',
        'Điều khiển dòng lệnh',
        'Chương trình con',
        'Quản lý bộ nhớ',
    ],
    'Đại số tuyến tính': [
        'Ma trận & Định thức',
        'Hệ phương trình tuyến tính',
        'Không gian Vector',
        'Ánh xạ tuyến tính',
        'Trị riêng & Vector riêng',
    ],
    'Vật lý 1': [
        'Động học chất điểm',
        'Động lực học',
        'Công và Năng lượng',
        'Chuyển động quay',
        'Trường hấp dẫn',
    ],
    'Học máy': [
        'Tìm kiếm A*',
        'Logic mệnh đề',
        'Học máy cơ bản',
        'Mạng nơ-ron',
        'Xử lý ngôn ngữ tự nhiên',
    ],
    'Hóa đại cương': [
        'Cấu tạo nguyên tử',
        'Liên kết hóa học',
        'Nhiệt hóa học',
        'Dung dịch',
        'Điện hóa học',
    ],
    'Hóa hữu cơ': [
        'Hidrocacbon',
        'Dẫn xuất Halogen',
        'Ancol - Phenol',
        'Andehit - Xeton',
        'Axit Cacboxylic',
    ],
    'Phương pháp tính': [
        'Sai số',
        'Giải gần đúng PT',
        'Hệ PT đại số tuyến tính',
        'Nội suy',
        'Đạo hàm & Tích phân số',
    ],
    'Giải tích 1': [
        'Giới hạn hàm số',
        'Đạo hàm & Vi phân',
        'Tích phân bất định',
        'Chuỗi số',
        'Khai triển Taylor',
    ],
    'Giải tích 2': [
        'Tích phân đường',
        'Tích phân mặt',
        'Phương trình vi phân',
        'Chuỗi Fourier',
        'Cực trị hàm nhiều biến',
    ],
    'Nhập môn điện toán': [
        'Biến & Kiểu dữ liệu',
        'Cấu trúc rẽ nhánh',
        'Vòng lặp',
        'Hàm & Thủ tục',
        'Mảng & Chuỗi',
    ],
    'Kỹ thuật lập trình': [
        'Con trỏ',
        'Đệ quy',
        'Struct & Union',
        'Quản lý bộ nhớ động',
        'Thao tác File',
    ],
    'Cơ sở dữ liệu': [
        'Mô hình ERD',
        'Đại số quan hệ',
        'SQL cơ bản',
        'Chuẩn hóa dữ liệu',
        'Transaction',
    ],
};

const PROGRESS_COMMENTS = [
    'Sinh viên nắm vững lý thuyết, giải bài tập nhanh.',
    'Cần cải thiện kỹ năng tính toán, còn hay sai sót nhỏ.',
    'Rất chủ động đặt câu hỏi, hiểu sâu vấn đề.',
    'Đã hoàn thành tốt bài tập về nhà được giao.',
    'Vẫn còn lúng túng ở phần vận dụng công thức.',
    'Tiến bộ rõ rệt so với buổi trước.',
    'Cần ôn lại kiến thức nền tảng của chương trước.',
];

const REQUEST_NOTES = [
    'Em bị mất gốc phần này, mong thầy giảng kỹ lại ạ.',
    'Em cần ôn tập gấp để chuẩn bị thi giữa kỳ.',
    'Phần bài tập này khó quá, em cần hướng dẫn giải chi tiết.',
    'Em muốn học nâng cao thêm về chủ đề này.',
    'Mong thầy sắp xếp thời gian giúp em ạ.',
    'Em chưa hiểu rõ lý thuyết trên lớp.',
];

const CANCELLATION_REASONS = [
    'Bận việc đột xuất từ phía gia đình.',
    'Sức khỏe không đảm bảo để tham gia buổi học.',
    'Trùng lịch thi đột xuất của nhà trường.',
    'Sự cố mất kết nối mạng/điện.',
    'Thay đổi kế hoạch học tập cá nhân.',
    'Xe hỏng giữa đường không về kịp.',
];

// --- HELPER FUNCTIONS ---
const getRandomInt = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomItem = <T>(arr: T[]): T =>
    arr[Math.floor(Math.random() * arr.length)];

const getRandomDate = (start: Date, end: Date) => {
    return new Date(
        start.getTime() + Math.random() * (end.getTime() - start.getTime()),
    );
};

const formatDateStr = (date: Date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
};

// Check overlap
// tracker structure: { "tutorId_YYYY-MM-DD": [{start: 840, end: 960}, ...] }
const isOverlapping = (
    tutorId: string,
    dateStr: string,
    newStart: number,
    newEnd: number,
    tracker: Record<string, { start: number; end: number }[]>,
): boolean => {
    const key = `${tutorId}_${dateStr}`;
    const existingSlots = tracker[key] || [];

    return existingSlots.some((slot) => {
        // Logic overlap: Max(start1, start2) < Min(end1, end2)
        return Math.max(slot.start, newStart) < Math.min(slot.end, newEnd);
    });
};

const registerSlot = (
    tutorId: string,
    dateStr: string,
    start: number,
    end: number,
    tracker: Record<string, { start: number; end: number }[]>,
) => {
    const key = `${tutorId}_${dateStr}`;
    if (!tracker[key]) tracker[key] = [];
    tracker[key].push({ start, end });
};

// Generate a valid random time slot (HH:MM)
const generateRandomTimeSlot = () => {
    const startHour = getRandomInt(7, 17); // 7h to 17h
    const durationMinutes = Math.random() > 0.5 ? 90 : 120; // 1.5h or 2h

    // Random start minute: 00 or 30
    const startMinute = Math.random() > 0.5 ? 0 : 30;

    const startTotal = startHour * 60 + startMinute;
    const endTotal = startTotal + durationMinutes;

    // Format HH:MM
    const format = (totalMin: number) => {
        const h = Math.floor(totalMin / 60);
        const m = totalMin % 60;
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    };

    return {
        startStr: format(startTotal),
        endStr: format(endTotal),
        startMin: startTotal,
        endMin: endTotal,
    };
};

// --- 1. SEED USERS ---
const SEED_USERS: (User | TutorProfile | StudentProfile)[] = [
    // --- TUTORS ---
    {
        id: 't1',
        username: 'phung.nguyen',
        name: 'Nguyễn Hứa Phùng',
        role: 'tutor',
        email: 'phung.nguyenhua@hcmut.edu.vn',
        major: 'Khoa học & Kỹ thuật Máy tính',
        avatarBg: 'bg-red-700',
        subjects: [
            'Nguyên lý ngôn ngữ lập trình',
            'Cấu trúc dữ liệu & Giải thuật',
            'Nhập môn điện toán',
            'Kỹ thuật lập trình',
            'Cơ sở dữ liệu',
        ],
        rating: 0,
        totalReviews: 0,
        totalSessions: 0,
        bio: 'Giảng viên lâu năm, chuyên về các môn chuyên ngành.',
        scheduleDescription: 'Thứ 3, 5 (17:00 - 20:00)',
        achievements: ['Giảng viên xuất sắc 2022'],
        teachingStyle: 'Nghiêm khắc, logic',
        specialization: 'Khoa học máy tính',
        availableFormats: ['Offline'],
    },
    {
        id: 't2',
        username: 'duc.nguyen',
        name: 'Nguyễn Văn Đức',
        role: 'tutor',
        email: 'duc.nguyenvan@hcmut.edu.vn',
        major: 'Khoa học Ứng dụng',
        avatarBg: 'bg-blue-600',
        subjects: [
            'Đại số tuyến tính',
            'Vật lý 1',
            'Học máy',
            'Giải tích 1',
            'Giải tích 2',
        ],
        rating: 0,
        totalReviews: 0,
        totalSessions: 0,
        bio: 'Tutor nhiệt tình, phương pháp dạy trực quan.',
        scheduleDescription: 'Thứ 2, 4, 6 (14:00 - 17:00)',
        achievements: ['Sinh viên 5 tốt cấp trường', 'IELTS 7.5'],
        teachingStyle: 'Thân thiện, tương tác cao',
        specialization: 'Toán ứng dụng',
        availableFormats: ['Offline', 'Online'],
    },
    {
        id: 't3',
        username: 'long.dang',
        name: 'Đặng Phạm Gia Long',
        role: 'tutor',
        email: 'long.dang@hcmut.edu.vn',
        major: 'Kỹ thuật Hóa học',
        avatarBg: 'bg-indigo-600',
        subjects: ['Hóa đại cương', 'Hóa hữu cơ', 'Phương pháp tính'],
        rating: 0,
        totalReviews: 0,
        totalSessions: 0,
        bio: 'Chuyên gia về Hóa lý & Phân tích.',
        scheduleDescription: 'Thứ 2, 4, 6 (14:00 - 17:00)',
        achievements: [
            'Kỹ sư quy trình tại Unilever Việt Nam',
            'Hướng dẫn 20+ đề tài NCKH',
        ],
        teachingStyle: 'Tương tác cao, tư duy phản biện',
        specialization: 'Kỹ thuật Polymer',
        availableFormats: ['Online', 'Offline'],
    },
    // --- COORDINATOR ---
    {
        id: 'c1',
        username: 'nhan.truong',
        name: 'Trương Thanh Nhân',
        role: 'coordinator',
        email: 'nhan.truong@hcmut.edu.vn',
        avatarBg: 'bg-purple-500',
    },
    // --- STUDENTS ---
    {
        id: 's1',
        username: '2310836',
        mssv: '2310836',
        name: 'Cấn Hoàng Hà',
        role: 'student',
        email: 'ha.canhoang@hcmut.edu.vn',
        major: 'Khoa học & Kỹ thuật Máy tính',
        registrationDate: '15/10/2025',
        status: 'Đã hoàn thành',
        level: 'Năm 2',
        dob: '15/11/2004',
        gender: 'Nam',
        cccd: '056205123457',
        phone: '0123456788',
        avatarBg: 'bg-green-500',
    },
    {
        id: 's2',
        username: '2311892',
        mssv: '2311892',
        name: 'Trịnh Trần Phương Tuấn',
        role: 'student',
        email: 'tuan.trinhtran@hcmut.edu.vn',
        major: 'Điện - Điện tử',
        registrationDate: '10/10/2025',
        status: 'Đã hoàn thành',
        level: 'Năm 2',
        dob: '10/01/2004',
        gender: 'Nam',
        cccd: '056205123458',
        phone: '0123456787',
        avatarBg: 'bg-orange-500',
    },
    {
        id: 's3',
        username: '2311449',
        mssv: '2311449',
        name: 'Nguyễn Hữu Khang',
        role: 'student',
        email: 'kh.nkh14@hcmut.edu.vn',
        major: 'Khoa học & Kỹ thuật Máy tính',
        registrationDate: '',
        status: 'Đã hoàn thành',
        level: 'Năm 1',
        dob: '14/10/2005',
        gender: 'Nam',
        cccd: '056205123456',
        phone: '0123456789',
        avatarBg: 'bg-blue-500',
    },
];

const SEED_DOCUMENTS: Document[] = [
    {
        id: 1,
        title: 'Data Structures and Algorithms in Python',
        authors: 'Michael T. Goodrich',
        type: 'Giáo trình',
        year: '2023',
        downloads: 567,
        views: 1200,
        rating: 4.8,
        fileInfo: 'PDF • 8.5MB',
        isSaved: true, // Giả sử đã lưu
        sharedBy: 't1',
    },
    {
        id: 2,
        title: 'Computer Networking: A Top-Down Approach',
        authors: 'James F. Kurose',
        type: 'Giáo trình',
        year: '2022',
        downloads: 890,
        views: 2100,
        rating: 4.9,
        fileInfo: 'PDF • 12MB',
        isSaved: false,
    },
    {
        id: 3,
        title: 'Slide bài giảng Hệ Điều Hành - Chương 4',
        authors: 'TS. Phạm Trần Vũ',
        type: 'Slide',
        year: '2024',
        downloads: 120,
        views: 450,
        rating: 4.5,
        fileInfo: 'PPTX • 2.3MB',
        isSaved: false,
    },
    {
        id: 4,
        title: 'Tổng hợp đề thi Kiến trúc máy tính 2023',
        authors: 'CLB Học thuật',
        type: 'Đề thi',
        year: '2023',
        downloads: 3200,
        views: 5600,
        rating: 5.0,
        fileInfo: 'ZIP • 15MB',
        isSaved: true,
    },
    {
        id: 5,
        title: 'Artificial Intelligence: A Modern Approach',
        authors: 'Stuart Russell',
        type: 'Giáo trình',
        year: '2021',
        downloads: 1100,
        views: 3400,
        rating: 4.7,
        fileInfo: 'PDF • 20MB',
        isSaved: false,
    },
    // Tài liệu do sinh viên (ví dụ user hiện tại) chia sẻ
    {
        id: 6,
        title: 'Ghi chú ôn tập Giải tích 1 - HK241',
        authors: 'Nguyễn Hữu Khang',
        type: 'Ghi chú',
        year: '2025',
        downloads: 15,
        views: 100,
        rating: 4.5,
        fileInfo: 'PDF • 2.4MB',
        isSaved: false,
        sharedBy: 's3', // ID của Nguyễn Hữu Khang (User demo)
        uploadedAt: '20/10/2025',
    },
    {
        id: 7,
        title: 'Slide thuyết trình BTL Công nghệ phần mềm',
        authors: 'Nguyễn Hữu Khang',
        type: 'Slide',
        year: '2025',
        downloads: 4,
        views: 20,
        rating: 5.0,
        fileInfo: 'PPTX • 5.1MB',
        isSaved: false,
        sharedBy: 's3',
        uploadedAt: '15/10/2025',
    },
];

// --- 5. SEED REGISTRATIONS ---
const SEED_REGISTRATIONS: ProgramRegistration[] = [
    {
        id: '#TM2025002',
        studentId: 's1',
        studentName: 'Cấn Hoàng Hà',
        subjects: [
            'Kỹ thuật lập trình',
            'Cấu trúc dữ liệu & Giải thuật',
            'Đại số tuyến tính',
            'Vật lý 1',
        ],
        specificSubjects: 'Kỹ thuật lập trình',
        challenges: 'Cần cải thiện tư duy thuật toán',
        goals: 'Qua môn với điểm cao',
        frequency: '1 buổi/tuần',
        format: 'Online',
        availability: 'Cuối tuần',
        additionalInfo: '',
        status: 'approved',
        createdAt: '15/10/2025',
    },
    {
        id: '#TM2025003',
        studentId: 's2',
        studentName: 'Đặng Phạm Gia Long',
        subjects: [
            'Học máy',
            'Cơ sở dữ liệu',
            'Giải tích 1',
            'Giải tích 2',
            'Hóa đại cương',
        ],
        specificSubjects: 'Học máy',
        challenges: 'Gặp khó khăn khi tối ưu hóa mô hình.',
        goals: 'Xuất bản bài báo nghiên cứu khoa học.',
        frequency: '2 buổi/tuần',
        format: 'Offline',
        availability: 'Thứ 7, Chủ nhật',
        additionalInfo: 'Mong muốn tìm Tutor có kinh nghiệm nghiên cứu.',
        status: 'approved',
        createdAt: '12/10/2025',
    },
];

// --- 2. GENERATE TEACHING PERIODS (PHASE 1) - FIXED LOGIC ---
const generateRandomTeachingPeriods = (): TeachingPeriod[] => {
    const periods: TeachingPeriod[] = [];
    const tutors = SEED_USERS.filter(
        (u) => u.role === 'tutor',
    ) as TutorProfile[];
    const students = SEED_USERS.filter(
        (u) => u.role === 'student',
    ) as (StudentProfile & { subjects: string[] })[];

    tutors.forEach((tutor) => {
        // Xáo trộn danh sách sinh viên để ngẫu nhiên hóa
        const shuffledStudents = [...students].sort(() => 0.5 - Math.random());

        shuffledStudents.forEach((student) => {
            // 1. Tìm các môn học chung giữa Tutor và Student
            const reg_student = SEED_REGISTRATIONS.find(
                (reg_student) => reg_student.studentId === student.id,
            );
            if (reg_student !== undefined) {
                const commonSubjects = tutor.subjects.filter((tSub) =>
                    reg_student.subjects.includes(tSub),
                );

                commonSubjects.forEach((subject) => {
                    let last_i = -1;
                    for (let i = 0; i < 5; i++) {
                        if (Math.random() > 0.2) {
                            last_i = i;
                            // Random thời gian
                            const start = getRandomDate(
                                new Date('2025-06-01'),
                                new Date('2025-09-01'),
                            );
                            start.setMonth(start.getMonth() - 6 * (5 - i));

                            let endStr: string | undefined = undefined;
                            const end = new Date(start);
                            end.setDate(end.getDate() + getRandomInt(30, 60));
                            endStr = formatDateStr(end);

                            periods.push({
                                id: periods.length.toString(),
                                tutorId: tutor.id,
                                studentId: student.id,
                                studentName: student.name,
                                studentEmail: student.email,
                                subject: subject,
                                startDate: formatDateStr(start),
                                endDate: endStr,
                                status: 'finished',
                                progressIds: [],
                            });
                        }
                    }
                    // Random trạng thái
                    const isActive = Math.random() > 1 - last_i / 4;
                    if (isActive && last_i != -1) {
                        periods[periods.length - 1].status = 'active';
                        periods[periods.length - 1].endDate = undefined;
                    }
                });
            }
        });
    });

    return periods;
};

// --- 3. GENERATE SESSIONS (PHASE 2) - NO OVERLAP ---
// Biến toàn cục (trong scope hàm) để track lịch trình tránh trùng lặp
const generateSessionsFromPeriods = (
    periods: TeachingPeriod[],
): {
    sessions: Session[];
    scheduleTracker: Record<string, { start: number; end: number }[]>;
} => {
    const sessions: Session[] = [];
    // Tracker để kiểm tra overlap: { "tutorId_YYYY-MM-DD": [ {start: 800, end: 900}, ... ] }
    const scheduleTracker: Record<string, { start: number; end: number }[]> =
        {};

    const tutors = SEED_USERS.filter(
        (u) => u.role === 'tutor',
    ) as TutorProfile[];

    periods.forEach((period) => {
        const tutor = tutors.find((t) => t.id === period.tutorId);
        const tutorName = tutor?.name || 'Unknown';
        const topics = SUBJECT_TOPICS[period.subject] || ['Ôn tập'];

        // Helper sinh buổi học an toàn
        const createSafeSession = (
            targetDate: Date,
            status: Session['status'],
            isUpcoming: boolean,
        ) => {
            const dateStr = formatDateStr(targetDate);
            let attempts = 0;
            let timeSlot = generateRandomTimeSlot();

            // Retry nếu trùng lịch
            while (
                isOverlapping(
                    period.tutorId,
                    dateStr,
                    timeSlot.startMin,
                    timeSlot.endMin,
                    scheduleTracker,
                ) &&
                attempts < 10
            ) {
                timeSlot = generateRandomTimeSlot();
                attempts++;
            }

            // Nếu sau 10 lần vẫn trùng -> Bỏ qua buổi này (để đảm bảo data sạch)
            if (attempts >= 10) return;

            // Đăng ký slot này vào tracker
            registerSlot(
                period.tutorId,
                dateStr,
                timeSlot.startMin,
                timeSlot.endMin,
                scheduleTracker,
            );

            const topic = getRandomItem(topics);
            let review = undefined;
            let progressNote = undefined;
            let cancellationReason = undefined;

            if (status === 'completed') {
                if (Math.random() > 0.3) {
                    review = {
                        rating: getRandomInt(4, 5),
                        comment: `Buổi học về ${topic} rất tốt.`,
                    };
                }
                if (Math.random() > 0.1) {
                    progressNote = {
                        content: `Đã học về ${topic}. ${getRandomItem(PROGRESS_COMMENTS)}`,
                        evaluation: getRandomItem([
                            'Xuất sắc',
                            'Tốt',
                            'Khá',
                            'Cần cải thiện',
                        ]) as 'Xuất sắc' | 'Tốt' | 'Khá' | 'Cần cải thiện',
                    };
                }
            }

            if (
                status === 'cancelled-tutor' ||
                status === 'cancelled-student'
            ) {
                cancellationReason = getRandomItem(CANCELLATION_REASONS);
            }

            const sessionId = isUpcoming
                ? `sess_${period.id}_fut_${Date.now()}_${Math.random()}`
                : `sess_${period.id}_hist_${Date.now()}_${Math.random()}`;

            const sessionType = Math.random() > 0.5 ? 'online' : 'location';
            sessions.push({
                id: sessionId,
                tutorId: period.tutorId,
                teachingPeriodId: period.id,
                tutorName: tutorName,
                studentId: period.studentId,
                studentName:
                    SEED_USERS.find((user) => user.id == period.studentId)
                        ?.name || '',
                title: `${period.subject} - ${topic}`,
                date: dateStr,
                time: `${timeSlot.startStr} - ${timeSlot.endStr}`,
                status: status,
                type: sessionType,
                locationOrLink:
                    sessionType == 'online'
                        ? getRandomItem([
                              'Google Meet',
                              'Zoom',
                              'Microsoft Teams',
                          ])
                        : getRandomItem(['H1-201', 'H6-102', 'H2-304']),
                canFeedback: status === 'completed' && !review,
                canViewReason: status.includes('cancelled'),
                review: review,
                progressNote: progressNote,
                cancellationReason: cancellationReason,
            });
        };

        // === CASE 1: FINISHED PERIOD ===
        if (period.status === 'finished') {
            const sessionCount = getRandomInt(12, 20);
            const startDate = new Date(period.startDate);
            const endDate = period.endDate
                ? new Date(period.endDate)
                : new Date();

            for (let i = 0; i < sessionCount; i++) {
                const sessionDate = getRandomDate(startDate, endDate);
                const status =
                    Math.random() > 0.9 ? 'cancelled-student' : 'completed';
                createSafeSession(sessionDate, status, false);
            }
        }

        // === CASE 2: ACTIVE PERIOD ===
        if (period.status === 'active') {
            // Past sessions
            const pastCount = getRandomInt(2, 5);
            const startDate = new Date(period.startDate);
            const today = new Date();

            for (let i = 0; i < pastCount; i++) {
                const sessionDate = getRandomDate(startDate, today);
                createSafeSession(sessionDate, 'completed', false);
            }

            // Upcoming sessions
            const upcomingCount = getRandomInt(1, 2);
            for (let i = 1; i <= upcomingCount; i++) {
                const futureDate = new Date(today);
                futureDate.setDate(today.getDate() + i * getRandomInt(2, 5));
                createSafeSession(futureDate, 'upcoming', true);
            }
        }
    });

    return { sessions, scheduleTracker };
};

// --- 4. GENERATE SLOTS (PHASE 3) - CHECK OVERLAP ---
const generateSlotsFromActivePeriods = (
    activePeriods: TeachingPeriod[],
    existingSchedule: Record<string, { start: number; end: number }[]>,
): AvailabilitySlot[] => {
    const slots: AvailabilitySlot[] = [];
    const today = new Date();
    const tutors = SEED_USERS.filter((u) => u.role === 'tutor');

    // 1. Available Slots
    tutors.forEach((tutor) => {
        for (let d = 1; d <= 14; d++) {
            const date = new Date(today);
            date.setDate(today.getDate() + d);
            const dateStr = formatDateStr(date);

            if (Math.random() > 0.3) {
                let attempts = 0;
                let timeSlot = generateRandomTimeSlot();

                // Check overlap với Sessions đã tạo trước đó
                while (
                    isOverlapping(
                        tutor.id,
                        dateStr,
                        timeSlot.startMin,
                        timeSlot.endMin,
                        existingSchedule,
                    ) &&
                    attempts < 10
                ) {
                    timeSlot = generateRandomTimeSlot();
                    attempts++;
                }

                if (attempts < 10) {
                    // Register để các slot sau không trùng slot này
                    registerSlot(
                        tutor.id,
                        dateStr,
                        timeSlot.startMin,
                        timeSlot.endMin,
                        existingSchedule,
                    );

                    slots.push({
                        id: slots.length.toString(),
                        tutorId: tutor.id,
                        date: dateStr,
                        startTime: timeSlot.startStr,
                        endTime: timeSlot.endStr,
                        status: 'available',
                    });
                }
            }
        }
    });

    // 2. Pending Requests
    activePeriods.forEach((period) => {
        if (Math.random() > 0.5) {
            const date = new Date(today);
            date.setDate(today.getDate() + getRandomInt(3, 10));
            const dateStr = formatDateStr(date);

            let attempts = 0;
            let timeSlot = generateRandomTimeSlot();

            // Check overlap
            while (
                isOverlapping(
                    period.tutorId,
                    dateStr,
                    timeSlot.startMin,
                    timeSlot.endMin,
                    existingSchedule,
                ) &&
                attempts < 10
            ) {
                timeSlot = generateRandomTimeSlot();
                attempts++;
            }

            if (attempts < 10) {
                registerSlot(
                    period.tutorId,
                    dateStr,
                    timeSlot.startMin,
                    timeSlot.endMin,
                    existingSchedule,
                );

                slots.push({
                    id: slots.length.toString(),
                    tutorId: period.tutorId,
                    date: dateStr,
                    startTime: timeSlot.startStr,
                    endTime: timeSlot.endStr,
                    status: 'pending',
                    bookedByStudentId: period.studentId,
                    bookedByStudentName:
                        SEED_USERS.find((user) => user.id == period.studentId)
                            ?.name || '',
                    subject: period.subject,
                    requestNote: getRandomItem(REQUEST_NOTES),
                });
            }
        }
    });

    return slots;
};

// --- HELPER MỚI: Tạo Slot booked từ các Session sắp tới ---
const generateBookedSlotsFromSessions = (
    sessions: Session[],
): AvailabilitySlot[] => {
    return sessions
        .filter((s) => s.status === 'upcoming') // Chỉ lấy các buổi sắp diễn ra
        .map((s) => {
            const [start, end] = s.time.split(' - ');
            const subject = s.title.split(' - ')[0]; // Lấy tên môn từ tiêu đề session

            return {
                id: `slot_booked_from_sess_${s.id}`,
                tutorId: s.tutorId,
                date: s.date,
                startTime: start,
                endTime: end,
                status: 'booked',
                bookedByStudentId: s.studentId,
                bookedByStudentName: s.studentName,
                subject: subject,
                requestNote: 'Đã được đặt tự động từ lịch học',
            };
        });
};

const get = <T>(key: string, def: T): T => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : def;
    } catch {
        return def;
    }
};

const set = <T>(key: string, value: T) => {
    localStorage.setItem(key, JSON.stringify(value));
};

// --- LOGIC "AI" GIẢ LẬP ---
const calculateMatchScore = (
    studentReg: ProgramRegistration,
    tutor: TutorProfile,
): number => {
    let score = 0;

    // 1. So khớp môn học (Quan trọng nhất)
    const commonSubjects = tutor.subjects.filter((sub) =>
        studentReg.subjects.includes(sub),
    );
    score += commonSubjects.length * 20; // Mỗi môn trùng +20%

    // 2. So khớp môn cụ thể (Nếu có)
    if (
        studentReg.specificSubjects &&
        tutor.subjects.some((s) => studentReg.specificSubjects.includes(s))
    ) {
        score += 15;
    }

    // 3. So khớp hình thức học (Online/Offline)
    if (tutor.availableFormats.includes(studentReg.format)) {
        score += 10;
    }

    // 4. Random nhẹ để tạo cảm giác "AI" phân tích các yếu tố ẩn (bio, style...)
    score += Math.floor(Math.random() * 10);

    // Cap ở 99%
    return Math.min(score, 99);
};

const timeToMinutes = (time: string): number => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
};

export const storage = {
    initialize: () => {
        if (!localStorage.getItem(KEYS.IS_INIT)) {
            localStorage.removeItem(KEYS.USERS);
            localStorage.removeItem(KEYS.SLOTS);
            localStorage.removeItem(KEYS.SESSIONS);
            localStorage.removeItem(KEYS.DOCUMENTS);
            localStorage.removeItem(KEYS.REGISTRATIONS);
            localStorage.removeItem(KEYS.TUTOR_REQUESTS);
            localStorage.removeItem(KEYS.CURRENT_USER);
            localStorage.removeItem(KEYS.TEACHING_PERIODS);

            // 1. Generate Periods
            const generatedTeachingPeriods = generateRandomTeachingPeriods();

            // 2. Generate Sessions (pass schedule tracker out)
            const sessionResult = generateSessionsFromPeriods(
                generatedTeachingPeriods,
            );
            const generatedSessions = sessionResult.sessions;
            const currentSchedule = sessionResult.scheduleTracker;

            // 3. Generate Slots (check against currentSchedule)
            const activePeriods = generatedTeachingPeriods.filter(
                (p) => p.status === 'active',
            );
            const generatedAvailablePendingSlots =
                generateSlotsFromActivePeriods(activePeriods, currentSchedule);
            const generatedBookedSlots =
                generateBookedSlotsFromSessions(generatedSessions);
            const allSlots = [
                ...generatedAvailablePendingSlots,
                ...generatedBookedSlots,
            ];

            set(KEYS.USERS, SEED_USERS);
            set(KEYS.TEACHING_PERIODS, generatedTeachingPeriods);
            set(KEYS.SESSIONS, generatedSessions);
            set(KEYS.SLOTS, allSlots);
            set(KEYS.REGISTRATIONS, SEED_REGISTRATIONS);
            set(KEYS.TUTOR_REQUESTS, []);
            set(KEYS.DOCUMENTS, SEED_DOCUMENTS);

            localStorage.setItem(KEYS.IS_INIT, 'true');
        }
    },

    getUsers: (): User[] => get(KEYS.USERS, []),
    getUserByUsername: (username: string): User | undefined =>
        storage.getUsers().find((u) => u.username === username),
    getUserById: (id: string): User | undefined =>
        storage.getUsers().find((u) => u.id === id),
    getCurrentUser: (): User | null => get(KEYS.CURRENT_USER, null),
    setCurrentUser: (user: User | null) => {
        if (user) localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
        else localStorage.removeItem(KEYS.CURRENT_USER);
    },
    getAllTutors: (): TutorProfile[] =>
        storage.getUsers().filter((u) => u.role === 'tutor') as TutorProfile[],
    getAllStudents: (): StudentProfile[] =>
        storage
            .getUsers()
            .filter((u) => u.role === 'student') as StudentProfile[],

    getRegistrationByStudentId: (
        studentId: string,
    ): ProgramRegistration | undefined => {
        const regs: ProgramRegistration[] = get(KEYS.REGISTRATIONS, []);
        return regs.find((r) => r.studentId === studentId);
    },
    getRegistrationStatus: (
        studentId: string,
    ): 'none' | 'pending' | 'approved' | 'rejected' => {
        const regs: ProgramRegistration[] = get(KEYS.REGISTRATIONS, []);
        const reg = regs.find((r) => r.studentId === studentId);
        return reg ? reg.status : 'none';
    },
    saveRegistration: (reg: ProgramRegistration) => {
        const regs: ProgramRegistration[] = get(KEYS.REGISTRATIONS, []);
        const index = regs.findIndex((r) => r.studentId === reg.studentId);
        if (index !== -1) {
            regs[index] = reg;
        } else {
            regs.push(reg);
        }
        set(KEYS.REGISTRATIONS, regs);
    },

    getRequestsByStudent: (studentId: string): TutorRequest[] => {
        const reqs: TutorRequest[] = get(KEYS.TUTOR_REQUESTS, []);
        return reqs.filter((r) => r.studentId === studentId);
    },
    createTutorRequest: (req: TutorRequest): boolean => {
        const reqs: TutorRequest[] = get(KEYS.TUTOR_REQUESTS, []);
        const exists = reqs.find(
            (r) =>
                r.studentId === req.studentId &&
                r.tutorId === req.tutorId &&
                r.status === 'pending',
        );
        if (!exists) {
            reqs.push(req);
            set(KEYS.TUTOR_REQUESTS, reqs);
            return true;
        }
        return false;
    },
    getSlots: (): AvailabilitySlot[] => get(KEYS.SLOTS, []),
    getSlotsByTutor: (tutorId: string): AvailabilitySlot[] =>
        storage.getSlots().filter((s) => s.tutorId === tutorId),
    addSlot: (slot: AvailabilitySlot) => {
        const s = storage.getSlots();
        s.push(slot);
        set(KEYS.SLOTS, s);
    },
    createOpenSession: (data: {
        tutorId: string;
        title: string;
        description: string;
        date: string;
        startTime: string;
        endTime: string;
        maxStudents: number;
        location: string;
    }): boolean => {
        try {
            const slots = storage.getSlots();
            const newSlot: AvailabilitySlot = {
                id: `slot-group-${Date.now()}`,
                tutorId: data.tutorId,
                date: data.date,
                startTime: data.startTime,
                endTime: data.endTime,
                status: 'available', // Vẫn là available cho đến khi full
                type: 'group', // Đánh dấu là slot nhóm/workshop
                title: data.title, // Topic
                description: data.description,
                maxStudents: data.maxStudents,
                location: data.location,
                enrolledStudentIds: [], // Khởi tạo mảng rỗng
                bookedByStudentId: undefined, // Không dùng trường này cho group
                bookedByStudentName: undefined,
            };

            slots.push(newSlot);
            set(KEYS.SLOTS, slots);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    },
    deleteSlot: (slotId: string) => {
        const slots = get<AvailabilitySlot[]>(KEYS.SLOTS, []);
        const slotToDelete = slots.find((s) => s.id === slotId);

        // Nếu slot đã book, cần xóa cả Session tương ứng (nếu có)
        if (slotToDelete && slotToDelete.status === 'booked') {
            const sessions = get<Session[]>(KEYS.SESSIONS, []);
            // Tìm session khớp tutorId, studentId và thời gian (Logic tương đối do mock data)
            const updatedSessions = sessions.filter(
                (s) =>
                    !(
                        s.tutorId === slotToDelete.tutorId &&
                        s.date === slotToDelete.date &&
                        s.time.includes(slotToDelete.startTime)
                    ),
            );
            set(KEYS.SESSIONS, updatedSessions);
        }

        const newSlots = slots.filter((x) => x.id !== slotId);
        set(KEYS.SLOTS, newSlots);
    },
    bookSlot: (
        slotId: string,
        studentId: string,
        studentName: string,
        subject: string,
        note: string,
        teachingPeriodId: string, // <--- Thêm tham số này
    ): boolean => {
        const slots = storage.getSlots();
        const idx = slots.findIndex((s) => s.id === slotId);
        if (idx !== -1 && slots[idx].status === 'available') {
            slots[idx].status = 'pending';
            slots[idx].bookedByStudentId = studentId;
            slots[idx].bookedByStudentName = studentName;
            slots[idx].subject = subject;
            slots[idx].requestNote = note;
            slots[idx].teachingPeriodId = teachingPeriodId; // <--- LƯU ID VÀO ĐÂY
            set(KEYS.SLOTS, slots);
            return true;
        }
        return false;
    },
    approveSlot: (slotId: string): boolean => {
        const slots = storage.getSlots();
        const idx = slots.findIndex((s) => s.id === slotId);

        if (idx !== -1 && slots[idx].status === 'pending') {
            slots[idx].status = 'booked';
            set(KEYS.SLOTS, slots);

            const tutor = storage.getUserById(slots[idx].tutorId);

            // --- STRICT LOGIC: COPY ID TRỰC TIẾP ---
            const session: Session = {
                id: `sess-${Date.now()}`,
                tutorId: slots[idx].tutorId,
                tutorName: tutor?.name || 'Unknown',
                studentId: slots[idx].bookedByStudentId || '',
                studentName: slots[idx].bookedByStudentName || '',
                teachingPeriodId: slots[idx].teachingPeriodId || '',
                title: slots[idx].subject || 'Buổi tư vấn',
                date: slots[idx].date,
                time: `${slots[idx].startTime} - ${slots[idx].endTime}`,
                status: 'upcoming',
                type: 'online',
                locationOrLink: 'Google Meet',
                canFeedback: false,
                canViewReason: false,
                review: undefined,
                // --- BỔ SUNG DÒNG NÀY: Copy tài liệu từ Slot sang Session ---
                attachedDocumentIds: slots[idx].attachedDocumentIds || [],
            };

            storage.addSession(session);
            return true;
        }
        return false;
    },
    rejectSlot: (slotId: string): boolean => {
        const slots = storage.getSlots();
        const idx = slots.findIndex((s) => s.id === slotId);
        if (idx !== -1 && slots[idx].status === 'pending') {
            slots[idx].status = 'available';
            delete slots[idx].bookedByStudentId;
            delete slots[idx].bookedByStudentName;
            delete slots[idx].subject;
            delete slots[idx].requestNote;
            set(KEYS.SLOTS, slots);
            return true;
        }
        return false;
    },
    getSessions: (): Session[] => get(KEYS.SESSIONS, []),
    getSessionsForTutor: (tutorId: string): Session[] =>
        storage.getSessions().filter((s) => s.tutorId === tutorId),
    getSessionsForStudent: (studentId: string): Session[] =>
        storage.getSessions().filter((s) => s.studentId === studentId),
    addSession: (session: Session) => {
        const s = storage.getSessions();
        s.push(session);
        set(KEYS.SESSIONS, s);
    },

    getActiveTeachingPeriods: (tutorId: string): TeachingPeriod[] => {
        const periods: TeachingPeriod[] = get(KEYS.TEACHING_PERIODS, []);
        return periods.filter(
            (p) => p.tutorId === tutorId && p.status === 'active',
        );
    },

    startTeachingPeriod: (
        tutorId: string,
        studentId: string,
        subject: string,
    ) => {
        const periods: TeachingPeriod[] = get(KEYS.TEACHING_PERIODS, []);
        const student = SEED_USERS.find((student) => student.id == studentId);
        const newPeriod: TeachingPeriod = {
            id: `tp_${Date.now()}`,
            tutorId,
            studentId,
            subject,
            startDate: new Date().toISOString().split('T')[0],
            status: 'active',
            progressIds: [],
            studentName: student?.name || '',
            studentEmail: student?.email,
        };
        periods.push(newPeriod);
        set(KEYS.TEACHING_PERIODS, periods);
        return newPeriod;
    },

    endTeachingPeriod: (periodId: string) => {
        const periods: TeachingPeriod[] = get(KEYS.TEACHING_PERIODS, []);
        const idx = periods.findIndex((p) => p.id === periodId);
        if (idx !== -1) {
            periods[idx].status = 'finished';
            periods[idx].endDate = new Date().toISOString().split('T')[0];
            set(KEYS.TEACHING_PERIODS, periods);
            return true;
        }
        return false;
    },

    reset: () => {
        localStorage.clear();
        window.location.reload();
    },
    getDocuments: (): Document[] => get(KEYS.DOCUMENTS, []),
    getSavedDocuments: (): Document[] => {
        return storage.getDocuments().filter((doc) => doc.isSaved);
    },

    // Lấy tài liệu do user chia sẻ (sharedBy = userId)
    getSharedDocuments: (userId: string): Document[] => {
        return storage.getDocuments().filter((doc) => doc.sharedBy === userId);
    },

    // Toggle lưu/bỏ lưu tài liệu
    toggleSaveDocument: (docId: number): boolean => {
        const docs = storage.getDocuments();
        const index = docs.findIndex((d) => d.id === docId);
        if (index !== -1) {
            docs[index].isSaved = !docs[index].isSaved;
            set(KEYS.DOCUMENTS, docs);
            return docs[index].isSaved; // Trả về trạng thái mới
        }
        return false;
    },

    // Upload tài liệu mới (giả lập)
    addDocument: (doc: Omit<Document, 'id'>): Document => {
        const docs = storage.getDocuments();
        const newDoc: Document = {
            ...doc,
            id: Date.now(), // Generate ID số
        };
        // Thêm vào đầu danh sách
        docs.unshift(newDoc);
        set(KEYS.DOCUMENTS, docs);
        return newDoc;
    },

    // Xóa tài liệu (dùng cho trang Shared)
    deleteDocument: (docId: number) => {
        const docs = storage.getDocuments();
        const newDocs = docs.filter((d) => d.id !== docId);
        set(KEYS.DOCUMENTS, newDocs);
    },
    getRecommendedTutors: (studentId: string): TutorProfile[] => {
        const tutors = storage.getAllTutors();
        const reg = storage.getRegistrationByStudentId(studentId);

        if (!reg) {
            // Nếu chưa đăng ký, trả về ngẫu nhiên 3 người và set % thấp
            return tutors
                .sort(() => 0.5 - Math.random())
                .slice(0, 3)
                .map((t) => ({
                    ...t,
                    matchPercentage: Math.floor(Math.random() * 40) + 40,
                })); // 40-80%
        }

        // Tính điểm match
        const scoredTutors = tutors.map((tutor) => ({
            ...tutor,
            matchPercentage: calculateMatchScore(reg, tutor),
        }));

        // Sort theo điểm cao nhất và lấy top 3
        return scoredTutors
            .sort((a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0))
            .slice(0, 3);
    },
    checkTimeOverlap: (
        tutorId: string,
        date: string,
        startTime: string,
        endTime: string,
    ): boolean => {
        const newStart = timeToMinutes(startTime);
        const newEnd = timeToMinutes(endTime);

        // 1. Kiểm tra trùng với Availability Slots (Available, Booked, Pending)
        const slots = storage.getSlotsByTutor(tutorId);
        const conflictingSlot = slots.find((slot) => {
            if (slot.date !== date) return false;
            // Bỏ qua slot đã bị hủy (nếu hệ thống có trạng thái cancelled cho slot)
            // Ở đây giả định slot tồn tại là có hiệu lực

            const currentStart = timeToMinutes(slot.startTime);
            const currentEnd = timeToMinutes(slot.endTime);

            // Logic overlap: (StartA < EndB) && (StartB < EndA)
            return newStart < currentEnd && currentStart < newEnd;
        });

        if (conflictingSlot) return true;

        // 2. Kiểm tra trùng với Sessions (Upcoming, Pending)
        // Session có thể được tạo ra mà không qua Slot (Open Session), nên cần check cả bảng này
        const sessions = storage.getSessionsForTutor(tutorId);
        const conflictingSession = sessions.find((session) => {
            if (session.date !== date) return false;
            // Chỉ check các session chưa hoàn thành/hủy
            if (
                ['completed', 'cancelled-tutor', 'cancelled-student'].includes(
                    session.status,
                )
            ) {
                return false;
            }

            // Format time session thường là "HH:mm - HH:mm", cần tách ra
            const [sStartStr, sEndStr] = session.time.split(' - ');
            const currentStart = timeToMinutes(sStartStr);
            const currentEnd = timeToMinutes(sEndStr);

            return newStart < currentEnd && currentStart < newEnd;
        });

        if (conflictingSession) return true;

        return false;
    },
    updateSlot: (updatedSlot: AvailabilitySlot): boolean => {
        try {
            const slots = storage.getSlots();
            const index = slots.findIndex((s) => s.id === updatedSlot.id);
            if (index !== -1) {
                slots[index] = updatedSlot;
                localStorage.setItem('tutor_app_slots', JSON.stringify(slots));
                return true;
            }
            return false;
        } catch (error) {
            console.error(error);
            return false;
        }
    },
};

storage.initialize();
