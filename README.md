# DevEnglish

Ứng dụng học tiếng Anh cá nhân dành cho developer Việt. Giao diện và giải thích bằng tiếng Việt; hội thoại, đoạn đọc và bài luyện bằng tiếng Anh. Không cần backend, tài khoản hoặc API key.

## Chạy ứng dụng

Yêu cầu Node.js 22 trở lên và npm.

```powershell
cd C:\Users\phant\OneDrive\Desktop\itd\itd\web\learnENG
npm ci
npm run dev
```

Mở http://127.0.0.1:3000. Bản production:

```powershell
npm run build
npm start
```

Giữ nguyên hostname, cổng và trình duyệt để thấy dữ liệu đã lưu. `localhost` và `127.0.0.1`, hoặc hai cổng khác nhau, là các vùng dữ liệu riêng. Dev server dùng cổng 3100 trong kiểm thử, dữ liệu kiểm thử mang tên **Tuấn · Kiểm thử**. Chạy cổng 3000 để bắt đầu sạch.

## Đã có

- Onboarding: hồ sơ, múi giờ IANA, ngày học, 30/45/60 phút, ưu tiên và khó khăn; kiểm tra 6 câu ngữ pháp/từ vựng, đoạn đọc 3 câu và nói tự đánh giá. Có thể bỏ qua.
- Dashboard, lịch tuần/danh sách, học trước/học bù và dời buổi chưa xong; giữ kết quả và ngày của những buổi đã hoàn thành.
- Đề cương 24 tuần, 120 buổi. **35 bài hoàn chỉnh** ở tuần 1–4, 7, 9, 11; **85 buổi đề cương** hiển thị trạng thái rõ ràng.
- Bài học có 6 cụm từ, mẫu câu, đoạn gốc riêng, 4 dạng bài luyện, giải thích, nói, ứng dụng, tóm tắt và nhiệm vụ mở rộng. Bản 30 phút rút gọn độ dài sản phẩm thực hành, 60 phút thêm đổi vai/câu hỏi/thu lại.
- Lưu phần đang học, đáp án và ghi chú. Hoàn thành cần đủ hoạt động bắt buộc, câu trả lời và xem giải thích; các phần tự thực hành cần xác nhận. Câu viết tự do được đối chiếu gợi ý/checklist, không bị chấm tự động.
- Timer chủ động, pause, tự pause khi ẩn tab. Chỉ ghi giây thực; mỗi phiên/ngày dùng một bản ghi cộng dồn.
- Flashcard chống trùng theo bài + cụm từ; lọc chủ đề/trạng thái và ôn thẻ đến hạn. Chu kỳ 1, 3, 7, 14, 30 ngày; quên hoặc khó quay lại sau một ngày.
- 12 tình huống nói theo lượt, gợi ý ẩn/hiện, câu tham khảo và mở rộng.
- 8 bài đọc IT nguyên bản dài 150–250 từ, giải thích Việt bật/tắt, câu hỏi, tóm tắt và ứng dụng.
- Thống kê từ dữ liệu thật, nhật ký nói, đánh giá mỗi 4 tuần và tài nguyên ngoài có hướng dẫn học ngắn.
- Light/dark, điều hướng desktop/mobile, focus bàn phím và hộp xác nhận dùng Radix.
- IndexedDB, JSON export/import có Zod validation, preview và xác nhận thay thế; reset có xác nhận; lỗi storage có nút export/thử lại.

## Nội dung và cấu trúc

- `src/data/course.ts`: 24 tuần, 120 tiêu đề, bank cụm từ, hàm ghép bài có kiểu `Lesson`.
- `src/data/foundation.ts`: 20 bài tuần 1–4, từng bài có đoạn và nhiệm vụ riêng.
- `src/data/workplace.ts`: 15 bài tuần 7, 9, 11.
- `src/data/comprehension.ts`: 35 câu đọc/nghe hiểu riêng, có nhiễu theo ngữ cảnh và bằng chứng; thêm câu tương ứng khi phát hành bài mới.
- `src/data/readings.ts`: 8 đoạn IT nguyên bản; `scenarios.ts`: 12 kịch bản; `assessment.ts`: đầu vào; `resources.ts`: nguồn ngoài.
- `src/lib/models.ts`: schema/kiểu dữ liệu; `learning.ts`: lịch, ôn, thống kê và điều kiện hoàn thành; `storage.ts`: mở DB và validate bản sao.
- `src/components/`: các màn hình và thành phần học; `ui/`: primitive shadcn (Button) và ConfirmDialog dựa trên Radix.

Để phát hành buổi tiếp theo, thêm một `LessonSeed` (tuple có chú thích cấu trúc trong `course.ts`) vào file nội dung tương ứng, thêm bank cụm từ cho tuần đó và giữ ID `wXX-dY` ổn định. Hàm ghép sẽ thay đề cương bằng bài đầy đủ. Nếu cần cấu trúc bài khác, bổ sung `Lesson` có kiểu rõ ràng thay vì sao chép bài mẫu. Chạy test kiểm tra số bài và điều chỉnh số lượng kỳ vọng khi chủ động phát hành thêm.

## Lưu trữ và quyền riêng tư

Nội dung khóa học nằm trong source; dữ liệu cá nhân nằm tại IndexedDB `devenglish`, store `user`, key `data`. Schema dữ liệu và DB hiện là v1, bản phát hành đầu tiên. Không có phiên bản dữ liệu cũ để chuyển đổi; importer từ chối phiên bản khác mà không ghi đè. Khi thêm schema v2, viết bước chuyển v1 → v2 trước validation và thêm test round-trip. Không tự tạo migration cho database backend.

Không đồng bộ thiết bị, không yêu cầu notification, không nhắc khi web đã đóng. Export thường xuyên và trước khi xóa dữ liệu trình duyệt. Khi save lỗi, thay đổi còn ở bộ nhớ phiên hiện tại; hãy export ngay. Chỉ mở một tab học để tránh hai tab cùng ghi đè một bản dữ liệu.

Giọng đọc là Web Speech API tổng hợp, phụ thuộc giọng tiếng Anh đã có trên thiết bị. Nếu không phát được, dùng transcript và đọc nhại. MediaRecorder chỉ xin microphone khi bấm ghi âm; xử lý từ chối/thiếu thiết bị và chờ quyền quá lâu, dừng tracks sau khi xong hoặc rời phần ghi âm. **Bản thu chỉ giữ trong phiên của thành phần ghi âm**, không upload, không nằm trong JSON; cần tải trước khi rời trang/phần hoặc refresh. Bản đầu không bật speech recognition hoặc AI chấm nói; không có điểm pronunciation, fluency hay chứng nhận CEFR.

## Kiểm tra

```powershell
npm run typecheck
npm test
npm run build
```

Test có giá trị tại `src/lib/learning.test.ts`: sinh lịch/ngày bắt đầu, cuối tuần, chuyển tháng/năm, múi giờ/DST, dời lịch và kết quả học bù, chu kỳ ôn, thời gian/streak, import sai schema/ngày/timezone/ID, điều kiện hoàn thành, 35 bài khác nhau và độ dài 8 bài đọc. Runner đặt cache trong `.cache/` để tránh lỗi rename thư mục temp trên Windows sandbox.

Xem `QA.md` để biết luồng browser đã kiểm tra và giới hạn thiết bị. Không có dữ liệu thành tích mẫu trong source; người mới bắt đầu ở 0. Điểm TOEIC cũ không được dùng để gán CEFR hoặc suy ra khả năng nói.
