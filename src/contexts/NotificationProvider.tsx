import Notification from '@/components/UI/Nofification';
import { NotificationContext } from './NotificationContext';
import { useCallback, useMemo, useState } from 'react';

export const NotificationProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [notification, setNotification] = useState<{
        message: string;
        type: 'info' | 'success' | 'error';
        id: number;
    } | null>(null);

    const showInfoNotification = useCallback(
        (message: string) =>
            setNotification({ message, type: 'info', id: Date.now() }),
        [],
    );

    const showSuccessNotification = useCallback(
        (message: string) =>
            setNotification({ message, type: 'success', id: Date.now() }),
        [],
    );

    const showErrorNotification = useCallback(
        (message: string) =>
            setNotification({ message, type: 'error', id: Date.now() }),
        [],
    );

    const hideNotification = useCallback(() => setNotification(null), []);

    const value = useMemo(
        () => ({
            showInfoNotification,
            showSuccessNotification,
            showErrorNotification,
        }),
        [showInfoNotification, showSuccessNotification, showErrorNotification],
    );

    return (
        <NotificationContext.Provider value={value}>
            {children}

            {notification && (
                <Notification
                    key={notification.id}
                    message={notification.message}
                    type={notification.type}
                    onClose={hideNotification}
                />
            )}
        </NotificationContext.Provider>
    );
};
