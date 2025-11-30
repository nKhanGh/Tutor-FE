import type { StudentProfile, StudentStatus } from '@/interfaces'; // Cập nhật import
import { storage } from '@/utils/storage';
import { useEffect } from 'react';

const getStatusBadge = (status: StudentStatus) => {
    let colors = '';
    switch (status) {
        case 'Đã hoàn thành':
            colors = 'bg-green-100 text-green-600';
            break;
        case 'Đang học':
            colors = 'bg-blue-100 text-blue-600';
            break;
        case 'Chưa hoàn thành':
            colors = 'bg-yellow-100 text-yellow-600';
            break;
        case 'Hủy môn':
            colors = 'bg-red-100 text-red-600';
            break;
    }
    return (
        <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${colors}`}
        >
            {status}
        </span>
    );
};

interface StudentListViewProps {
    students: StudentProfile[]; // Cập nhật type
    onViewDetails: (student: StudentProfile) => void;
}

const StudentListView: React.FC<StudentListViewProps> = ({
    students,
    onViewDetails,
}) => {
    const registerDate =
        storage.getRegistrationByStudentId(students[0]?.id || '')?.createdAt ||
        '';
    useEffect(() => {
        console.log('Students data:', students);
        console.log('Register date sample:', registerDate);
    }, [students, registerDate]);
    return (
        <div className='h-full'>
            <h1 className='mb-6 text-3xl font-bold text-gray-800'>
                Quản lý Sinh viên
            </h1>
            {/* ... (Phần Search/Filter giữ nguyên) ... */}

            <div className='overflow-hidden rounded-2xl bg-white shadow-sm'>
                <table className='w-full table-auto'>
                    <thead className='border-b border-gray-100 bg-gray-50'>
                        <tr>
                            <th className='px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500'>
                                ID
                            </th>
                            <th className='px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500'>
                                Họ Tên
                            </th>
                            <th className='px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500'>
                                Ngày ĐK
                            </th>
                            <th className='px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500'>
                                Trạng thái
                            </th>
                            <th className='px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500'>
                                Trình độ
                            </th>
                        </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-100'>
                        {students.map((student) => (
                            <tr
                                key={student.id}
                                onClick={() => onViewDetails(student)}
                                className='cursor-pointer transition hover:bg-gray-50'
                            >
                                <td className='px-4 py-3 text-sm text-gray-600'>
                                    {student.id}
                                </td>
                                <td className='px-4 py-3'>
                                    <p className='font-medium text-gray-800'>
                                        {student.name}
                                    </p>
                                    <p className='text-xs text-gray-500'>
                                        {student.mssv}
                                    </p>
                                </td>
                                <td className='px-4 py-3 text-sm text-gray-600'>
                                    {storage.getRegistrationByStudentId(
                                        student.id,
                                    )?.createdAt || ''}
                                </td>
                                <td className='px-4 py-3'>
                                    {getStatusBadge(student.status)}
                                </td>
                                <td className='px-4 py-3 text-sm text-gray-600'>
                                    {student.level}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* ... (Pagination giữ nguyên) ... */}
        </div>
    );
};

export default StudentListView;
