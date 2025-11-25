import { Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import { pages } from './page';

const withSuspense = (el: React.ReactNode) => (
    <Suspense fallback={<div>Loading...</div>}>{el}</Suspense>
);

export const AppRoutes = [
    {
        path: '/',
        element: <Navigate to='/login' replace />,
    },

    ...pages.map(({ path, Component }) => ({
        path,
        element: withSuspense(<Component />),
    })),
];
