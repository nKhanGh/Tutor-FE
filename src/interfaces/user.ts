// src/interfaces/user.ts

// --- USER TYPES ---
export interface User {
    id: string;
    username: string;
    password?: string;
    name: string;
    role: 'student' | 'tutor' | 'coordinator' | 'admin';
    avatar?: string;
    avatarBg?: string;
    email?: string;
    phone?: string;
    major?: string;
}

export type StudentStatus =
    | 'Đang học'
    | 'Đã hoàn thành'
    | 'Chưa hoàn thành'
    | 'Hủy môn';

export interface StudentProfile extends User {
    mssv: string;
    registrationDate: string;
    status: StudentStatus;
    level: string;
    dob: string;
    gender: string;
    cccd: string;
}

export interface TutorProfile extends User {
    subjects: string[];
    rating: number;
    totalReviews: number;
    totalSessions: number;
    bio: string;
    scheduleDescription: string;
    achievements: string[];
    teachingStyle: string;
    specialization: string;
    availableFormats: string[];
    matchPercentage?: number;
}
