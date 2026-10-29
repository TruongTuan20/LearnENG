import { Reading } from "../lib/models";

type ReadingSeed = [
  string,
  string,
  string,
  string,
  string[],
  string,
  string,
  string,
  string,
];
const seeds: ReadingSeed[] = [
  [
    "http",
    "HTTP request / response",
    `When you open a booking screen, the browser usually needs data from a server. It sends an HTTP request with a method and a target URL. Headers carry additional information, such as the expected content type. Some requests also include a body. For example, a POST request may send the details of a new booking as JSON.

The server processes the request and returns a response. The response includes a status code, headers and, in many cases, a body. A successful request to read a list may return 200 with an array of items. A validation failure may return 400 with details that help the user correct an input. The exact response format belongs to the API contract.

Before displaying data, the client should check whether a response was received and whether its status indicates success. A network failure is different from an HTTP error: the client may receive no response at all. Keep the user’s filters when a request fails, explain the problem clearly and offer a safe retry action. Avoid repeating a write request automatically unless you understand its effects.`,
    "Trình duyệt gửi method, URL, headers và có thể có body. Server trả status, headers và thường có body. Lỗi HTTP khác lỗi mạng không nhận được response. Kiểm tra trạng thái trước khi hiển thị; cẩn thận retry thao tác ghi.",
    [
      "request|yêu cầu|The browser sends a request.",
      "response body|nội dung phản hồi|Read the response body after checking the status.",
      "retry|thử lại|Offer a safe retry action.",
    ],
    "What may happen during a network failure?",
    "The client may receive no response.",
    "When should the client check the status?",
    "Before displaying data.",
  ],
  [
    "rest",
    "A practical REST API guide",
    `This example API manages bookings as resources. The collection lives at /api/bookings. To read a small page, send GET with page and pageSize query parameters. The default page is one, and the maximum page size is fifty. The server returns an items array and a total count. An empty collection still returns a successful response with an empty array.

To create a booking, send POST to the collection URL. Set the content type to application/json and include customerName and startTime in the request body. Both fields are required. If validation succeeds, the server creates a resource and returns 201 with the new booking. If a field is missing, it returns 400 with field-level details. The client should show those details near the relevant input.

Protected operations require an access token in the Authorization header. A missing or expired token produces 401 in this example. Do not put tokens in screenshots or bug reports. Before connecting a real screen, test successful creation, invalid input, an empty list and missing access. These rules describe this example contract; always read the contract for your actual project.`,
    "API ví dụ quản lý booking. GET dùng phân trang, POST tạo mới với hai trường bắt buộc. 201 là tạo thành công, 400 là đầu vào không hợp lệ và 401 khi thiếu/hết hạn token trong ví dụ. Không đưa token vào ảnh hoặc báo cáo.",
    [
      "collection|tập hợp tài nguyên|The collection contains bookings.",
      "required field|trường bắt buộc|Start time is a required field.",
      "field-level details|chi tiết theo trường|Show field-level details near the input.",
    ],
    "What is the maximum page size?",
    "Fifty.",
    "What must the client send to create a booking?",
    "A JSON body with customerName and startTime.",
  ],
  [
    "auth",
    "Authentication vs authorization",
    `Authentication answers the question, “Who are you?” Authorization answers a different question: “What are you allowed to do?” A user may successfully sign in and still lack permission to delete a booking. A clear interface should help the user understand that difference without exposing sensitive security details.

In a common flow, the client receives an access token after authentication and sends it with protected requests. The server validates the token and then checks the permissions required by the operation. Hiding a delete button in the interface can improve the experience, but it is not a security boundary. The server must enforce the rule even when a request comes from another client.

In this example, the API returns 401 when valid authentication is missing and 403 when an authenticated user lacks permission. Your project may document additional rules. Do not solve a permission problem by giving every user a broad role. First, identify the intended action and the smallest permission needed. When reporting an access issue, include the environment, user role and operation, but remove passwords, tokens and personal data from the report.`,
    "Authentication xác định danh tính; authorization kiểm tra quyền thao tác. Ẩn nút giúp UX nhưng server vẫn phải chặn truy cập trái phép. Báo cáo lỗi quyền cần vai trò và thao tác, không cần mật khẩu/token.",
    [
      "permission|quyền|The user lacks permission.",
      "enforce|thực thi bắt buộc|The server must enforce the rule.",
      "security boundary|ranh giới bảo mật|A hidden button is not a security boundary.",
    ],
    "Does hiding a button secure an endpoint?",
    "No. The server must enforce permission checks.",
    "What should a report remove?",
    "Passwords, tokens and personal data.",
  ],
  [
    "indexes",
    "Database indexes in context",
    `An index helps a database find rows without examining every row in a table. Imagine a booking table with many records and a screen that often filters by creation date. A suitable index may help the database locate the relevant range more efficiently. It does not mean that every query becomes fast or that every column needs an index.

Indexes use storage and add work when rows are inserted, updated or deleted. The best choice depends on the filters, ordering, data distribution and actual workload. A query that returns most of a table may still require substantial work. Start by limiting the requested time range, selecting the fields you need and using pagination. Then inspect the execution plan and measure the result.

When discussing an index change, explain the slow user action and provide evidence. For example, compare response times for the same date range before and after the change. Test writes as well as reads. Avoid promising an improvement from a single local experiment. Record the environment and data size so another developer can repeat the comparison and understand the limits of the conclusion.`,
    "Index hỗ trợ tìm dòng nhưng tốn dung lượng và chi phí ghi. Giới hạn khoảng thời gian, phân trang, xem execution plan và đo cùng điều kiện. Một thử nghiệm local không chứng minh mọi truy vấn sẽ nhanh.",
    [
      "execution plan|kế hoạch thực thi|Inspect the execution plan.",
      "workload|khối lượng tác vụ|The choice depends on the workload.",
      "date range|khoảng ngày|Limit the date range.",
    ],
    "What cost can an index add?",
    "Storage and extra work during writes.",
    "What should you compare?",
    "The same date range before and after the change.",
  ],
  [
    "state",
    "Frontend state and derived values",
    `A frontend component needs state when it must remember something between user actions. A filter panel may store the selected status and date range. A dialog may store whether it is open. These values belong to the interaction, while the booking records themselves may come from a server or a local database.

Not every displayed value needs separate state. If the interface already has a list of selected items, the selected count can usually be calculated from that list. Storing both values creates a second source of truth. A later change may update the list but forget the count, leaving the screen inconsistent.

Place state near the components that need it, and move it upward when several components must share it. A global store can be useful, but it should not become the default home for every input. When reviewing a bug, ask which value is authoritative and when it changes. Test empty data, repeated actions and navigation away from the screen. If progress must survive a refresh, save it deliberately and show an error when persistence fails rather than pretending the save succeeded.`,
    "State nhớ lựa chọn tương tác. Giá trị tính được từ dữ liệu khác thường không cần lưu riêng. Xác định nguồn sự thật, phạm vi chia sẻ và xử lý lỗi lưu khi cần tồn tại qua refresh.",
    [
      "derived value|giá trị suy ra|The count is a derived value.",
      "source of truth|nguồn dữ liệu chuẩn|Use one source of truth.",
      "persistence|lưu bền vững|Persistence can fail.",
    ],
    "Why avoid storing both list and count?",
    "They may become inconsistent.",
    "What should happen when saving fails?",
    "Show an error instead of pretending the save succeeded.",
  ],
  [
    "errors",
    "Error handling that helps users",
    `An error message should help a user decide what to do next. “Something went wrong” may be better than a blank screen, but it rarely gives enough guidance. A useful message describes the affected action, preserves the user’s work and offers a safe next step. It should not expose internal stack traces or sensitive connection details.

Different failures need different responses. If an input is invalid, show the relevant message next to that field. If a connection fails, keep the form values and offer a retry. If the session has expired, explain that the user needs to sign in again. Avoid endless automatic retries, especially for operations that may create duplicate records.

Developers also need diagnostic information. A correlation identifier can help connect a user report to server logs without showing the full technical exception. In a bug report, separate the visible message from the suspected cause. Record the action, environment and time of failure. Test the failure path deliberately: a successful happy path does not prove that the application handles slow requests, unavailable storage or a rejected permission request correctly.`,
    "Lỗi hữu ích cho biết thao tác bị ảnh hưởng và bước tiếp theo, giữ dữ liệu người dùng, không lộ stack trace. Kiểm tra riêng đường lỗi; happy path không chứng minh fallback hoạt động.",
    [
      "preserve|giữ lại|Preserve the form values.",
      "correlation identifier|mã đối chiếu log|Include a correlation identifier.",
      "failure path|luồng thất bại|Test the failure path.",
    ],
    "What should a connection error preserve?",
    "The form values.",
    "Why use a correlation identifier?",
    "To connect a user report to server logs.",
  ],
  [
    "deployment",
    "Deployment configuration",
    `A feature can work locally and fail after deployment because the environment is different. The database address, API base URL and enabled features may vary between development, staging and production. Configuration makes these differences explicit without requiring a separate codebase for each environment.

Before a release, confirm which values are required and who manages them. A missing value should produce a clear diagnostic message rather than a confusing failure much later. Secrets belong in an appropriate secret-management mechanism, not in frontend source code, screenshots or shared tickets. A value bundled into a browser application should be treated as public.

Use a release checklist that includes configuration validation, a small smoke test and a rollback plan. After deployment, check the actual user flow instead of relying only on a successful build. When something fails, compare the environment settings carefully without copying secrets into a conversation. Record what changed and what you verified. A rollback plan should explain how to return to a known working version and what happens to data written by the new version. Practice that plan before an urgent incident makes every decision harder.`,
    "Cấu hình khác giữa local, staging và production. Giá trị frontend là công khai. Release cần kiểm tra cấu hình, smoke test và rollback có xét dữ liệu được ghi bởi phiên bản mới.",
    [
      "environment|môi trường|Check the staging environment.",
      "rollback plan|kế hoạch quay lui|Prepare a rollback plan.",
      "smoke test|kiểm tra nhanh luồng chính|Run a smoke test after deployment.",
    ],
    "How should browser-bundled values be treated?",
    "As public.",
    "What should follow deployment?",
    "A check of the actual user flow.",
  ],
  [
    "caching",
    "Caching and stale data",
    `A cache stores a copy of data so that later requests can be served with less work. For example, an application may cache a frequently used list of public categories. A cache hit means the requested value was available. A cache miss means the application must obtain the value from its original source and may store a new copy.

The difficult question is often freshness. A cached value can become stale after the source changes. A time-to-live limits how long a value stays in the cache, but it does not guarantee that every user sees an update immediately. Some applications also invalidate related keys after a successful write. The correct approach depends on the cost of stale data and the expected workload.

Before caching, decide what can safely be shared, how keys are built and when values expire. Do not accidentally share private user data through a common key. Measure hit rate and response time, and test what happens when the cache is unavailable. The application should have an intentional fallback. Explain the trade-off in ordinary language: faster responses may mean that a recent change takes longer to appear.`,
    "Cache lưu bản sao, hit là có sẵn, miss là phải lấy nguồn. TTL không bảo đảm cập nhật tức thì. Thiết kế key để không chia sẻ nhầm dữ liệu riêng tư; đo và kiểm tra fallback khi cache lỗi.",
    [
      "cache hit|lấy được từ cache|A cache hit avoids extra work.",
      "stale data|dữ liệu cũ|The screen may show stale data.",
      "invalidate|làm mất hiệu lực|Invalidate related keys after a write.",
    ],
    "Does a TTL guarantee immediate freshness?",
    "No. A recent change may take time to appear.",
    "What should you test besides a cache hit?",
    "What happens when the cache is unavailable.",
  ],
];
export const readings: Reading[] = seeds.map(
  ([id, title, text, translation, phrases, q1, a1, q2, a2], index) => ({
    id,
    title,
    text,
    translation,
    level: index < 2 ? "Ôn nền tảng" : "Đọc ứng dụng",
    minutes: 12,
    phrases: phrases.map((s) => {
      const [text, meaning, example] = s.split("|");
      return { text, meaning, example };
    }),
    questions: [
      {
        id: `${id}-q1`,
        type: "choice",
        prompt: q1,
        options: [
          a1,
          "The system never needs any checks.",
          "All operations always succeed.",
        ],
        answers: [a1],
        explanation: `Đoạn đọc nêu: ${a1}`,
      },
      {
        id: `${id}-q2`,
        type: "fill",
        prompt: q2,
        answers: [a2],
        explanation: `Câu tham khảo: ${a2} Có thể diễn đạt bằng từ khác khi tự đánh giá.`,
      },
      {
        id: `${id}-q3`,
        type: "writing",
        prompt:
          "What is the main idea? Give one condition or limitation mentioned in the text.",
        answers: [`${title}: ${a1} ${a2}`],
        explanation:
          "Tự kiểm tra: ý chính đúng chủ đề và điều kiện có bằng chứng trong đoạn.",
      },
      {
        id: `${id}-q4`,
        type: "writing",
        prompt: `Explain “${phrases[0].split("|")[0]}” in this context.`,
        answers: [phrases[0].split("|")[2]],
        explanation: `Nghĩa trong ngữ cảnh: ${phrases[0].split("|")[1]}.`,
      },
    ],
    summary:
      "Summarize the text in 3–5 English sentences. Include one limitation and one next action.",
    application: `Áp dụng ${title} vào một tính năng thật: viết một checklist ba bước và một tình huống lỗi cần thử.`,
    code:
      index < 2
        ? 'GET /api/bookings?page=1&pageSize=20\nAuthorization: Bearer <example-only>\n\nHTTP/1.1 200 OK\n{"items": [], "total": 0}'
        : undefined,
  }),
);
