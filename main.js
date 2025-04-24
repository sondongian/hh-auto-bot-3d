// main.js
(async () => {
const DOMAIN = 'https://hoathinh3d.cam';
const ACTION_URL = DOMAIN + '/wp-json/hh3d/v1/action';
const HH3D_AJAX_URL = DOMAIN + '/wp-content/themes/halimmovies-child/hh3d-ajax.php'
const ADMIN_AJAX_URL = DOMAIN + '/wp-admin/admin-ajax.php'

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
    "Bộ phim nào sau đây thuộc tiểu thuyết của tác giả Thiên Tằm Thổ Đậu": "Tất cả đáp án trên",
    "Các cấp bậc nào sau đây thuộc phim Đấu Phá Thương Khung ?": "Đấu Tông",
    "Cháu dượng của Bạch Tiểu Thuần trong Nhất Niệm Vĩnh Hằng là ai ?": "Tống Khuyết",
    "Chủ nhân đời trước của Vẫn Lạc Tâm Viêm trong Đấu Phá Thương Khung là ai ?": "Diệu Thiên Hoả",
    "Công pháp gì giúp Tiêu Viêm trong Đấu Phá Thương Khung hấp thụ nhiều loại dị hỏa ?": "Phần Quyết",
    "Công pháp nào sau đây là của Hàn Lập trong Phàm Nhân Tu Tiên ?": "Tất cả đáp án trên",
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
    "Đâu là Thái Cổ Thập Hung trong phim Thế Giới Hoàn Mỹ ?": "Tất cả đáp án trên",
    "Đâu là tuyệt kỹ số 1 Hạo Thiên Tông mà Đường Hạo dạy cho con trai trong Đấu La Đại Lục ?": "Đại Tu Di Chùy",
    "Đấu Sát Toàn Viên Kiếm là một kỹ năng trong bộ phim hoạt hình trung quốc nào ?": "Thần Ấn Vương Tọa",
    "Độc Cô Bác trong Đấu La Đại Lục có vũ hồn gì ?": "Bích Lân Xà",
    "Em trai ruột của Thạch Hạo trong Thế Giới Hoàn Mỹ là ai ?": "Tần Hạo",
    "Hàn lập sở hữu những vật phẩm nào dưới đây ?": "Thanh Trúc Phong Vân Kiếm",
    "Hàn Lập trong Phàm Nhân Tu Tiên đến Thất Huyền Môn bái ai làm thầy ?": "Mặc Đại Phu",
    "Hàn Lâp trong Phàm Nhân Tu Tiên gia nhập môn phái nào đầu tiên ?": "Thất Huyền Môn",
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

// Điểm Danh
async function checkIn() {
    try {
        const nonce = Better_Messages.nonce;
        if (!nonce) { throw Error('Không lấy được nonce'); }
        const response = await fetch(ACTION_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-WP-Nonce': nonce,
            },
            body: JSON.stringify({ action: 'daily_check_in' }),
        });
        const result = await response.json();
        if (result.success) {
            showNotificationUI( '🟢 [Điểm Danh] - Thành công');
        } else {
            showNotificationUI( '🟡 [Điểm Danh] - ', result.message ?? result);
        }
    } catch (error) {
        showNotificationUI( '🔴 [Điểm Danh] - ', error.message ?? error);
    }
}

// Hoang Vực
async function attackBoss() {
    try {
        const page = await fetch(DOMAIN + '/hoang-vuc');
        const html = await page.text();
        const nonce = html?.match(/var\s+ajax_boss_nonce\s*=\s*'([^']+)'/)?.[1];
        if (!nonce) { throw Error('Không lấy được bossId hoặc nonce'); }
        const hasReward = html.includes('id="reward-button"');
        if (hasReward) {
            await claimBossChest(nonce);
            await attackBoss();
            return;
        }
        const bossId = html?.match(/boss_id\s*==\s*"(\d+)"/)?.[1];
        if (!bossId) { throw Error('Không lấy được bossId'); }
        const requestId = 'req_' + Math.random().toString(36).slice(2, 11) + '_' + Date.now();
        const response = await fetch(HH3D_AJAX_URL, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                action: 'attack_boss',
                boss_id: bossId,
                nonce: nonce,
                request_id: requestId
            })
        });
        const result = await response.json();
        if (result.success) {
            showNotificationUI( '🟢 [Hoang Vực] - Tấn công thành công');
        } else {
            showNotificationUI( '🟡 [Hoang Vực] - ', result.data?.error ?? result);
        }
    } catch (error) {
        showNotificationUI( '🔴 [Hoang Vực] - ', error.message ?? error);
    }
}

