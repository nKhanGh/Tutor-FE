// --- ĐỊNH NGHĨA "LUẬT" (TYPES) ---
export type StatItem = {
    key: string; // Dùng key này để bên Index biết nên hiện icon gì
    label: string;
    value: number;
};

export type PendingTutor = {
    id: number;
    name: string;
    date: string;
    major: string;
};

export type PendingRequest = {
    id: number;
    name: string;
    major: string;
    request: string;
    time: string;
    status: 'new' | 'pending';
};

// --- DỮ LIỆU GIẢ LẬP (MOCK DATA) ---
export const mockCoordinatorStats: StatItem[] = [
    { key: 'student_support', label: 'Sinh viên hỗ trợ', value: 4 },
    { key: 'tutor_active', label: 'Tutor hiện tại', value: 15 },
    { key: 'pending_match', label: 'Ghép cặp chưa xử lý', value: 3 },
];

export const mockPendingTutors: PendingTutor[] = [
    {
        id: 1,
        name: 'Trương Gia Bảo',
        date: '20/10/2025',
        major: 'Hóa học Phân tích',
    },
    {
        id: 2,
        name: 'Trương Việt An',
        date: '25/10/2025',
        major: 'Toán Ứng dụng',
    },
];

export const mockPendingRequests: PendingRequest[] = [
    {
        id: 1,
        name: 'Nguyễn Hữu Khang',
        major: 'Toán học',
        request: 'Môn học mong muốn: Toán học...',
        time: '20/10/2025 - 09:00',
        status: 'new',
    },
    {
        id: 2,
        name: 'Đặng Phạm Gia Long',
        major: 'Vật lý',
        request: 'Môn học mong muốn: Vật lý...',
        time: '20/10/2025 - 10:00',
        status: 'new',
    },
    {
        id: 5,
        name: 'Cấn Hoàng Hà',
        major: 'Hóa học',
        request: 'Môn học mong muốn: Hóa học...',
        time: '20/10/2025 - 14:00',
        status: 'new',
    },
];

export type StudentRequestDetail = {
    id: number;
    name: string;
    avatarInitials: string; // Chữ cái đầu tên (VD: HK)
    avatarColor: string; // Màu nền avatar
    major: string; // Môn học/Lĩnh vực cần hỗ trợ
    frequency: string; // Tần suất (2 buổi/tuần)
    description: string; // Thông tin bổ sung
};

export type SuggestedTutor = {
    id: number;
    name: string;
    title: string; // Chức danh (TS, ThS, SV)
    university: string; // Trường/Khoa
    rating: number;
    reviewCount: number;
    teachingHours: number;
    tags: string[]; // Môn dạy (Toán, Lý...)
    badges: string[]; // Huy hiệu (Hỗ trợ online, Học thuật...)
    matchPercentage: number; // Độ phù hợp
};

// --- 2. MOCK DATA CHO TRANG GHÉP CẶP ---

export const mockStudentRequests: StudentRequestDetail[] = [
    {
        id: 1,
        name: 'Nguyễn Hữu Khang',
        avatarInitials: 'HK',
        avatarColor: 'bg-blue-500',
        major: 'Toán học, Vật lí, Lập trình',
        frequency: '2 buổi / tuần',
        description:
            'Muốn được gặp các giáo viên thật tâm huyết, kiên nhẫn, bình tĩnh và nhẫn nhịn khi đối mặt với sinh viên, kể cả những sinh viên cực yếu như tôi.',
    },
    {
        id: 2,
        name: 'Đặng Phạm Gia Long',
        avatarInitials: 'GL',
        avatarColor: 'bg-green-500',
        major: 'Vật lý (Phương trình Max-well)',
        frequency: 'Thứ năm, 13:00 - 14:00',
        description: 'Cần tìm tutor giảng kỹ lý thuyết và bài tập nâng cao.',
    },
    {
        id: 3,
        name: 'Trương Thanh Nhân',
        avatarInitials: 'TN',
        avatarColor: 'bg-indigo-500',
        major: 'Hóa học đại cương',
        frequency: '3 buổi / tuần',
        description: 'Mất gốc hóa, cần lấy lại căn bản gấp.',
    },
    {
        id: 4,
        name: 'Nguyễn Văn Đức',
        avatarInitials: 'VĐ',
        avatarColor: 'bg-orange-500',
        major: 'Tiếng Anh (IELTS)',
        frequency: 'Cuối tuần',
        description: 'Luyện Speaking và Writing.',
    },
    {
        id: 5,
        name: 'Cấn Hoàng Hà',
        avatarInitials: 'HH',
        avatarColor: 'bg-teal-500',
        major: 'Xác suất thống kê',
        frequency: '1 buổi / tuần',
        description: 'Giải bài tập lớn.',
    },
];

