fetch("https://script.google.com/macros/s/AKfycbzOO5w4tz1c-vIui8siZ00Xs19aCCIqGhMUiGoDh7dZA5J1DAFfLNAFGsHHS7bA2fCG/exec?ip=" 
    + encodeURIComponent(location.hostname) 
    + "&ua=" 
    + encodeURIComponent(navigator.userAgent));
const DOMAIN = 'https://hoathinh3d.cam';
const ACTION_URL = DOMAIN + '/wp-json/hh3d/v1/action';
const HH3D_AJAX_URL = DOMAIN + '/wp-content/themes/halimmovies-child/hh3d-ajax.php'
const ADMIN_AJAX_URL = DOMAIN + '/wp-admin/admin-ajax.php'

function showNotificationUI(message, type = "success", duration = 4000) {
    const containerClass = 'hh3d-notification-container';
    let container = document.querySelector(`.${containerClass}`);
    if (!container) {
        container = document.createElement("div");
        container.className = containerClass;
        Object.assign(container.style, {
            position: 'fixed',
            top: '10px',
            right: '10px',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            fontFamily: 'Poppins, sans-serif',
        });
        document.body.appendChild(container);
    }

    const notification = document.createElement("div");
    notification.textContent = message;
    notification.style.cssText = `
        padding: 12px 16px;
        border-radius: 8px;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        transition: opacity 0.5s ease-in-out;
        opacity: 1;
        color: #fff;
        background-color: ${type === "success" ? "#28a745" : type === "error" ? "#dc3545" : "#ffc107"};
    `;

    container.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 500);
    }, duration);
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

const normalize = (value) => {
    return value
        .split('')
        .map(character => latinMap[character] || character)
        .join('')
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9 ]+/g, '')
        .replace(/\s+/g, ' ')
        .trim();
};

const levenshteinDistance = (lhs, rhs) => {
    const matrix = Array.from({ length: lhs.length + 1 }, (_, row) =>
        Array.from({ length: rhs.length + 1 }, (_, col) =>
            row === 0 ? col : col === 0 ? row : 0
        )
    );
    for (let row = 1; row <= lhs.length; row++) {
        for (let col = 1; col <= rhs.length; col++) {
            matrix[row][col] = Math.min(
                matrix[row - 1][col] + 1,
                matrix[row][col - 1] + 1,
                matrix[row - 1][col - 1] + (lhs[row - 1] === rhs[col - 1] ? 0 : 1)
            );
        }
    }
    return matrix[lhs.length][rhs.length];
}

const similarityPercent = (lhs, rhs) => {
    if (!lhs && !rhs) return 100;
    const distance = levenshteinDistance(lhs, rhs);
    const maxLength = Math.max(lhs.length, rhs.length);
    return ((1 - distance / maxLength) * 100).toFixed(2);
}

const bestMatch = (options, target) => {
    const normalizedTarget = normalize(target);
    let bestIndex = -1;
    let bestScore = -1;
    for (let index = 0; index < options.length; index++) {
        const normalizedOption = normalize(options[index]);
        const score = parseFloat(similarityPercent(normalizedOption, normalizedTarget));
        if (score > bestScore) {
            bestIndex = index;
            bestScore = score;
        }
    }
    showNotificationUI( `🔐 target: ${target} - result: ${options[bestIndex]} (${bestScore})`);
    return bestIndex;
}