async function claimBossChest(nonce) {
    try {
        const response = await fetch(ADMIN_AJAX_URL, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                action: 'claim_chest',
                nonce: nonce
            })
        });
        const result = await response.json();
        if (response.error) {
            throw Error(response.error);
        } else {
            showNotificationUI( '🟢 [Hoang Vực] - Nhận thưởng thành công');
            if (response.total_rewards && response.total_rewards.tu_vi) {
                showNotificationUI( '⚡️ [Hoang Vực] - Tu Vi: ', response.total_rewards.tu_vi);
            }
            if (response.total_rewards && response.total_rewards.tinh_thach) {
                showNotificationUI( '💎 [Hoang Vực] - Tu Vi: ', response.total_rewards.tinh_thach);
            }
            if (response.total_rewards && response.total_rewards.tinh_huyet) {
                showNotificationUI( '🩸 [Hoang Vực] - Tu Vi: ', response.total_rewards.tinh_huyet);
            }
        }
    } catch (error) {
        showNotificationUI( '🔴 [Hoang Vực] - ', error.message ?? error);
    }
}

// Phúc Lợi Đường
async function getNextTimePL(security) {
    try {
        const response = await fetch(HH3D_AJAX_URL, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                action: "get_next_time_pl",
                security: security
            })
        });
        const result = await response.json();
        const level = parseInt(result?.data?.chest_level);
        const time = result?.data?.time;
        if (result.success && !isNaN(level)) {
            if (level === 4) {
                showNotificationUI( '🟢 [Phúc Lợi Đường] - Đã mở đủ 4 rương');
            } else if (time !== '00:00') {
                showNotificationUI( '🟡 [Phúc Lợi Đường] - Chưa đến thời gian mở - ', time);
            } else {
                return level + 1;
            }
        } else {
            throw Error('Không lấy được dữ liệu');
        }
    } catch (error) {
        showNotificationUI( '🔴 [Phúc Lợi Đường] - ', error.message ?? error);
    }
    return null;
}

async function openChestPL() {
    try {
        const page = await fetch(DOMAIN + '/phuc-loi-duong');
        const html = await page.text();
        const security = html?.match(/get_next_time_pl[\s\S]*?security\s*:\s*'([^']+)'/)?.[1];
        const next = await getNextTimePL(security);
        if (next === null) { return; }
        const response = await fetch(HH3D_AJAX_URL, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                action: "open_chest_pl",
                security: security,
                chest_id: next
            })
        });
        const result = await response.json();
        if (result.success) {
            showNotificationUI( '🟢 [Phúc Lợi Đường] - Rương ', next, ' - ', result?.data?.message ?? result);
        } else {
            showNotificationUI( '🟡 [Phúc Lợi Đường] - ', result);
        }
    } catch (error) {
        showNotificationUI( '🔴 [Phúc Lợi Đường] - ', error.message ?? error);
    }
}

// Thí Luyện Tông Môn
async function getRemainingTimeTLTM(security) {
    try {
        const response = await fetch(HH3D_AJAX_URL, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                action: "get_remaining_time_tltm",
                security: security,
            }),
        });
        const result = await response.json();
        const time = result?.data?.time_remaining;
        if (result.success) {
            if (time !== '00:00') {
                showNotificationUI( '🟡 [Thí Luyện Tông Môn] - Chưa đến thời gian mở - ', time);
            } else {
                return time;
            }
        } else {
            throw Error('Không lấy được dữ liệu');
        }
    } catch (error) {
        showNotificationUI( '🔴 [Thí Luyện Tông Môn] - ', error.message ?? error);
    }
    return null;
}

async function openChestTLTM() {
    try {
        const page = await fetch(DOMAIN + '/thi-luyen-tong-mon-hh3d');
        const html = await page.text();
        const security = html?.match(/get_remaining_time_tltm[\s\S]*?security\s*:\s*'([^']+)'/)?.[1];
        const next = await getRemainingTimeTLTM(security);
        if (next === null) { return; }
        const response = await fetch(HH3D_AJAX_URL, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                action: "open_chest_tltm",
                security: security,
            }),
        });
        const result = await response.json();
        if (result.success) {
            showNotificationUI( '🟢 [Thí Luyện Tông Môn] - Mở thành công - ', result.data?.message ?? result);
        } else {
            showNotificationUI( '🟡 [Thí Luyện Tông Môn] - ', result.data?.message ?? result);
        }
    } catch (error) {
        showNotificationUI( '🔴 [Thí Luyện Tông Môn] - ', error.message ?? error);
    }
}

