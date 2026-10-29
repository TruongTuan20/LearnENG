import { CourseWeek, Lesson, Phrase } from "../lib/models";

const topics = [
  "Giới thiệu bản thân và công việc",
  "Thói quen, thời gian và lịch làm việc",
  "Kể việc đã làm và vấn đề đã gặp",
  "Kế hoạch, đề nghị và nhờ hỗ trợ",
  "Small talk và sở thích",
  "Ăn uống, mua sắm và hỏi thông tin",
  "Daily meeting và báo cáo tiến độ",
  "Hỏi lại và xác nhận yêu cầu",
  "Mô tả bug và các bước tái hiện",
  "Giải thích tính năng và giao diện",
  "Đọc tài liệu API và HTTP",
  "Ôn tập và đánh giá theo tình huống",
  "Authentication và authorization",
  "Database và truy vấn",
  "Frontend, component và state",
  "Backend và xử lý lỗi",
  "Testing và code review",
  "Deployment và môi trường",
  "Performance và caching",
  "Thảo luận giải pháp và đánh đổi",
  "Khai thác yêu cầu với vai trò BA",
  "Demo sản phẩm và nhận feedback",
  "Xử lý sự cố và trao đổi nhóm",
  "Dự án cuối khóa và đánh giá tiến bộ",
];
const outlines = [
  [
    "Introduce yourself as a developer",
    "Say your role clearly",
    "Meet a new teammate",
    "Read a developer profile",
    "Your 90-second introduction",
  ],
  [
    "Describe a working day",
    "Hear times and schedules",
    "Arrange a short meeting",
    "Read a weekly plan",
    "Plan a balanced workday",
  ],
  [
    "Talk about finished work",
    "Hear past-tense endings",
    "Explain yesterday’s problem",
    "Read an incident note",
    "Write a short work update",
  ],
  [
    "Describe next steps",
    "Make a polite request",
    "Ask a colleague for help",
    "Read a delivery plan",
    "Negotiate a realistic plan",
  ],
  [
    "Start a friendly conversation",
    "Listen for interests",
    "Talk about your weekend",
    "Read a community post",
    "Keep a conversation going",
  ],
  [
    "Order food politely",
    "Hear prices and quantities",
    "Ask for directions",
    "Read a menu and a notice",
    "Solve an everyday problem",
  ],
  [
    "Structure a daily update",
    "Listen for blockers",
    "Respond in a stand-up",
    "Read a task board update",
    "Deliver a focused daily report",
  ],
  [
    "Ask a clarifying question",
    "Hear confirmation signals",
    "Confirm acceptance criteria",
    "Read a user story",
    "Summarize an agreement",
  ],
  [
    "Describe expected and actual behavior",
    "Hear steps and frequency",
    "Report a bug to a teammate",
    "Read a reproducible bug report",
    "Report the notification bug",
  ],
  [
    "Explain a feature",
    "Describe screen layout",
    "Guide a user through a flow",
    "Read a feature brief",
    "Present a UI decision",
  ],
  [
    "Understand request and response",
    "Listen to an API explanation",
    "Ask about an endpoint",
    "Read a REST API guide",
    "Explain and test an API call",
  ],
  [
    "Review useful phrases",
    "Listen and take notes",
    "Handle a mixed conversation",
    "Read an unfamiliar brief",
    "Complete the first scenario assessment",
  ],
  [
    "Compare authentication and authorization",
    "Hear a login flow",
    "Explain access permissions",
    "Read a token guide",
    "Explain a protected endpoint",
  ],
  [
    "Describe tables and relationships",
    "Hear query requirements",
    "Discuss a slow query",
    "Read an index guide",
    "Explain a query improvement",
  ],
  [
    "Name components and state",
    "Hear UI changes",
    "Discuss shared state",
    "Read a component guide",
    "Explain a state update",
  ],
  [
    "Describe backend responsibilities",
    "Hear an error report",
    "Explain validation",
    "Read an error response",
    "Propose an error-handling flow",
  ],
  [
    "Describe test cases",
    "Hear review suggestions",
    "Give respectful review feedback",
    "Read a pull request",
    "Review and improve a change",
  ],
  [
    "Describe environments",
    "Hear deployment steps",
    "Discuss configuration",
    "Read release instructions",
    "Explain a safe release",
  ],
  [
    "Describe response time",
    "Hear performance observations",
    "Discuss cache invalidation",
    "Read a caching guide",
    "Explain a performance experiment",
  ],
  [
    "Compare two solutions",
    "Hear advantages and risks",
    "Disagree constructively",
    "Read a design proposal",
    "Recommend a trade-off",
  ],
  [
    "Ask open questions",
    "Hear hidden assumptions",
    "Interview a stakeholder",
    "Read a requirement brief",
    "Write acceptance criteria",
  ],
  [
    "Set a demo agenda",
    "Hear user feedback",
    "Demonstrate a feature",
    "Read a feedback summary",
    "Deliver a product demo",
  ],
  [
    "Describe an incident",
    "Hear an urgent handover",
    "Coordinate a response",
    "Read an incident timeline",
    "Write an incident update",
  ],
  [
    "Plan your final project",
    "Listen and summarize",
    "Present your project",
    "Read and apply a new guide",
    "Compare your first and final recordings",
  ],
];

