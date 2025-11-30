import Sidebar from '@/components/layouts/Sidebar';
import { useState, useEffect } from 'react';
import { Upload, FileText, Trash2, X } from 'lucide-react';
import { useNotification } from '@/hooks/useNotification';
import { storage } from '@/utils/storage';
import { useAuth } from '@/contexts/AuthContext';
import type { Document } from '@/interfaces';

const SharedDocuments = () => {
    const { user } = useAuth();
    const { showSuccessNotification, showErrorNotification } =
        useNotification();
    const [documents, setDocuments] = useState<Document[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        type: 'Giáo trình',
        description: '',
    });

    const documentTypes = ['Giáo trình', 'Slide', 'Đề thi', 'Ghi chú'];

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setIsModalOpen(true);
            // Auto-fill title from filename
            const fileName = file.name.replace(/\.[^/.]+$/, '');
            setFormData((prev) => ({ ...prev, title: fileName }));
        }
        // Reset input
        e.target.value = '';
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedFile || !formData.title.trim()) {
            showErrorNotification('Vui lòng nhập đầy đủ thông tin!');
            return;
        }

        const fileSize = (selectedFile.size / (1024 * 1024)).toFixed(1);
        const fileExtension =
            selectedFile.name.split('.').pop()?.toUpperCase() || 'FILE';

        const newDoc: Document = {
            id: Date.now(),
            title: formData.title,
            authors: user?.name || 'Unknown',
            type: formData.type,
            year: new Date().getFullYear().toString(),
            description: formData.description,
            views: 0,
            downloads: 0,
            rating: 0,
            fileInfo: `${fileExtension} • ${fileSize} MB`,
            isSaved: false,
            sharedBy: user?.id || 'Unknown',
            uploadedAt: new Date().toLocaleDateString('vi-VN'),
        };

        setDocuments((prev) => [newDoc, ...prev]);
        storage.addDocument(newDoc);
        // Reset form
        setIsModalOpen(false);
        setSelectedFile(null);
        setFormData({ title: '', type: 'Giáo trình', description: '' });

        showSuccessNotification('Tải lên tài liệu thành công!');
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedFile(null);
        setFormData({ title: '', type: 'Giáo trình', description: '' });
    };

    // Load data
    useEffect(() => {
        const timer = setTimeout(() => {
            if (user) {
                const sharedDocs = storage.getSharedDocuments(user.id);
                setDocuments(sharedDocs);
            }
        }, 0);
        return () => clearTimeout(timer);
    }, [user]);

    // const handleUpload = () => {
    //     if (!user) return;

    //     // Giả lập upload document mới vào Storage
    //     const newDoc = storage.addDocument({
    //         title: 'Tài liệu mới tải lên ' + new Date().toLocaleTimeString(),
    //         authors: user.name,
    //         type: 'Ghi chú',
    //         year: new Date().getFullYear().toString(),
    //         views: 0,
    //         downloads: 0,
    //         rating: 0,
    //         fileInfo: 'PDF • 1.0 MB',
    //         isSaved: false,
    //         sharedBy: user.id,
    //         uploadedAt: new Date().toLocaleDateString('vi-VN'),
    //         description: 'Tài liệu đóng góp bởi sinh viên.',
    //     });

    //     setDocuments((prev) => [newDoc, ...prev]);
    //     showSuccessNotification('Tải lên tài liệu thành công!');
    // };

    const handleDelete = (id: number) => {
        if (window.confirm('Bạn có chắc muốn xóa tài liệu chia sẻ này?')) {
            storage.deleteDocument(id);
            setDocuments((prev) => prev.filter((d) => d.id !== id));
            showSuccessNotification('Đã xóa tài liệu.');
        }
    };

    return (
        <>
            <Sidebar />
            <div className='ml-[80px] min-h-screen bg-[#f4f7fc] p-6 font-bevietnam md:ml-[260px]'>
                <div className='mx-auto max-w-7xl'>
                    <div className='mb-8 flex items-end justify-between'>
                        <div>
                            <h1 className='mb-2 flex items-center gap-2 text-2xl font-bold text-gray-800'>
                                <Upload className='text-[#0795DF]' /> Tài liệu
                                đã chia sẻ
                            </h1>
                            <p className='text-gray-600'>
                                Quản lý các tài liệu bạn đã đóng góp cho cộng
                                đồng.
                            </p>
                        </div>
                        <label className='flex cursor-pointer items-center gap-2 rounded-xl bg-[#0795DF] px-5 py-2.5 font-semibold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-600'>
                            <Upload size={18} /> Tải lên mới
                            <input
                                type='file'
                                onChange={handleFileSelect}
                                className='hidden'
                                accept='.pdf,.doc,.docx,.ppt,.pptx,.txt'
                            />
                        </label>
                    </div>

                    <div className='overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm'>
                        <table className='w-full text-left'>
                            <thead className='border-b border-gray-100 bg-gray-50 text-sm font-semibold uppercase text-gray-500'>
                                <tr>
                                    <th className='px-6 py-4'>Tên tài liệu</th>
                                    <th className='px-6 py-4'>Loại</th>
                                    <th className='px-6 py-4'>Ngày chia sẻ</th>
                                    <th className='px-6 py-4 text-center'>
                                        Lượt tải
                                    </th>
                                    <th className='px-6 py-4'></th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-gray-100 text-gray-700'>
                                {documents.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className='p-10 text-center text-gray-400'
                                        >
                                            Bạn chưa chia sẻ tài liệu nào.
                                        </td>
                                    </tr>
                                ) : (
                                    documents.map((doc) => (
                                        <tr
                                            key={doc.id}
                                            className='transition-colors hover:bg-gray-50'
                                        >
                                            <td className='px-6 py-4'>
                                                <div className='flex items-center gap-3'>
                                                    <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-500'>
                                                        <FileText size={20} />
                                                    </div>
                                                    <span className='font-medium'>
                                                        {doc.title}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className='px-6 py-4'>
                                                <span className='rounded bg-gray-100 px-2 py-1 text-xs font-bold text-gray-600'>
                                                    {doc.type}
                                                </span>
                                            </td>
                                            <td className='px-6 py-4 text-sm'>
                                                {doc.uploadedAt || 'Unknown'}
                                            </td>
                                            <td className='px-6 py-4 text-center font-bold text-blue-600'>
                                                {doc.downloads}
                                            </td>
                                            <td className='px-6 py-4 text-right'>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(doc.id)
                                                    }
                                                    className='text-gray-400 transition-colors hover:text-red-500'
                                                    title='Xóa tài liệu'
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                {isModalOpen && (
                    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4'>
                        <div className='w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl'>
                            <div className='mb-6 flex items-center justify-between'>
                                <h2 className='text-2xl font-bold text-gray-800'>
                                    Thông tin tài liệu
                                </h2>
                                <button
                                    onClick={handleCloseModal}
                                    className='text-gray-400 transition-colors hover:text-gray-600'
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                {/* File info */}
                                {selectedFile && (
                                    <div className='mb-6 rounded-lg bg-blue-50 p-4'>
                                        <div className='flex items-center gap-3'>
                                            <FileText
                                                className='text-blue-500'
                                                size={24}
                                            />
                                            <div>
                                                <div className='font-medium text-gray-800'>
                                                    {selectedFile.name}
                                                </div>
                                                <div className='text-sm text-gray-500'>
                                                    {(
                                                        selectedFile.size /
                                                        (1024 * 1024)
                                                    ).toFixed(2)}{' '}
                                                    MB
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Title */}
                                <div className='mb-4'>
                                    <label className='mb-2 block font-semibold text-gray-700'>
                                        Tên tài liệu{' '}
                                        <span className='text-red-500'>*</span>
                                    </label>
                                    <input
                                        type='text'
                                        value={formData.title}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                title: e.target.value,
                                            }))
                                        }
                                        className='w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200'
                                        placeholder='Nhập tên tài liệu...'
                                        required
                                    />
                                </div>

                                {/* Type */}
                                <div className='mb-4'>
                                    <label className='mb-2 block font-semibold text-gray-700'>
                                        Loại tài liệu{' '}
                                        <span className='text-red-500'>*</span>
                                    </label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                type: e.target.value,
                                            }))
                                        }
                                        className='w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200'
                                        required
                                    >
                                        {documentTypes.map((type) => (
                                            <option key={type} value={type}>
                                                {type}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Description */}
                                <div className='mb-6'>
                                    <label className='mb-2 block font-semibold text-gray-700'>
                                        Mô tả
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                description: e.target.value,
                                            }))
                                        }
                                        className='w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200'
                                        placeholder='Mô tả ngắn về tài liệu (không bắt buộc)...'
                                        rows={4}
                                    />
                                </div>

                                {/* Buttons */}
                                <div className='flex gap-3'>
                                    <button
                                        type='button'
                                        onClick={handleCloseModal}
                                        className='flex-1 rounded-lg border border-gray-300 px-4 py-2.5 font-semibold text-gray-700 transition-colors hover:bg-gray-50'
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type='submit'
                                        className='flex-1 rounded-lg bg-[#0795DF] px-4 py-2.5 font-semibold text-white transition-colors hover:bg-blue-600'
                                    >
                                        Tải lên
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default SharedDocuments;
