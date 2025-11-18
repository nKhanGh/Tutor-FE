import Sidebar from '@/components/layouts/Sidebar';
import { useState } from 'react';
import type { Student } from '@/interfaces/Student'; // Import "luật"
import { mockStudents } from '@/interfaces/Student'; // Import data

// Import 2 component con
import StudentListView from '@/components/UI/coordinator/StudentListView';
import StudentDetailView from '@/components/UI/coordinator/StudentDetailView';

const StudentManagement = () => {
    // State để chuyển đổi giữa 2 chế độ xem
    const [view, setView] = useState<'list' | 'detail'>('list');
    // State để lưu SV được chọn khi xem chi tiết
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(
        null,
    );

    // Hàm xử lý khi nhấp vào một sinh viên
    const handleViewDetails = (student: Student) => {
        setSelectedStudent(student);
        setView('detail');
    };

    // Hàm xử lý khi nhấp nút "Quay lại"
    const handleBackToList = () => {
        setView('list');
        setSelectedStudent(null);
    };

    // Render component chính
    return (
        <>
            <Sidebar />
            <div className='ml-[80px] min-h-screen bg-blue-50 p-3 pt-4 sm:p-4 md:ml-[260px] md:p-6'>
                {/* Dựa vào state 'view' để hiển thị component con phù hợp */}
                {view === 'list' ? (
                    <StudentListView
                        students={mockStudents}
                        onViewDetails={handleViewDetails}
                    />
                ) : (
                    <StudentDetailView
                        student={selectedStudent}
                        onBack={handleBackToList}
                    />
                )}
            </div>
        </>
    );
};

export default StudentManagement;
