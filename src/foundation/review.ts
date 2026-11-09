export type FindingKlass = "fact" | "inference" | "hypothesis";

export type Finding = {
  id: string;
  klass: FindingKlass;
  title: string;
  body: string;
};

export const gaps: Finding[] = [
  {
    id: "g1",
    klass: "fact",
    title: "Đã có dụng cụ ở Foundation — Ủy thác (/mandate)",
    body: "Hiến chương nói quyết định tốt hơn thị trường nhưng không khóa: tốt hơn chỉ số nào, trong tiền tệ nào, trên chân trời nào, với nhu cầu thanh khoản và thuế nào. Không có ủy thác thì lợi nhuận kỳ vọng chưa phải quyết định.",
  },
  {
    id: "g2",
    klass: "fact",
    title: "Đã có dụng cụ ở Foundation — Ủy thác hai vành (/mandate)",
    body: "Cùng một công thức chứa cổ phiếu, vĩ mô, yếu tố và mạng cảm biến. Ngân hàng, phi tài chính, hàng hóa và doanh nghiệp tư nhân không dùng chung một bộ chỉ tiêu chất lượng lợi nhuận. Phase 0 chưa chọn vành được phép đầu tư.",
  },
  {
    id: "g3",
    klass: "fact",
    title: "Đã có dụng cụ ở Foundation — Quan sát thế giới (/world)",
    body: "Lộ trình nhảy từ tri thức sang phân tích công ty. World Intelligence và Macro Engine nằm trong kiến trúc nhưng không có cổng nghiệm thu riêng. Dễ thành lời nói đầu của mọi báo cáo mà không bao giờ được xây.",
  },
  {
    id: "g4",
    klass: "fact",
    title: "Đã có dụng cụ ở Foundation — Base rate (/baserates)",
    body: "Xác suất có điều kiện đòi base rate. Không module nào sở hữu tập base rate: tỷ lệ duy trì tăng trưởng, tỷ lệ đảo chiều thành công, tỷ lệ hủy niêm yết, tỷ lệ gian lận. Không có tập này, cập nhật Bayes là trình diễn.",
  },
  {
    id: "g5",
    klass: "inference",
    title: "Thiếu chi phí thực thi",
    body: "Lợi thế thực thi được nêu tên nhưng chưa có mô hình thuế, trượt giá, vay cổ phiếu, sự kiện doanh nghiệp và quy đổi ngoại tệ. Với tài khoản tiêu dùng bằng đồng nội tệ, một ý tưởng đúng trên đô la có thể sai sau ma sát.",
  },
  {
    id: "g6",
    klass: "inference",
    title: "Kế toán theo chế độ chưa vào thiết kế",
    body: "Chất lượng lợi nhuận phụ thuộc VAS, IFRS hoặc US GAAP. Một kiểm tra phải thu đúng với chế độ này có thể vô nghĩa với chế độ kia. Engine công ty nếu xây như một mẫu chung sẽ tạo sai số hệ thống.",
  },
  {
    id: "g7",
    klass: "inference",
    title: "Hiệu chỉnh sẽ đến quá muộn nếu chỉ chờ giá cổ phiếu",
    body: "Thesis vốn cổ phần phân giải qua nhiều năm. Nếu không có điểm quy trình và các dự báo ngắn hạn đã đăng ký trước, hệ thống có thể mất một chu kỳ mới biết mình lệch xác suất.",
  },
  {
    id: "g8",
    klass: "fact",
    title: "Dòng dõi chưa bao phủ chính người phân tích",
    body: "Dòng dõi yêu cầu nguồn của số liệu, chưa yêu cầu phiên bản mô hình, mã và hồ sơ đã nhìn thấy lúc kết luận. Không khóa cái đó thì không tái lập được quyết định.",
  },
  {
    id: "g9",
    klass: "inference",
    title: "Chưa có ngân sách tìm kiếm bác bỏ",
    body: "Có phe bán trên giấy, chưa có mức công sức tối thiểu để tìm bằng chứng trái trước khi được phép kết luận. Dễ dừng khi câu chuyện đã tròn.",
  },
  {
    id: "g10",
    klass: "hypothesis",
    title: "Một người vận hành là rủi ro sống còn riêng",
    body: "Sinh tồn trong hiến chương nói về phá sản thị trường. Nếu nhật ký và tiêu chí hủy chỉ nằm trong đầu một người, hệ thống gãy khi người đó mệt, thiên lệch, hoặc vắng. Đây là giả thuyết về vận hành, chưa phải sự kiện đã đo.",
  },
  {
    id: "g11",
    klass: "fact",
    title: "Đã có dụng cụ ở Foundation — Nhật ký quyết định (/journal)",
    body: "Owner quyết định cuối, nhưng hiến chương không bắt buộc ghi lại khi Owner nới tiêu chí hủy. Không có nhật ký ghi đè thì nguyên tắc không nới tiêu chuẩn không kiểm được.",
  },
  {
    id: "g12",
    klass: "inference",
    title: "Giá trị thông tin chưa thành cổng dừng",
    body: "Mục giá trị thông tin đúng, nhưng chưa nói khi nào ngừng thu thập. Mạng cảm biến hàng triệu điểm có thể nuốt Phase 0.",
  },
];

