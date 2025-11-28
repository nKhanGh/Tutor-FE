const sizeClasses: Record<'sm' | 'md' | 'lg' | 'xl', string> = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-4',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4',
};

const Loading = ({
    size = 'md',
    className = '',
}: {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}) => {
    return (
        <div className={`flex items-center justify-center ${className}`}>
            <div
                className={`${sizeClasses[size]} animate-spin rounded-full border-blue-200 border-t-blue-600`}
            ></div>
        </div>
    );
};

export default Loading;
