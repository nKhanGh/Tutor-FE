import {
    createContext,
    useContext,
    useState,
    type ReactNode,
    useCallback,
} from 'react';
import { storage } from '@/utils/storage';
import { type User } from '@/interfaces';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
    user: User | null;
    login: (username: string) => boolean;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    // Sử dụng Lazy Initialization để lấy user từ LocalStorage ngay khi khởi tạo
    // Giúp dữ liệu không bị mất khi F5 trang
    const [user, setUser] = useState<User | null>(() => {
        return storage.getCurrentUser();
    });

    const navigate = useNavigate();

    const login = useCallback(
        (username: string): boolean => {
            // Logic login giả lập
            const foundUser = storage.getUserByUsername(username);

            if (foundUser) {
                setUser(foundUser);
                storage.setCurrentUser(foundUser);

                // Điều hướng dựa trên role
                switch (foundUser.role) {
                    case 'student':
                        navigate('/student/overview');
                        break;
                    case 'tutor':
                        navigate('/tutor/overview');
                        break;
                    case 'coordinator':
                        navigate('/coordinator/overview');
                        break;
                    default:
                        navigate('/');
                }
                return true;
            }
            return false;
        },
        [navigate],
    );

    const logout = useCallback(() => {
        setUser(null);
        storage.setCurrentUser(null);
        navigate('/login');
    }, [navigate]);

    return (
        <AuthContext.Provider
            value={{ user, login, logout, isAuthenticated: !!user }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// Dòng này giúp bỏ qua lỗi ESLint vì useAuth đi kèm AuthProvider là hợp lý
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