export const dupes: Finding[] = [
  {
    id: "d1",
    klass: "inference",
    title: "Ba người viết của một thế giới",
    body: "World, Macro và Regime cùng nói về lãi suất, thanh khoản và địa chính trị. Nếu cả ba đều ghi, sẽ có ba sự thật. Nên một bản ghi có phiên bản, những module kia đọc và chất vấn.",
  },
  {
    id: "d2",
    klass: "inference",
    title: "Ba nơi hỏi thị trường đã định giá gì",
    body: "Expectation Engine, DCF ngược và Market Engine là ba kênh của một câu hỏi. Tách kênh là đúng. Tách thành ba kết luận là trùng.",
  },
  {
    id: "d3",
    klass: "inference",
    title: "Mười mục cảm biến dễ thành mười engine",
    body: "Tuyển dụng, dòng người, cung, cầu, web, tồn kho, vật lý, ngôn ngữ, KPI mất, bằng sáng chế là họ cảm biến. Chúng cần một sổ tín hiệu, không cần mười nguồn sự thật về cùng một công ty.",
  },
  {
    id: "d4",
    klass: "inference",
    title: "Bốn nơi có thể phát ra xác suất",
    body: "Probability, Scenario, Monte Carlo và Calibration dễ mỗi nơi một con số gọi là xác suất. Monte Carlo là tính toán có điều kiện. Kịch bản là cấu trúc. Calibration là điểm của sổ. Chỉ sổ cái được quyền giữ hậu nghiệm.",
  },
  {
    id: "d5",
    klass: "inference",
    title: "Kelly và danh mục",
    body: "Hai bộ não kích thước sẽ ra hai tỷ trọng. Kelly là một công thức đầu vào của một module kích thước, không phải một danh mục thứ hai.",
  },
  {
    id: "d6",
    klass: "inference",
    title: "Pháp y và chất lượng lợi nhuận",
    body: "Mục tài chính, chất lượng lợi nhuận và vai pháp y kiểm cùng một danh sách. Một danh sách kiểm, nhiều người đọc, một chỗ ghi cờ.",
  },
];

