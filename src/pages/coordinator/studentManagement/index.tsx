import Sidebar from '@/components/layouts/Sidebar';
import { useState, useEffect } from 'react';
import type { StudentProfile } from '@/interfaces';
import { storage } from '@/utils/storage';

import StudentListView from '@/components/UI/coordinator/StudentListView';
import StudentDetailView from '@/components/UI/coordinator/StudentDetailView';

const StudentManagement = () => {
    const [view, setView] = useState<'list' | 'detail'>('list');
    const [selectedStudent, setSelectedStudent] =
        useState<StudentProfile | null>(null);
    const [students, setStudents] = useState<StudentProfile[]>([]);

    // Load data từ storage (Fixed: wrap in setTimeout to avoid synchronous setState warning)
    useEffect(() => {
        const timer = setTimeout(() => {
            const data = storage.getAllStudents();
            setStudents(data);
        }, 0);

        return () => clearTimeout(timer);
    }, []);

    const handleViewDetails = (student: StudentProfile) => {
        setSelectedStudent(student);
        setView('detail');
    };

    const handleBackToList = () => {
        setView('list');
        setSelectedStudent(null);
    };

    return (
        <>
            <Sidebar />
            <div className='ml-[80px] min-h-screen bg-blue-50 p-3 pt-4 sm:p-4 md:ml-[260px] md:p-6'>
                {view === 'list' ? (
                    <StudentListView
                        students={students}
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