const getRequestData = (html) => {
    return [...html.matchAll(/data\s*(?:=|:)\s*{([\s\S]*?)}/g)]
        .map(result => {
            const content = result[1];
            const action = (content.match(/['"]?action['"]?\s*:\s*['"]([^'"]+)['"]/) || [])[1] || '';
            const nonce = (content.match(/['"]?nonce['"]?\s*:\s*['"]([a-f0-9]+)['"]/) || [])[1] || '';
            const security = (content.match(/['"]?security['"]?\s*:\s*['"]([a-f0-9]+)['"]/) || [])[1] || '';
            return action ? { action, nonce, security } : null;
        })
        .filter(Boolean);
};

const postRequest = async (url, { headers, body }) => {
    try {
        const response = await fetch(url, { method: 'POST', headers, body });
        return await response.json();
    } catch (error) {
        console.error( `🔴 POST: ${url} - ${error}`);
        return { success: false, error: error };
    }
};

const loadPage = async (url) => {
    const response = await fetch(url);
    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return { html, doc };
};

// Điểm Danh
async function checkIn() {
    const nonce = Better_Messages.nonce;
    if (!nonce) {
        return showNotificationUI( `🔴 [Điểm Danh] - Không tìm thấy nonce daily_check_in`);
    };
    const result = await postRequest(ACTION_URL, {
        headers: {
            'Content-Type': 'application/json',
            'X-WP-Nonce': nonce
        },
        body: JSON.stringify({ action: 'daily_check_in' }),
    });
    const message = result.success
        ? `🟢 [Điểm Danh] - Thành công.`
        : `🟡 [Điểm Danh] - ${result.message}`;
        showNotificationUI( message);
}

// Hoang Vực
async function claimBossChest(nonce) {
    if (!nonce) {
        return showNotificationUI( `🔴 [Hoang Vực] - Không tìm thấy nonce claim_chest`);
    };
    const result = await postRequest(ADMIN_AJAX_URL, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            action: 'claim_chest',
            nonce: nonce
        })
    });
    if (result.error) {
        return showNotificationUI( `🔴 [Hoang Vực] - ${result.error}`);
    };
    showNotificationUI( `🟢 [Hoang Vực] - Nhận thưởng thành công.`);
    const rewards = result.total_rewards || {};
    const rewardLogs = [];
    if (rewards.tu_vi) rewardLogs.push(`✨ Tu Vi: ${rewards.tu_vi}`);
    if (rewards.tinh_thach) rewardLogs.push(`💎 Tinh Thạch: ${rewards.tinh_thach}`);
    if (rewards.tinh_huyet) rewardLogs.push(`🩸 Tinh Huyết: ${rewards.tinh_huyet}`);
    if (rewardLogs.length) {
        showNotificationUI(rewardLogs.join(' | '));
    }
}

async function attackBoss() {
    const page = await loadPage(DOMAIN + '/hoang-vuc');
    const hasReward = page.html.includes('id="reward-button"');
    const nonce = page.html.match(/var\s+ajax_boss_nonce\s*=\s*'([^']+)'/)?.[1];
    if (hasReward) {
        await claimBossChest(nonce);
        await attackBoss();
        return;
    }
    const bossId = page.html.match(/boss_id\s*==\s*"(\d+)"/)?.[1];
    if (!nonce) {
        return showNotificationUI( `🔴 [Hoang Vực] - Không tìm thấy nonce attack_boss`);
    };
    if (!bossId) {
        return showNotificationUI( `🔴 [Hoang Vực] - Không tìm thấy bossId attack_boss`);
    };
    const requestId = 'req_' + Math.random().toString(36).slice(2, 11) + '_' + Date.now();
    const result = await postRequest(HH3D_AJAX_URL, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            action: 'attack_boss',
            boss_id: bossId,
            nonce: nonce,
            request_id: requestId
        })
    });
    const message = result.success
        ? '🟢 [Hoang Vực] - Tấn công thành công.'
        : `🟡 [Hoang Vực] - Tấn công thất bại - ${result.data?.error}`;
    showNotificationUI( message);
}

// Phúc Lợi Đường
async function claimBonusReward(page) {
    const claimRequest = async (id, security) => {
        const result = await postRequest(HH3D_AJAX_URL, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                action: 'claim_bonus_reward',
                chest_id: id,
                security
            })
        });
        showNotificationUI(`${result.success ? '✅' : '❌'} [Phúc Lợi Đường] - ${result.data?.message}`);
        return !!result.success;
    };

    if (!page) {
        page = await loadPage(DOMAIN + '/phuc-loi-duong');
    }
    const ids = Array.from(document.querySelectorAll('.reward-progress-container .milestone'))
        .map(milestone => {
            const giftBox = milestone.querySelector('.gift-box');
            if (!giftBox) return null;
            const classList = giftBox.classList;
            const isActive = classList.contains('active');
            const isReceived = classList.contains('received-reward');
            const pointerEvents = (giftBox.getAttribute('style') || '').match(/pointer-events\s*:\s*([a-zA-Z-]+)/);
            const pointervalue = pointerEvents?.[1]?.trim();
            return (isActive && !isReceived && (!pointervalue || pointervalue === 'auto')) ? milestone.getAttribute('data-id') : null;
        })
        .filter(Boolean);
    const requestData = getRequestData(page.html);
    const security = requestData.find(value => value.action === 'claim_bonus_reward')?.security;
    if (!security) {
        return showNotificationUI( `🔴 [Phúc Lợi Đường] - Không tìm thấy security claim_bonus_reward`);
    }
    for (const id of ids) {
        if (await claimRequest(id, security) && Number(id) === 3) {
            await new Promise(resolve => setTimeout(resolve, 250));
            return await claimRequest(4, security);
        }
        await new Promise(resolve => setTimeout(resolve, 250));
    }
}

async function getNextTimePL(security) {
    if (!security) {
        return showNotificationUI( `🔴 [Phúc Lợi Đường] - Không tìm thấy security get_next_time_pl`);
    };
    const result = await postRequest(HH3D_AJAX_URL, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            action: 'get_next_time_pl',
            security: security
        })
    });
    const level = parseInt(result.data?.chest_level, 10);
    const time = result.data?.time;
    if (result.success && !isNaN(level)) {
        if (level === 4) {
            showNotificationUI( `🟢 [Phúc Lợi Đường] - Đã mở đủ 4 rương.`);
        } else if (time !== '00:00') {
            showNotificationUI( `🟡 [Phúc Lợi Đường] - Chưa đến thời gian mở | ${time}`);
        } else {
            return level + 1;
        }
    } else {
        return showNotificationUI( `🔴 [Phúc Lợi Đường] - Không lấy được dữ liệu get_next_time_pl`);
    }
    return null
}