export const risks: Finding[] = [
  {
    id: "r1",
    klass: "hypothesis",
    title: "Độ chính xác giả của Monte Carlo",
    body: "P(giá trị hợp lý lớn hơn giá) trông như khoa học trong khi tăng trưởng và WACC là ý kiến. Nếu giao diện không dán câu có điều kiện lên chính con số, Owner sẽ nhớ con số và quên điều kiện.",
  },
  {
    id: "r2",
    klass: "hypothesis",
    title: "Mẫu báo cáo 22 mục tạo cảm giác đủ",
    body: "Biểu mẫu đầy có thể được điền cả khi giá trị thông tin thấp. Độ dài không phải chất lượng quyết định. Đây là trình diễn mà hiến chương đã cấm, sinh ra từ chính mẫu biểu.",
  },
  {
    id: "r3",
    klass: "hypothesis",
    title: "Năm vai trên một mô hình là một người đeo năm mặt nạ",
    body: "Nếu cùng trọng số, cùng kho văn bản, sai số sẽ tương quan. Phản biện chỉ có giá trị khi khác bằng chứng, khác thứ tự và khác phần thưởng. Chưa đo trên hệ thống này vì chưa có agent.",
  },
  {
    id: "r4",
    klass: "inference",
    title: "Hiệu ứng thứ tự",
    body: "A viết phe mua trước. Người đọc sau bám vào bản đó. Phe bán cần viết độc lập trước khi thấy kết luận của A, hoặc người phán xử không biết câu nào của vai nào cho đến lượt sau.",
  },
  {
    id: "r5",
    klass: "inference",
    title: "Phình phạm vi trước khi có vòng phản hồi",
    body: "Độ dài hiến chương là một rủi ro thực thi. Phase 5 có thể bắt đầu trước khi một thesis giấy nào được mổ. Nền không xong mà cảm biến đã chạy là thất bại của chính lộ trình.",
  },
  {
    id: "r6",
    klass: "inference",
    title: "Trượt từ dữ liệu công khai sang thông tin nội gián",
    body: "Dòng nhân sự và kênh nhà cung cấp có thể bước sang thông tin trọng yếu chưa công bố nếu nguồn là riêng tư. Cổng pháp lý phải đứng trước nghiên cứu, không đứng ở chú thích.",
  },
  {
    id: "r7",
    klass: "hypothesis",
    title: "Tương quan nhảy và thanh khoản biến mất cùng lúc",
    body: "LTCM, tháng 8/2007 và các đợt dash-for-cash cho thấy kịch bản stress trên giấy vẫn có thể quá hiền nếu đòn bẩy, tài trợ và tương quan được mô phỏng tách nhau.",
  },
];

export const assumptions: Finding[] = [
  {
    id: "a1",
    klass: "inference",
    title: "Trọng tâm ngầm là cổ phiếu có báo cáo",
    body: "Công thức thì rộng, lộ trình xây thì quy tụ về công ty. Lãi suất, tiền tệ và hàng hóa có thể chỉ còn là đoạn mở đầu của memo cổ phiếu.",
  },
  {
    id: "a2",
    klass: "hypothesis",
    title: "Đồ thị nhân quả biết được đủ để hành động",
    body: "Bắt buộc có cơ chế là đúng để chống tương quan giả. Bắt buộc phải vẽ được cơ chế có thể đẩy người dùng bịa cơ chế cho đủ ô.",
  },
  {
    id: "a3",
    klass: "inference",
    title: "Tỷ số hợp lý được giả định là biết",
    body: "Công thức tiên nghiệm sang hậu nghiệm đẹp khi likelihood biết được. Nhiều bằng chứng định tính không có tỷ số hợp lý đã nhận diện. Hệ thống phải cho phép ghi chưa biết, thay vì bịa một tỷ số.",
  },
  {
    id: "a4",
    klass: "hypothesis",
    title: "Khoảng kỳ vọng sẽ được thị trường công nhận trong chân trời của mình",
    body: "Thực tế trừ kỳ vọng chỉ thành lợi nhuận nếu khoảng đó đóng lại đúng cửa sổ, sau chi phí. Đúng mà sớm mười năm vẫn có thể là sai về sống còn.",
  },
  {
    id: "a5",
    klass: "inference",
    title: "Base rate ngoại có thể bị dùng như base rate nội",
    body: "Phần lớn sách và án lệ là thị trường Mỹ. Thị trường có tỷ trọng nhà đầu tư cá nhân cao, sở hữu tập trung và nhạy chính sách không kế thừa các tỷ lệ đó. Prior ngoại phải được ghi là ngoại.",
  },
  {
    id: "a6",
    klass: "hypothesis",
    title: "Regime nhận ra được lúc đang sống trong nó",
    body: "Regime trên sách sử thường rõ vì nhìn lại. Sai số phân loại thời gian thực phải nằm trong xác suất, không được giả định bằng không.",
  },
  {
    id: "a7",
    klass: "inference",
    title: "Người dùng dưới áp lực sẽ không đi đường tắt",
    body: "Một quy trình tuần không cạnh tranh được với một quyết định cần trong buổi sáng, trừ khi đường tắt cũng bị ghi lại như một ghi đè.",
  },
  {
    id: "a8",
    klass: "fact",
    title: "Hiến chương đã giả định sách là nền mà vẫn cảnh báo sách không phải sự thật",
    body: "Hai điều này cùng đúng chỉ nếu kệ sách không được chấm là tiến độ. Phase 1 hoàn thành khi có thư mục và giới hạn, không khi có cảm giác đã đọc.",
  },
];

