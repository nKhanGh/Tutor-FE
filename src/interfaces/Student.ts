// src/interfaces/Student.ts

export type StudentStatus =
    | 'Đang học'
    | 'Đã hoàn thành'
    | 'Chưa hoàn thành'
    | 'Hủy môn';

export type Student = {
    id: number;
    name: string;
    lastName: string;
    firstName: string;
    mssv: string;
    registrationDate: string;
    status: StudentStatus;
    level: string;
    dob: string;
    gender: string;
    cccd: string;
    phone: string;
    email: string;
    khoa: string;
};

// Dữ liệu giả lập (10 sinh viên)
export const mockStudents: Student[] = [
    {
        id: 1,
        name: 'Trương Thanh Nhân',
        lastName: 'Trương Thanh',
        firstName: 'Nhân',
        mssv: '2312453',
        registrationDate: '09:40:41 - 20/11/2025',
        status: 'Đang học',
        level: 'Năm 2',
        dob: '14/10/2005',
        gender: 'Nam',
        cccd: '056205123456',
        phone: '0123456789',
        email: 'nhan.tt@hcmut.edu.vn',
        khoa: 'Khoa học & kĩ thuật máy tính',
    },
    {
        id: 2,
        name: 'Cấn Hoàng Hà',
        lastName: 'Cấn Hoàng',
        firstName: 'Hà',
        mssv: '2312875',
        registrationDate: '13:20:12 - 21/11/2025',
        status: 'Đã hoàn thành',
        level: 'Năm 1',
        dob: '15/11/2005',
        gender: 'Nam',
        cccd: '056205123457',
        phone: '0123456788',
        email: 'ha.canhoang@hcmut.edu.vn',
        khoa: 'Khoa học & kĩ thuật máy tính',
    },
    // ... (Thêm 8 sinh viên còn lại) ...
    {
        id: 3,
        name: 'Đặng Phạm Gia Long',
        lastName: 'Đặng Phạm Gia',
        firstName: 'Long',
        mssv: '2354361',
        registrationDate: '10:45:02 - 21/11/2025',
        status: 'Đang học',
        level: 'Năm 1',
        dob: '10/01/2005',
        gender: 'Nam',
        cccd: '056205123458',
        phone: '0123456787',
        email: 'long.dangpham@hcmut.edu.vn',
        khoa: 'Khoa học & kĩ thuật máy tính',
    },
    {
        id: 4,
        name: 'Nguyễn Hữu Khang',
        lastName: 'Nguyễn Hữu',
        firstName: 'Khang',
        mssv: '2365431',
        registrationDate: '07:40:41 - 21/11/2025',
        status: 'Chưa hoàn thành',
        level: 'Năm 1',
        dob: '12/05/2005',
        gender: 'Nam',
        cccd: '056205123459',
        phone: '0123456786',
        email: 'khang.nguyenhuu@hcmut.edu.vn',
        khoa: 'Khoa học & kĩ thuật máy tính',
    },
    {
        id: 5,
        name: 'Trương Thanh Nhân',
        lastName: 'Trương Thanh',
        firstName: 'Nhân',
        mssv: '5684236530',
        registrationDate: '21:22:23 - 23/11/2025',
        status: 'Đang học',
        level: 'Năm 3',
        dob: '14/10/2003',
        gender: 'Nam',
        cccd: '056205123460',
        phone: '0123456785',
        email: 'nhan.tt2@hcmut.edu.vn',
        khoa: 'Khoa học & kĩ thuật máy tính',
    },
    {
        id: 6,
        name: 'Trương Thanh Nhân',
        lastName: 'Trương Thanh',
        firstName: 'Nhân',
        mssv: '5684236531',
        registrationDate: '12:15:56 - 25/11/2025',
        status: 'Đã hoàn thành',
        level: 'Năm 3',
        dob: '14/10/2003',
        gender: 'Nam',
        cccd: '056205123461',
        phone: '0123456784',
        email: 'nhan.tt3@hcmut.edu.vn',
        khoa: 'Khoa học & kĩ thuật máy tính',
    },
    {
        id: 7,
        name: 'Nguyễn Hữu Khang',
        lastName: 'Nguyễn Hữu',
        firstName: 'Khang',
        mssv: '5684236532',
        registrationDate: '22:02:43 - 25/11/2025',
        status: 'Hủy môn',
        level: 'Năm 4',
        dob: '12/05/2002',
        gender: 'Nam',
        cccd: '056205123462',
        phone: '0123456783',
        email: 'khang.nguyenhuu2@hcmut.edu.vn',
        khoa: 'Khoa học & kĩ thuật máy tính',
    },
    {
        id: 8,
        name: 'Nguyễn Hữu Khang',
        lastName: 'Nguyễn Hữu',
        firstName: 'Khang',
        mssv: '5684236533',
        registrationDate: '08:06:42 - 26/11/2025',
        status: 'Đang học',
        level: 'Năm 1',
        dob: '12/05/2005',
        gender: 'Nam',
        cccd: '056205123463',
        phone: '0123456782',
        email: 'khang.nguyenhuu3@hcmut.edu.vn',
        khoa: 'Khoa học & kĩ thuật máy tính',
    },
    {
        id: 9,
        name: 'Nguyễn Hữu Khang',
        lastName: 'Nguyễn Hữu',
        firstName: 'Khang',
        mssv: '5684236534',
        registrationDate: '10:41:41 - 27/11/2025',
        status: 'Chưa hoàn thành',
        level: 'Năm 3',
        dob: '12/05/2003',
        gender: 'Nam',
        cccd: '056205123464',
        phone: '0123456781',
        email: 'khang.nguyenhuu4@hcmut.edu.vn',
        khoa: 'Khoa học & kĩ thuật máy tính',
    },
    {
        id: 10,
        name: 'Nguyễn Văn Đức',
        lastName: 'Nguyễn Văn',
        firstName: 'Đức',
        mssv: '2310790',
        registrationDate: '11:11:11 - 28/11/2025',
        status: 'Đang học',
        level: 'Năm 2',
        dob: '01/01/2004',
        gender: 'Nam',
        cccd: '056205123465',
        phone: '0123456780',
        email: 'duc.nguyenvan@hcmut.edu.vn',
        khoa: 'Khoa học & kĩ thuật máy tính',
    },
];

export const mockStats = {
    tutors: 2,
    sessions: 120,
    courses: 6,
};
