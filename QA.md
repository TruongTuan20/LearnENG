# Kiểm tra DevEnglish · 29/10/2026

## Tự động

- TypeScript strict: đạt.
- Vitest: 11 test đạt. Bao gồm lịch/ngày bắt đầu/cuối tuần, chuyển năm, timezone/DST, dời lịch/học bù giữ kết quả, chu kỳ ôn, giây/streak/ngày học, import và điều kiện hoàn thành.
- Kiểm kê nội dung: 24 tuần, 120 buổi, 35 bài phát hành có đoạn khác nhau; mỗi bài có ít nhất 6 cụm và 4 dạng luyện. Tám bài đọc đều đạt 150–250 từ; 12 kịch bản.
- Production build: đạt với Next.js 16.4.3. Dependency audit sau cập nhật: 0 cảnh báo.

## Trình duyệt đã thao tác

Kiểm tra bằng trình duyệt tích hợp tại `http://127.0.0.1:3100`, tên **Tuấn · Kiểm thử**. Đây là dữ liệu do thao tác QA tạo, không được seed vào ứng dụng hoặc coi là thành tích của người dùng. Cổng 3000 là origin riêng để bắt đầu sạch.

1. Onboarding: nhập tên, kiểm tra mặc định lịch 5 ngày/45 phút và múi giờ; chọn đủ 9 đáp án đầu vào, viết tự đánh giá nói, thấy 9/9 và gợi ý không gán CEFR.
2. Dashboard ban đầu có 0 bài, 0 phút, 0 thẻ; ngày có đánh giá đầu vào được tính là ngày hoạt động thật.
3. Mở bài đầu, chủ động bắt đầu timer, xác nhận khởi động/cụm từ/nghe đọc.
4. Làm điền từ, chọn đáp án, sắp xếp bằng nút và viết câu; xem phản hồi/giải thích. Câu viết chỉ hiển thị tham khảo và checklist.
5. Thêm “work as” vào ôn tập, lưu ghi chú và nhật ký tự đánh giá nói.
6. Hoàn thành bị khóa khi thiếu tổng kết; sau khi đủ hoạt động thì hoàn thành được.
7. Dừng timer và refresh: trạng thái hoàn thành, phần đang xem và ghi chú vẫn còn. Dashboard đề xuất bài 2 và hiển thị thời gian thực đã tích lũy.
8. Ôn thẻ đến hạn, lật thẻ rồi chọn Nhớ. Lịch mới được lưu; không cập nhật lịch chỉ do nhìn mặt trước.
9. Export tạo file JSON thật. Chọn lại file bằng file chooser; preview hiển thị đúng 120 lịch, 1 tiến độ, 1 thẻ, 1 phiên timer, 1 lượt nói và 1 đánh giá. Xác nhận khôi phục cùng bản sao thành công.
10. Dark mode ở viewport 360×800: kiểm tra form cài đặt và dashboard; không tràn ngang. Kiểm tra menu mobile, focus ban đầu và ẩn điều hướng khỏi cây accessibility khi đóng. Đã trả viewport về mặc định.
11. Mở danh sách 8 bài đọc và bài REST API: đoạn gốc, JSON, cụm từ, bốn câu hỏi, nút giải thích Việt, tóm tắt và điều kiện hoàn thành đều hiển thị.
12. Ghi âm: không xin quyền khi mở trang; sau bấm có trạng thái chờ quyền và chặn bấm lặp. Trình duyệt kiểm thử không cấp quyền microphone; sau giới hạn chờ, có thông báo fallback và vẫn dùng được checklist.

## Giới hạn xác minh

- Chưa thu được âm thanh thật để xác minh chất lượng bản thu, nghe lại và download trên phần cứng của người dùng. Chưa thao tác được hộp thoại **Từ chối** riêng của hệ điều hành; đã xác minh fallback không nhận được quyền. Nên kiểm tra thêm microphone trên Chrome/Edge/Safari và thiết bị thật.
- Đã thấy danh sách giọng tổng hợp trên thiết bị và control tốc độ; chưa xác nhận âm thanh phát ra qua loa.
- Chưa thử xóa dữ liệu trình duyệt, gây quota thật, nhiều tab ghi đồng thời hoặc mọi bản trình duyệt. Lỗi storage được xử lý và có export/thử lại; khuyến nghị một tab học.
- Các luồng lịch qua timezone, học bù, reschedule, dữ liệu import sai và từ chối schema tương lai được kiểm bằng test logic, chưa thao tác mọi tổ hợp trên UI.
- Hai nguồn BBC/VOA không đọc được qua công cụ duyệt; trang Tài nguyên đánh dấu chưa xác minh thay vì khẳng định link đã kiểm tra.
- 85 buổi chưa có chi tiết là đề cương. Không có nhận dạng giọng nói hoặc AI chấm nói; không đồng bộ thiết bị và không nhắc khi đóng web.