const banks: Record<number, string[]> = {
  1: [
    "work as|làm việc với vai trò|I work as a full-stack developer.",
    "be responsible for|chịu trách nhiệm về|I am responsible for building APIs.",
    "mainly work with|chủ yếu làm với|I mainly work with .NET and Next.js.",
    "work on|tham gia làm|I work on a booking system.",
    "be familiar with|quen thuộc với|I am familiar with SQL Server.",
    "improve my communication skills|cải thiện kỹ năng giao tiếp|I want to improve my communication skills.",
    "join the team|gia nhập nhóm|I joined the team in June.",
    "focus on|tập trung vào|I focus on the backend today.",
  ],
  2: [
    "start at|bắt đầu lúc|I start at nine.",
    "usually check|thường kiểm tra|I usually check messages first.",
    "take a break|nghỉ giải lao|I take a break at noon.",
    "be available|có thời gian rảnh|Are you available at two?",
    "every weekday|mỗi ngày trong tuần|I study every weekday.",
    "move the meeting|dời cuộc họp|Can we move the meeting to three?",
    "finish by|xong trước|I finish by six.",
    "spend time on|dành thời gian cho|I spend time on code review.",
  ],
  3: [
    "worked on|đã làm về|I worked on the login page.",
    "ran into|gặp phải|I ran into a timeout.",
    "found out|phát hiện ra|We found out the token had expired.",
    "fixed the issue|đã sửa lỗi|I fixed the issue yesterday.",
    "tested the change|đã kiểm tra thay đổi|We tested the change locally.",
    "could not|đã không thể|The user could not sign in.",
    "after that|sau đó|After that, I checked the logs.",
    "turned out|hóa ra|It turned out to be a configuration issue.",
  ],
  4: [
    "plan to|dự định|I plan to finish the form today.",
    "going to|sẽ, có dự định|We are going to test the release.",
    "could you|bạn có thể|Could you review this change?",
    "would you mind|bạn có phiền|Would you mind checking the logs?",
    "need help with|cần giúp về|I need help with Redis.",
    "by tomorrow|trước ngày mai|I can send it by tomorrow.",
    "let me know|hãy cho tôi biết|Let me know if you need details.",
    "instead of|thay vì|Can we meet tomorrow instead of today?",
  ],
  7: [
    "completed|đã hoàn thành|I completed the endpoint yesterday.",
    "currently working on|hiện đang làm|I am currently working on validation.",
    "blocked by|bị chặn bởi|I am blocked by missing credentials.",
    "next step|bước tiếp theo|The next step is integration testing.",
    "waiting for|đang chờ|I am waiting for the API contract.",
    "on track|đúng tiến độ|The feature is on track.",
    "follow up|trao đổi tiếp|Let us follow up after the stand-up.",
    "need a hand|cần giúp|I need a hand with the test setup.",
  ],
  9: [
    "expected behavior|hành vi mong đợi|The expected behavior is a loaded list.",
    "actual behavior|hành vi thực tế|The actual behavior is a blank panel.",
    "steps to reproduce|các bước tái hiện|Please include the steps to reproduce.",
    "every time|mọi lần|It fails every time.",
    "affect users|ảnh hưởng người dùng|This can affect users after login.",
    "error message|thông báo lỗi|There is no error message.",
    "workaround|cách xử lý tạm|Refreshing is a temporary workaround.",
    "reproduce the issue|tái hiện lỗi|I can reproduce the issue in staging.",
  ],
  11: [
    "send a request|gửi yêu cầu|The client sends a request.",
    "return a response|trả phản hồi|The server returns a response.",
    "request body|nội dung yêu cầu|The request body contains a name.",
    "status code|mã trạng thái|Check the status code first.",
    "required field|trường bắt buộc|Email is a required field.",
    "access token|mã truy cập|Include an access token in the header.",
    "query parameter|tham số truy vấn|The page query parameter starts at one.",
    "rate limit|giới hạn tần suất|Respect the rate limit.",
  ],
};

export type LessonSeed = [
  number,
  number,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
];
import { foundationSeeds } from "./foundation";
import { workplaceSeeds } from "./workplace";
import { comprehension } from "./comprehension";