export const overfit: Finding[] = [
  {
    id: "o1",
    klass: "fact",
    title: "Ngưỡng phễu tín hiệu là số minh họa",
    body: "10.000 xuống 1.500, 400, 150, 70, 30 rồi 10–20 không phải kết quả của một thử nghiệm trong dự án này. Nếu biến chúng thành hạn ngạch, chính hạn ngạch là một mô hình chưa kiểm.",
  },
  {
    id: "o2",
    klass: "inference",
    title: "Vũ trụ nhỏ, lịch sử gãy, nhiều giả thuyết",
    body: "Một thị trường ít mã, đứt gãy chế độ, và hàng nghìn cảm biến là môi trường kinh điển của kiểm định nhiều giả thuyết. Cần kế hoạch sai số theo họ giả thuyết, viết trước.",
  },
  {
    id: "o3",
    klass: "inference",
    title: "Tiêu chí hủy đặt sau khi đã thấy mã",
    body: "Kill criteria viết sau khi nhìn kết quả lịch sử của chính mã đó không phải xác nhận ngoài mẫu. Chúng phải được khóa trước, hoặc được ghi là hậu nghiệm.",
  },
  {
    id: "o4",
    klass: "inference",
    title: "Trung bình ensemble che bất đồng",
    body: "Nhiều mô hình sai cùng một hướng vẫn cho một trung bình trông chắc. Độ rộng giữa các mô hình là thông tin. Trung bình không được là đầu ra duy nhất.",
  },
  {
    id: "o5",
    klass: "inference",
    title: "Monte Carlo độc lập làm đuôi quá mỏng",
    body: "Tăng trưởng, biên và hệ số không độc lập trong suy thoái. Kéo độc lập rồi đem so với chương rủi ro đuôi là tự mâu thuẫn.",
  },
];

export const hallucinations: Finding[] = [
  {
    id: "h1",
    klass: "hypothesis",
    title: "Đồ thị kinh tế là nơi mô hình ngôn ngữ bịa đối tác",
    body: "Nhà cung cấp và khách hàng lớn là chi tiết mô hình có thể nói rất trôi. Luật: không cạnh nếu chưa có nguồn và ngày. Mặc định chưa xác minh.",
  },
  {
    id: "h2",
    klass: "inference",
    title: "Tóm tắt sách và án lệ dễ trôi",
    body: "Kệ nên giữ thư mục và giới hạn sử dụng, không giữ bài học được gán cho tác giả khi người viết bài học là mô hình.",
  },
  {
    id: "h3",
    klass: "hypothesis",
    title: "Trích ngôn ngữ bịa",
    body: "Phân tích trôi ngữ nghĩa sẽ bịa câu trích nếu không bắt buộc nguyên văn, ngày và mã tài liệu. Chưa xây engine này nên đây là rủi ro thiết kế, chưa phải sự cố đã gặp.",
  },
  {
    id: "h4",
    klass: "inference",
    title: "Xác suất văn xuôi",
    body: "Câu xác suất tăng từ 55% lên 64% mà không có tiên nghiệm, bằng chứng và tỷ số hợp lý là sự chặt chẽ giả. Nó nguy hiểm hơn một câu không có số.",
  },
  {
    id: "h5",
    klass: "hypothesis",
    title: "KPI biến mất vì không nằm trong cửa sổ ngữ cảnh",
    body: "Mô hình có thể kết luận một chỉ tiêu đã bị bỏ chỉ vì tài liệu đưa vào không chứa nó. Cần đối chiếu mục lục nhiều kỳ, không đối chiếu trí nhớ hội thoại.",
  },
];