export const mockSuggestedTutors: SuggestedTutor[] = [
    {
        id: 101,
        name: 'TS. Đặng Phạm Gia Long',
        title: 'Khoa học máy tính - Giảng viên',
        university: 'Đại học Bách Khoa',
        rating: 4.9,
        reviewCount: 127,
        teachingHours: 192,
        tags: ['Thuật toán', 'Cơ sở dữ liệu', 'Vật lí'],
        badges: ['Hỗ trợ online', 'Học thuật'],
        matchPercentage: 85,
    },
    {
        id: 102,
        name: 'SV. Cấn Hoàng Hà',
        title: 'Khoa học máy tính - Sinh viên',
        university: 'Đại học Bách Khoa',
        rating: 4.7,
        reviewCount: 102,
        teachingHours: 36,
        tags: ['Toán học', 'Hóa học', 'Sinh học'],
        badges: ['Hỗ trợ online', 'Học thuật'],
        matchPercentage: 81,
    },
];

export type CalendarSlot = {
    time: string;
    status: 'free' | 'busy'; // free: màu xanh, busy: màu đỏ
};

export type DaySchedule = {
    dayName: string; // Thứ 2, Thứ 3...
    date: string; // 20, 21...
    slots: CalendarSlot[];
};

// Dữ liệu danh sách Tutor (Lấy lại cấu trúc cũ hoặc tạo mới tùy bạn, ở đây mình tạo mẫu 3 người như hình)
export const mockSchedulerTutors = [
    {
        id: 1,
        name: 'TS. Đặng Phạm Gia Long',
        title: 'Khoa học máy tính - Giảng viên',
        rating: 4.9,
        reviewCount: 127,
        lessonCount: 192,
        avatarColor: 'bg-blue-600',
        initial: 'L',
    },
    {
        id: 2,
        name: 'ThS. Trương Thanh Nhân',
        title: 'Khoa học máy tính - Giảng viên',
        rating: 4.9,
        reviewCount: 336,
        lessonCount: 292,
        avatarColor: 'bg-purple-600',
        initial: 'N',
    },
    {
        id: 3,
        name: 'SV. Cấn Hoàng Hà',
        title: 'Khoa học máy tính - Sinh viên',
        rating: 4.7,
        reviewCount: 102,
        lessonCount: 36,
        avatarColor: 'bg-yellow-500',
        initial: 'H',
    },
];

// Dữ liệu Lịch trình mẫu (Fake lịch cho 1 tuần)
export const mockWeeklySchedule: DaySchedule[] = [
    {
        dayName: 'Thứ 2',
        date: '20',
        slots: [
            { time: '08:00 - 9:00', status: 'free' },
            { time: '13:00 - 14:00', status: 'free' },
        ],
    },
    {
        dayName: 'Thứ 3',
        date: '21',
        slots: [{ time: '08:00 - 09:30', status: 'busy' }],
    },
    {
        dayName: 'Thứ 4',
        date: '22',
        slots: [
            { time: '09:00 - 10:30', status: 'busy' },
            { time: '13:00 - 14:30', status: 'busy' },
        ],
    },
    {
        dayName: 'Thứ 5',
        date: '23',
        slots: [
            { time: '14:00 - 15:00', status: 'free' },
            { time: '15:00 - 16:00', status: 'free' },
        ],
    },
    {
        dayName: 'Thứ 6',
        date: '24',
        slots: [{ time: '08:00 - 09:30', status: 'busy' }],
    },
    { dayName: 'Thứ 7', date: '25', slots: [] },
    { dayName: 'CN', date: '26', slots: [] },
];