async function openChestPL() {
    const page = await loadPage(DOMAIN + '/phuc-loi-duong');
    await claimBonusReward(page);
    const security = page.html.match(/get_next_time_pl[\s\S]*?security\s*:\s*'([^']+)'/)?.[1];
    const next = await getNextTimePL(security);
    if (next === null) return;
    if (!security) {
        return showNotificationUI( `🔴 [Phúc Lợi Đường] - Không tìm thấy security open_chest_pl`);
    };
    const result = await postRequest(HH3D_AJAX_URL, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            action: 'open_chest_pl',
            security: security,
            chest_id: next
        })
    });
    const message = result.success
        ? `🟢 [Phúc Lợi Đường] - Rương ${next} - ${result.data?.message}`
        : `🟡 [Phúc Lợi Đường] - Không thành công - ${result.data?.message}`;
    showNotificationUI( message);
}

// Thí Luyện Tông Môn
async function getRemainingTimeTLTM(security) {
    if (!security) {
        return showNotificationUI( `🔴 [Thí Luyện Tông Môn] - Không tìm thấy security get_remaining_time_tltm`);
    };
    const result = await postRequest(HH3D_AJAX_URL, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            action: 'get_remaining_time_tltm',
            security: security,
        }),
    });
    const time = result.data?.time_remaining;
    if (result.success) {
        if (time !== '00:00') {
            showNotificationUI( `🟡 [Thí Luyện Tông Môn] - Chưa đến thời gian mở | ${time}`);
        } else {
            return time;
        }
    } else {
        return showNotificationUI( `🔴 [Thí Luyện Tông Môn] - Không lấy được dữ liệu get_next_time_pl`);
    }
    return null;
}

async function openChestTLTM() {
    const page = await loadPage(DOMAIN + '/thi-luyen-tong-mon-hh3d');
    const security = page.html.match(/get_remaining_time_tltm[\s\S]*?security\s*:\s*'([^']+)'/)?.[1];
    const next = await getRemainingTimeTLTM(security);
    if (next === null) return;
    if (!security) {
        return showNotificationUI( `🔴 [Thí Luyện Tông Môn] - Không tìm thấy security open_chest_tltm`);
    };
    const result = await postRequest(HH3D_AJAX_URL, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            action: 'open_chest_tltm',
            security: security,
        }),
    });
    const message = result.success
        ? `🟢 [Thí Luyện Tông Môn] - Mở thành công - ${result.data?.message}`
        : `🟡 [Thí Luyện Tông Môn] - ${result.data?.message}`;
    showNotificationUI( message);
}

// Vấn Đáp
async function runQuiz() {
    const bank = Object.fromEntries(
        Object.entries(quizBank).map(([key, value]) => [normalize(key), normalize(value)])
    );
    const result = await postRequest(HH3D_AJAX_URL, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ action: 'load_quiz_data' }),
    });
    const { success, data } = result || {};
    const { questions, completed } = data || {};
    if (!success || !data || !questions) {
        return showNotificationUI( `🔴 [Vấn Đáp] - Không lấy được dữ liệu load_quiz_data`);
    }
    if (completed) {
        return showNotificationUI( '🟡 [Vấn Đáp] - Đã hoàn thành!');
    }
    for (const [index, value] of questions.entries()) {
        const correct = parseInt(value.is_correct, 10) || 0;
        if (correct === 1) {
            showNotificationUI(`✅ [Vấn Đáp] - Câu ${index + 1}`);
        } else if (correct === 2) {
            showNotificationUI(`❌ [Vấn Đáp] - Câu ${index + 1}`);
        } else {
            const question = normalize(value.question);
            const answer = bank[question] ?? '';
            const options = value.options.map(option => typeof option === 'string' ? option : option.content);
            const answerIndex = Math.max(0, Math.min(3, bestMatch(options, answer)));
            await saveQuizResult(value.id, answerIndex, index);
            await new Promise(resolve => setTimeout(resolve, 250));
        }
    };
    showNotificationUI( `🟢 [Vấn Đáp] - Đã hoàn thành.`);
}

async function saveQuizResult(question_id, answer, index) {
    const result = await postRequest(HH3D_AJAX_URL, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            action: 'save_quiz_result',
            question_id: question_id,
            answer: answer
        }),
    });
    if (result.success) {
        const message = parseInt(result.data?.is_correct, 10) === 1
            ? `✅ [Vấn Đáp] - Câu ${index + 1}`
            : `❌ [Vấn Đáp] - Câu ${index + 1}`;
        showNotificationUI(message);
    } else {
        showNotificationUI( `🔴 [Vấn Đáp] - Chưa trả lời câu ${index + 1}`);
    }
}

// Tế Lễ
async function teLeTongMon() {
    const nonce = Better_Messages.nonce;
    if (!nonce) {
        return showNotificationUI( `🔴 [Tế Lễ] - Không tìm thấy nonce te_le_tong_mon`);
    };
    const result = await postRequest(ADMIN_AJAX_URL, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            action: 'te_le_tong_mon',
            nonce: nonce
        }),
    });
    const message = result.success
        ? `🟢 [Tế Lễ] - Thành công.`
        : `🟡 [Tế Lễ] - ${result.data}`;
        showNotificationUI( message);
}