function phrasesFor(week: number, day: number): Phrase[] {
  const bank = banks[week];
  return Array.from({ length: 6 }, (_, i) => {
    const [text, meaning, example] =
      bank[(i + day - 1) % bank.length].split("|");
    return { text, meaning, example };
  });
}
function buildLesson(seed: LessonSeed): Lesson {
  const [
    week,
    day,
    warmup,
    explanation,
    passage,
    prompt,
    answer,
    speaking,
    output,
  ] = seed;
  const id = `w${String(week).padStart(2, "0")}-d${day}`,
    phrases = phrasesFor(week, day);
  const [question, correct, wrong1, wrong2, evidence] = comprehension[id];
  const choices = [correct, wrong1, wrong2];
  const shift = (week + day) % 3;
  const options = [...choices.slice(shift), ...choices.slice(0, shift)];
  const order = phrases[(day + 1) % phrases.length].example;
  return {
    id,
    week,
    day,
    title: outlines[week - 1][day - 1],
    topic: topics[week - 1],
    skill: [
      "Cụm từ & mẫu câu",
      "Nghe & phát âm",
      "Hội thoại & phản xạ",
      "Đọc & ứng dụng",
      "Ôn tập & thực hành",
    ][day - 1],
    published: true,
    estimatedMinutes: 45,
    objectives: [
      `Thực hiện: ${output}`,
      `Dùng ít nhất ba cụm từ trong ngữ cảnh ${topics[week - 1].toLowerCase()}.`,
    ],
    output,
    warmup,
    explanation,
    phrases,
    patterns: [phrases[0].example, phrases[2].example, phrases[4].example],
    passage,
    exercises: [
      {
        id: `${id}-fill`,
        type: "fill",
        prompt,
        answers: answer.split("|"),
        explanation: `Điền “${answer.split("|")[0]}”. ${explanation}`,
      },
      {
        id: `${id}-choice`,
        type: "choice",
        prompt: question,
        options,
        answers: [correct],
        explanation: evidence,
      },
      {
        id: `${id}-order`,
        type: "order",
        prompt: "Put the words in order to make a useful sentence.",
        options: order.replace(/\.$/, "").split(" ").reverse(),
        answers: [order],
        explanation: `Câu tự nhiên: ${order} Chú ý chủ ngữ đứng trước động từ.`,
      },
      {
        id: `${id}-write`,
        type: "writing",
        prompt: `Write 3–5 sentences: ${speaking}`,
        answers: [
          `${phrases[0].example} ${phrases[2].example} ${phrases[4].example}`,
        ],
        explanation:
          "Đây chỉ là gợi ý cấu trúc. Tự kiểm tra: đủ ý, có chủ ngữ/động từ, dùng cụm mục tiêu và người đọc hiểu bước tiếp theo.",
      },
    ],
    speaking,
    application: `Áp dụng với thông tin thật: ${output} Viết vào ghi chú, bỏ thông tin nội bộ nhạy cảm.`,
    summary: `Bạn vừa luyện ${outlines[week - 1][day - 1].toLowerCase()}. ${explanation} Nhắc lại ba cụm từ mà không nhìn.`,
    extension: `Thêm 15 phút: ${speaking} Đổi vai hoặc thay một điều kiện, đặt hai câu hỏi tiếp nối rồi thu lại một lần không nhìn mẫu.`,
  };
}
const ready = [...foundationSeeds, ...workplaceSeeds].map(buildLesson);
export const weeks: CourseWeek[] = topics.map((title, i) => ({
  id: `week-${i + 1}`,
  number: i + 1,
  title,
  goal: `Sử dụng tiếng Anh để ${title.toLowerCase()} bằng câu rõ ràng, phù hợp bối cảnh.`,
  output:
    i === 23
      ? "Demo 3 phút, tóm tắt tài liệu mới và nhật ký so sánh tiến bộ."
      : `Một sản phẩm thực hành về ${title.toLowerCase()}, có tự đánh giá.`,
  lessons: outlines[i].map(
    (name, d) =>
      ready.find((l) => l.week === i + 1 && l.day === d + 1) || {
        id: `w${String(i + 1).padStart(2, "0")}-d${d + 1}`,
        week: i + 1,
        day: d + 1,
        title: name,
        topic: title,
        skill: ["Cụm từ", "Nghe", "Hội thoại", "Đọc", "Tổng hợp"][d],
        published: false,
        estimatedMinutes: 45,
        objectives: [`Chuẩn bị thực hành ${name.toLowerCase()}.`],
        output: `Bản nháp: ${name}.`,
        warmup: "Ghi điều đã biết và hai câu hỏi cần trả lời.",
        explanation: "Đề cương; nội dung chi tiết chưa phát hành.",
        phrases: [],
        patterns: [],
        passage: "",
        exercises: [],
        speaking: `Prepare a short response about: ${name}.`,
        application: "Tìm một ví dụ trong công việc và ghi điều cần học thêm.",
        summary: "",
        extension: "",
      },
  ),
}));
export const lessons = weeks.flatMap((w) => w.lessons);
export const publishedLessons = lessons.filter((l) => l.published);
