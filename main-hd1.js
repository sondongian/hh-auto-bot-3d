(async () => {
// Điểm Danh
(async function runDiemDanh() {
  const ACTIVITY_NAME = "🎯 Hoạt động: Điểm danh";
  const NONCE_VAR_NAME = 'customRestNonce';
  const API_URL = 'https://hoathinh3d.team/wp-json/hh3d/v1/action';

  // Inject confetti nếu chưa có
  if (!window.confetti) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js';
    document.head.appendChild(script);
  }

  function showNotification(type, title, message) {
    const wrapper = document.createElement('div');
    wrapper.style.position = 'fixed';
    wrapper.style.bottom = '20px';
    wrapper.style.right = '20px';
    wrapper.style.maxWidth = '320px';
    wrapper.style.backgroundColor = type === 'success' ? '#d4edda' : '#f8d7da';
    wrapper.style.color = type === 'success' ? '#155724' : '#721c24';
    wrapper.style.border = '1px solid';
    wrapper.style.borderColor = type === 'success' ? '#c3e6cb' : '#f5c6cb';
    wrapper.style.padding = '15px';
    wrapper.style.borderRadius = '8px';
    wrapper.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
    wrapper.style.zIndex = 9999;
    wrapper.style.fontFamily = 'sans-serif';
    wrapper.style.opacity = 0;
    wrapper.style.transition = 'opacity 0.5s ease';

    const icon = type === 'success' ? '✅' : '❌';

    wrapper.innerHTML = `
      <strong style="display:block;margin-bottom:5px;">
        ${icon} ${title}
      </strong>
      <div style="margin-bottom:5px;">${message}</div>
    `;

    document.body.appendChild(wrapper);
    requestAnimationFrame(() => (wrapper.style.opacity = 1));
    setTimeout(() => {
      wrapper.style.opacity = 0;
      setTimeout(() => wrapper.remove(), 600);
    }, 8000);
  }

  const nonce = window[NONCE_VAR_NAME];
  if (!nonce) {
    console.error('[DiemDanh] Không tìm thấy nonce!');
    showNotification('error', ACTIVITY_NAME, 'Không thể thực hiện điểm danh.');
    return;
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': nonce,
      },
      body: JSON.stringify({ action: 'daily_check_in' }),
    });

    const result = await response.json();

    if (result.success) {
      showNotification('success', ACTIVITY_NAME, result.message || 'Đã ghi nhận điểm danh!');
      console.log('[DiemDanh] Thành công:', result);
      if (window.confetti) {
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
      }
    } else {
      showNotification('error', ACTIVITY_NAME, result.message || 'Không rõ lỗi');
      console.error('[DiemDanh] Lỗi:', result);
    }
  } catch (err) {
    console.error('[DiemDanh] Lỗi khi gửi yêu cầu:', err);
    showNotification('error', ACTIVITY_NAME, 'Không thể kết nối tới máy chủ.');
  }
})();


// Tế Lễ
(async function runTele() {
  const ACTIVITY_NAME = "🙏 Hoạt động: Tế Lễ Tông Môn";
  const alreadyDoneIndicators = ["đã tế lễ", "đạo hữu đã tế lễ"];
  const denyIndicators = ["lỗi", "thất bại", "không"];

  // Inject confetti nếu chưa có
  if (!window.confetti) {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js";
    document.head.appendChild(script);
  }

  function showNotification(message, type = "success") {
    const wrapper = document.createElement("div");
    wrapper.style.position = "fixed";
    wrapper.style.bottom = "20px";
    wrapper.style.right = "20px";
    wrapper.style.maxWidth = "320px";
    wrapper.style.backgroundColor = type === "success" ? "#d4edda" : "#f8d7da";
    wrapper.style.color = type === "success" ? "#155724" : "#721c24";
    wrapper.style.border = "1px solid";
    wrapper.style.borderColor = type === "success" ? "#c3e6cb" : "#f5c6cb";
    wrapper.style.padding = "15px";
    wrapper.style.borderRadius = "8px";
    wrapper.style.boxShadow = "0 0 10px rgba(0,0,0,0.2)";
    wrapper.style.zIndex = 9999;
    wrapper.style.fontFamily = "sans-serif";
    wrapper.style.opacity = 0;
    wrapper.style.transition = "opacity 0.5s ease";

    const icon = type === "success" ? "✅" : "❌";
    const title = type === "success" ? "Tế Lễ Thành Công" : "Tế Lễ Thất Bại";

    wrapper.innerHTML = `
      <strong style="display:block;margin-bottom:5px;">
        ${icon} ${title}
      </strong>
      <div style="margin-bottom:10px;">${message}</div>
    `;

    document.body.appendChild(wrapper);
    requestAnimationFrame(() => (wrapper.style.opacity = 1));
    setTimeout(() => {
      wrapper.style.opacity = 0;
      setTimeout(() => wrapper.remove(), 600);
    }, 8000);
  }

  const nonce = window.customRestNonce;
  if (!nonce) {
    showNotification("Không tìm thấy customRestNonce trong trang!", "error");
    return;
  }

  try {
    const res = await fetch("https://hoathinh3d.team/wp-admin/admin-ajax.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        action: "te_le_tong_mon",
        nonce: nonce,
      }),
    });

    const result = await res.json();
    const rawMsg = typeof result.data === "string"
      ? result.data
      : (result.data?.message || result.message || "Không rõ kết quả.");
    const msgText = rawMsg.toLowerCase();
    const isSuccess = result.success === true;
    const isDone = alreadyDoneIndicators.some((x) => msgText.includes(x));
    const isError = denyIndicators.some((x) => msgText.includes(x));

    if (isSuccess || (isDone && !isError)) {
      showNotification(rawMsg, "success");
      if (window.confetti) confetti({ particleCount: 120, spread: 60, origin: { y: 0.6 } });
      console.log("✅ Tế Lễ:", rawMsg);
    } else {
      showNotification(rawMsg, "error");
      console.warn("⚠️ Tế Lễ Lỗi:", rawMsg);
    }
  } catch (err) {
    showNotification("Lỗi gửi yêu cầu tế lễ!", "error");
    console.error("❌ Tế Lễ Exception:", err);
  }
})();