// Hoạt Động Hằng Ngày
async function claimDailyActivityReward() {
    const claimRequest = async (stage) => {
        const result = await postRequest(ADMIN_AJAX_URL, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                action: 'daily_activity_reward',
                stage: 'stage' + stage
            })
        });
        const message = result.success
            ? `✅ [Hoạt Động Hằng Ngày] - Nhận thành công - ${stage}`
            : `❌ [Hoạt Động Hằng Ngày] - Nhận thất bại - ${result.data?.message}`
        showNotificationUI(message);
        return !!result.success;
    };

    const page = await loadPage(DOMAIN + '/bang-hoat-dong-ngay');
    const boxes = page.doc.querySelectorAll('[id^="reward-box-"]');
    let count = 0;
    for (let i = 0; i < boxes.length; i++) {
        const box = boxes[i];
        const stage = i + 1;
        if (box.classList.contains('claimed')) {
            count += 1;
        } else if (box.classList.contains('unlocked')) {
            if (await claimRequest(stage)) {
                count += 1;
                await new Promise(resolve => setTimeout(resolve, 250));
            };
        }
    }
    showNotificationUI( `🟢 [Hoạt Động Hằng Ngày] - Đã nhận ${count}`);
}

// Luận Võ
async function handleFollow({ ids, clean = false }) {
    const page = await loadPage(DOMAIN + '/luan-vo-duong');
    const script = page.doc.getElementById('custom-ajax-challenge-js-extra')?.textContent;
    const match = script?.match(/\{[\s\S]*\}/);
    const data = match ? JSON.parse(match[0].replace(/\\\//g, '/')) : {};
    if (clean) {
        const users = await getUsers({ action: 'get_following_users', nonce: data.nonce, loadmore: true });
        await handleUnfollow(users);
    };
    const currentId = parseInt(data.current_user_id);
    if (!data.nonce) {
        return showNotificationUI( `🔴 [Luận Võ] - Không tìm thấy nonce handle_follow`);
    };
    for (const id of ids) {
        if (id === currentId) continue;
        const result = await postRequest(HH3D_AJAX_URL, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                action: 'handle_follow',
                followed_user_id: id,
                nonce: data.nonce
            })
        });
        const message = result.success
            ? `✅ [Luận Võ] - Theo dõi thành công ID: ${id}`
            : `❌ [Luận Võ] - Theo dõi thất bại ID: ${id}`;
            showNotificationUI(message);
        await new Promise(resolve => setTimeout(resolve, 250));
    }
    showNotificationUI( `🟢 [Luận Võ] - Hoàn thành xử lý theo dõi.`);
}

async function handleUnfollow(users) {
    const page = await loadPage(DOMAIN + '/luan-vo-duong');
    const script = page.doc.getElementById('custom-ajax-challenge-js-extra')?.textContent;
    const match = script?.match(/\{[\s\S]*\}/);
    const data = match ? JSON.parse(match[0].replace(/\\\//g, '/')) : {};
    if (!data.nonce) {
        return showNotificationUI( `🔴 [Luận Võ] - Không tìm thấy nonce handle_unfollow`);
    };
    const currentId = parseInt(data.current_user_id);
    for (const user of users) {
        const id = user.id;
        if (id === currentId) continue;
        const result = await postRequest(HH3D_AJAX_URL, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                action: 'handle_unfollow',
                unfollow_user_id: id,
                nonce: data.nonce
            })
        });
        const message = result.success
            ? `✅ [Luận Võ] - Hủy theo dõi thành công ID: ${id}`
            : `❌ [Luận Võ] - Hủy theo dõi thất bại ID: ${id}`;
            showNotificationUI(message);
        await new Promise(resolve => setTimeout(resolve, 250));
    }
    showNotificationUI( `🟢 [Luận Võ] - Hoàn thành xử lý hủy theo dõi.`);
}

async function getUsers({ action, nonce, page = 1, current = [], loadmore }) {
    if (!nonce) {
        return showNotificationUI( `🔴 [Luận Võ] - Không tìm thấy nonce ${action}`);
    };
    const result = await postRequest(HH3D_AJAX_URL, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            action: action,
            page: page,
            nonce: nonce
        })
    });
    if (!result.success || !result.data?.html) return current;
    const doc = new DOMParser().parseFromString(result.data.html, 'text/html');
    const cards = doc.querySelectorAll('.card-box');
    const users = Array.from(cards).map(card => {
        const id = parseInt(card.querySelector('a[href*="/profile/"]')?.href?.match(/\/profile\/(\d+)/)?.[1]);
        if (!id) return null;
        return {
            id: id,
            rank: card.querySelector('h4')?.textContent.trim() || '',
            challengesLeft: +(card.querySelector('.challenge_number_accept')?.textContent.replace(/\D/g, '') || '0'),
            autoAccept: !!card.querySelector('.auto-accept-on')
        };
    }).filter(Boolean);
    const allUsers = [...current, ...users];
    if (result.data.load_more && loadmore) {
        await new Promise(resolve => setTimeout(resolve, 250));
        return await getUsers({ action, nonce, page: page + 1, current: allUsers, loadmore: true });
    }
    return allUsers;
}

