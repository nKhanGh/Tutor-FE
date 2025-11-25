import { faCalendar, faHome } from '@fortawesome/free-regular-svg-icons';
import {
    faArrowRightFromBracket,
    faArrowTrendUp,
    faBook,
    faBuildingColumns,
    faGraduationCap,
    faPersonChalkboard,
    faRotateLeft,
} from '@fortawesome/free-solid-svg-icons';
import { faHandHoldingHand } from '@fortawesome/free-solid-svg-icons/faHandHoldingHand';
import { NavLink } from 'react-router-dom';
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from '@/contexts/AuthContext';
import { getUserInitials } from '@/utils/helpers'; // Import helper

interface SidebarItem {
    icon: IconDefinition;
    content: string;
    path: string;
}

const Sidebar = () => {
    const { user, logout } = useAuth();
    let sidebarElements: SidebarItem[] = [];

    const role = user?.role;

    switch (role) {
        case 'student':
            sidebarElements = [
                {
                    icon: faHome,
                    content: 'Tổng quan',
                    path: '/student/overview',
                },
                {
                    icon: faBook,
                    content: 'Đăng kí chương trình',
                    path: '/student/register-program',
                },
                {
                    icon: faGraduationCap,
                    content: 'Lựa chọn tutor',
                    path: '/student/choose-tutor',
                },
                {
                    icon: faCalendar,
                    content: 'Lịch trình của tôi',
                    path: '/student/schedule',
                },
                {
                    icon: faRotateLeft,
                    content: 'Lịch sử buổi học',
                    path: '/student/study-history',
                },
                {
                    icon: faBuildingColumns,
                    content: 'Thư viện HCMUT',
                    path: '/hcmut-library/all-documents',
                },
            ];
            break;
        case 'tutor':
            sidebarElements = [
                { icon: faHome, content: 'Tổng quan', path: '/tutor/overview' },
                {
                    icon: faCalendar,
                    content: 'Quản lí lịch rảnh',
                    path: '/tutor/availability-management',
                },
                {
                    icon: faGraduationCap,
                    content: 'Tiến độ sinh viên',
                    path: '/tutor/student-progress',
                },
                {
                    icon: faArrowTrendUp,
                    content: 'Thống kê',
                    path: '/tutor/statistic',
                },
                {
                    icon: faRotateLeft,
                    content: 'Lịch sử buổi học',
                    path: '/tutor/study-history',
                },
                {
                    icon: faBuildingColumns,
                    content: 'Thư viện HCMUT',
                    path: '/hcmut-library/all-documents',
                },
            ];
            break;
        case 'coordinator':
            sidebarElements = [
                {
                    icon: faHome,
                    content: 'Tổng quan',
                    path: '/coordinator/overview',
                },
                {
                    icon: faHandHoldingHand,
                    content: 'Ghép cặp',
                    path: '/coordinator/match-tutor-student',
                },
                {
                    icon: faCalendar,
                    content: 'Quản lí lịch trình',
                    path: '/coordinator/schedule-management',
                },
                {
                    icon: faPersonChalkboard,
                    content: 'Quản lí tutor',
                    path: '/coordinator/tutor-management',
                },
                {
                    icon: faGraduationCap,
                    content: 'Quản lí sinh viên',
                    path: '/coordinator/student-management',
                },
            ];
            break;
        default:
            sidebarElements = [];
            break;
    }

    const displayRole =
        role === 'student'
            ? 'Sinh viên'
            : role === 'tutor'
              ? 'Tutor'
              : role === 'coordinator'
                ? 'Điều phối viên'
                : 'Người dùng';

    return (
        <div className='fixed left-0 top-0 z-40 flex h-full w-[80px] flex-col items-center gap-6 border-r-[2px] border-gray-200 bg-white py-[25px] font-bevietnam md:w-[260px] md:p-[25px]'>
            {/* LOGO APP */}
            <div className='flex justify-start gap-2 md:w-[227px]'>
                <div className='flex h-[40px] w-[40px] items-center justify-center rounded-[8px] bg-gradient-to-r from-blue-primary to-blue-secondary text-xl font-bold text-white shadow-md'>
                    BK
                </div>
                <div className='ml-1 hidden h-full items-center justify-center text-[16px] font-bold text-blue-primary md:flex'>
                    Hệ thống Tutor
                </div>
            </div>

            {/* MENU ITEMS */}
            <div className='w-full flex-1'>
                {sidebarElements.map((element) => (
                    <NavLink
                        to={element.path}
                        key={element.path}
                        className={({ isActive }) =>
                            `mb-2 flex h-[44px] w-full items-center gap-3 rounded-[8px] px-4 text-[14px] font-medium transition-all md:w-[227px] ${
                                isActive
                                    ? 'bg-blue-primary text-white shadow-md shadow-blue-200'
                                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-primary'
                            }`
                        }
                    >
                        <FontAwesomeIcon icon={element.icon} className='w-5' />
                        <span className='hidden md:block'>
                            {element.content}
                        </span>
                    </NavLink>
                ))}
            </div>

            {/* USER PROFILE */}
            <div className='mt-auto flex h-[70px] items-center gap-3 rounded-[12px] bg-blue-50 p-[12px] transition-colors hover:bg-blue-100 md:w-[227px]'>
                {/* AVATAR LOGIC */}
                <div
                    className={`flex h-[40px] w-[40px] flex-shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white text-sm font-bold text-white shadow-sm ${user?.avatarBg || 'bg-blue-primary'}`}
                >
                    {user?.avatar ? (
                        <img
                            src={user.avatar}
                            alt={user.name}
                            className='h-full w-full object-cover'
                        />
                    ) : (
                        getUserInitials(user?.name || '')
                    )}
                </div>

                <div className='hidden overflow-hidden md:block'>
                    <div className='truncate text-sm font-bold text-gray-800'>
                        {user?.name || 'Guest'}
                    </div>
                    <div className='text-[11px] font-semibold uppercase text-blue-500'>
                        {displayRole}
                    </div>
                </div>
            </div>

            <button
                onClick={logout}
                className='flex h-[44px] w-full cursor-pointer items-center justify-center rounded-lg pl-0 font-medium text-gray-500 transition-colors hover:bg-red-50 hover:text-red-500 md:w-[227px] md:justify-start md:pl-2'
            >
                <FontAwesomeIcon
                    icon={faArrowRightFromBracket}
                    className='mt-0.5 md:mr-2'
                />
                <span className='hidden text-[14px] md:block'>Đăng xuất</span>
            </button>
        </div>
    );
};

export default Sidebar;
