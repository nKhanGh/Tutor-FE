import { Suspense } from 'react';
import { pages } from './page';

const withSuspense = (el: React.ReactNode) => (
    <Suspense fallback={<div>Loading...</div>}>{el}</Suspense>
);

export const AppRoutes = pages.map(({ path, Component }) => ({
    path,
    element: withSuspense(<Component />),
}));
