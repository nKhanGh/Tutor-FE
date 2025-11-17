import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCheckCircle,
    faExclamationCircle,
    faInfoCircle,
    faTimes,
} from '@fortawesome/free-solid-svg-icons';

interface NotificationProps {
    message: string;
    type: 'success' | 'error' | 'info';
    onClose: () => void;
}

const Notification = ({ message, type, onClose }: NotificationProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);
    const handleClose = () => {
        setIsLeaving(true);
        setIsVisible(false);
        setTimeout(() => {
            onClose();
        }, 300);
    };

    useEffect(() => {
        const openTimer = setTimeout(() => setIsVisible(true), 10);
        const closeTimer = setTimeout(() => handleClose(), 3000);

        return () => {
            clearTimeout(openTimer);
            clearTimeout(closeTimer);
        };
    }, [handleClose]);

    const configs = {
        success: {
            color: 'text-green-500',
            icon: faCheckCircle,
            border: 'border-green-500',
        },
        error: {
            color: 'text-red-500',
            icon: faExclamationCircle,
            border: 'border-red-500',
        },
        info: {
            color: 'text-blue-500',
            icon: faInfoCircle,
            border: 'border-blue-500',
        },
    };

    const config = configs[type];

    return (
        <div
            className={`fixed left-1/2 top-4 z-50 -translate-x-1/2 transition-all duration-300 ease-out ${isVisible && !isLeaving ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'} `}
        >
            <div
                className={`flex min-w-[320px] max-w-md items-center gap-4 rounded-xl border-l-4 bg-white px-6 py-4 text-gray-800 shadow-lg ${config.border} `}
            >
                <div className='flex-shrink-0'>
                    <FontAwesomeIcon
                        icon={config.icon}
                        className={`${config.color} text-2xl`}
                    />
                </div>
                <div className='flex-1 font-medium'>{message}</div>
                <button
                    onClick={handleClose}
                    className='h-[36px] w-[36px] flex-shrink-0 rounded-full bg-transparent p-1 transition-colors duration-200 hover:bg-gray-100 focus:outline-none'
                >
                    <FontAwesomeIcon
                        icon={faTimes}
                        className={`${config.color} text-sm`}
                    />
                </button>
            </div>
        </div>
    );
};

export default Notification;
