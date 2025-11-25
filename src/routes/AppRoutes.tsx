import { Suspense } from 'react';
import { Navigate } from 'react-router-dom'; // 1. Import Navigate
import { pages } from './page';

const withSuspense = (el: React.ReactNode) => (
    <Suspense fallback={<div>Loading...</div>}>{el}</Suspense>
);

export const AppRoutes = [
    // 2. Thêm route redirect này vào đầu mảng
    {
        path: '/',
        element: <Navigate to='/login' replace />, // Chuyển hướng sang /login
    },

    // Các routes khác từ file page.ts
    ...pages.map(({ path, Component }) => ({
        path,
        element: withSuspense(<Component />),
    })),
];
