import Sidebar from '@/components/layouts/Sidebar';

const SharedDocument = () => {
    return (
        <>
            <Sidebar />
            <div className='ml-[260px] bg-blue-50 p-6'>
                Shared Documents Content
            </div>
        </>
    );
};

export default SharedDocument;
