export default function App() {
    return (
        <div className='flex min-h-screen items-center justify-center bg-gray-100 p-4'>
            <div className='w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg'>
                <h1 className='font-sans text-3xl font-bold text-blue-primary'>
                    Tailwind v3 Test
                </h1>

                <p className='mt-3 font-sans text-gray-600'>
                    Nếu bạn thấy màu xanh + font Inter → Tailwind hoạt động
                    đúng.
                </p>

                <button className='mt-6 rounded-xl bg-blue-secondary px-6 py-3 font-semibold text-white transition hover:bg-blue-primary'>
                    Test Button
                </button>
            </div>
        </div>
    );
}
