import { useState, useEffect } from 'react';
import loginIllustration from '@/assets/images/login-illustration.png';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/hooks/useNotification';
import { storage } from '@/utils/storage';
import type { User, TutorProfile } from '@/interfaces';
import { CheckCircle2 } from 'lucide-react';
import { getUserInitials } from '@/utils/helpers'; // Import helper

const Login = () => {
    const { login } = useAuth();
    const { showErrorNotification, showSuccessNotification } =
        useNotification();

    const [users, setUsers] = useState<(User | TutorProfile)[]>([]);
    const [selectedUser, setSelectedUser] = useState<string>('');

    useEffect(() => {
        const timer = setTimeout(() => {
            const allUsers = storage.getUsers();
            setUsers(allUsers);
            if (allUsers.length > 0) {
                setSelectedUser(allUsers[0].username);
            }
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    const handleSsoLogin = () => {
        if (!selectedUser) return;

        const success = login(selectedUser);
        if (success) {
            showSuccessNotification('Đăng nhập thành công thông qua HCMUT SSO');
        } else {
            showErrorNotification('Tài khoản không tồn tại hoặc có lỗi xảy ra');
        }
    };

    return (
        <div className='flex min-h-screen bg-white font-bevietnam'>
            {/* --- CỘT BÊN TRÁI (NỘI DUNG) --- */}
            <div className='relative flex w-full flex-col justify-center p-8 md:w-1/2 lg:p-16'>
                <div className='absolute left-8 top-8 flex items-center gap-2'>
                    <div className='flex h-8 w-8 items-center justify-center rounded bg-gradient-to-r from-[#0795DF] to-[#00C0EF] font-bold text-white'>
                        BK
                    </div>
                    <span className='text-lg font-semibold text-gray-800'>
                        Hệ thống Tutor
                    </span>
                </div>

                <div className='mx-auto w-full max-w-sm'>
                    <h1 className='mb-3 text-3xl font-bold text-gray-900'>
                        Chào mừng bạn!
                    </h1>
                    <p className='mb-8 text-gray-600'>
                        Đăng nhập để tiếp tục hành trình học tập và giảng dạy
                        tại HCMUT.
                    </p>

                    {/* DEMO SELECTOR */}
                    <div className='mb-6 rounded-xl border border-blue-100 bg-blue-50 p-4'>
                        <p className='mb-3 text-xs font-bold uppercase tracking-wider text-blue-600'>
                            Chọn vai trò Demo
                        </p>
                        <div className='space-y-2'>
                            {users.map((u) => (
                                <label
                                    key={u.id}
                                    className={`flex cursor-pointer items-center rounded-lg border p-3 transition-all ${
                                        selectedUser === u.username
                                            ? 'border-blue-500 bg-white shadow-sm ring-1 ring-blue-500'
                                            : 'border-transparent bg-transparent hover:border-blue-200 hover:bg-white'
                                    }`}
                                >
                                    <input
                                        type='radio'
                                        name='login_user'
                                        value={u.username}
                                        checked={selectedUser === u.username}
                                        onChange={(e) =>
                                            setSelectedUser(e.target.value)
                                        }
                                        className='hidden'
                                    />

                                    {/* AVATAR AREA */}
                                    <div
                                        className={`mr-3 flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border border-white text-xs font-bold text-white shadow-sm ${u.avatarBg || 'bg-gray-400'}`}
                                    >
                                        {u.avatar ? (
                                            <img
                                                src={u.avatar}
                                                alt={u.name}
                                                className='h-full w-full object-cover'
                                            />
                                        ) : (
                                            <span className='text-sm'>
                                                {getUserInitials(u.name)}
                                            </span>
                                        )}
                                    </div>

                                    <div className='flex-1'>
                                        <p className='text-sm font-semibold text-gray-800'>
                                            {u.name}
                                        </p>
                                        <p className='flex items-center gap-1 text-xs capitalize text-gray-500'>
                                            {u.role === 'student'
                                                ? '🎓 Sinh viên'
                                                : u.role === 'tutor'
                                                  ? '👨‍🏫 Tutor'
                                                  : '🛠 Điều phối viên'}
                                        </p>
                                    </div>

                                    {selectedUser === u.username && (
                                        <CheckCircle2
                                            size={20}
                                            className='animate-in fade-in zoom-in text-blue-500 duration-200'
                                        />
                                    )}
                                </label>
                            ))}
                        </div>
                    </div>

                    <button
                        type='button'
                        onClick={handleSsoLogin}
                        className='flex w-full items-center justify-center gap-2 rounded-lg bg-[#0795DF] px-4 py-3.5 text-center font-semibold text-white shadow-lg shadow-blue-200 transition-all hover:bg-[#0088C0] active:scale-95'
                    >
                        Đăng nhập qua HCMUT SSO
                    </button>

                    <p className='mt-8 text-center text-xs text-gray-500'>
                        Hệ thống hỗ trợ kỹ thuật:{' '}
                        <a href='#' className='text-blue-600 hover:underline'>
                            support@hcmut.edu.vn
                        </a>
                    </p>
                </div>
            </div>

            {/* --- CỘT BÊN PHẢI (HÌNH ẢNH) --- */}
            <div className='relative hidden items-center justify-center overflow-hidden bg-gray-50 p-8 md:flex md:w-1/2'>
                <div className="absolute inset-0 scale-150 bg-[url('https://upload.wikimedia.org/wikipedia/commons/d/de/HCMUT_official_logo.png')] bg-center bg-no-repeat opacity-5 blur-3xl"></div>
                <img
                    src={loginIllustration}
                    alt='Tutor session illustration'
                    className='animate-fade-in-up relative z-10 max-w-lg drop-shadow-2xl'
                />
            </div>
        </div>
    );
};

export default Login;
