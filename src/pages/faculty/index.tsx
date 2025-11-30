import Sidebar from '@/components/layouts/Sidebar';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { FileDown, Loader2 } from 'lucide-react';
import { useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    Legend,
} from 'recharts';

// --- MOCK DATA ---
const dataBar = [
    { name: 'T5', value: 320 },
    { name: 'T6', value: 400 },
    { name: 'T7', value: 390 },
    { name: 'T8', value: 450 },
    { name: 'T9', value: 510 },
    { name: 'T10', value: 470 },
];

const dataLine = [
    { name: 'T5', value: 4.2 },
    { name: 'T6', value: 4.35 },
    { name: 'T7', value: 4.3 },
    { name: 'T8', value: 4.5 },
    { name: 'T9', value: 4.7 },
    { name: 'T10', value: 4.6 },
];

const dataPie = [
    { name: 'Đại số', value: 30, color: '#0099D6' },
    { name: 'OOP', value: 25, color: '#10B981' },
    { name: 'CSDL', value: 20, color: '#8B5CF6' },
    { name: 'KTMT', value: 15, color: '#F59E0B' },
    { name: 'Khác', value: 10, color: '#A78BFA' },
];

const dataHBar = [
    // Horizontal Bar Data
    { name: 'Đã xử lý', value: 85, color: '#10B981' },
    { name: 'Chờ phản hồi', value: 15, color: '#0099D6' },
    { name: 'Từ chối', value: 5, color: '#EF4444' },
    { name: 'Đã hủy', value: 4, color: '#9CA3AF' },
];

const topStudents = [
    {
        id: 1,
        name: 'Đặng Phạm Gia Long',
        mssv: '2311892',
        khoa: 'CNTT',
        sessions: 45,
        rating: 4.9,
        status: 'Active',
    },
    {
        id: 2,
        name: 'Cấn Hoàng Hà',
        mssv: '2311893',
        khoa: 'Đ-ĐT',
        sessions: 38,
        rating: 4.8,
        status: 'Active',
    },
    {
        id: 3,
        name: 'Nguyễn Hữu Khang',
        mssv: '2311894',
        khoa: 'Hóa',
        sessions: 32,
        rating: 4.5,
        status: 'Inactive',
    },
    {
        id: 4,
        name: 'Phạm Thị Dung',
        mssv: '2311895',
        khoa: 'CNTT',
        sessions: 30,
        rating: 4.6,
        status: 'Inactive',
    },
];

