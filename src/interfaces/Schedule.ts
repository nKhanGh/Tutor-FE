// --- ĐỊNH NGHĨA "LUẬT" (TYPES) ---
export type Session = {
    id: number;
    title: string;
    tutor: string;
    date: string;
    time: string;
    type: 'location' | 'online';
};

export type Program = {
    id: string;
    title: string;
    tutor: string;
};

export type Slot = { day: string; time: string; status: string };

export type CalendarStatus = 'available' | 'full' | 'current';

// --- DỮ LIỆU GIẢ LẬP (MOCK DATA) ---
export const mockSessions: Session[] = [
    {
        id: 1,
        title: 'Hệ cơ sở dữ liệu - Đại số quan hệ',
        tutor: 'ThS. Cấn Hoàng Hà',
        date: '2025-10-20',
        time: '9:00 - 10:00',
        type: 'location',
    },
    {
        id: 2,
        title: 'Giải tích 2 - Biến đổi Laplace',
        tutor: 'TS. Đặng Phạm Gia Long',
        date: '2025-10-24',
        time: '09:00 - 10:30',
        type: 'online',
    },
    {
        id: 3,
        title: 'Lập trình nâng cao - Lập trình hàm',
        tutor: 'ThS. Trương Thanh Nhân',
        date: '2025-10-26',
        time: '13:00 - 14:30',
        type: 'location',
    },
    {
        id: 4,
        title: 'Vật lý 1 - Điện trường',
        tutor: 'TS. Đặng Phạm Gia Long',
        date: '2025-10-27',
        time: '10:00 - 11:30',
        type: 'online',
    },
    {
        id: 5,
        title: 'Công nghệ phần mềm',
        tutor: 'ThS. Cấn Hoàng Hà',
        date: '2025-10-28',
        time: '14:00 - 15:00',
        type: 'location',
    },
    {
        id: 6,
        title: 'Xác suất thống kê',
        tutor: 'TS. Nguyễn Văn Đức',
        date: '2025-10-29',
        time: '16:00 - 17:00',
        type: 'location',
    },
];
export const mockPrograms: Program[] = [
    {
        id: 'p1',
        title: 'Hệ cơ sở dữ liệu - Đại số quan hệ',
        tutor: 'ThS. Cấn Hoàng Hà',
    },
    {
        id: 'p2',
        title: 'Giải tích 2 - Biến đổi Laplace',
        tutor: 'TS. Đặng Phạm Gia Long',
    },
    {
        id: 'p3',
        title: 'Lập trình nâng cao - Lập trình hàm',
        tutor: 'ThS. Trương Thanh Nhân',
    },
    {
        id: 'p4',
        title: 'Tư vấn nghề nghiệp',
        tutor: 'TS. Nguyễn Văn Đức',
    },
    {
        id: 'p5',
        title: 'Cải thiện khả năng tập trung',
        tutor: 'TS. Nguyễn Hữu Khang',
    },
];
export const mockCalendarSlots: {
    [key: string]: { time: string; status: CalendarStatus }[];
} = {
    '20': [
        { time: '09:00 - 10:00', status: 'current' },
        { time: '10:00 - 11:00', status: 'available' },
    ],
    '21': [{ time: '15:00 - 16:30', status: 'full' }],
    '22': [
        { time: '09:00 - 10:30', status: 'full' },
        { time: '14:00 - 15:30', status: 'full' },
    ],
    '23': [
        { time: '13:00 - 14:00', status: 'available' },
        { time: '14:00 - 15:00', status: 'available' },
    ],
    '24': [{ time: '14:00 - 15:00', status: 'full' }],
    '25': [{ time: '08:00 - 09:30', status: 'available' }],
    '26': [{ time: '14:00 - 15:30', status: 'available' }],
};
export const dayNameMap: { [key: string]: string } = {
    '20': 'Thứ 2',
    '21': 'Thứ 3',
    '22': 'Thứ 4',
    '23': 'Thứ 5',
    '24': 'Thứ 6',
    '25': 'Thứ 7',
    '26': 'CN',
};