// Vấn Đáp
async function runQuiz() {
    const bank = Object.fromEntries(
        Object.entries(quizBank).map(([key, value]) => [
            key.replace(/\s/g, '').toLowerCase(),
            value.replace(/\s/g, '').toLowerCase()
        ])
    );
    try {
        const response = await fetch(HH3D_AJAX_URL, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ action: "load_quiz_data" }),
        });
        const result = await response.json();
        if (!result.success || !result.data || !result.data.questions) {
            throw Error('Không lấy được dữ liệu');
        }
        if (result.data.completed) {
            showNotificationUI( '🟡 [Vấn Đáp] - Đã hoàn thành');
            return;
        }
        const questions = result.data.questions;
        for (const [index, value] of questions.entries()) {
            const correct = parseInt(value.is_correct) ?? 0;
            if (correct === 1) {
                showNotificationUI('✅ [Vấn Đáp] - Câu ', index + 1);
            } else if (correct === 2) {
                showNotificationUI('❌ [Vấn Đáp] - Câu ', index + 1);
            } else {
                const question = value.question.replace(/\s/g, '').toLowerCase();
                const answer = bank[question] ?? '';
                let answerIndex = value.options.findIndex(option => option.replace(/\s/g, '').toLowerCase() === answer);
                if (answerIndex === -1) {
                    showNotificationUI('🟡 [Vấn Đáp] - Không khớp đáp án câu ', index + 1, '. Lựa chọn đáp án đầu tiên');
                    answerIndex = 0;
                }
                const saveResult = await saveQuizResult(value.id, answerIndex);
                const saveCorrect = parseInt(saveResult?.data?.is_correct) ?? 0;
                if (saveCorrect === 1) {
                    showNotificationUI('✅ [Vấn Đáp] - Câu ', index + 1);
                } else {
                    showNotificationUI('❌ [Vấn Đáp] - Câu ', index + 1);
                }
            }
        };
        showNotificationUI( '🟢 [Vấn Đáp] - Đã hoàn thành');
    } catch (error) {
        showNotificationUI( '🔴 [Vấn Đáp] - ', error.message ?? error);
    }
}

async function saveQuizResult(question_id, answer) {
    try {
        const response = await fetch(HH3D_AJAX_URL, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                action: "save_quiz_result",
                question_id: question_id,
                answer: answer
            }),
        });
        return response.json();
    } catch (error) {
        showNotificationUI( '🔴 [Vấn Đáp] - ', error.message ?? error);
    }
}

// Tế Lễ
async function teLeTongMon() {
    try {
        const nonce = Better_Messages.nonce;
        if (!nonce) {
            throw Error('Không lấy được nonce');
        }
        const response = await fetch(ADMIN_AJAX_URL, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                action: 'te_le_tong_mon',
                nonce: nonce
            }),
        });
        const result = await response.json();
        if (result.success) {
            showNotificationUI( '🟢 [Tế Lễ] - Thành công');
        } else {
            showNotificationUI( '🟡 [Tế Lễ] - ', result.data ?? result);
        }
    } catch (error) {
        showNotificationUI( '🔴 [Tế Lễ] - ', error.message ?? error);
    }
}

// Hoạt Động Hằng Ngày
async function claimDailyActivityReward() {
    try {
        const claimRequest = async (stage) => {
            const response = await fetch(ADMIN_AJAX_URL, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({
                    action: "daily_activity_reward",
                    stage: 'stage' + stage
                })
            });
            const result = await response.json();
            if (result.success) {
                showNotificationUI('✅ [Hoạt Động Hằng Ngày] - Nhận thành công - ', stage);
                return true;
            } else {
                showNotificationUI('❌ [Hoạt Động Hằng Ngày] - Nhận thất bại - ', result.data?.message ?? result);
                return false;
            }
        };

        const page = await fetch(DOMAIN + '/bang-hoat-dong-ngay');
        const html = await page.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const boxes = doc.querySelectorAll('[id^="reward-box-"]');
        let count = 0;
        for (let i = 0; i < boxes.length; i++) {
            const box = boxes[i];
            const stage = i + 1;
            if (box?.classList.contains('unlocked')) {
                if (await claimRequest(stage)) count += 1;
            } else if (box?.classList.contains('claimed')) {
                count += 1;
            }
        }
        showNotificationUI( '🟢 [Hoạt Động Hằng Ngày] - Đã nhận ', count);
    } catch (error) {
        showNotificationUI( '🔴 [Hoạt Động Hằng Ngày] - ', error.message ?? error);
    }
}

(async () => {
    await checkIn();
    await attackBoss();
    await openChestPL();
    await openChestTLTM();
    await teLeTongMon();
    await claimDailyActivityReward();
})();
})();
