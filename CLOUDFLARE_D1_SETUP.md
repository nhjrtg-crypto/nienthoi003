# HƯỚNG DẪN KẾT NỐI CLOUDFLARE D1 (MIỄN PHÍ 100%)

Hệ thống đã được lập trình sẵn toàn bộ API Cloudflare Pages Functions (`/functions/api/`) và Client Service (`d1Service.ts`) để thay thế hoặc chạy song song với Firebase.

Khi kích hoạt D1:
- **Lượt đọc miễn phí**: 5.000.000 lượt/ngày (Gấp 100 lần Firebase).
- **Lượt ghi miễn phí**: 100.000 lượt/ngày (Gấp 5 lần Firebase).
- **Không bao giờ bị nghẽn mạng hay dính cảnh báo giới hạn (Quota Limit)**.

---

## 3 BƯỚC ĐƠN GIẢN ĐỂ KÍCH HOẠT D1 TRÊN CLOUDFLARE

### BƯỚC 1: Tạo Database D1 trên Cloudflare
1. Đăng nhập vào [dash.cloudflare.com](https://dash.cloudflare.com/).
2. Ở thanh menu bên trái, chọn **Storage & Databases** -> **D1 SQL Database**.
3. Bấm nút **Create database** -> Đặt tên (ví dụ: `nienthoi-db`) -> Bấm **Create**.

---

### BƯỚC 2: Khởi tạo bảng dữ liệu (Copy & Paste)
1. Bấm vào database vừa tạo (`nienthoi-db`).
2. Chọn tab **Console** (ngay trên đầu).
3. Mở file `schema.sql` trong dự án của bạn, copy toàn bộ nội dung và dán vào ô nhập lệnh Console của D1.
4. Bấm **Execute** (hoặc nhấn Enter) để chạy.
*(Bảng `site_stats`, `novel_views`, `likes`, `comments`, `guest_notes` sẽ được tạo ngay lập tức).*

---

### BƯỚC 3: Liên kết (Binding) Database vào trang Web Pages
1. Tại menu bên trái Cloudflare, vào **Workers & Pages**.
2. Chọn dự án website bạn đã deploy.
3. Vào tab **Settings** -> chọn mục **Functions** ở menu con.
4. Cuộn xuống phần **D1 Database Bindings** -> Bấm **Add binding**:
   - **Variable name**: Nhập chính xác chữ `DB` (viết hoa).
   - **D1 database**: Chọn database bạn vừa tạo ở Bước 1 (`nienthoi-db`).
5. Bấm **Save**.
6. (Tùy chọn) Bấm **Deployments** -> Bấm vào lần build mới nhất và chọn **Retry deployment** hoặc đẩy code mới lên GitHub để Cloudflare kích hoạt Pages Functions.

---

## CÁC TÍNH NĂNG ĐÃ SẴN SÀNG:
1. **Lượt xem toàn web cộng dồn**: Nút ở chân trang (Footer) tự động đếm và cộng dồn qua `/api/views`.
2. **Lượt thả tim**: Thả tim truyện và trang giới thiệu lưu trực tiếp vào bảng `likes`.
3. **Bình luận truyện & chương**: Lưu trữ vĩnh viễn trong bảng `comments`, tốc độ tải trang cực nhanh.
4. **Lưu bút bạn đọc**: Lưu vào bảng `guest_notes` trên Edge Network của Cloudflare.
