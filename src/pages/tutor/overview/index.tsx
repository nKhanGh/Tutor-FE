import Sidebar from '@/components/layouts/Sidebar';

const Overview = () => {
    return (
        <>
            <Sidebar />
            <div className='ml-[80px] min-h-screen bg-blue-50 p-3 pt-4 sm:p-4 md:ml-[260px] md:p-6'>
                Overview Content
            </div>
        </>
    );
};

export default Overview;