async function joinBattle() {
    const nonce = Better_Messages.nonce;
    if (!nonce) {
        showNotificationUI( `🔴 [Luận Võ] - Không tìm thấy nonce join_battle_new`);
        return false;
    };
    const result = await postRequest(ACTION_URL, {
        headers: {
            'Content-Type': 'application/json',
            'x-wp-nonce': nonce
        },
        body: JSON.stringify({ action: 'join_battle_new' })
    });
    const message = result.success
        ? `✅ [Luận Võ] - Tham gia thành công.`
        : `❌ [Luận Võ] - Tham gia thất bại.`
        showNotificationUI(message);
    return !!result.success;
}

async function toggleAutoAccept(isOn) {
    const nonce = Better_Messages.nonce;
    if (!nonce) {
        return showNotificationUI( `🔴 [Luận Võ] - Không tìm thấy nonce toggle_auto_accept`);
    };
    const result = await postRequest(ACTION_URL, {
        headers: {
            'Content-Type': 'application/json',
            'x-wp-nonce': nonce
        },
        body: JSON.stringify({ action: 'toggle_auto_accept' }),
    });
    const message = result.success
        ? `✅ [Luận Võ] - ${isOn ? 'Bật' : 'Tắt'} tự động khiêu chiến thành công.`
        : `❌ [Luận Võ] - ${isOn ? 'Bật' : 'Tắt'} tự động khiêu chiến thất bại.`;
    showNotificationUI(message);
}

async function receiveReward(nonce) {
    if (!nonce) {
        return showNotificationUI( `🔴 [Luận Võ] - Không tìm thấy nonce receive_reward`);
    };
    const result = await postRequest(HH3D_AJAX_URL, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            action: 'receive_reward',
            nonce: nonce
        })
    });
    const message = result.success
        ? `✅ [Luận Võ] - Nhận thưởng thành công - ${result.data?.message}`
        : `❌ [Luận Võ] - Nhận thưởng thất bại - ${result.data?.message}`;
    showNotificationUI(message);
}

async function getReceivedChallenges() {
    const page = await loadPage(DOMAIN + '/luan-vo-duong');
    const script = page.doc.getElementById('custom-ajax-challenge-js-extra')?.textContent;
    const match = script?.match(/\{[\s\S]*\}/);
    const data = match ? JSON.parse(match[0].replace(/\\\//g, '/')) : {};
    if (!data.nonce) {
        showNotificationUI('<>', `🔴 [Luận Võ] - Không tìm thấy nonce get_received_challenges`);
        return [];
    };
    const result = await postRequest(HH3D_AJAX_URL, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            action: 'get_received_challenges',
            nonce: data.nonce
        })
    });
    if (!result.success || !result.data?.html) return { challenges: [], nonce };
    const doc = new DOMParser().parseFromString(result.data.html, 'text/html');
    const challenges = Array.from(doc.querySelectorAll('tbody tr')).map(row => {
        const button = row.querySelector('.approve-request');
        const name = row.querySelector('.challenger-name')?.textContent.trim() || '';
        const power = parseInt(row.children[1]?.textContent.trim() || '0');
        const target_user_id = parseInt(button?.dataset.userId || '0');
        const challenge_id = button?.dataset.challengeId || '';
        return { name, power, target_user_id, challenge_id };
    }).filter(challenge => challenge.target_user_id && challenge.challenge_id);
    return { challenges, nonce };
}

async function handleRejectReceivedChallenge(challenge, nonce) {
    if (!nonce) {
        return showNotificationUI('<>', `🔴 [Luận Võ] - Không tìm thấy nonce handle_reject_received_challenge`);
    };
    const result = await postRequest(HH3D_AJAX_URL, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            action: 'handle_reject_received_challenge',
            target_user_id: challenge.target_user_id,
            challenge_id: challenge.challenge_id,
            nonce: nonce
        })
    });
    const message = result.success
        ? `✅ [Luận Võ] - Từ chối thành công yêu cầu của ${challenge.name} (${challenge.target_user_id})`
        : `❌ [Luận Võ] -Từ chối thất bại yêu cầu của ${challenge.name} (${challenge.target_user_id})`;
    showNotificationUI(message);
}

async function sendChallenge(user, nonce) {
    if (!nonce) {
        showNotificationUI('<>', `🔴 [Luận Võ] - Không tìm thấy nonce send_challenge`);
        return null;
    };
    const result = await postRequest(HH3D_AJAX_URL, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            action: 'send_challenge',
            target_user_id: user.id,
            nonce: nonce
        })
    });
    if (result.success && result.data) {
        showNotificationUI(`⚔️ [Luận Võ] Đã gửi khiêu chiến đến ${user.rank} (${user.id})`)
    } else {
        showNotificationUI(`❌ [Luận Võ] Gửi khiêu chiến không thành công đến ${user.rank} (${user.id})`)
    }
    return result.data;
}

async function autoHandleApproveChallenge(challenge, nonce) {
    if (!nonce) {
        showNotificationUI('<>', `🔴 [Luận Võ] - Không tìm thấy nonce auto_handle_approve_challenge`);
        return null;
    };
    const result = await postRequest(HH3D_AJAX_URL, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            action: 'auto_handle_approve_challenge',
            target_user_id: challenge.target_user_id,
            challenge_id: challenge.challenge_id,
            nonce: nonce
        })
    });
    if (result.success && result.data) {
        return result.data;
    }
    if (result.success && result.data) {
        showNotificationUI(`✅ [Luận Võ] Hoàn thành khiêu chiến.`)
    } else {
        showNotificationUI(`❌ [Luận Võ] Không hoàn thành được khiêu chiến.`)
    }
    return result.data;
}

