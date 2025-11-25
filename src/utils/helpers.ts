/**
 * Lấy 2 chữ cái đầu của 2 từ cuối trong tên.
 * Ví dụ: "Nguyễn Văn Đức" -> "VĐ"
 * "Trương Thanh Nhân" -> "TN"
 * "Nam" -> "N"
 */
export const getUserInitials = (name: string): string => {
    if (!name) return '';

    // Tách chuỗi dựa trên khoảng trắng, loại bỏ khoảng trắng thừa
    const parts = name.trim().split(/\s+/);

    if (parts.length === 0) return '';

    // Nếu chỉ có 1 từ, lấy chữ cái đầu
    if (parts.length === 1) {
        return parts[0].charAt(0).toUpperCase();
    }

    // Lấy 2 từ cuối
    const last = parts[parts.length - 1];
    const secondLast = parts[parts.length - 2];

    return (secondLast.charAt(0) + last.charAt(0)).toUpperCase();
};
