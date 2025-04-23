(async function autoBlessing() {
  const ACTION_URL = 'https://hoathinh3d.cam/wp-json/hh3d/v1/action';
  const DOMAIN = 'https://hoathinh3d.cam';

  const blessingMessages = [
    "🌸 Duyên khởi từ tâm, đạo hợp bởi ý! Chúc hai vị đạo hữu đồng hành bất diệt!",
    "🌿 Tình thâm như suối nguồn, đạo bền như núi đá! Chúc phúc Song Tu viên mãn!",
    "🌟 Mong hai đạo hữu tay nắm tay vượt qua vạn kiếp, đồng hành muôn kiếp!",
    "🔥 Tình như lửa đỏ, đạo như trăng rằm. Nguyện Song Tu kết thành Thiên Đạo!",
    "🌈 Chúc hai vị luôn hòa hợp, tỏa sáng như vầng dương giữa trời cao!"
  ];

  // Gọi API lấy danh sách phòng cưới
  const weddingRes = await fetch(ACTION_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-WP-Nonce': window?.Better_Messages?.nonce || ''
    },
    body: JSON.stringify({ action: 'show_all_wedding' })
  });

  const weddingData = await weddingRes.json();
  const rooms = weddingData?.data || [];

  const unblessedRooms = rooms.filter(r => !r.has_blessed);

  if (!unblessedRooms.length) {
    console.log("✅ Tất cả các phòng đã chúc phúc hôm nay.");
    return;
  }

  for (const room of unblessedRooms) {
    const roomId = room.wedding_room_id;
    console.log(`💠 Đang xử lý phòng ${roomId}...`);

    // Lấy nonce từ trang phòng
    const pageRes = await fetch(`${DOMAIN}/phong-cuoi?id=${roomId}`);
    const pageHtml = await pageRes.text();
    const nonceMatch = pageHtml.match(/const\s+rest_nonce\s*=\s*['"]([^'"]+)['"]/);
    const nonce = nonceMatch?.[1];

    if (!nonce) {
      console.warn(`❌ Không tìm thấy nonce cho phòng ${roomId}`);
      continue;
    }

    const blessing = blessingMessages[Math.floor(Math.random() * blessingMessages.length)];

    const blessRes = await fetch(ACTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': nonce
      },
      body: JSON.stringify({
        action: 'hh3d_add_blessing',
        wedding_room_id: roomId,
        message: blessing
      })
    });

    const blessData = await blessRes.json();

    if (blessData.success) {
      console.log(`🎉 Phòng ${roomId}: Chúc phúc thành công → "${blessing}"`);
    } else {
      console.warn(`⚠️ Phòng ${roomId}: ${blessData.message || 'Lỗi không rõ'}`);
    }

    // Delay nhẹ tránh spam
    await new Promise(r => setTimeout(r, 1000));
  }
})();
