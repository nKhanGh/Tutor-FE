// --- AVAILABILITY ---
export interface AvailabilitySlot {
    id: string;
    tutorId: string;
    teachingPeriodId?: string;
    date: string;
    startTime: string;
    endTime: string;
    status: 'available' | 'booked' | 'pending';
    bookedByStudentId?: string;
    bookedByStudentName?: string;
    subject?: string;
    requestNote?: string;
    type?: 'one-on-one' | 'group';
    title?: string; // Tiêu đề buổi học (Topic)
    description?: string; // Mô tả chi tiết
    maxStudents?: number; // Số lượng tối đa
    location?: string; // Địa điểm cụ thể
    enrolledStudentIds?: string[]; // Danh sách ID sinh viên đã đăng ký vào slot này (dành cho group)
    attachedDocumentIds?: number[];
}
export interface PendingChange {
    type: 'cancel' | 'reschedule';
    newDate?: string; // Chỉ dùng cho reschedule
    newTime?: string; // Chỉ dùng cho reschedule (HH:MM - HH:MM)
    reason: string;
    createdAt: string;
}
// --- SESSION ---
export interface Session {
    id: string;
    tutorId: string;
    studentId: string;
    teachingPeriodId: string;
    tutorName: string;
    studentName: string;
    title: string;
    date: string;
    time: string;
    status:
        | 'pending'
        | 'upcoming'
        | 'completed'
        | 'cancelled-tutor'
        | 'cancelled-student';
    type: 'location' | 'online';
    locationOrLink: string;
    canFeedback?: boolean;
    canViewReason?: boolean;
    review?: {
        rating: number;
        comment: string;
    };
    cancellationReason?: string;
    progressNote?: {
        content: string;
        evaluation: 'Xuất sắc' | 'Tốt' | 'Khá' | 'Cần cải thiện';
    };
    attachedDocumentIds?: number[];
    pendingChange?: PendingChange;
}

// --- REQUESTS & REGISTRATION ---
export interface ProgramRegistration {
    id: string;
    studentId: string;
    studentName: string;
    subjects: string[];
    specificSubjects: string;
    challenges: string;
    goals: string;
    frequency: string;
    format: string;
    availability: string;
    additionalInfo: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
}

export interface TutorRequest {
    id: string;
    studentId: string;
    studentName: string;
    tutorId: string;
    tutorName: string;
    status: 'pending' | 'accepted' | 'rejected';
    requestContent: string;
    createdAt: string;
}

// --- TEACHING PERIOD (KỲ DẠY) ---
// Kỳ dạy bắt đầu khi ghép cặp thành công, kết thúc khi hủy ghép cặp
export interface TeachingPeriod {
    id: string;
    tutorId: string;
    studentId: string;
    studentName: string;
    studentEmail?: string;
    subject: string; // Môn học của kỳ dạy này
    startDate: string;
    endDate?: string; // Nếu có giá trị => Đã kết thúc
    status: 'active' | 'finished' | 'cancelled';
    progressIds: string[]; // Danh sách ID các biên bản/tiến độ trong kỳ này
}
