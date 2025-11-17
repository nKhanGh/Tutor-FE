export interface Session {
    id: string;
    date: string;
    time: string;
    title: string;
    tutor?: string;
    student?: string;
    status: 'completed' | 'cancelled-tutor' | 'cancelled-student' | 'pending';
    canFeedback?: boolean;
    canViewReason?: boolean;
    review?: {
        rating: number;
        comment: string;
    };
    cancellationReason?: string;
}
