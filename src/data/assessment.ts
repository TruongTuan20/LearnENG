import { Exercise } from "@/lib/models";
export const milestonePassages: Record<string, string> = {
  "4": "Yesterday, our team reviewed a new booking form. I explained the required fields and asked two questions about the phone number. The product owner will confirm the rule tomorrow. I plan to update the form after that. Could you review my changes on Friday morning?",
  "8": "I completed the search endpoint yesterday and checked the empty response. Today, I am connecting it to the interface. I am waiting for a decision about cancelled bookings. Could we confirm the default filter after this stand-up? I can continue with the loading state while waiting.",
  "12": "The notification list fails after a fresh login in staging. We expected two messages, but the loading indicator remained on screen. The first request returned 401 in three tests. Refreshing loaded the list. We have not confirmed the cause, so the next step is to inspect when the token becomes available.",
  "16": "The endpoint authenticates the caller before checking the required permission. A user with read access can view the report but cannot delete it. Hiding the delete button improves the interface, but the server still checks every request. The team will add an authorization test and a clear forbidden message.",
  "20": "We measured a slow booking query using the same date range in staging. An index improved reads, but writes became slightly slower. A cache is another option, although recent changes may take time to appear. We need to compare the workload and decide how much stale data is acceptable before choosing a solution.",
  "24": "During the product demo, a stakeholder asked for an export of filtered bookings. We confirmed the date range, columns and access rules before estimating the work. The release will include validation, an empty state and a retry action. We will review feedback after deployment and compare actual response times with our baseline.",
};
export const assessmentPassage =
  "Tuan works on a booking system. Yesterday, he fixed a validation issue, but he has not deployed the change. Today, he plans to test it in staging. He needs the product owner to confirm whether a phone number is required. If the rule is not confirmed, he will continue with the loading state instead. He will send a short update after lunch.";
const questions: [string, string[], string, string][] = [
  [
    "I am responsible ___ building APIs.",
    ["for", "to", "at"],
    "for",
    "Responsible for + danh từ/V-ing.",
  ],
  [
    "Yesterday, I ___ the login page.",
    ["test", "tested", "testing"],
    "tested",
    "Yesterday là thời gian đã kết thúc: dùng quá khứ đơn.",
  ],
  [
    "Could you ___ this change?",
    ["review", "reviewing", "reviewed"],
    "review",
    "Could you + động từ nguyên mẫu.",
  ],
  [
    "An access token is missing. This example API returns ___.",
    ["401", "201", "200"],
    "401",
    "Ví dụ dùng 401 khi thiếu xác thực hợp lệ.",
  ],
  [
    "I am waiting ___ the API contract.",
    ["on", "for", "with"],
    "for",
    "Wait for: chờ một điều/người.",
  ],
  [
    "The expected behavior describes ___.",
    ["what should happen", "an unconfirmed cause", "the tester’s device"],
    "what should happen",
    "Expected là điều cần xảy ra đúng yêu cầu.",
  ],
  [
    "Has Tuan deployed the change?",
    ["No.", "Yes.", "The text does not say."],
    "No.",
    "Đoạn nêu he has not deployed the change.",
  ],
  [
    "What does Tuan need confirmed?",
    [
      "Whether a phone number is required.",
      "The database password.",
      "The release date.",
    ],
    "Whether a phone number is required.",
    "Tìm câu needs the product owner to confirm...",
  ],
  [
    "What will he do if the rule is not confirmed?",
    [
      "Continue with the loading state.",
      "Deploy immediately.",
      "Delete the form.",
    ],
    "Continue with the loading state.",
    "Câu If chỉ điều kiện và hành động thay thế.",
  ],
];
export const assessmentQuestions: Exercise[] = questions.map(
  ([prompt, options, answer, explanation], i) => ({
    id: `entry-${i + 1}`,
    type: "choice",
    prompt,
    options,
    answers: [answer],
    explanation,
  }),
);
