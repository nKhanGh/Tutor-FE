import { createContext } from 'react';

type NotificationContextType = {
    showInfoNotification: (message: string) => void;
    showSuccessNotification: (message: string) => void;
    showErrorNotification: (message: string) => void;
};

export const NotificationContext =
    createContext<NotificationContextType | null>(null);
