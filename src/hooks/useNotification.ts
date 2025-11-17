import { NotificationContext } from '@/contexts/NotificationContext';
import { useContext } from 'react';

export const useNotification = () => {
    const ctx = useContext(NotificationContext);
    if (!ctx) {
        throw new Error(
            'useNotification must be used within a NotificationProvider',
        );
    }
    return ctx;
};