export const falseConfidence: Finding[] = [
  {
    id: "f1",
    klass: "inference",
    title: "Nhãn HIGH nghe như một cảm giác",
    body: "HIGH, MEDIUM, LOW sẽ bị dùng như độ ấm của văn. Chúng chỉ có nghĩa nếu checklist nhìn thấy được và bị chặn khi thiếu dữ liệu.",
  },
  {
    id: "f2",
    klass: "fact",
    title: "Bản đồ module không phải hệ thống đang chạy",
    body: "Một sơ đồ đủ mười tầng tạo cảm giác engine đã có. Foundation V1 là học thuyết và dụng cụ. Mọi engine phải ghi chưa xây cho đến khi qua cổng.",
  },
  {
    id: "f3",
    klass: "fact",
    title: "Calibration chưa thể được chứng minh",
    body: "Chưa có dự báo nào đã phân giải trong hệ thống. Mọi xác suất ở phiên bản này đều chưa hiệu chỉnh. Nói khác đi là sai.",
  },
  {
    id: "f4",
    klass: "inference",
    title: "Báo cáo đủ mười lăm mục không phải quyết định tốt",
    body: "Thước cuối cùng của hiến chương là hiệu chỉnh, độ bền, lợi nhuận sau rủi ro, sụt giảm, chất lượng quyết định và sống sót. Không thước nào trong đó đo được ở Phase 0. Giao diện không được giả vờ đã đo.",
  },
];

