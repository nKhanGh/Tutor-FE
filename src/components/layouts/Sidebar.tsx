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
import { NavLink, useLocation } from 'react-router-dom';
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface SidebarItem {
    icon: IconDefinition;
    content: string;
    path: string;
}

interface ActorType {
    name: string;
    role: string;
}

const Sidebar = () => {
    const location = useLocation();
    const role = location.pathname.split('/')[1];
    let sidebarElements: SidebarItem[] = [];
    let actor: ActorType = { name: '', role: '' };
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
            actor = {
                name: 'Nguyễn Hữu Khang',
                role: 'Sinh viên',
            };
            break;
        case 'tutor':
            sidebarElements = [
                {
                    icon: faHome,
                    content: 'Tổng quan',
                    path: '/tutor/overview',
                },
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
            actor = {
                name: 'Nguyễn Văn Đức',
                role: 'Tutor',
            };
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
            actor = {
                name: 'Trương Thanh Nhân',
                role: 'Điều Phối viên',
            };
            break;
        case 'hcmut-library':
            sidebarElements = [
                {
                    icon: faBuildingColumns,
                    content: 'Tất cả tài liệu',
                    path: '/hcmut-library/all-documents',
                },
                {
                    icon: faBook,
                    content: 'Đã lưu',
                    path: '/hcmut-library/saved-documents',
                },
                {
                    icon: faBook,
                    content: 'Đã chia sẻ',
                    path: '/hcmut-library/shared-documents',
                },
            ];
            actor = {
                name: 'Đặng Phạm Gia Long',
                role: 'Tutor',
            };
            break;
        case 'faculty':
            sidebarElements = [
                {
                    icon: faArrowTrendUp,
                    content: 'Thống kê',
                    path: '/faculty',
                },
            ];
            actor = {
                name: 'Cấn Hoàng Hà',
                role: 'Phòng CTSV',
            };
            break;
        default:
            sidebarElements = [];
            break;
    }
    return (
        <div className='fixed left-0 top-0 flex h-full w-[80px] flex-col items-center gap-6 border-r-[2px] border-gray-200 bg-white py-[25px] md:w-[260px] md:p-[25px]'>
            <div className='flex justify-start gap-2 md:w-[227px]'>
                <div className='flex h-[40px] w-[40px] items-center justify-center rounded-[8px] bg-gradient-to-r from-blue-primary to-blue-secondary text-xl font-bold text-white'>
                    BK
                </div>
                <div className='ml-1 hidden h-full items-center justify-center text-[16px] font-semibold text-blue-primary md:flex'>
                    Hệ thống Tutor
                </div>
            </div>
            <div>
                {sidebarElements.map((element) => (
                    <NavLink
                        to={element.path}
                        key={element.path}
                        className={({ isActive }) =>
                            `mb-2 flex h-[44px] w-[46px] items-center gap-2 rounded-[8px] px-4 text-[16px] font-medium hover:bg-blue-primary hover:text-white md:w-[227px] ${
                                isActive
                                    ? 'bg-blue-primary text-white'
                                    : 'text-gray-500'
                            }`
                        }
                    >
                        <FontAwesomeIcon icon={element.icon} />
                        <span className='hidden md:block'>
                            {element.content}
                        </span>
                    </NavLink>
                ))}
            </div>
            <div className='mt-auto flex h-[70px] items-center gap-2 rounded-[12px] bg-blue-50 p-[12px] md:w-[227px]'>
                <div className='text-1xl flex h-[40px] w-[40px] items-center justify-center rounded-full bg-blue-primary font-semibold text-white'>
                    K
                </div>
                <div className='hidden md:block'>
                    <div className='font-bold'>{actor.name}</div>
                    <div className='text-[12px] font-semibold text-gray-500'>
                        {actor.role}
                    </div>
                </div>
            </div>

            <div className='flex h-[44px] cursor-pointer items-center pl-2 font-medium text-gray-500 hover:text-black focus:outline-none md:w-[227px]'>
                <FontAwesomeIcon
                    icon={faArrowRightFromBracket}
                    className='mr-2 mt-1'
                />
                <span className='hidden text-[16px] md:block'>Đăng xuất</span>
            </div>
        </div>
    );
};

export default Sidebar;
