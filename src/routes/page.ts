import { lazy } from 'react';

export const pages = [
    {
        path: '/login',
        Component: lazy(() => import('@/pages/login')),
    },
    {
        path: '/student/study-history',
        Component: lazy(() => import('@/pages/student/studyHistory')),
    },
    {
        path: '/student/overview',
        Component: lazy(() => import('@/pages/student/overview')),
    },
    {
        path: '/student/choose-tutor',
        Component: lazy(() => import('@/pages/student/chooseTutor')),
    },
    {
        path: '/student/register-program',
        Component: lazy(() => import('@/pages/student/registerProgram')),
    },
    {
        path: '/student/schedule',
        Component: lazy(() => import('@/pages/student/schedule')),
    },
    {
        path: '/tutor/study-history',
        Component: lazy(() => import('@/pages/tutor/studyHistory')),
    },
    {
        path: '/tutor/statistic',
        Component: lazy(() => import('@/pages/tutor/statistic')),
    },
    {
        path: '/tutor/student-progress',
        Component: lazy(() => import('@/pages/tutor/studentProgress')),
    },
    {
        path: '/tutor/availability-management',
        Component: lazy(() => import('@/pages/tutor/availabilityManagement')),
    },
    {
        path: '/tutor/overview',
        Component: lazy(() => import('@/pages/tutor/overview')),
    },
    {
        path: '/coordinator/match-tutor-student',
        Component: lazy(() => import('@/pages/coordinator/matchTutorStudent')),
    },
    {
        path: '/coordinator/overview',
        Component: lazy(() => import('@/pages/coordinator/overview')),
    },
    {
        path: '/coordinator/schedule-management',
        Component: lazy(() => import('@/pages/coordinator/scheduleManagement')),
    },
    {
        path: '/coordinator/student-management',
        Component: lazy(() => import('@/pages/coordinator/studentManagement')),
    },
    {
        path: '/coordinator/tutor-management',
        Component: lazy(() => import('@/pages/coordinator/tutorManagement')),
    },
    {
        path: '/hcmut-library/all-documents',
        Component: lazy(() => import('@/pages/hcmutLibrary/allDocuments')),
    },
    {
        path: '/hcmut-library/saved-documents',
        Component: lazy(() => import('@/pages/hcmutLibrary/savedDocuments')),
    },
    {
        path: '/hcmut-library/shared-documents',
        Component: lazy(() => import('@/pages/hcmutLibrary/sharedDocuments')),
    },
    {
        path: '/faculty',
        Component: lazy(() => import('@/pages/faculty')),
    },
];
