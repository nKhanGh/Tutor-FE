// BƯỚC 1: Import useNavigate
import { useNavigate } from 'react-router-dom';
import loginIllustration from '@/assets/images/login-illustration.png';

const Login = () => {
    // BƯỚC 2: Khởi tạo hook
    const navigate = useNavigate();

    // Tạo hàm xử lý đăng nhập
    const handleSsoLogin = () => {
        // Chuyển hướng người dùng đến trang overview
        navigate('/student/overview');
    };

    return (
        <div className='flex min-h-screen bg-white'>
            {/* --- CỘT BÊN TRÁI (NỘI DUNG) --- */}
            <div className='flex w-full flex-col justify-center p-8 md:w-1/2 lg:p-16'>
                {/* Header "Login" ở góc trên bên trái */}
                <div className='absolute left-0 top-0 p-6'>
                    <span className='text-lg font-semibold text-gray-800'>
                        Login
                    </span>
                </div>

                {/* Nội dung chính (form) */}
                <div className='mx-auto w-full max-w-sm'>
                    {/* Tiêu đề */}
                    <h1 className='mb-3 text-3xl font-bold text-gray-900'>
                        Chào mừng bạn đến với hệ thống Tutor!
                    </h1>

                    {/* Mô tả */}
                    <p className='mb-6 text-gray-600'>
                        Bắt đầu ngay để tìm kiếm những giảng viên xuất sắc và
                        cải thiện học lực của bạn
                    </p>

                    {/* Nút Đăng nhập SSO */}
                    <button
                        type='button'
                        // BƯỚC 3: Thêm onClick
                        onClick={handleSsoLogin}
                        className='w-full rounded-full border border-gray-300 bg-white px-4 py-3 text-center font-medium text-gray-700 shadow-sm transition duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                    >
                        Đăng nhập thông qua HCMUT SSO
                    </button>

                    {/* Điều khoản dịch vụ */}
                    <p className='mt-6 text-center text-xs text-gray-500'>
                        Bằng cách tiếp tục, bạn đã đồng ý với{' '}
                        <a
                            href='#'
                            className='font-medium text-blue-600 hover:underline'
                        >
                            Điều khoản sử dụng
                        </a>{' '}
                        và{' '}
                        <a
                            href='#'
                            className='font-medium text-blue-600 hover:underline'
                        >
                            quyền riêng tư
                        </a>
                    </p>
                </div>
            </div>

            {/* --- CỘT BÊN PHẢI (HÌNH ẢNH) --- */}
            <div className='hidden items-center justify-center bg-gray-50 p-8 md:flex md:w-1/2'>
                <img
                    src={loginIllustration}
                    alt='Tutor session illustration'
                    className='max-w-lg'
                />
            </div>
        </div>
    );
};

export default Login;