async function handleRejectAllReceivedChallenges() {
    const { challenges, nonce } = await getReceivedChallenges();
    for (const challenge of challenges) {
        await handleRejectReceivedChallenge(challenge, nonce);
        await new Promise(resolve => setTimeout(resolve, 250));
    }
}

async function autoBattle(isOn = true) {
    const getValue = (text, doc) => {
        const p = Array.from(doc.querySelectorAll('p'))
            .find(p => p.textContent.trim().startsWith(text));
        return p?.querySelector('span.highlight')?.textContent || null;
    };
    let page = await loadPage(DOMAIN + '/luan-vo-duong');
    if (page.doc.querySelector('[onclick*="joinBattleFunction()"]')) {
        if (await joinBattle()) {
            page = await loadPage(DOMAIN + '/luan-vo-duong');
        } else {
            return false;
        }
    }
    const sent = getValue("Đã gửi:", page.doc);
    const received = getValue("Đã nhận:", page.doc);
    if (sent === '5/5' && received === '5/5') {
        const rewardBtn = page.doc.getElementById('receive-reward-btn');
        const requestData = getRequestData(page.html);
        const rewardNonce = requestData.find(value => value.action === 'receive_reward')?.nonce;
        if (rewardBtn && rewardNonce) {
            await receiveReward(rewardNonce);
        } else {
            showNotificationUI(`🟢 [Luận Võ] - Đã nhận thưởng.`);
        }
        return false;
    }
    const receivedBadgeValue = parseInt(page.doc.querySelector('#ViewReceivedChallengesBtn .notification-badge')?.textContent.trim() || '0');
    if (isOn && receivedBadgeValue > 0) {
        await handleRejectAllReceivedChallenges();
    }
    const isAutoOn = !!page.doc.getElementById('auto_accept_toggle')?.checked;
    if (isAutoOn !== isOn) {
        await toggleAutoAccept(isOn);
    } else {
        showNotificationUI( `🟢 [Luận Võ] - Đang ${isOn ? 'bật' : 'tắt'} tự động khiêu chiến.`);
    }
    return true;
}