const Faculty = () => {
    const [isExporting, setIsExporting] = useState(false);

    const handleExportPDF = async () => {
        const element = document.getElementById('report-content');
        if (!element) return;

        setIsExporting(true);

        try {
            // Chờ một chút để đảm bảo UI render xong nếu có thay đổi
            await new Promise((resolve) => setTimeout(resolve, 100));

            const canvas = await html2canvas(element, {
                scale: 2, // Tăng độ phân giải ảnh (2x) cho sắc nét
                useCORS: true, // Cho phép load ảnh cross-origin nếu có
                logging: false,
                backgroundColor: '#f4f7fc', // Màu nền khớp với bg
            });

            const imgData = canvas.toDataURL('image/png');

            // Khởi tạo PDF khổ A4
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
            });

            const imgWidth = 210; // Chiều rộng A4 (mm)
            const pageHeight = 297; // Chiều cao A4 (mm)

            // Tính chiều cao ảnh dựa trên tỷ lệ gốc
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            let heightLeft = imgHeight;
            let position = 0;

            // Vẽ ảnh trang đầu tiên
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            // Nếu nội dung dài hơn 1 trang, thêm trang mới (logic cơ bản)
            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            // Lưu file
            pdf.save(`Bao_cao_thong_ke_tong_quan.pdf`);
        } catch (error) {
            console.error('Lỗi khi xuất PDF:', error);
            alert('Có lỗi xảy ra khi tạo file PDF. Vui lòng thử lại.');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className='flex min-h-screen bg-[#F9FAFB] text-gray-600'>
            <Sidebar />

            <div className='ml-[260px] w-full p-8' id='report-content'>
                {/* 1. HEADER & FILTERS */}
                <div className='mb-8 flex flex-col gap-6'>
                    <div className='flex items-start justify-between'>
                        <div>
                            <h1 className='text-2xl font-bold text-gray-900'>
                                Thống kê & Báo cáo
                            </h1>
                            <p className='mt-1 text-gray-500'>
                                Phân tích hiệu suất chương trình Tutor
                            </p>
                        </div>
                        <button
                            onClick={handleExportPDF}
                            disabled={isExporting}
                            className='flex gap-2 rounded-lg bg-[#0099D6] px-5 py-2 font-medium text-white shadow-sm transition-colors hover:bg-[#0088C0]'
                        >
                            {isExporting ? (
                                <Loader2 size={20} className='animate-spin' />
                            ) : (
                                <FileDown size={20} />
                            )}
                            <span className='hidden sm:inline'>
                                {isExporting ? 'Đang tạo...' : 'Xuất Báo Cáo'}
                            </span>
                        </button>
                    </div>

                    {/* Filter Bar */}
                    <div className='flex w-fit items-center gap-4 rounded-lg border border-gray-200 bg-white p-2'>
                        <div className='flex items-center gap-2 border-r border-gray-200 px-3'>
                            <span className='text-sm font-bold text-gray-700'>
                                Học kỳ:
                            </span>
                            <select className='cursor-pointer bg-transparent text-sm font-medium text-gray-900 outline-none'>
                                <option>HK 251 (2025-2026)</option>
                                <option>HK 252 (2025-2026)</option>
                            </select>
                        </div>
                        <div className='flex items-center gap-2 px-3'>
                            <span className='text-sm font-bold text-gray-700'>
                                Khoa:
                            </span>
                            <select className='cursor-pointer bg-transparent text-sm font-medium text-gray-900 outline-none'>
                                <option>Tất cả</option>
                                <option>Khoa học & Kỹ thuật Máy tính</option>
                                <option>Điện - Điện tử</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* 2. STATS CARDS */}
                <div className='mb-8 grid grid-cols-4 gap-6'>
                    {/* Card 1 */}
                    <div className='relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm'>
                        <div className='mb-4 flex items-start justify-between'>
                            <h3 className='text-3xl font-bold text-gray-800'>
                                1,248
                            </h3>
                            <div className='rounded-lg bg-blue-50 p-2 text-blue-600'>
                                <svg
                                    className='h-6 w-6'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                    stroke='currentColor'
                                >
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth={2}
                                        d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
                                    />
                                </svg>
                            </div>
                        </div>
                        <p className='mb-1 text-sm font-medium text-gray-500'>
                            Tổng số buổi tham gia
                        </p>
                        <span className='rounded bg-green-50 px-2 py-0.5 text-xs font-bold text-green-500'>
                            +12.5% so với kỳ trước
                        </span>
                    </div>

                    {/* Card 2 */}
                    <div className='relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm'>
                        <div className='mb-4 flex items-start justify-between'>
                            <h3 className='text-3xl font-bold text-gray-800'>
                                892
                            </h3>
                            <div className='rounded-lg bg-green-50 p-2 text-green-600'>
                                <svg
                                    className='h-6 w-6'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                    stroke='currentColor'
                                >
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth={2}
                                        d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                                    />
                                </svg>
                            </div>
                        </div>
                        <p className='mb-1 text-sm font-medium text-gray-500'>
                            Yêu cầu hoàn thành
                        </p>
                        <span className='rounded bg-green-50 px-2 py-0.5 text-xs font-bold text-green-500'>
                            +8.2% so với kỳ trước
                        </span>
                    </div>

                    {/* Card 3 */}
                    <div className='relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm'>
                        <div className='mb-4 flex items-start justify-between'>
                            <h3 className='text-3xl font-bold text-gray-800'>
                                +18.5
                            </h3>
                            <div className='rounded-lg bg-yellow-50 p-2 text-yellow-600'>
                                <svg
                                    className='h-6 w-6'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                    stroke='currentColor'
                                >
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth={2}
                                        d='M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'
                                    />
                                </svg>
                            </div>
                        </div>
                        <p className='mb-1 text-sm font-medium text-gray-500'>
                            Điểm rèn luyện cộng thêm
                        </p>
                        <span className='rounded bg-green-50 px-2 py-0.5 text-xs font-bold text-green-500'>
                            Mức 1 so với kỳ trước
                        </span>
                    </div>

                    {/* Card 4 */}
                    <div className='relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm'>
                        <div className='mb-4 flex items-start justify-between'>
                            <h3 className='text-3xl font-bold text-gray-800'>
                                156
                            </h3>
                            <div className='rounded-lg bg-purple-50 p-2 text-purple-600'>
                                <svg
                                    className='h-6 w-6'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                    stroke='currentColor'
                                >
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth={2}
                                        d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
                                    />
                                </svg>
                            </div>
                        </div>
                        <p className='mb-1 text-sm font-medium text-gray-500'>
                            Học công tốt tốt
                        </p>
                        <span className='rounded bg-green-50 px-2 py-0.5 text-xs font-bold text-green-500'>
                            Tăng trưởng ổn định
                        </span>
                    </div>
                </div>

                {/* 3. CHARTS SECTION */}
                <div className='mb-8 space-y-6'>
                    {/* Chart 1: Số buổi tư vấn theo tháng */}
                    <div className='rounded-2xl border border-gray-100 bg-white p-6 shadow-md'>
                        <h3 className='mb-1 font-bold text-gray-800'>
                            Số buổi tư vấn theo tháng
                        </h3>
                        <p className='mb-6 text-xs text-gray-400'>
                            Thống kê 6 tháng gần đây
                        </p>
                        <div className='h-[250px] w-full'>
                            <ResponsiveContainer width='100%' height='100%'>
                                <BarChart data={dataBar}>
                                    <CartesianGrid
                                        strokeDasharray='3 3'
                                        vertical={false}
                                        stroke='#E5E7EB'
                                    />
                                    <XAxis
                                        dataKey='name'
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#6B7280', fontSize: 12 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#6B7280', fontSize: 12 }}
                                    />
                                    <Tooltip
                                        cursor={{ fill: '#F3F4F6' }}
                                        contentStyle={{
                                            borderRadius: '8px',
                                            border: 'none',
                                            boxShadow:
                                                '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                        }}
                                    />
                                    <Bar
                                        dataKey='value'
                                        fill='#38BDF8'
                                        radius={[4, 4, 0, 0]}
                                        barSize={40}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Chart 2: Điểm đánh giá trung bình */}
                    <div className='rounded-2xl border border-gray-100 bg-white p-6 shadow-md'>
                        <h3 className='mb-1 font-bold text-gray-800'>
                            Điểm đánh giá trung bình
                        </h3>
                        <p className='mb-6 text-xs text-gray-400'>
                            Xu hướng chất lượng tư vấn
                        </p>
                        <div className='h-[250px] w-full'>
                            <ResponsiveContainer width='100%' height='100%'>
                                <LineChart data={dataLine}>
                                    <CartesianGrid
                                        strokeDasharray='3 3'
                                        vertical={false}
                                        stroke='#E5E7EB'
                                    />
                                    <XAxis
                                        dataKey='name'
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#6B7280', fontSize: 12 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        domain={[4.0, 5.0]}
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#6B7280', fontSize: 12 }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: '8px',
                                            border: 'none',
                                            boxShadow:
                                                '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                        }}
                                    />
                                    <defs>
                                        <linearGradient
                                            id='colorValue'
                                            x1='0'
                                            y1='0'
                                            x2='0'
                                            y2='1'
                                        >
                                            <stop
                                                offset='5%'
                                                stopColor='#38BDF8'
                                                stopOpacity={0.3}
                                            />
                                            <stop
                                                offset='95%'
                                                stopColor='#38BDF8'
                                                stopOpacity={0}
                                            />
                                        </linearGradient>
                                    </defs>
                                    <Line
                                        type='monotone'
                                        dataKey='value'
                                        stroke='#0EA5E9'
                                        strokeWidth={3}
                                        dot={{
                                            r: 4,
                                            fill: '#0EA5E9',
                                            strokeWidth: 2,
                                            stroke: '#fff',
                                        }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Row 3: Pie & Horizontal Bar */}
                    <div className='grid grid-cols-2 gap-6'>
                        {/* Pie Chart */}
                        <div className='rounded-2xl border border-gray-100 bg-white p-6 shadow-md'>
                            <h3 className='mb-6 font-bold text-gray-800'>
                                Tỷ lệ các môn học được yêu cầu
                            </h3>
                            <div className='flex h-[250px] w-full justify-center'>
                                <ResponsiveContainer width='100%' height='100%'>
                                    <PieChart>
                                        <Pie
                                            data={dataPie}
                                            cx='50%'
                                            cy='50%'
                                            innerRadius={50}
                                            outerRadius={80}
                                            paddingAngle={2}
                                            dataKey='value'
                                        >
                                            {dataPie.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={entry.color}
                                                    stroke='none'
                                                />
                                            ))}
                                        </Pie>
                                        <Legend
                                            layout='horizontal'
                                            verticalAlign='bottom'
                                            align='center'
                                            iconType='circle'
                                        />
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Horizontal Bar Chart (Custom HTML/CSS for simplicity and control) */}
                        <div className='rounded-2xl border border-gray-100 bg-white p-6 shadow-md'>
                            <h3 className='mb-6 font-bold text-gray-800'>
                                Tỷ lệ chấp nhận yêu cầu
                            </h3>
                            <div className='flex h-[250px] flex-col justify-center gap-4'>
                                {dataHBar.map((item, index) => (
                                    <div key={index} className='w-full'>
                                        <div className='mb-1 flex justify-between text-sm font-medium text-gray-600'>
                                            <span>{item.name}</span>
                                            <span>{item.value}%</span>
                                        </div>
                                        <div className='h-2.5 w-full rounded-full bg-gray-100'>
                                            <div
                                                className='h-2.5 rounded-full transition-all duration-500'
                                                style={{
                                                    width: `${item.value}%`,
                                                    backgroundColor: item.color,
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. TOP STUDENTS TABLE */}
                <div className='overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md'>
                    <div className='border-b border-gray-100 p-6'>
                        <h3 className='font-bold text-gray-800'>
                            Top Sinh viên tích cực nhất
                        </h3>
                    </div>
                    <table className='w-full text-left text-sm text-gray-600'>
                        <thead className='bg-gray-50 text-xs font-bold uppercase text-gray-400'>
                            <tr>
                                <th className='px-6 py-4'>Sinh viên</th>
                                <th className='px-6 py-4'>MSSV</th>
                                <th className='px-6 py-4'>Khoa</th>
                                <th className='px-6 py-4'>Số buổi</th>
                                <th className='px-6 py-4'>Điểm TL</th>
                                <th className='px-6 py-4'>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-100'>
                            {topStudents.map((student) => (
                                <tr
                                    key={student.id}
                                    className='transition-colors hover:bg-gray-50'
                                >
                                    <td className='px-6 py-4 font-medium text-gray-900'>
                                        {student.name}
                                    </td>
                                    <td className='px-6 py-4'>
                                        {student.mssv}
                                    </td>
                                    <td className='px-6 py-4'>
                                        {student.khoa}
                                    </td>
                                    <td className='px-6 py-4'>
                                        {student.sessions}
                                    </td>
                                    <td className='px-6 py-4 font-bold text-blue-600'>
                                        {student.rating}
                                    </td>
                                    <td className='px-6 py-4'>
                                        <span
                                            className={`rounded px-2 py-1 text-xs font-bold ${student.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}
                                        >
                                            {student.status === 'Active'
                                                ? 'Xuất sắc'
                                                : 'Tốt'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Faculty;
