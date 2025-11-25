export interface Document {
    id: number;
    title: string;
    authors: string; // Tên tác giả
    type: string; // Giáo trình, Slide, Đề thi...
    year: string;
    description?: string;
    views: number;
    downloads: number;
    rating: number;
    fileInfo: string; // VD: PDF • 8.5MB
    isSaved: boolean; // Trạng thái đã lưu (cho user hiện tại)
    sharedBy?: string; // ID của user đã chia sẻ (nếu có)
    uploadedAt?: string; // Ngày upload (dành cho trang Shared)
}