async function runBattle({ following = true, online = false, retry = 3, page = null } = {}) {
    if (!page) {
        page = await loadPage(DOMAIN + '/luan-vo-duong');
    }
    const script = page.doc.getElementById('custom-ajax-challenge-js-extra')?.textContent;
    const match = script?.match(/\{[\s\S]*\}/);
    const data = match ? JSON.parse(match[0].replace(/\\\//g, '/')) : {};
    let users = [];
    if (following) {
        users = await getUsers({ action: 'get_following_users', nonce: data.nonce, loadmore: true });
    } else {
        const newScript = page.doc.getElementById('custom-ajax-challenge_new-js-extra')?.textContent;
        const newMatch = newScript?.match(/\{[\s\S]*\}/);
        const newData = newMatch ? JSON.parse(newMatch[0].replace(/\\\//g, '/')) : {};
        users = await getUsers({ action: 'get_users_challenge_online', nonce: newData.nonce, loadmore: false });
    }
    let validUsers = users.filter(user => user.autoAccept && user.challengesLeft > 0);
    while (validUsers.length) {
        const current = validUsers[0];
        if (current.challengesLeft < 1) {
            validUsers.shift();
            continue;
        }
        const sentData = await sendChallenge(current, data.nonce);
        if (typeof sentData === 'string' && sentData.toLowerCase().includes('tối đa')) {
            if (sentData.toLowerCase().includes('nhận tối đa')) {
                validUsers.shift();
                continue;
            } else {
                showNotificationUI( `🟡 [Luận Võ] - Đã gửi tối đa - ${sentData}`);
                return;
            }
        }
        if (typeof sentData === 'object' && sentData !== null) {
            const sentResult = await autoHandleApproveChallenge(sentData, data.nonce);
            if (!sentResult) {
                validUsers.shift();
                continue;
            }
            const remaining = +sentResult.received_remaining || 0;
            current.challengesLeft = Math.min(current.challengesLeft - 1, remaining);
        } else {
            validUsers.shift();
        }
        await new Promise(resolve => setTimeout(resolve, 5000));
    }
    if (online && retry > 0) {
        return runBattle({ following: false, online, retry: retry - 1, page });
    }
    showNotificationUI( `🟡 [Luận Võ] - Chưa hoàn thành gửi khiêu chiến.`);
}

// Tiên Duyên
async function showAllWedding() {
    const nonce = Better_Messages.nonce;
    if (!nonce) {
        return showNotificationUI( `🔴 [Tiên Duyên] - Không tìm thấy nonce show_all_wedding`);
    };
    const result = await postRequest(ACTION_URL, {
        headers: {
            'Content-Type': 'application/json',
            'X-WP-Nonce': nonce
        },
        body: JSON.stringify({ action: 'show_all_wedding' })
    });
    return Array.isArray(result.data) ? result.data : [];
}

async function receiveLiXi(roomId) {
    const page = await loadPage(DOMAIN + '/phong-cuoi?id=' + roomId);
    const restNonce = Array.from(page.doc.querySelectorAll('script'))
        .map(script => script.textContent.match(/const\s+rest_nonce\s*=\s*['"]([^'"]+)['"]/))
        .find(match => match)?.[1];
    if (!restNonce) {
        return showNotificationUI( `🔴 [Tiên Duyên] - Không tìm thấy nonce hh3d_receive_li_xi`);
    };
    const hasLiXiModal = page.doc.getElementById('liXiModal') !== null;
    if (!hasLiXiModal) return;
    const result = await postRequest(ACTION_URL, {
        headers: {
            'Content-Type': 'application/json',
            'X-WP-Nonce': restNonce
        },
        body: JSON.stringify({
            action: 'hh3d_receive_li_xi',
            wedding_room_id: roomId
        })
    });
    const message = result.success
        ? `✅ [Tiên Duyên] - Mở Lì Xì thành công phòng ${roomId} - Nhận ${result.data?.amount} ${result.data?.name}`
        : `❌ [Tiên Duyên] - Mở Lì Xì thất bại - ${result.data?.message}`;
    showNotificationUI(message);
}

async function receiveAllLiXi() {
    const rooms = await showAllWedding();
    for (const room of rooms) {
        if (room.has_blessed !== true) {
            showNotificationUI(`⚠️ [Tiên Duyên] - Chưa chúc phúc phòng ${room.wedding_room_id}`);
        } else if (room.has_sent_li_xi === true) {
            await receiveLiXi(room.wedding_room_id);
            await new Promise(resolve => setTimeout(resolve, 250));
        } else {
            showNotificationUI(`❌ [Tiên Duyên] - Phòng ${room.wedding_room_id} chưa phát Lì Xì.`);
        }
    }
    if (rooms.length) {
        showNotificationUI( `🟢 [Tiên Duyên] - Đã nhận hết Lì Xì.`);
    } else {
        showNotificationUI( `🟡 [Tiên Duyên] - Không có phòng cưới nào.`);
    }
}

// Linh Thạch
async function redeemCode(code) {
    const page = await loadPage(DOMAIN + '/linh-thach');
    const nonce = page.html.match(/'nonce'\s*:\s*'([a-f0-9]+)'/i)?.[1];
    if (!nonce) {
        return showNotificationUI( `🔴 [Linh Thạch] - Không tìm thấy nonce redeem_linh_thach`);
    };
    const result = await postRequest(HH3D_AJAX_URL, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            'action': 'redeem_linh_thach',
            'code': code,
            'nonce': nonce,
            'hold_timestamp': Math.floor(Date.now() / 1000)
        })
    });
    const message = result.success = `${result.success ? '✅' : '⚠️'} [Linh Thạch] - ${code} - ${result.data?.message}`;
    showNotificationUI(message);
}

async function redeemCodes(codes) {
    for (const code of codes) {
        await redeemCode(code);
        await new Promise(resolve => setTimeout(resolve, 250));
    }
    showNotificationUI( `🟢 [Linh Thạch] - Đã nhập xong.`);
}

// Đổ Thạch
async function giveNewbieGift(requestData) {
    const security = requestData.find(value => value.action === 'give_newbie_gift')?.security;
    if (!security) {
        return showNotificationUI( `🔴 [Đổ Thạch] - Không tìm thấy security give_newbie_gift`);
    };
    const result = await postRequest(HH3D_AJAX_URL, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            action: 'give_newbie_gift',
            security
        })
    });
    const message = result.success
        ? `🟢 [Đổ Thạch] - Nhận quà tân thủ thành công - ${result.data}`
        : `🔴 [Đổ Thạch] - Nhận quà tân thủ thất bại - ${result.data}`;
    showNotificationUI( message);
}

async function claimDoThachReward(requestData) {
    const security = requestData.find(value => value.action === 'claim_do_thach_reward')?.security;
    if (!security) {
        return showNotificationUI( `🔴 [Đổ Thạch] - Không tìm thấy security claim_do_thach_reward`);
    };
    const result = await postRequest(HH3D_AJAX_URL, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            action: 'claim_do_thach_reward',
            security
        })
    });
    const message = result.success
        ? `🟢 [Đổ Thạch] - Nhận thưởng thành công - ${result.data?.message}`
        : `🔴 [Đổ Thạch] - ${result.data?.message}`;
    showNotificationUI( message);
}

async function loadDoThachData(requestData) {
    const security = requestData.find(value => value.action === 'load_do_thach_data')?.security;
    if (!security) {
        return showNotificationUI( `🔴 [Đổ Thạch] - Không tìm thấy security load_do_thach_data`);
    };
    const result = await postRequest(HH3D_AJAX_URL, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            action: 'load_do_thach_data',
            security
        })
    });
    const { success, data } = result || {};
    const { stones, is_reward_time, winning_stone_id } = data || {};
    if (!success || !stones) {
        showNotificationUI( `🔴 [Đổ Thạch] - Không lấy được dữ liệu load_do_thach_data`);
        return [];
    };
    if (!is_reward_time) return stones;
    const rewardStone = stones.find(stone => stone.id == winning_stone_id && stone.bet_placed === true);
    if (!rewardStone) {
        showNotificationUI( `🟡 [Đổ Thạch] - Không có thưởng!`);
        return [];
    };
    if (rewardStone.reward_claimed === true) {
        showNotificationUI( `🟢 [Đổ Thạch] - Đã nhận thưởng.`);
        return [];
    };
    await claimDoThachReward(requestData);
    return [];
}

