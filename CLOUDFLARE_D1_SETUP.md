# HƯỚNG DẪN KẾT NỐI 2 DATABASE CLOUDFLARE D1 (MIỄN PHÍ 100%)

Hệ thống đã được kiến trúc tách biệt thành **2 Database D1 độc lập** trên Cloudflare:
1. **Database 1 (`DB` - `nienthoi-db`)**: Dành riêng cho Lượt xem toàn web, Lượt xem chương truyện, Bình luận truyện & Lưu trữ ảnh bìa (500MB).
2. **Database 2 (`INTRO_DB` - `nienthoi-intro-db`)**: Dành riêng 100% cho **Lượt thả tim** và **Bình luận lưu bút trang giới thiệu** (500MB độc lập).

---

## LỢI ÍCH CỦA VIỆC TÁCH 2 DATABASE:
- **Ngắt hoàn toàn khỏi Firebase**: Lượt thả tim và lưu bút không còn phụ thuộc vào Firebase Firestore.
- **X2 Dung lượng (1.000 MB thay vì 500 MB)**: Mỗi database Cloudflare D1 miễn phí có 500 MB. Tách 2 database giúp bạn có tới 1.000 MB miễn phí!
- **Hạn mức khổng lồ**: 5.000.000 lượt đọc/ngày và 100.000 lượt ghi/ngày trên Cloudflare Edge Network.

---

## CÁCH TẠO & KẾT NỐI DATABASE THỨ 2 (`INTRO_DB`):

### BƯỚC 1: Tạo Database thứ 2 trên Cloudflare
1. Đăng nhập vào [dash.cloudflare.com](https://dash.cloudflare.com/).
2. Chọn menu **Storage & Databases** -> **D1 SQL Database**.
3. Bấm **Create database** -> Đặt tên: `nienthoi-intro-db` -> Bấm **Create**.

---

### BƯỚC 2: Chạy Schema khởi tạo cho Database thứ 2
1. Bấm vào database `nienthoi-intro-db` vừa tạo.
2. Chọn tab **Console**.
3. Mở file `schema_intro.sql` trong dự án của bạn (chỉ gồm bảng `likes` và `guest_notes`), copy toàn bộ nội dung và dán vào ô Console.
4. Bấm **Execute**.

---

### BƯỚC 3: Liên kết (Binding) vào Cloudflare Pages / Workers
1. Tại menu Cloudflare, vào **Workers & Pages** -> Chọn dự án website của bạn.
2. Vào **Settings** -> **Functions** (hoặc **Variables & Bindings** nếu dùng Worker):
3. Cuộn xuống mục **D1 Database Bindings** -> Bấm **Add binding**:
   - **Variable name**: Nhập chính xác chữ `INTRO_DB` (viết hoa).
   - **D1 database**: Chọn `nienthoi-intro-db`.
4. Bấm **Save**.
5. Vào **Deployments** -> Bấm vào lần build mới nhất chọn **Retry deployment** (hoặc commit code mới lên GitHub) để Cloudflare kích hoạt binding mới.

*(Lưu ý: Nếu chưa cấu hình binding `INTRO_DB`, hệ thống sẽ tự động fallback về `DB` nên web vẫn hoạt động bình thường mà không bị lỗi).*

