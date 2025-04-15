(async () => {
// Phúc Lợi
(async function runPhucLoi() {
  const ACTIVITY_NAME = "🎁 Hoạt động: Phúc Lợi";
  const PL_URL = 'https://hoathinh3d.team/phuc-loi-duong';
  const API_URL = 'https://hoathinh3d.team/wp-content/themes/halimmovies-child/hh3d-ajax.php';
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

  function showNotification(type, title, message) {
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

    wrapper.innerHTML = `
      <strong style="display:block;margin-bottom:5px;">${icon} ${title}</strong>
      <div style="margin-bottom:10px;">${message}</div>
    `;

    document.body.appendChild(wrapper);
    requestAnimationFrame(() => (wrapper.style.opacity = 1));
    setTimeout(() => {
      wrapper.style.opacity = 0;
      setTimeout(() => wrapper.remove(), 600);
    }, 8000);
  }

  async function fetchHTML(url) {
    const res = await fetch(url);
    return await res.text();
  }

  function parseSecurity(html, type) {
    const scripts = Array.from(html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi));
    for (const [, content] of scripts) {
      if (content.includes(type)) {
        const match = content.match(/security\s*:\s*['"]([a-f0-9]{10,})['"]/i);
        if (match) return match[1];
      }
    }
    return null;
  }

  async function getNextChestPL(security) {
    const formData = new FormData();
    formData.append('action', 'get_next_time_pl');
    formData.append('security', security);
    const res = await fetch(API_URL, { method: 'POST', body: formData });
    const json = await res.json();
    return json?.data || null;
  }

  async function openChestPL(security, chest_id) {
    const formData = new FormData();
    formData.append('action', 'open_chest_pl');
    formData.append('security', security);
    formData.append('chest_id', chest_id);

    const res = await fetch(API_URL, { method: 'POST', body: formData });
    const json = await res.json();

    if (json.success) {
      showNotification('success', `Rương ${chest_id}`, json.data.message);
      console.log(`[PhucLoi] ✅ Mở rương ${chest_id}: ${json.data.message}`);
      return json.data?.next_chest || null;
    } else {
      showNotification('error', `Lỗi mở rương ${chest_id}`, json.data?.message || 'Không rõ lỗi');
      return null;
    }
  }

  async function claimMilestonesPL(security) {
    const activeGifts = document.querySelectorAll('.gift-box.active');
    for (const box of activeGifts) {
      const chestId = box.getAttribute('data-id') || '1';

      const formData = new FormData();
      formData.append('action', 'claim_bonus_reward');
      formData.append('security', security);
      formData.append('chest_id', chestId);

      const res = await fetch(API_URL, { method: 'POST', body: formData });
      const json = await res.json();

      if (json.success) {
        showNotification('success', '🎁 Mốc thưởng', `Đã nhận mốc rương ${chestId}`);
      } else {
        showNotification('error', 'Lỗi nhận mốc', json?.data?.message || 'Không rõ lỗi');
      }
    }
  }

  const html = await fetchHTML(PL_URL);
  const security = parseSecurity(html, 'get_next_time_pl');
  if (!security) return showNotification('error', 'Không tìm thấy token', 'Security token không có');

  const status = await getNextChestPL(security);
  if (!status || (status.reset_rewards === null && status.chest_level === "4")) {
    return showNotification('success', 'Hoàn thành', 'Đã mở đủ 4 rương hôm nay!');
  }

  let currentChest = parseInt(status.chest_level || '0') + 1;

  while (currentChest <= 4) {
    await openChestPL(security, currentChest);
    currentChest++;
    if (currentChest <= 4) {
      await delay(60 * 60 * 1000); // Đợi 60 phút
    }
  }

  await claimMilestonesPL(security);
  showNotification('success', '🎉 Hoàn tất Phúc Lợi', 'Đã mở hết rương và nhận mốc!');
})();


// Thí Luyện Tông Môn
(async function runTLTM() {
  const ACTIVITY_NAME = "🧪 Hoạt động: Thí Luyện Tông Môn";
  const TLTM_URL = 'https://hoathinh3d.team/thi-luyen-tong-mon-hh3d';
  const API_URL = 'https://hoathinh3d.team/wp-content/themes/halimmovies-child/hh3d-ajax.php';

  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

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

    const icon = type === "success" ? "✅" : "❌";
    wrapper.innerHTML = `
      <strong style="display:block;margin-bottom:5px;">
        ${icon} ${title}
      </strong>
      <div style="margin-bottom:10px;">${message}</div>
    `;

    document.body.appendChild(wrapper);
    requestAnimationFrame(() => wrapper.style.opacity = 1);
    setTimeout(() => {
      wrapper.style.opacity = 0;
      setTimeout(() => wrapper.remove(), 600);
    }, 8000);
  }

  async function fetchHTML(url) {
    const res = await fetch(url);
    return await res.text();
  }

  function parseSecurity(html) {
    const scripts = Array.from(html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi));
    for (const [, content] of scripts) {
      if (content.includes('get_remaining_time_tltm')) {
        const match = content.match(/security\s*:\s*['"]([a-f0-9]{10,})['"]/i);
        if (match) return match[1];
      }
    }
    return null;
  }

  function parseCustomRestNonce(html) {
    const match = html.match(/var\s+customRestNonce\s*=\s*['"]([a-f0-9]{10,})['"]/i);
    return match ? match[1] : null;
  }

  async function getRemainingTime(security) {
    const formData = new FormData();
    formData.append('action', 'get_remaining_time_tltm');
    formData.append('security', security);

    const res = await fetch(API_URL, { method: 'POST', body: formData });
    const json = await res.json();
    return json?.data?.time_remaining || null;
  }

  async function openChestTLTM(security) {
    const formData = new FormData();
    formData.append('action', 'open_chest_tltm');
    formData.append('security', security);

    const res = await fetch(API_URL, { method: 'POST', body: formData });
    const json = await res.json();

    if (json.success) {
      showNotification('success', '🎉 Thí Luyện Thành Công', json.data?.message || 'Đã mở rương!');
      if (window.confetti) confetti({ particleCount: 120, spread: 60, origin: { y: 0.6 } });
      console.log('[TLTM] ✅', json);
    } else {
      showNotification('error', 'Lỗi mở rương', json.data?.message || 'Không rõ lỗi');
      console.error('[TLTM] ❌', json);
    }
    return json;
  }

  // --- THỰC THI ---
  const html = await fetchHTML(TLTM_URL);
  const security = parseSecurity(html);
  const nonce = parseCustomRestNonce(html);

  if (!security || !nonce) {
    showNotification('error', 'Thiếu token', 'Không tìm thấy mã bảo mật.');
    return;
  }

  const remaining = await getRemainingTime(security);
  if (remaining === '00:00') {
    const result = await openChestTLTM(security);
    if (
      result &&
      result.data &&
      result.data.message === "Đã hoàn thành Thí Luyện Tông Môn hôm nay, quay lại vào ngày kế tiếp."
    ) {
      console.log("✅ Đã hoàn thành Thí Luyện Tông Môn hôm nay.");
      return;
    }
  } else {
    showNotification('error', '⏳ Chưa tới giờ', `Thời gian còn lại: ${remaining}`);
    console.log(`[TLTM] Chưa tới giờ mở rương: ${remaining}`);
  }

  // Lặp lại sau 60 phút
  setTimeout(() => {
    console.log("Lặp lại sau 60 phút.");
    runTLTM();
  }, 60 * 60 * 1000);
})();

// Hoang Vực
(async function attackBoss() {
  const ACTIVITY_NAME = "⚔️ Hoạt động: Hoang Vực";
  const HOANG_VUC_URL = 'https://hoathinh3d.team/hoang-vuc';
  const AJAX_ATTACK_URL = 'https://hoathinh3d.team/wp-content/themes/halimmovies-child/hh3d-ajax.php';
  const AJAX_REWARD_URL = 'https://hoathinh3d.team/wp-admin/admin-ajax.php';

  // Inject confetti nếu chưa có
  if (!window.confetti) {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js";
    document.head.appendChild(script);
  }

  // Giao diện thông báo
  function notifyUI(type, title, message) {
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
      <div style="margin-bottom:10px;">${message}</div>
    `;

    document.body.appendChild(wrapper);
    requestAnimationFrame(() => (wrapper.style.opacity = 1));
    setTimeout(() => {
      wrapper.style.opacity = 0;
      setTimeout(() => wrapper.remove(), 600);
    }, 8000);
  }

  // Fetch dữ liệu ban đầu
  const html = await fetch(HOANG_VUC_URL).then(res => res.text()).catch(() => null);
  const nonce = html?.match(/var\s+ajax_boss_nonce\s*=\s*'([^']+)'/)?.[1];
  const bossId = html?.match(/boss_id\s*==\s*"(\d+)"/)?.[1];

  if (!nonce || !bossId) {
    console.error('❌ Không thể lấy được nonce hoặc bossId!');
    notifyUI('error', ACTIVITY_NAME, 'Không tìm thấy nonce hoặc bossId.');
    return;
  }

  // Nhận thưởng khi hết lượt
  function claimReward() {
    $.post(AJAX_REWARD_URL, { action: 'claim_chest', nonce }, function (res) {
      if (res.error) {
        notifyUI('error', 'Nhận thưởng thất bại', res.error);
      } else {
        let rewards = [];
        if (res.total_rewards?.tu_vi) rewards.push(`🌀 Tu Vi: ${res.total_rewards.tu_vi}`);
        if (res.total_rewards?.tinh_thach) rewards.push(`💎 Tinh Thạch: ${res.total_rewards.tinh_thach}`);
        if (res.total_rewards?.tinh_huyet) rewards.push(`🩸 Tinh Huyết: ${res.total_rewards.tinh_huyet}`);
        notifyUI('success', '🎁 Nhận thưởng thành công', rewards.join(', ') || 'Đã nhận thưởng!');
        if (window.confetti) confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
      }
    }, 'json').fail(() =>
      notifyUI('error', 'Lỗi kết nối', 'Không thể kết nối để nhận thưởng.')
    );
  }

  // Tấn công Boss
  function doAttack() {
    const requestId = `req_${Math.random().toString(36).slice(2)}_${Date.now()}`;
    console.log(`[⚔️] Đang tấn công Boss (${new Date().toLocaleTimeString()})`);

    $.post(AJAX_ATTACK_URL, {
      action: 'attack_boss',
      boss_id: bossId,
      nonce: nonce,
      request_id: requestId
    }, function (res) {
      if (!res.success) {
        if (res.data?.error?.toLowerCase().includes('đã hết lượt')) {
          notifyUI('error', '🛑 Dừng tấn công', 'Đã hết lượt tấn công Boss.');
          clearInterval(autoAttackInterval);
          claimReward();
        } else {
          notifyUI('error', '❌ Lỗi tấn công', JSON.stringify(res));
        }
      } else {
        notifyUI('success', '✅ Tấn công thành công', res.data?.message || 'Đòn đánh đã được ghi nhận.');
        if (window.confetti) confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
      }
    }, 'json').fail(() =>
      notifyUI('error', '❌ Lỗi kết nối', 'Không thể gửi yêu cầu tấn công.')
    );
  }

  // Tấn công lần đầu và lặp lại sau mỗi 30 phút
  doAttack();
  const autoAttackInterval = setInterval(doAttack, 30 * 60 * 1000);
})();

  
(async () => {
  await runPhucLoi ();
  await runTLTM ();
  await attackBoss();
  })();
})();