export const proposals: {
  id: string;
  title: string;
  status: string;
  proposal: string;
  why: string;
  counter: string;
  compare: string;
  recommend: string;
}[] = [
  {
    id: "P1",
    title: "Khóa ủy thác hai vành",
    status: "Đã dựng, chờ Owner duyệt",
    proposal: "Vành trong: những gì được phép đưa vào nhật ký như ý định vốn, sau này. Vành ngoài: thực thể nước ngoài và biến vĩ mô chỉ để theo dõi cơ chế, không phải ứng viên vốn cho đến khi có nguồn và quy tắc riêng.",
    why: "Thiếu ủy thác là lỗ hổng g1 và g2. Không khóa thì mọi module sẽ phình.",
    counter: "Khóa sớm có thể làm mù các doanh nghiệp trong nước sống nhờ cầu và lãi suất bên ngoài.",
    compare: "Vành ngoài giữ được tầm nhìn thế giới mà không biến mọi thực thể thành một phiếu mua. Một vũ trụ mở không giới hạn thì mô hình dữ liệu gãy trước khi có bài học.",
    recommend: "Nên nhận, nhưng chỉ Owner khóa được tiền tệ, chân trời và danh sách vành. Kiến trúc sư không tự khóa.",
  },
  {
    id: "P2",
    title: "Một WorldState, nhiều người đọc",
    status: "Chờ Owner",
    proposal: "Gộp quyền ghi của thế giới, vĩ mô và regime thành một bản ghi có phiên bản. Các module khác được chất vấn, không được viết đè.",
    why: "Trùng d1. Ba sự thật về cùng một đường cong lãi suất sẽ không ai phát hiện.",
    counter: "Tách nhóm bắt được lỗi khác nhau. Một bản ghi có thể thành một điểm mù.",
    compare: "Giữ sự tách của người chất vấn. Bỏ sự tách của người ghi. Phản biện không đòi ba cơ sở dữ liệu.",
    recommend: "Nên nhận khi xây engine. Chưa gộp trong Foundation vì chưa có dữ liệu để ghi.",
  },
  {
    id: "P3",
    title: "Một sổ tín hiệu cho mọi họ cảm biến",
    status: "Chờ Owner",
    proposal: "Giữ đủ mười họ trong hiến chương, nhưng không xây mười engine. Tín hiệu chưa đăng ký giả thuyết thì không được chạm xác suất.",
    why: "Trùng d3 và rủi ro phình phạm vi.",
    counter: "Một sổ dễ thành ngăn kéo hỗn độn.",
    compare: "Schema cứng và cổng đăng ký chống ngăn kéo tốt hơn mười dashboard. Không xóa họ nào.",
    recommend: "Nên nhận lúc mở Phase 5. Bản đồ hiện vẫn liệt kê đủ họ, trạng thái chưa xây.",
  },
  {
    id: "P4",
    title: "Sổ xác suất thay cho xác suất trong văn",
    status: "Đã dựng, chờ Owner duyệt",
    proposal: "Mọi đổi xác suất là một dòng: tiên nghiệm, mã bằng chứng, tỷ số hợp lý hoặc chưa biết, hậu nghiệm, người ghi, thời điểm. Không số nếu không có dòng.",
    why: "Chống ảo giác h4 và trùng d4. Đây là cách đọc thẳng mục xác suất và mục trí nhớ của hiến chương.",
    counter: "Chậm. Có thể làm người dùng ngại cập nhật.",
    compare: "Chậm là cái giá của việc không bịa độ chặt chẽ. Một câu 64% không truy được còn tệ hơn không có câu.",
    recommend: "Đã dựng dụng cụ ở mức Foundation vì không dựng thì Phase 0 không có khung xác suất nào dùng được. Nếu Owner bác, các dòng cũ vẫn giữ, và có thể ngừng bắt buộc tỷ số hợp lý.",
  },
  {
    id: "P5",
    title: "Phản biện viết độc lập trước",
    status: "Chờ Owner",
    proposal: "Phe bán và pháp y không nhận bản kết luận của phe mua cho đến khi có bản riêng. Người phán xử thấy bất đồng trước khi thấy tên vai. Ghi rõ cùng một họ mô hình không phải năm chuyên gia.",
    why: "Rủi ro r3 và r4. Năm mặt nạ tạo tự tin giả đúng chỗ hiến chương muốn sự khiêm nhường.",
    counter: "Tranh luận tuần tự đôi khi đào sâu hơn viết bịt mắt.",
    compare: "Viết độc lập rồi mới tranh luận lấy được cả hai. Tranh luận từ đầu thì phe sau bám phe trước.",
    recommend: "Nên nhận như quy trình người thực hiện ngay. Chưa triển khai agent. Không xây năm chatbot ở Foundation.",
  },
  {
    id: "P6",
    title: "Điểm quy trình, không thay kết quả",
    status: "Đã dựng, chờ Owner duyệt",
    proposal: "Chấm hồ sơ lúc quyết định: dòng dõi, bằng chứng trái, tiêu chí hủy, base rate, trần kích thước. Không gọi điểm này là alpha.",
    why: "Vòng phản hồi của cổ phiếu quá chậm so với nhu cầu biết mình đang lệch, xem g7.",
    counter: "LTCM có quy trình mà vẫn gãy. Thờ quy trình là một kiểu tự tin giả khác.",
    compare: "Cần cả hai, không cái nào thay cái kia. Điểm quy trình chỉ để khỏi mất dấu trong lúc chờ kết cục.",
    recommend: "Đã gắn vào nhật ký như một dụng cụ của mục chất lượng quyết định, kèm câu nó không phải xác suất đúng.",
  },
  {
    id: "P7",
    title: "Cổng quyền dữ liệu trước nghiên cứu",
    status: "Đã dựng, chờ Owner duyệt",
    proposal: "Tín hiệu và claim không mang nhãn sự thật hoặc dữ liệu nếu chưa có nhãn công khai, có phép, hoặc cấm, và chưa khai không phải thông tin nội gián.",
    why: "Rủi ro r6. Hiến chương đã nói dữ liệu phải hợp pháp. Cổng này khiến câu đó không còn là khẩu hiệu.",
    counter: "Có thể chặn các nguồn xám mà một quỹ khác sẵn sàng dùng.",
    compare: "Sống còn pháp lý đi trước một tín hiệu chưa kiểm. Nới cổng là quyết định của Owner, không phải của mô hình.",
    recommend: "Đã thi hành ở mức claim trong quy trình. Chưa có bộ máy pháp chế.",
  },
  {
    id: "P8",
    title: "Bất đồng định giá là đầu ra",
    status: "Chờ Owner",
    proposal: "Ensemble báo trung vị và khoảng giữa các mô hình. Khoảng rộng thì trần độ tin cậy là MEDIUM dù câu chuyện hay.",
    why: "Overfitting o4 và nguyên tắc không một mô hình.",
    counter: "DCF gần như luôn rộng. Trần này có thể khóa HIGH gần như mọi hồ sơ.",
    compare: "Ở giai đoạn chưa hiệu chỉnh, khóa đó có lẽ là đúng chứ không phải là hỏng. Một giá mục tiêu đẹp là rủi ro, không phải tính năng.",
    recommend: "Nên nhận khi xây Phase 3. Chưa áp lên số vì chưa có engine định giá. Ô định giá trong quy trình cố ý không tự ra giá.",
  },
  {
    id: "P9",
    title: "Bỏ hạn ngạch số của phễu tín hiệu",
    status: "Đã dựng, chờ Owner duyệt",
    proposal: "Giữ hình phễu và các cổng: cơ chế, ngoài mẫu, regime, chi phí, sức chứa. Không ghi các con số 10.000 hay 10–20 thành luật.",
    why: "Các số đó là ví dụ trong hiến chương, không phải kết quả đo. Biến ví dụ thành quota là overfitting siêu hình.",
    counter: "Không có số thì khó biết khi nào một chương trình nghiên cứu đã quá tay.",
    compare: "Cổng định tính viết trước vẫn chặt hơn một quota trông khoa học. Có thể đặt ngân sách công sức mà không đặt số tín hiệu phải sống.",
    recommend: "Đã ghi trên trang tín hiệu rằng các số là minh họa. Không xóa hình phễu.",
  },
];

export const keptOnPurpose = [
  "Không biến hệ thống thành chatbot khuyến nghị mã.",
  "Không dự báo giá ngày mai và không ngôn ngữ chắc chắn.",
  "Tách sự thật, dữ liệu, suy luận, giả thuyết, dự báo, chưa xác minh.",
  "Không bịa số, không bịa nguồn, không giấu bằng chứng trái.",
  "Quyết định không phải hàm của ý kiến AI.",
  "Bốn kịch bản và lợi nhuận kỳ vọng, không một giá mục tiêu.",
  "Không Full Kelly.",
  "Sống sót trước lợi nhuận cực đại.",
  "Năm vai phản biện, bất đồng không bị xóa.",
  "Tiêu chí hủy viết trước.",
  "Tầng nguồn và toàn vẹn thời gian.",
  "Trí nhớ quyết định chống hồi tố.",
  "Owner giữ quyền cuối. Không triển khai vốn thật.",
  "Sách không bị đồng nhất với sự thật.",
  "Đa số tín hiệu phải được phép chết.",
];