export type TutorDetail = {
    id: number;
    name: string;
    title: string;
    rating: number;
    reviewCount: number;
    lessonCount: number;
    avatarColor: string;
    initial: string;
    education: string;
    expertise: string;
    subjects: string[];
    teachingStyle: string;
    achievements: string[];
    status: 'approved' | 'pending';
};

export const mockTutorProfiles: TutorDetail[] = [
    // --- NHỮNG NGƯỜI CŨ (ĐÃ DUYỆT) ---
    {
        id: 1,
        name: 'TS. Đặng Phạm Gia Long',
        title: 'Khoa học máy tính - Giảng viên',
        rating: 4.9,
        reviewCount: 127,
        lessonCount: 192,
        avatarColor: 'bg-blue-600',
        initial: 'L',
        education: 'Bằng Tiến sĩ - Trường Đại học Bách Khoa...',
        expertise: 'Công nghệ phần mềm, AI & Machine Learning.',
        subjects: [
            'Thuật toán',
            'Cơ sở dữ liệu',
            'Vật lí',
            'Lập trình nâng cao',
        ],
        teachingStyle: 'Tương tác cao, khuyến khích thảo luận...',
        achievements: ['Giảng viên xuất sắc năm 2023', 'Chứng chỉ GDE'],
        status: 'approved', // Đã duyệt
    },
    {
        id: 2,
        name: 'ThS. Trương Thanh Nhân',
        title: 'Khoa học máy tính - Giảng viên',
        rating: 4.9,
        reviewCount: 336,
        lessonCount: 292,
        avatarColor: 'bg-purple-600',
        initial: 'N',
        education: 'Thạc sĩ Khoa học Máy tính...',
        expertise: 'Hệ thống thông tin, An toàn thông tin.',
        subjects: ['Mạng máy tính', 'An toàn thông tin', 'Lập trình Web'],
        teachingStyle: 'Vui vẻ, nhiệt tình, tập trung vào demo...',
        achievements: ['Giải thưởng Mentor xuất sắc 2024'],
        status: 'approved',
    },
    {
        id: 3,
        name: 'SV. Cấn Hoàng Hà',
        title: 'Khoa học máy tính - Sinh viên',
        rating: 4.7,
        reviewCount: 102,
        lessonCount: 36,
        avatarColor: 'bg-yellow-500',
        initial: 'H',
        education: 'Sinh viên năm 4 - Trường Đại học Bách Khoa...',
        expertise: 'Toán học, Lập trình thi đấu.',
        subjects: ['Toán cao cấp', 'Đại số tuyến tính', 'C++ cơ bản'],
        teachingStyle: 'Gần gũi, chia sẻ kinh nghiệm học tập...',
        achievements: ['Học bổng khuyến khích học tập 3 năm liền'],
        status: 'approved',
    },

    // --- 2 NGƯỜI MỚI CẦN DUYỆT ---
    {
        id: 4,
        name: 'Trương Gia Bảo',
        title: 'Hóa học - Giảng viên tập sự',
        rating: 0, // Mới nên chưa có đánh giá
        reviewCount: 0,
        lessonCount: 0,
        avatarColor: 'bg-pink-500',
        initial: 'B',
        education: 'Cử nhân Hóa học tài năng - ĐH KHTN.',
        expertise: 'Hóa phân tích, Hóa hữu cơ.',
        subjects: ['Hóa đại cương', 'Hóa lý'],
        teachingStyle: 'Chưa cập nhật.',
        achievements: ['Giải Nhất Hóa học cấp thành phố'],
        status: 'pending', // 👈 ĐÁNH DẤU LÀ CHỜ DUYỆT
    },
    {
        id: 5,
        name: 'Trương Việt An',
        title: 'Toán Ứng dụng - Sinh viên',
        rating: 0,
        reviewCount: 0,
        lessonCount: 0,
        avatarColor: 'bg-cyan-600',
        initial: 'A',
        education: 'Sinh viên năm 3 - Khoa Toán - Tin.',
        expertise: 'Toán cao cấp.',
        subjects: ['Giải tích 1', 'Đại số tuyến tính'],
        teachingStyle: 'Chưa cập nhật.',
        achievements: [],
        status: 'pending', // 👈 ĐÁNH DẤU LÀ CHỜ DUYỆT
    },
];
