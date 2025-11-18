import { Filter, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Student, StudentStatus } from '@/interfaces/Student'; // Import "luật"

// Hàm render badge (đưa vào chung file component)
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

// Định nghĩa props mà component này nhận
interface StudentListViewProps {
    students: Student[];
    onViewDetails: (student: Student) => void;
}

// Component
const StudentListView: React.FC<StudentListViewProps> = ({
    students,
    onViewDetails,
}) => {
    return (
        <div className='h-full'>
            <h1 className='mb-6 text-3xl font-bold text-gray-800'>
                Quản lý Sinh viên
            </h1>
            <div className='mb-4 flex items-center justify-between'>
                <button className='rounded-lg border border-gray-300 bg-white p-2 text-gray-600 shadow-sm transition hover:bg-gray-50'>
                    <Filter size={20} />
                </button>
                <div className='relative w-full max-w-xs'>
                    <Search
                        size={18}
                        className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
                    />
                    <input
                        type='text'
                        placeholder='Tìm kiếm...'
                        className='w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                </div>
            </div>
            <div className='overflow-hidden rounded-2xl bg-white shadow-sm'>
                <table className='w-full table-auto'>
                    <thead className='border-b border-gray-100 bg-gray-50'>
                        <tr>
                            <th className='px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500'>
                                #
                            </th>
                            <th className='px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500'>
                                Họ Tên
                            </th>
                            <th className='px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500'>
                                Thời gian đăng ký
                            </th>
                            <th className='px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500'>
                                Status
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
                                    {student.registrationDate}
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
            <div className='mt-4 flex items-center justify-between text-sm'>
                <p className='text-gray-600'>1-10 of 97</p>
                <div className='flex items-center gap-2'>
                    <span className='text-gray-600'>Rows per page: 10</span>
                    <button className='rounded-full p-1 text-gray-500 hover:bg-gray-100'>
                        <ChevronLeft size={20} />
                    </button>
                    <button className='rounded-full p-1 text-gray-500 hover:bg-gray-100'>
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudentListView;