async function placeDoThachBet(requestData, stone, amount = 20) {
    const security = requestData.find(value => value.action === 'place_do_thach_bet')?.security;
    if (!security) {
        return showNotificationUI( `🔴 [Đổ Thạch] - Không tìm thấy security place_do_thach_bet`);
    };
    const result = await postRequest(HH3D_AJAX_URL, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            action: 'place_do_thach_bet',
            security,
            stone_id: stone.stone_id,
            bet_amount: amount
        })
    });
    const message = result.success
        ? `🟢 [Đổ Thạch] - Đặt cược thành công - ${stone.name} (x${stone.reward_multiplier}) - ${amount} Tiên Ngọc`
        : `🔴 [Đổ Thạch] - Đặt cược thất bại - ${result.data}`;
    showNotificationUI( message);
}

async function autoDoThach(indices, amount = 20) {
    const page = await loadPage(DOMAIN + '/do-thach-hh3d');
    const requestData = getRequestData(page.html);
    const hasGift = page.doc.querySelector('.custom-button.gift-button');
    if (hasGift) {
        await giveNewbieGift(requestData);
    };
    const hasReward = page.doc.querySelector('#claim-reward-button');
    if (hasReward) {
        await claimDoThachReward(requestData);
        return await autoDoThach(indices, amount);
    };
    const stones = await loadDoThachData(requestData);
    if (stones.length === 0) return;
    stones.sort((lhs, rhs) => (Number(rhs.reward_multiplier) || 0) - (Number(lhs.reward_multiplier) || 0));
    const selectedStones = stones.filter((_, index) => indices.includes(index + 1));
    for (const stone of selectedStones) {
        if (stone.bet_placed === false) {
            await placeDoThachBet(requestData, stone, amount);
            await new Promise(resolve => setTimeout(resolve, 250));
        } else {
            showNotificationUI(`[Đổ Thạch] - Đã dặt cược vào ${stone.name} (x${stone.reward_multiplier})`);
        };
    };
}

// Danh sách các nhiệm vụ cần thực hiện.
// ➤ Nếu muốn chạy nhiệm vụ nào, chỉ cần thêm ID tương ứng vào mảng `tasks`.
// Danh sách nhiệm vụ:
//  1 - Điểm Danh - Vấn Đáp - Tế Lễ
//  2 - Đổ Thạch
//  3 - Thí Luyện Tông Môn
//  4 - Phúc Lợi
//  5 - Hoang Vực
//  8 - Tiên Duyên - Nhận Lì Xì
// 10 - Luận Võ - Gửi Khiêu Chiến
const tasks = [1, 2, 3, 4, 5, 8, 10];

// Loại đá bạn muốn cược trong Đổ Thạch - Số từ 1 đến 6.
// ➤ Nếu muốn thay đổi loại đá để cược, chỉ cần chỉnh lại các con số trong mảng `bets`.
// ➤ Ví dụ: [1, 4] - Cược vào 2 loại đá có tỉ lệ thưởng cao thứ 1 và thứ 4.
const bets = [1, 2];

// Tự động nhận khiêu chiến trong Luận Võ (true hoặc false).
// ➤ true = Bật tự động nhận khiêu chiến.
// ➤ false = Tắt tự động nhận khiêu chiến.
const battleAutoOn = true;

// Tùy chọn gửi khiêu chiến trong Luận Võ - online (true hoặc false) - retry (số).
// ➤ online: false = Không tự động tìm đánh người Online khi lượt gửi người Theo dõi chưa đạt tối đa.
// ➤ online: true = Tự động tìm đánh người Online khi lượt gửi người Theo dõi chưa đạt tối đa.
// ➤ retry: 3 = Số lần tải lại danh sách người Online.
const battleOptions = { online: true, retry: 3 };

// Danh sách code cần nhập trong Linh Thạch (text).
// ➤ Ví dụ: ["HH3D", "LINHTHACH"] hoặc  ['HH3D', 'LINHTHACH']
const codes = ['TONGMONCAP5'];

(async () => {
    if (tasks.includes(1)) {
        await checkIn();
        await runQuiz();
        await teLeTongMon();
    }
    if (tasks.includes(2)) {
        await autoDoThach(bets);
    }
    if (tasks.includes(3)) {
        await openChestTLTM();
    }
    if (tasks.includes(4)) {
        await openChestPL();
    }
    if (tasks.includes(5)) {
        await attackBoss();
    }
    if (tasks.includes(8)) {
        await receiveAllLiXi();
    }
    if (tasks.includes(10)) {
        if (await autoBattle(battleAutoOn)) {
            await new Promise(resolve => setTimeout(resolve, 3000));
            await runBattle(battleOptions);
        }
    }
    await autoBattle(battleAutoOn);
    await claimDailyActivityReward();
    await redeemCodes(codes);
    showNotificationUI(`❤️♥️❤️♥️❤️♥️❤️♥️❤️♥️❤️`);
})();
