(async function runQuiz () {
  const DOMAIN          = 'https://hoathinh3d.cam';
  const HH3D_AJAX_URL   = DOMAIN + '/wp-content/themes/halimmovies-child/hh3d-ajax.php';
  const todayStr        = new Date().toISOString().slice(0, 10);


  async function postRequest (url, bodyObj = {}) {
    try {
      const res = await fetch(url, {
        method : 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body   : new URLSearchParams(bodyObj)
      });
      return await res.json();
    } catch (err) {
      console.error('[Quiz] POST error →', err);
      return { success: false, error: err };
    }
  }

  function showNotificationUI (msg, type = 'success') {
    let wrap = document.querySelector('.quiz-notification-container');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.className = 'quiz-notification-container';
      Object.assign(wrap.style, {
        position: 'fixed', top: '20px', right: '20px', zIndex: 99999,
        display : 'flex', flexDirection: 'column', gap: '10px'
      });
      document.body.appendChild(wrap);
    }
    const box = document.createElement('div');
    Object.assign(box.style, {
      padding: '12px 16px', borderRadius: '8px',
      color: '#fff', fontSize: '14px', fontFamily: 'Arial, sans-serif',
      boxShadow: '0 4px 12px rgba(0,0,0,.3)',
      backgroundColor: type === 'success' ? '#28a745' : '#dc3545',
      opacity: 0, transform: 'translateX(30px)',
      transition: 'all .4s'
    });
    box.innerHTML = msg;
    wrap.appendChild(box);
    requestAnimationFrame(() => { box.style.opacity = '1'; box.style.transform = 'translateX(0)'; });
    setTimeout(() => {
      box.style.opacity = '0';
      box.style.transform = 'translateX(30px)';
      setTimeout(() => box.remove(), 400);
    }, 1000);
  }
  
    const latinMap = {
    // Cyrillic lowercase
    'а': 'a', 'с': 'c', 'е': 'e', 'о': 'o', 'р': 'p', 'х': 'x', 'у': 'y', 'т': 't',
    'в': 'b', 'н': 'h', 'к': 'k', 'м': 'm', 'л': 'n', 'ѕ': 's', 'ј': 'j', 'і': 'i',
    'ѵ': 'v', 'ӏ': 'l', 'д': 'd', 'ё': 'e', 'г': 'g', 'һ': 'h', 'қ': 'k', 'з': 'z',

    // Cyrillic uppercase
    'А': 'A', 'С': 'C', 'Е': 'E', 'О': 'O', 'Р': 'P', 'Х': 'X', 'У': 'Y', 'Т': 'T',
    'В': 'B', 'Н': 'H', 'К': 'K', 'М': 'M', 'Л': 'N', 'Ѕ': 'S', 'Ј': 'J', 'І': 'I',
    'Ѵ': 'V', 'Ӏ': 'L', 'Д': 'D', 'Ё': 'E', 'Г': 'G', 'Һ': 'H', 'Қ': 'K', 'З': 'Z',

    // Greek lowercase
    'α': 'a', 'β': 'b', 'γ': 'g', 'δ': 'd', 'ε': 'e', 'ζ': 'z', 'η': 'h', 'θ': 'th',
    'ι': 'i', 'κ': 'k', 'λ': 'l', 'μ': 'm', 'ν': 'n', 'ξ': 'ks', 'ο': 'o', 'π': 'p',
    'ρ': 'r', 'σ': 's', 'τ': 't', 'υ': 'u', 'φ': 'ph', 'χ': 'x', 'ψ': 'ps', 'ω': 'w',

    // Greek uppercase
    'Α': 'A', 'Β': 'B', 'Γ': 'G', 'Δ': 'D', 'Ε': 'E', 'Ζ': 'Z', 'Η': 'H', 'Θ': 'TH',
    'Ι': 'I', 'Κ': 'K', 'Λ': 'L', 'Μ': 'M', 'Ν': 'N', 'Ξ': 'KS', 'Ο': 'O', 'Π': 'P',
    'Ρ': 'R', 'Σ': 'S', 'Τ': 'T', 'Υ': 'U', 'Φ': 'PH', 'Χ': 'X', 'Ψ': 'PS', 'Ω': 'W',

    // Armenian lowercase
    'ɑ': 'a', 'օ': 'o', 'ս': 's', 'ե': 'e', 'զ': 'z', 'կ': 'k', 'ո': 'n', 'ռ': 'r',
    'հ': 'h', 'լ': 'l', 'մ': 'm', 'ն': 'n', 'վ': 'v', 'տ': 't', 'բ': 'b', 'դ': 'd',
    'ճ': 'c', 'ջ': 'j', 'յ': 'y', 'ք': 'k', 'է': 'e',

    // Armenian uppercase
    'Ա': 'A', 'Օ': 'O', 'Ս': 'S', 'Ե': 'E', 'Զ': 'Z', 'Կ': 'K', 'Ո': 'N', 'Ր': 'R',
    'Հ': 'H', 'Լ': 'L', 'Մ': 'M', 'Ն': 'N', 'Վ': 'V', 'Տ': 'T', 'Բ': 'B', 'Դ': 'D',
    'Ճ': 'C', 'Ջ': 'J', 'Յ': 'Y', 'Ք': 'K',

    // Vietnamese lowercase
    'à': 'a', 'á': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a', 'ă': 'a', 'ằ': 'a', 'ắ': 'a',
    'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a', 'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ẩ': 'a', 'ẫ': 'a',
    'ậ': 'a', 'è': 'e', 'é': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e', 'ê': 'e', 'ề': 'e',
    'ế': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e', 'ì': 'i', 'í': 'i', 'ỉ': 'i', 'ĩ': 'i',
    'ị': 'i', 'ò': 'o', 'ó': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o', 'ô': 'o', 'ồ': 'o',
    'ố': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o', 'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ở': 'o',
    'ỡ': 'o', 'ợ': 'o', 'ù': 'u', 'ú': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u', 'ư': 'u',
    'ừ': 'u', 'ứ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u', 'ỳ': 'y', 'ý': 'y', 'ỷ': 'y',
    'ỹ': 'y', 'ỵ': 'y', 'đ': 'd',

    // Vietnamese uppercase
    'À': 'A', 'Á': 'A', 'Ả': 'A', 'Ã': 'A', 'Ạ': 'A', 'Ă': 'A', 'Ằ': 'A', 'Ắ': 'A',
    'Ẳ': 'A', 'Ẵ': 'A', 'Ặ': 'A', 'Â': 'A', 'Ầ': 'A', 'Ấ': 'A', 'Ẩ': 'A', 'Ẫ': 'A',
    'Ậ': 'A', 'È': 'E', 'É': 'E', 'Ẻ': 'E', 'Ẽ': 'E', 'Ẹ': 'E', 'Ê': 'E', 'Ề': 'E',
    'É': 'E', 'Ể': 'E', 'Ễ': 'E', 'Ệ': 'E', 'Ì': 'I', 'Í': 'I', 'Ỉ': 'I', 'Ĩ': 'I',
    'Ị': 'I', 'Ò': 'O', 'Ó': 'O', 'Ỏ': 'O', 'Õ': 'O', 'Ọ': 'O', 'Ô': 'O', 'Ồ': 'O',
    'Ố': 'O', 'Ổ': 'O', 'Ỗ': 'O', 'Ộ': 'O', 'Ơ': 'O', 'Ờ': 'O', 'Ớ': 'O', 'Ở': 'O',
    'Ỡ': 'O', 'Ợ': 'O', 'Ù': 'U', 'Ú': 'U', 'Ủ': 'U', 'Ũ': 'U', 'Ụ': 'U', 'Ư': 'U',
    'Ừ': 'U', 'Ứ': 'U', 'Ử': 'U', 'Ữ': 'U', 'Ự': 'U', 'Ỳ': 'Y', 'Ý': 'Y', 'Ỷ': 'Y',
    'Ỹ': 'Y', 'Ỵ': 'Y', 'Đ': 'D',

    // Fullwidth Latin lowercase
    'ａ': 'a', 'ｂ': 'b', 'ｃ': 'c', 'ｄ': 'd', 'ｅ': 'e', 'ｆ': 'f', 'ｇ': 'g', 'ｈ': 'h',
    'ｉ': 'i', 'ｊ': 'j', 'ｋ': 'k', 'ｌ': 'l', 'ｍ': 'm', 'ｎ': 'n', 'ｏ': 'o', 'ｐ': 'p',
    'ｑ': 'q', 'ｒ': 'r', 'ｓ': 's', 'ｔ': 't', 'ｕ': 'u', 'ｖ': 'v', 'ｗ': 'w', 'ｘ': 'x',
    'ｙ': 'y', 'ｚ': 'z',

    // Fullwidth Latin uppercase
    'Ａ': 'A', 'Ｂ': 'B', 'Ｃ': 'C', 'Ｄ': 'D', 'Ｅ': 'E', 'Ｆ': 'F', 'Ｇ': 'G', 'Ｈ': 'H',
    'Ｉ': 'I', 'Ｊ': 'J', 'Ｋ': 'K', 'Ｌ': 'L', 'Ｍ': 'M', 'Ｎ': 'N', 'Ｏ': 'O', 'Ｐ': 'P',
    'Ｑ': 'Q', 'Ｒ': 'R', 'Ｓ': 'S', 'Ｔ': 'T', 'Ｕ': 'U', 'Ｖ': 'V', 'Ｗ': 'W', 'Ｘ': 'X',
    'Ｙ': 'Y', 'Ｚ': 'Z',

    // Fullwidth digits
    '０': '0', '１': '1', '２': '2', '３': '3', '４': '4', '５': '5', '６': '6', '７': '7',
    '８': '8', '９': '9',

    // Latin extended
    'ⱥ': 'a', 'ⱦ': 't', 'Ɐ': 'A', 'Ɽ': 'R', 'ƀ': 'b', 'ƃ': 'b', 'ƈ': 'c', 'ɗ': 'd',
    'ƒ': 'f', 'ɠ': 'g', 'ɦ': 'h', 'ɨ': 'i', 'ƙ': 'k', 'ɱ': 'm', 'ɲ': 'n', 'ɵ': 'o',
    'ʠ': 'q', 'ʂ': 's', 'ʈ': 't', 'ⱳ': 'w', 'ⱹ': 'r', 'ʋ': 'v', 'ⱺ': 'o', 'ƴ': 'y',
    'ƶ': 'z', 'Ɓ': 'B', 'Ƈ': 'C', 'Ɗ': 'D', 'Ƒ': 'F', 'Ɠ': 'G', 'Ƙ': 'K', 'Ɲ': 'N',
    'Ɵ': 'O', 'Ƣ': 'OI', 'Ƭ': 'T', 'Ʋ': 'V', 'Ƴ': 'Y', 'Ƶ': 'Z',

    // Cherokee letters
    'Ꭺ': 'go', 'Ꭻ': 'gu', 'Ꭼ': 'gv', 'Ꮜ': 'sa', 'Ꮝ': 's', 'Ꮞ': 'se',
    'Ꮟ': 'si', 'Ꮠ': 'so', 'Ꮡ': 'su', 'Ꮢ': 'sv',

    // IPA letters
    'ɡ': 'g', 'ɢ': 'G', 'ɴ': 'N', 'ʀ': 'R', 'ʟ': 'L', 'ʏ': 'Y', 'ʃ': 's',
    'ʒ': 'z', 'ɾ': 'r', 'ʰ': 'h',

    // Superscript letters and modifier letters
    'ᵃ': 'a', 'ᵇ': 'b', 'ᶜ': 'c', 'ᵈ': 'd', 'ᵉ': 'e', 'ᶠ': 'f', 'ᵍ': 'g',
    'ʰ': 'h', 'ⁱ': 'i', 'ʲ': 'j', 'ᵏ': 'k', 'ˡ': 'l', 'ᵐ': 'm', 'ⁿ': 'n',
    'ᵒ': 'o', 'ᵖ': 'p', 'ʳ': 'r', 'ˢ': 's', 'ᵗ': 't', 'ᵘ': 'u', 'ᵛ': 'v',
    'ʷ': 'w', 'ˣ': 'x', 'ʸ': 'y', 'ᶻ': 'z',

    // Special Unicode letterlike symbols
    'ℓ': 'l', '℮': 'e', 'ℊ': 'g', 'ℍ': 'H', 'ℕ': 'N', 'ℙ': 'P',
    'ℚ': 'Q', 'ℝ': 'R', 'ℤ': 'Z', 'ℂ': 'C', 'ℬ': 'B', 'ℰ': 'E',
    'ℱ': 'F', 'ℳ': 'M',
}
    

  function normalize(str) {
    return str.toLowerCase()
      .split('').map(ch => latinMap[ch] || ch).join('')
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9 ]+/g, '').replace(/\s+/g, ' ').trim();
  }
  function levenshtein(a, b) {
    const m = Array.from({ length: a.length + 1 }, (_, i) =>
      Array.from({ length: b.length + 1 }, (_, j) => (i ? (j ? 0 : i) : j)));
    for (let i = 1; i <= a.length; i++)
      for (let j = 1; j <= b.length; j++)
        m[i][j] = Math.min(
          m[i - 1][j] + 1,
          m[i][j - 1] + 1,
          m[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
        );
    return m[a.length][b.length];
  }
  function similarity(a, b) {
    const A = normalize(a), B = normalize(b);
    return 100 - (levenshtein(A, B) / Math.max(A.length, B.length)) * 100;
  }
  function bestMatch(opts, answer) {
    let best = 0, score = -1;
    opts.forEach((o, i) => {
      const s = similarity(o, answer);
      if (s > score) { score = s; best = i; }
    });
    return best;
  }

  const quizBank = {
      "Ai là huynh đệ và cũng là người thầy mà Vương Lâm trong Tiên Nghịch kính trọng nhất ?": "Tư Đồ Nam",
      "Ai là mẹ của Đường Tam?": "A Ngân",
      "Ai là người đứng đầu Vũ Hồn Điện?": "Bỉ Bỉ Đông",
      "Ai là người thầy của Đường Tam?": "Đại Sư",
      "Ai là nhân vật chính trong bộ phim hoạt hình trung quốc Thần Mộ ?": "Thần Nam",
      "Ám tinh giới được xuất hiện trong bộ phim hoạt hình nào dưới đây ?": "Tinh Thần Biến",
      "Bách Lý Đông Quân là nhân vật trong bộ hoạt hình trung quốc nào sau đây ?": "Thiếu Niên Bạch Mã Tuý Xuân Phong",
      "Bạch Nguyệt Khôi là tên nhân vật chính trong bộ phim hoạt hình trung quốc nào sau đây ?": "Linh Lung",
      "Bạch Tiểu Thuần là nhân vật chính trong bộ hoạt hình trung quốc nào ?": "Nhất Niệm Vĩnh Hằng",
      "Bạch Tiểu Thuần trong Nhất Niệm Vĩnh Hằng luôn được ai âm thầm giúp đỡ ?": "Đỗ Lăng Phỉ",
      "Bộ phim nào sau đây thuộc tiểu thuyết của tác giả Thiên Tằm Thổ Đậu": "Tất cả đáp án",
      "Các cấp bậc nào sau đây thuộc phim Đấu Phá Thương Khung ?": "Đấu Tông",
      "Cháu dượng của Bạch Tiểu Thuần trong Nhất Niệm Vĩnh Hằng là ai ?": "Tống Khuyết",
      "Chủ nhân đời trước của Vẫn Lạc Tâm Viêm trong Đấu Phá Thương Khung là ai ?": "Diệu Thiên Hoả",
      "Công pháp gì giúp Tiêu Viêm trong Đấu Phá Thương Khung hấp thụ nhiều loại dị hỏa ?": "Phần Quyết",
      "Công pháp nào sau đây là của Hàn Lập trong Phàm Nhân Tu Tiên ?": "Tất cả đáp án",
      "Cơ Tử Nguyệt là nhân vật trong các bộ hoạt hình trung quốc nào sau đây ?": "Già Thiên",
      "Dạ Táng còn là biệt danh của ai trong Nhất Niệm Vĩnh Hằng ?": "Bạch Tiểu Thuần",
      "Danh xưng Tàn Thi Bại Thuế là của nhân vật nào trong Hoạ Giang Hồ Chi Bất Lương Nhân ?": "Hàng Thần",
      "Diễm Linh Cơ là nhân vật trong phim hoạt hình trung quốc nào ?": "Thiên Hành Cửu Ca",
      "Diệp Phàm là nhân vật chính trong bộ hoạt hình trung quốc nào ?": "Già Thiên",
      "Diệp Thần trong Tiên Võ Đế Tôn gia nhập Tông Môn nào đầu tiên ?": "Chính Dương Tông",
      "Dược Trần trong Đấu Phá Thương Khung đã từng bị đồ đệ nào phản bội ?": "Hàn Phong",
      "Đại ca của Tiêu Viêm trong Đấu Phá Thương Khung tên gì ?": "Tiêu Đỉnh",
      "Đàm Vân là nhân vật chính trong bộ phim hoạt hình trung quốc nào sau đây ?": "Nghịch Thiên Chí Tôn",
      "Đạo lữ của Hàn Lập là ai ?": "Nam Cung Uyển",
      "Đâu là nhân vật chính trong phim Bách Luyện Thành Thần ?": "La Chinh",
      "Đâu là Thái Cổ Thập Hung trong phim Thế Giới Hoàn Mỹ ?": "Tất cả đáp án",
      "Đâu là tuyệt kỹ số 1 Hạo Thiên Tông mà Đường Hạo dạy cho con trai trong Đấu La Đại Lục ?": "Đại Tu Di Chùy",
      "Đấu Sát Toàn Viên Kiếm là một kỹ năng trong bộ phim hoạt hình trung quốc nào ?": "Thần Ấn Vương Tọa",
      "Độc Cô Bác trong Đấu La Đại Lục có vũ hồn gì ?": "Bích Lân Xà",
      "Em trai ruột của Thạch Hạo trong Thế Giới Hoàn Mỹ là ai ?": "Tần Hạo",
      "Hàn lập sở hữu những vật phẩm nào dưới đây ?": "Thanh Trúc Phong Vân Kiếm",
      "Hàn Lập trong Phàm Nhân Tu Tiên đến Thất Huyền Môn bái ai làm thầy ?": "Mặc Đại Phu",
      "Hàn Lập trong Phàm Nhân Tu Tiên gia nhập môn phái nào đầu tiên ?": "Thất Huyền Môn",
      "Hàn Lập trong Phàm Nhân Tu Tiên từng cứu ai mà bị hấp thụ tu vi giảm xuống Luyện Khí Kỳ ?": "Nam Cung Uyển",
      "Hoang Thiên Đế là nhân vật chính trong bộ phim hoạt hình trung quốc nổi tiếng nào ?": "Thế Giới Hoàn Mỹ",
      "Hoắc Vũ Hạo là hậu nhân của ai trong Sử Lai Khắc ?": "Đái Mộc Bạch",
      "Hồn hoàn màu nào mạnh nhất?": "Đỏ",
      "Huân Nhi là công chúa của bộ tộc nào?": "Cổ tộc",
      "Khô Lâu Đà Chủ xuất hiện trong bộ phim hoạt hình nào dưới đây ?": "Võ Thần Chúa Tể",
      "Khi ở Già Nam Học Viện, Tiêu Viêm thu phục được loại dị hỏa nào ?": "Vẫn Lạc Tâm Viêm",
      "Kính Huyền trong Quyến Tư Lượng là hậu duệ của tộc nào ?": "Thần Tộc",
      "Lạc Ly trong Đại Chúa Tể là nhân vật trong Tộc nào ?": "Lạc Thần Tộc",
      "Lâm Động trong Vũ Động Càn Khôn học được Linh Võ Học nào khi vào bia cổ Đại Hoang ?": "Đại Hoang Tù Thiên Chỉ",
      "Lâm Động trong Vũ Động Càn Khôn luyện hóa Tổ Phù nào đầu tiên ?": "Thôn Phệ Tổ Phù",
      "Lâm Động trong Vũ Động Càn Khôn sử dụng vũ khí loại nào sau đây ?": "Thương",
      "Lâm Phong là nhân vật trong bộ hoạt hình trung quốc nào sau đây ?": "Vạn Giới Độc Tôn",
      "Lâm Thất Dạ là nhân vật trong bộ hoạt hình trung quốc nào sau đây ?": "Trảm Thần",
      "Lâm Thất Dạ trong Trảm Thần sở hữu sức mạnh của vị thần nào ?": "Thiên Sứ",
      "Long Tuyền Kiếm xuất hiện trong bộ phim hoạt hình nào dưới đây ?": "Họa Giang Hồ Chi Bất Lương Nhân",
      "Lục Tuyết Kỳ trong Tru Tiên thuộc Phong nào trong Thanh Vân Môn?": "Tiểu Trúc Phong",
      "Lý Tinh Vân trong Họa Giang Hồ Chi Bất Lương Nhân sử dụng vũ khí nào sau đây ?": "Long Tuyền Kiếm",
      "Lý Tinh Vân là một nhân vật trong bộ phim hoạt hình trung quốc nào sau đây ?": "Họa Giang Hồ Chi Bất Lương Nhân",
      "Lý Trường Thọ trong Sư Huynh A Sư Huynh xuyên không về Hồng Hoang bái sư ở đâu ?": "Độ Tiên Môn",
      "Man Hồ Tử trong phim \"Phàm Nhân Tu Tiên\" tu luyện công pháp nào?": "Thác Thiên Ma Công",
      "Mẫu thân của La Phong trong Thôn Phệ Tinh Không tên là gì ?": "Cung Tâm Lan",
      "Mẹ của Mạnh Xuyên trong Thương Nguyên Đồ tên là gì ?": "Bạch Niệm Vân",
      "Mẹ của Tần Trần là ai ?": "Tần Nguyệt Trì",
      "Mẹ của Thạch Hạo trong Thế Giới Hoàn Mỹ tên là gì": "Tần Di Ninh",
      "Mối tình đầu của Diệp Thần trong Tiên Võ Đế Tôn là ai ?": "Cơ Ngưng Sương",
      "Mục đích tu luyện của Vương Lâm trong Tiên Nghịch theo diễn biến phim hiện tại là gì ?": "Báo Thù",
      "Mục Trần trong Đại Chúa Tể liên kết Huyết Mạch với ?": "Cửu U Tước",
      "Mục Vân là nhân vật trong bộ hoạt hình trung quốc nào sau đây ?": "Vô Thượng Thần Đế",
      "Nam chính trong bộ hoạt hình trung quốc Ám Hà Truyện là ai ?": "Tô Mộ Vũ",
      "Nam chính trong bộ Quyến Tư Lượng là ai ?": "Kính Huyền",
      "Nghịch Hà Tông là Tông Môn trong bộ hoạt hình trung quốc nào sau đây ?": "Nhất Niệm Vĩnh Hằng",
      "Nghịch Thiên Nhi Hành là một nhân vật trong bộ phim hh3d nào sau đây ?": "Vũ Canh Kỷ",
      "Ngụy Anh (Ngụy Vô Tiện) là nhân vật trong bộ hhtq nào sau đây ?": "Ma Đạo Tổ Sư",
      "Người bạn thuở nhỏ của Trương Tiểu Phàm trong Tru Tiên là ai ?": "Lâm Kinh Vũ",
      "Nhân vật Bách Lý Đồ Minh xuất hiện trong phim hoạt hình nào dưới đây ?": "Trảm Thần Chi Phàm Trần Thần Vực",
      "Nhân vật chính của \"Thần Ấn Vương Tọa\" là ai?": "Long Hạo Thần",
      "Nhân vật chính của Đấu La Đại Lục là ai?": "Đường Tam",
      "Nhân vật chính Lý Trường Thọ trong Sư Huynh A Sư Huynh đã tỏ tình với ai ?": "Vân Tiêu",
      "Nhân vật chính trong Thương Nguyên đồ là ai ?": "Mạnh Xuyên",
      "Nhân vật chính trong Yêu Thần Ký tên là gì ?": "Nhiếp Ly",
      "Nhân vật chính trong Man Hoang Tiên Giới là ai ?": "Lục Hàng Chi",
      "Nhân vật nào luôn bất bại trong phim Hoạt Hình Trung Quốc, được ví như One-Punch Man ?": "Từ Dương",
      "Nhân vật nào sau đây được mệnh danh là Vua Lỳ Đòn trong Đấu Phá Thương Khung ?": "Phượng Thanh Nhi",
      "Nhị ca của Tiêu Viêm trong Đấu Phá Thương Khung tên gì ?": "Tiêu Lệ",
      "Nhiếp Phong là nhân vật chính trong phim hoạt hình trung quốc nào ?": "Chân Võ Đỉnh Phong",
      "Ninh Diêu là một nhân vật trong bộ phim hoạt hình trung quốc nào sau đây ?": "Kiếm Lai",
      "Nữ chính cũng là vợ Đông Bá Tuyết Ưng trong Tuyết Ưng Lĩnh Chủ là ai sau đây ?": "Dư Tĩnh Thu",
      "Nữ chính trong bộ Quyến Tư Lượng là ai ?": "Đồ Lệ",
      "Ông nội của Lâm Động trong Vũ Động Càn Khôn là ai ?": "Lâm Chấn Thiên",
      "Phụ Thân của Lâm Động trong Vũ Động Càn Khôn là ai ?": "Lâm Khiếu",
      "Phương Hàn là nhân vật trong bộ hoạt hình trung quốc nào sau đây ?": "Vĩnh Sinh",
      "Phương Hàn trong Vĩnh Sinh nhận được Giao Phục Hoàng Tuyền Đồ từ ai ?": "Bạch Hải Thiện",
      "Phương Hàn trong Vĩnh Sinh xuất thân là gì ở nhà họ Phương ?": "Nô Bộc",
      "Phượng Thanh Nhi trong Đấu Phá Thương Khung thuộc chủng tộc nào ?": "Thiên Yêu Hoàng Tộc",
      "Số hiệu vị thần của main trong Trảm Thần: Phàm Trần Thần Vực là số mấy ?": "003",
      "Sử Lai Khắc Thất Quái đã từng đến nơi nào để luyện tập?": "Hải Thần Đảo",
      "Sư mẫu của Bạch Tiểu Thuần trong Nhất Niệm Vĩnh Hằng là ai ?": "Hứa Mị Nương",
      "Sư phụ của Bạch Tiểu Thuần trong Nhất Niệm Vĩnh hằng là ai ?": "Lý Thanh Hậu",
      "Sư phụ của Lý Trường Thọ là ai ?": "Tề Nguyên",
      "Sư phụ mà Diệp Thần yêu trong Tiên Võ Đế Tôn là ai ?": "Sở Huyên Nhi",
      "Sư Phụ thứ 2 của Lý Trường Thọ trong phim": "Thái Thanh Thánh Nhân",
      "Tại sao Đường Tam bị Đường Môn truy sát ở tập đầu phim Đấu La Đại Lục ?": "Học trộm tuyệt học bổn môn",
      "Tần Vũ trong Tinh Thần Biến được tặng pháp bảo siêu cấp vip pro nào để tu luyện nhanh chóng ?": "Khương Lan Tháp",
      "Tần Vũ trong Tinh Thần Biến khiếm khuyết đan điền nhờ đâu mới có thể tu luyện ?": "Lưu Tinh Lệ",
      "Thánh nữ nào trong Già Thiên bị nhân vật chính Diệp Phàm lấy mất cái áo lót ?": "Diêu Hi",
      "Thần Thông Bí Cảnh xuất hiện trong bộ phim hoạt hình nào dưới đây ?": "Vĩnh Sinh",
      "Thần vị mà Đường Tam đạt được là gì?": "Hải Thần và Tu La Thần",
      "Thế lực nào là đối thủ lớn nhất của Tiêu Viêm trong Đấu Phá Thương Khung?": "Hồn Điện",
      "Thiên Hoả Tôn Giả trong Đấu Phá Thương Khung dùng thi thể của ai để hồi sinh ?": "Vân Sơn",
      "Thú cưng Thôn Thôn trong Nguyên Tôn sinh ra có sức mạnh ngang cảnh giới nào ?": "Thái Sơ Cảnh",
      "Tiêu Khinh Tuyết xuất hiện trong bộ hoạt hình nào dưới đây ?": "Tuyệt Thế Chiến Hồn",
      "Tiêu Viêm đã lập nên thế lực nào khi ở Học Viện Già Nam ?": "Bàn Môn",
      "Tiêu Viêm trong Đấu Phá Thương Khung đã Hẹn Ước 3 Năm với ai ?": "Nạp Lan Yên Nhiên",
      "Tiêu Viêm trong Đấu Phá Thương Khung sử dụng loại vũ khí nào sau đây ?": "Thước",
      "Tiêu Viêm trong Đấu Phá Thương Khung thuộc gia tộc nào?": "Tiêu gia",
      "Tiêu Thần là nhân vật chính trong bộ phim hoạt hình trung quốc nào sau đây ?": "Trường Sinh Giới",
      "Tình đầu của Diệp Phàm trong Già Thiên là ai ?": "Lý Tiểu Mạn",
      "Trần Bình An là nam chính trong bộ phim hoạt hình trung quốc nào ?": "Kiếm Lai",
      "Triệu Ngọc Chân là nhân vật trong bộ hoạt hình trung quốc nào sau đây ?": "Thiếu Niên Bạch Mã Tuý Xuân Phong",
      "Trong bộ Đấu Phá Thương Khung, Tiêu Viêm tìm đến ai để cứu Dược Lão ?": "Phong Tôn Giả",
      "Trong bộ Tiên Nghịch, nhân vật chính Vương Lâm khi ở quê nhà còn có tên khác là gì ?": "Thiết Trụ",
      "Trong Đấu La Đại Lục, Đường Hạo là gì của Đường Tam?": "Cha",
      "Trong Già Thiên, thể chất Diệp Phàm là thể chất gì ?": "Hoang Cổ Thánh Thể",
      "Trong Phàm Nhân Tu Tiên ai bị luyện thành khôi lỗi Khúc Hồn ?": "Trương Thiết",
      "Trong phim Tiên Nghịch, Vương Lâm vô tình có được pháp bảo nghịch thiên nào ?": "Thiên Nghịch Châu",
      "Trong Tiên Nghịch, Vương Lâm nhận được truyền thừa gì ở Cổ Thần Chi Địa ?": "Ký Ức",
      "Trong Tru Tiên, Điền Bất Dịch là thủ tọa của Phong nào?": "Đại Trúc Phong",
      "Trong Vĩnh Sinh - Phương Hàn hẹn ước 10 năm cùng với ai ?": "Hoa Thiên Đô",
      "Trước khi đến Linh Khê Tông, Bạch Tiểu Thuần trong Nhất Niệm Vĩnh Hằng ở đâu ?": "Mạo Nhi Sơn Thôn",
      "Trương Tiểu Phàm trong phim Tru Tiên còn có tên gọi là ?": "Quỷ Lệ",
      "Trương Tiểu Phàm trong Tru Tiên từng được nhận vào môn phái nào?": "Thanh Vân Môn",
      "Tử Nghiên trong Đấu Phá Thương Khung thuộc chủng tộc nào ?": "Thái Hư Cổ Long",
      "Vân Triệt là tên nhân vật chính trong bộ phim hoạt hình trung quốc nào sau đây ?": "Nghịch Thiên Tà Thần",
      "Tại sao Hàn Lập khi gặp Phong Hi không chạy mà ở lại giúp đỡ chế tạo Phong Lôi Sí ?": "Vì đánh không lại\".\"",
      "Vũ Canh là nhân vật trong bộ hoạt hình trung quốc nào sau đây ?": "Vũ Canh Kỷ",
      "Vũ hồn của Chu Trúc Thanh là gì?": "U Minh Linh Miêu",
      "Vũ hồn của Đới Mộc Bạch là gì?": "Bạch Hổ",
      "Vũ hồn của Mã Hồng Tuấn là gì?": "Hỏa Phượng Hoàng",
      "Vũ hồn của Tiểu Vũ là gì?": "Nhu Cốt Thỏ",
      "Vũ hồn thứ hai của Đường Tam là gì?": "Hạo Thiên Chùy",
      "Vũ khí của Đàm Vân trong Nghịch Thiên Chí Tôn là gì ?": "Hồng Mông Thần Kiếm",
      "Vũ khí mà Tiêu Viêm trong Đấu Phá Thương Khung luôn mang bên mình có tên gọi là gì ?": "Huyền Trọng Xích",
      "Vương Lâm trong phim Tiên Nghịch dựa vào gì để vô địch cùng cảnh giới ?": "Cực cảnh",
      "Y Lai Khắc Tư là một nhân vật trong bộ phim hoạt hình trung quốc nào sau đây ?": "Cả 1 và 2",
      "Tần Mục là nhân vật chính trong bộ phim hoạt hình trung quốc nào sau đây ?": "Mục Thần Ký",
      "Mục đích chính tu luyện của Tần Vũ trong Tinh Thần Biến là gì ??": "Vì muốn được cưới Khương Lập",
      "Trong Đấu Phá Thương Khung, Tiêu Viêm hơn Cổ Hà ở điểm gì ?": "Dị Hỏa",
      "Tại sao Hàn Lập khi gặp Phong Hi không chạy mà ở lại giúp đỡ chế tạo Phong Lôi Sí ?": "Vì đánh không lại.",
      "Nhân vật chính trong Ta Có Thể Giác Ngộ Vô Hạn là ai ?": "Tiêu Vân",
      "Nhân vật chính trong Đấu Chiến Thiên Hạ là ai ?": "Đại Phong",
      "Nhân vật chính trong Quân Tử Vô Tật là ai ?": "Dao Cơ",
      "Nhân vật chính trong Man Hoang Tiên Giới là ai ?": "Lục Hàng Chi",
      "1 Trong 2 Admin của website HoatHinh3D là ai ? (Biệt danh chính xác ở web)": "Từ Dương",
      "Tỉnh Cửu là nhân vật chính trong bộ phim hoạt hình trung quốc nào sau đây ?": "Đại Đạo Triều Thiên",
      "Tần Nam là nhân vật chính trong bộ hoạt hình trung quốc nào sau đây ?": "Tuyệt Thế Chiến Hồn",
  };
  
const normalizedBank = {};
for (const q in quizBank) normalizedBank[normalize(q)] = quizBank[q];

const loadData = () => postRequest(HH3D_AJAX_URL, { action: 'load_quiz_data' });
const data     = await loadData();

if (!data.success || !data.data?.questions) {
  showNotificationUI('❌ Không tải được danh sách câu hỏi', 'error');
  return;
}

const questions = data.data.questions;

// Lấy tất cả câu chưa đúng (0 hoặc 2)
let pending = questions.filter(q => q.is_correct !== '1');

for (let idx = 0; idx < pending.length; idx++) {
  const q       = pending[idx];
  const key     = normalize(q.question);
  const rightAns= normalizedBank[key];

  if (!rightAns) {
    showNotificationUI(`⚠️ Chưa có đáp án:<br>${q.question}`, 'error');
    continue;
  }

  const opts = q.options.map(o => (typeof o === 'string' ? o : o.content));
  const pick = bestMatch(opts, rightAns);

  const res = await postRequest(HH3D_AJAX_URL, {
    action      : 'save_quiz_result',
    question_id : q.id,
    answer      : pick
  });

  const isRight = Number(res?.data?.is_correct) === 1;
  q.is_correct  = isRight ? '1' : '2';                        // ⚡ cập‑nhật local
  const icon    = isRight ? '✅' : '❌';
  showNotificationUI(
    `${icon} <b>Căng Cọt Câu ${idx + 1}</b><br>📌 ${q.question}<br>📥Đáp án nè vãi lòn chưa: <i>${opts[pick]}</i><br>🎯Lịt pẹ ${res?.data?.message || ''}`,
    isRight ? 'success' : 'error'
  );
  await new Promise(r => setTimeout(r, 250));                 // nhỏ delay
}

/* -------------------------------------------------- *
 * 7.  Tính kết quả dựa trên dữ liệu đã cập‑nhật       *
 * -------------------------------------------------- */
const correctCnt = questions.filter(q => q.is_correct === '1').length;

if (correctCnt === 5) {
  showNotificationUI('Vấp Đáp 🎉 Đã hoàn thành toàn bộ Vấn đáp. Đòi làm thêm có cái L chứ làm Cút', 'success');
  // Gắn flag CHỈ khi hoàn tất
  try { chrome?.storage?.local?.set?.({ quizDone: todayStr }); } catch {}
} else {
  // Không gắn flag – chỉ thông báo còn thiếu
  showNotificationUI(
    `[Quiz Notification] ⚠️ Vẫn còn câu hỏi chưa đúng – (${correctCnt}/5). Vui lòng kiểm tra lại.`,
    'error'
  );
}
})();
