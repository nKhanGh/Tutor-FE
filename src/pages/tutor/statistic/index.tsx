import { useState, useEffect } from 'react';
import Sidebar from '@/components/layouts/Sidebar';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';
import { FileDown, Calendar, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { storage } from '@/utils/storage';
// Import thư viện xuất PDF
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// --- ĐỊNH NGHĨA TYPE ---
interface BarChartData {
    name: string;
    sessions: number;
    [key: string]: string | number;
}

interface PieChartData {
    name: string;
    value: number;
    color: string;
    [key: string]: string | number;
}

interface LineChartData {
    name: string;
    rating: number;
    [key: string]: string | number;
}

interface CancellationData {
    name: string; // Tên môn
    rate: number; // Tỷ lệ %
    cancelled: number; // Số buổi hủy của môn này
    total: number; // Tổng số buổi của môn này
    [key: string]: string | number;
}
// ------------------------------

// --- HÀM HELPER TẠO MÀU ĐỘNG ---
const generateColors = (count: number) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
        const hue = Math.floor((i * 360) / count);
        colors.push(`hsl(${hue}, 70%, 50%)`);
    }
    return colors;
};

const Statistic = () => {
    const { user } = useAuth();

    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState<number>(currentYear);
    const [availableYears, setAvailableYears] = useState<number[]>([]);

    const [barData, setBarData] = useState<BarChartData[]>([]);
    const [pieData, setPieData] = useState<PieChartData[]>([]);
    const [lineData, setLineData] = useState<LineChartData[]>([]);
    const [cancellationData, setCancellationData] = useState<
        CancellationData[]
    >([]);
    const [stats, setStats] = useState({ totalSessions: 0, avgRating: 0 });

    // State cho việc loading khi xuất PDF
    const [isExporting, setIsExporting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (user) {
                const sessions = storage.getSessionsForTutor(user.id);

                // --- 0. TÍNH TOÁN DANH SÁCH NĂM ---
                const yearSet = new Set<number>();
                for (let i = currentYear - 10; i <= currentYear + 10; i++) {
                    yearSet.add(i);
                }
                sessions.forEach((s) => {
                    let y = 0;
                    if (s.date.includes('/')) {
                        y = parseInt(s.date.split('/')[2], 10);
                    } else if (s.date.includes('-')) {
                        y = parseInt(s.date.split('-')[0], 10);
                    }
                    if (y > 0) yearSet.add(y);
                });
                const sortedYears = Array.from(yearSet).sort((a, b) => b - a);
                setAvailableYears(sortedYears);

                // --- 1. Khởi tạo cấu trúc dữ liệu ---
                const monthStats: Record<
                    string,
                    {
                        sessions: number;
                        totalRating: number;
                        reviewCount: number;
                    }
                > = {};
                for (let i = 1; i <= 12; i++) {
                    monthStats[`T${i}`] = {
                        sessions: 0,
                        totalRating: 0,
                        reviewCount: 0,
                    };
                }

                // --- 2. Lọc và xử lý dữ liệu ---
                let filteredSessionCount = 0;
                let filteredTotalRating = 0;
                let filteredRatedCount = 0;

                const subjectCounts: Record<string, number> = {};
                const subjectCancellation: Record<
                    string,
                    { total: number; cancelled: number }
                > = {};

                sessions.forEach((s) => {
                    let sYear = 0;
                    let sMonth = 0;

                    if (s.date.includes('/')) {
                        const parts = s.date.split('/');
                        sMonth = parseInt(parts[1], 10);
                        sYear = parseInt(parts[2], 10);
                    } else if (s.date.includes('-')) {
                        const parts = s.date.split('-');
                        sYear = parseInt(parts[0], 10);
                        sMonth = parseInt(parts[1], 10);
                    }

                    if (sYear === selectedYear && sMonth >= 1 && sMonth <= 12) {
                        const key = `T${sMonth}`;

                        monthStats[key].sessions += 1;
                        if (s.review && s.review.rating) {
                            monthStats[key].totalRating += s.review.rating;
                            monthStats[key].reviewCount += 1;
                            filteredTotalRating += s.review.rating;
                            filteredRatedCount += 1;
                        }

                        filteredSessionCount += 1;

                        const subject = s.title.split('-')[0].trim();

                        if (subjectCounts[subject]) {
                            subjectCounts[subject] += 1;
                        } else {
                            subjectCounts[subject] = 1;
                        }

                        if (!subjectCancellation[subject]) {
                            subjectCancellation[subject] = {
                                total: 0,
                                cancelled: 0,
                            };
                        }
                        subjectCancellation[subject].total += 1;

                        if (
                            s.status === 'cancelled-tutor' ||
                            s.status === 'cancelled-student'
                        ) {
                            subjectCancellation[subject].cancelled += 1;
                        }
                    }
                });

                // --- 3. Transform Data cho Biểu đồ ---
                const bData: BarChartData[] = [];
                const lData: LineChartData[] = [];

                for (let i = 1; i <= 12; i++) {
                    const key = `T${i}`;
                    const item = monthStats[key];
                    bData.push({ name: key, sessions: item.sessions });
                    const avg =
                        item.reviewCount > 0
                            ? parseFloat(
                                  (item.totalRating / item.reviewCount).toFixed(
                                      1,
                                  ),
                              )
                            : 0;
                    lData.push({ name: key, rating: avg });
                }

                const cData: CancellationData[] = Object.keys(
                    subjectCancellation,
                ).map((subj) => {
                    const item = subjectCancellation[subj];
                    const rate =
                        item.total > 0
                            ? parseFloat(
                                  ((item.cancelled / item.total) * 100).toFixed(
                                      1,
                                  ),
                              )
                            : 0;
                    return {
                        name: subj,
                        rate: rate,
                        cancelled: item.cancelled,
                        total: item.total,
                    };
                });

                const subjects = Object.keys(subjectCounts);
                const dynamicColors = generateColors(subjects.length);

                const pData: PieChartData[] = subjects.map((key, index) => ({
                    name: key,
                    value: subjectCounts[key],
                    color: dynamicColors[index],
                }));

                setBarData(bData);
                setLineData(lData);
                setCancellationData(cData);

                setPieData(
                    pData.length > 0
                        ? pData
                        : [
                              {
                                  name: 'Chưa có dữ liệu',
                                  value: 100,
                                  color: '#e5e7eb',
                              },
                          ],
                );

                setStats({
                    totalSessions: filteredSessionCount,
                    avgRating:
                        filteredRatedCount > 0
                            ? parseFloat(
                                  (
                                      filteredTotalRating / filteredRatedCount
                                  ).toFixed(1),
                              )
                            : 0,
                });
            }
        }, 0);
        return () => clearTimeout(timer);
    }, [user, selectedYear, currentYear]);

    // --- HÀM XỬ LÝ XUẤT PDF ---
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
            pdf.save(
                `Bao_cao_thong_ke_${selectedYear}_${user?.name || 'Tutor'}.pdf`,
            );
        } catch (error) {
            console.error('Lỗi khi xuất PDF:', error);
            alert('Có lỗi xảy ra khi tạo file PDF. Vui lòng thử lại.');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <>
            <Sidebar />
            {/* Thêm ID vào đây để html2canvas chụp lại toàn bộ vùng này */}
            <div
                id='report-content'
                className='ml-[80px] min-h-screen bg-[#f4f7fc] p-6 font-bevietnam transition-all duration-300 md:ml-[260px]'
            >
                {/* Header */}
                <div className='mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
                    <div>
                        <h1 className='text-2xl font-bold text-gray-800'>
                            Thống kê & Báo cáo
                        </h1>
                        <p className='text-gray-500'>
                            Tổng quan năm {selectedYear}:{' '}
                            <span className='font-bold text-[#0795DF]'>
                                {stats.totalSessions}
                            </span>{' '}
                            buổi dạy | Đánh giá TB:{' '}
                            <span className='font-bold text-yellow-500'>
                                {stats.avgRating}/5.0
                            </span>
                        </p>
                    </div>

                    <div
                        className='flex items-center gap-3'
                        data-html2canvas-ignore='true'
                    >
                        {/* data-html2canvas-ignore="true" giúp ẩn các nút khi xuất file PDF nếu muốn, 
                            nhưng ở đây ta để lại để biết context. 
                            Nếu muốn ẩn nút khi in, bỏ class này ra khỏi div chứa button hoặc dùng css.
                        */}

                        {/* Year Selector */}
                        <div className='relative'>
                            <Calendar
                                size={18}
                                className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500'
                            />
                            <select
                                value={selectedYear}
                                onChange={(e) =>
                                    setSelectedYear(Number(e.target.value))
                                }
                                disabled={isExporting}
                                className='max-h-60 cursor-pointer appearance-none overflow-y-auto rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-8 font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0795DF] disabled:opacity-50'
                            >
                                {availableYears.map((y) => (
                                    <option key={y} value={y}>
                                        Năm {y}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            onClick={handleExportPDF}
                            disabled={isExporting}
                            className='flex items-center gap-2 rounded-lg border border-[#0795DF] bg-white px-5 py-2 font-semibold text-[#0795DF] shadow-sm transition-all hover:bg-[#0795DF] hover:text-white disabled:cursor-not-allowed disabled:opacity-70'
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
                </div>

                {/* Charts Grid */}
                <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
                    {/* 1. Bar Chart */}
                    <div className='rounded-xl border border-gray-100 bg-white p-6 shadow-sm'>
                        <h3 className='mb-4 text-lg font-bold text-gray-800'>
                            Số buổi tư vấn (Năm {selectedYear})
                        </h3>
                        <div className='h-[300px] w-full'>
                            <ResponsiveContainer width='100%' height='100%'>
                                <BarChart data={barData}>
                                    <CartesianGrid
                                        strokeDasharray='3 3'
                                        vertical={false}
                                    />
                                    <XAxis
                                        dataKey='name'
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        allowDecimals={false}
                                    />
                                    <Tooltip
                                        cursor={{ fill: '#f4f7fc' }}
                                        contentStyle={{
                                            borderRadius: '8px',
                                            border: 'none',
                                            boxShadow:
                                                '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                        }}
                                    />
                                    <Bar
                                        dataKey='sessions'
                                        name='Số buổi'
                                        fill='#00C0EF'
                                        radius={[4, 4, 0, 0]}
                                        barSize={20}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* 2. Line Chart */}
                    <div className='rounded-xl border border-gray-100 bg-white p-6 shadow-sm'>
                        <h3 className='mb-4 text-lg font-bold text-gray-800'>
                            Đánh giá trung bình (Năm {selectedYear})
                        </h3>
                        <div className='h-[300px] w-full'>
                            <ResponsiveContainer width='100%' height='100%'>
                                <LineChart data={lineData}>
                                    <CartesianGrid
                                        strokeDasharray='3 3'
                                        vertical={false}
                                    />
                                    <XAxis
                                        dataKey='name'
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        domain={[0, 5]}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: '8px',
                                            border: 'none',
                                            boxShadow:
                                                '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                        }}
                                    />
                                    <Line
                                        type='monotone'
                                        dataKey='rating'
                                        name='Điểm'
                                        stroke='#333'
                                        strokeWidth={2}
                                        dot={{ r: 3, fill: '#00C0EF' }}
                                        activeDot={{ r: 5 }}
                                        connectNulls={true}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* 3. Pie Chart (Fixed Bug & Dynamic Colors) */}
                    <div className='rounded-xl border border-gray-100 bg-white p-6 shadow-sm'>
                        <h3 className='mb-4 text-lg font-bold text-gray-800'>
                            Tỷ lệ các môn học đã dạy (Năm {selectedYear})
                        </h3>
                        <div className='h-[300px] w-full'>
                            <ResponsiveContainer width='100%' height='100%'>
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        innerRadius={80}
                                        outerRadius={110}
                                        paddingAngle={5}
                                        dataKey='value'
                                        label={({ percent }) =>
                                            `${((percent || 0) * 100).toFixed(1)}%`
                                        }
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.color}
                                                strokeWidth={0}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: '8px',
                                            border: 'none',
                                            boxShadow:
                                                '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                        }}
                                    />
                                    <Legend
                                        verticalAlign='middle'
                                        align='right'
                                        layout='vertical'
                                        iconType='circle'
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* 4. Cancellation Chart */}
                    <div className='rounded-xl border border-gray-100 bg-white p-6 shadow-sm'>
                        <h3 className='mb-4 text-lg font-bold text-gray-800'>
                            Tỷ lệ hủy lớp theo môn (%)
                        </h3>
                        <div className='h-[300px] w-full'>
                            <ResponsiveContainer width='100%' height='100%'>
                                <BarChart
                                    data={cancellationData}
                                    layout='vertical'
                                    margin={{ left: 10, right: 10 }}
                                >
                                    <CartesianGrid
                                        strokeDasharray='3 3'
                                        horizontal={false}
                                    />
                                    <XAxis
                                        type='number'
                                        domain={[0, 100]}
                                        hide
                                    />
                                    <YAxis
                                        dataKey='name'
                                        type='category'
                                        width={120}
                                        tick={{ fontSize: 12 }}
                                    />
                                    <Tooltip
                                        cursor={{ fill: '#f4f7fc' }}
                                        contentStyle={{
                                            borderRadius: '8px',
                                            border: 'none',
                                            boxShadow:
                                                '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                        }}
                                        formatter={(
                                            value: number,
                                            name: string,
                                            props: { payload?: unknown },
                                        ) => {
                                            const data =
                                                props.payload as CancellationData;
                                            if (!data) return [value, name];
                                            return [
                                                `${value}% (${data.cancelled}/${data.total} buổi)`,
                                                'Tỷ lệ hủy',
                                            ];
                                        }}
                                    />
                                    <Bar
                                        dataKey='rate'
                                        fill='#ef4444'
                                        radius={[0, 4, 4, 0]}
                                        barSize={20}
                                        name='Tỷ lệ hủy'
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Statistic;
