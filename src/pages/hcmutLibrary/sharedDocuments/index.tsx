import Sidebar from '@/components/layouts/Sidebar';

const SharedDocument = () => {
    return (
        <>
            <Sidebar />
            <div className='ml-[80px] min-h-screen bg-blue-50 p-3 pt-4 sm:p-4 md:ml-[260px] md:p-6'>
                Shared Documents Content
            </div>
        </>
    );
};

export default SharedDocument;