// Vấn Đáp
(async function autoAnswerQuiz() {
  const normalize = (text) =>
    text.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").replace(/\s+/g, " ").trim();const normalizedAnswerBank = {};
  for (const q in answerBank) {
    normalizedAnswerBank[normalize(q)] = answerBank[q];
  }

  async function fetchQuizData() {
    const res = await fetch("/wp-content/themes/halimmovies-child/hh3d-ajax.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ action: "load_quiz_data" }),
    });
    return res.json();
  }

  async function submitAnswer(question_id, answerIndex) {
    const res = await fetch("/wp-content/themes/halimmovies-child/hh3d-ajax.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        action: "save_quiz_result",
        question_id,
        answer: answerIndex,
      }),
    });
    return res.json();
  }

  const res = await fetchQuizData();
  if (!res.success || !res.data?.questions) {
    console.warn("❌ Không thể lấy câu hỏi quiz.");
    return;
  }

  if (res.data.completed) {
    console.log("✅ Quiz đã hoàn thành hôm nay.");
    return;
  }

  let questions = res.data.questions.filter((q) => q.is_correct === "0");
  let total = 0;
  const skipped = [];

  while (questions.length > 0) {
    const q = questions[0];
    const normalized = normalize(q.question);
    const correct = normalizedAnswerBank[normalized];

    if (!correct) {
      console.warn("⚠️ Không tìm thấy đáp án cho:", q.question);
      skipped.push(q.question);
      questions.shift();
      continue;
    }

    const idx = q.options.findIndex((opt) => normalize(opt) === normalize(correct));
    if (idx === -1) {
      console.warn("❗ Không khớp đáp án với options:", q.options);
      skipped.push(q.question);
      questions.shift();
      continue;
    }

    let success = false;
    for (let retry = 0; retry < 3 && !success; retry++) {
      try {
        const result = await submitAnswer(q.id, idx);
        if (result && result.success) {
          console.log(`✅ Câu ${++total}: ${q.question}\n➡️ Đáp án: ${correct}`);
          success = true;
          questions.shift();
        } else {
          console.warn("❌ BE không phản hồi thành công. Thử lại...");
          await new Promise(r => setTimeout(r, 500));
        }
      } catch (err) {
        console.error("🚨 Lỗi submit:", err);
        await new Promise(r => setTimeout(r, 1000));
      }
    }
    if (!success) {
      skipped.push(q.question);
      questions.shift();
    }
  }

  if (skipped.length > 0) {
    console.warn(`⚠️ Có ${skipped.length} câu bị bỏ qua:`);
    skipped.forEach((q, i) => console.warn(`${i + 1}. ${q}`));
    console.log(`📌 Đã trả lời đúng ${total} / ${total + skipped.length} câu.`);
  } else {
    console.log(`🎉 Hoàn tất Quiz. Đã trả lời đúng toàn bộ ${total} câu.`);
  }
})();

  (async () => {
    await autoAnswerQuiz ();
    await runDiemDanh ();
    await runTele ();
})();
})();
