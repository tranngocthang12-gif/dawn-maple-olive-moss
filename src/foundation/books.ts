export type BookClass = "FOUNDATION" | "ADVANCED" | "COUNTERPOINT" | "HISTORICAL";

export type BookGroup =
  | "econ"
  | "macro"
  | "accounting"
  | "corporate"
  | "valuation"
  | "value"
  | "growth"
  | "portfolio"
  | "behavior"
  | "quant"
  | "crises"
  | "decision";

export type Book = {
  id: string;
  group: BookGroup;
  title: string;
  authors: string;
  year: string;
  klass: BookClass;
  limit: string;
};

export const groups: { id: BookGroup; name: string }[] = [
  { id: "econ", name: "Kinh tế học nền" },
  { id: "macro", name: "Vĩ mô và chu kỳ" },
  { id: "accounting", name: "Kế toán và báo cáo" },
  { id: "corporate", name: "Tài chính doanh nghiệp" },
  { id: "valuation", name: "Định giá" },
  { id: "value", name: "Đầu tư giá trị" },
  { id: "growth", name: "Tăng trưởng và chất lượng" },
  { id: "portfolio", name: "Danh mục" },
  { id: "behavior", name: "Tài chính hành vi" },
  { id: "quant", name: "Định lượng và rủi ro" },
  { id: "crises", name: "Khủng hoảng và lịch sử" },
  { id: "decision", name: "Ra quyết định" },
];

export const books: Book[] = [
  { id: "b01", group: "econ", title: "The Wealth of Nations", authors: "Adam Smith", year: "1776", klass: "HISTORICAL", limit: "Khung phân công và giá cả của một thời. Không phải mô hình thị trường hiện đại." },
  { id: "b02", group: "econ", title: "Principles of Economics", authors: "Alfred Marshall", year: "1890", klass: "HISTORICAL", limit: "Nền cận biên. Nhiều công cụ đã bị thay trong giảng dạy hôm nay." },
  { id: "b03", group: "econ", title: "The General Theory of Employment, Interest and Money", authors: "John Maynard Keynes", year: "1936", klass: "HISTORICAL", limit: "Viết trong đại khủng hoảng. Không đọc thành đơn thuốc cho mọi suy thoái." },
  { id: "b04", group: "econ", title: "Capitalism, Socialism and Democracy", authors: "Joseph Schumpeter", year: "1942", klass: "HISTORICAL", limit: "Phá hủy sáng tạo là một cơ chế, không phải một chiến lược mua tăng trưởng." },
  { id: "b05", group: "econ", title: "Individualism and Economic Order", authors: "F. A. Hayek", year: "1948", klass: "FOUNDATION", limit: "Bài về tri thức phân tán quan trọng hơn kết luận chính trị của tác giả." },
  { id: "b06", group: "econ", title: "The Firm, the Market and the Law", authors: "R. H. Coase", year: "1988", klass: "FOUNDATION", limit: "Chi phí giao dịch giải thích vì sao hãng tồn tại. Không đo được hào bằng một câu." },
  { id: "b07", group: "econ", title: "Institutions, Institutional Change and Economic Performance", authors: "Douglass North", year: "1990", klass: "FOUNDATION", limit: "Thể chế thay đổi chậm. Đừng rút một quý lợi nhuận từ một lý thuyết thể chế." },
  { id: "b08", group: "macro", title: "A Monetary History of the United States, 1867–1960", authors: "Milton Friedman, Anna Schwartz", year: "1963", klass: "FOUNDATION", limit: "Lịch sử tiền tệ Mỹ. Cơ chế không tự động đúng với một nền kinh tế khác thời." },
  { id: "b09", group: "macro", title: "Measuring Business Cycles", authors: "Arthur Burns, Wesley Mitchell", year: "1946", klass: "HISTORICAL", limit: "Đo chu kỳ chứ không hứa đoán đỉnh đáy theo thời gian thực." },
  { id: "b10", group: "macro", title: "Stabilizing an Unstable Economy", authors: "Hyman Minsky", year: "1986", klass: "ADVANCED", limit: "Giả thuyết bất ổn tài chính. Không phải lịch mua bán." },
  { id: "b11", group: "macro", title: "Essays on the Great Depression", authors: "Ben Bernanke", year: "2000", klass: "ADVANCED", limit: "Nghiên cứu tín dụng và khuếch đại. Tác giả sau này là người trong cuộc chính sách, đừng trộn hai vai." },
  { id: "b12", group: "macro", title: "The Holy Grail of Macroeconomics", authors: "Richard Koo", year: "2008", klass: "COUNTERPOINT", limit: "Suy thoái bảng cân đối từ kinh nghiệm Nhật. Không phải mọi suy thoái đều cùng kiểu." },
  { id: "b13", group: "macro", title: "This Time Is Different", authors: "Carmen Reinhart, Kenneth Rogoff", year: "2009", klass: "FOUNDATION", limit: "Lịch sử khủng hoảng nợ có ích. Một kết quả tăng trưởng-nợ sau này bị tranh cãi về dữ liệu. Không thần thánh hóa một ngưỡng." },
  { id: "b14", group: "macro", title: "The New Lombard Street", authors: "Perry Mehrling", year: "2010", klass: "ADVANCED", limit: "Nhìn hệ thống từ tạo lập thị trường tiền. Khó suy ra một định giá cổ phiếu." },
  { id: "b15", group: "macro", title: "Principles for Navigating Big Debt Crises", authors: "Ray Dalio", year: "2018", klass: "COUNTERPOINT", limit: "Khung của một nhà thực hành. Sơ đồ đẹp không phải khoa học đã đóng." },
  { id: "b16", group: "macro", title: "The Alchemy of Finance", authors: "George Soros", year: "1987", klass: "COUNTERPOINT", limit: "Phản thân là một thấu kính. Nhật ký giao dịch trong sách không phải hệ thống tái lập được." },
  { id: "b17", group: "macro", title: "Mastering the Market Cycle", authors: "Howard Marks", year: "2018", klass: "FOUNDATION", limit: "Chu kỳ như thái độ đối với rủi ro. Không cho một đồng hồ đếm." },
  { id: "b18", group: "accounting", title: "The Interpretation of Financial Statements", authors: "Benjamin Graham, Spencer Meredith", year: "1937", klass: "HISTORICAL", limit: "Báo cáo thời đó khác chuẩn hôm nay. Giữ tinh thần đọc số, không giữ mẫu biểu." },
  { id: "b19", group: "accounting", title: "Quality of Earnings", authors: "Thornton O'Glove", year: "1987", klass: "FOUNDATION", limit: "Các mánh lợi nhuận có thời hạn sử dụng. Kẻ gian cập nhật mánh." },
  { id: "b20", group: "accounting", title: "The Financial Numbers Game", authors: "Charles Mulford, Eugene Comiskey", year: "2002", klass: "FOUNDATION", limit: "Bản đồ quản trị lợi nhuận. Không kết luận gian lận từ một tỷ lệ." },
  { id: "b21", group: "accounting", title: "Financial Shenanigans", authors: "Howard Schilit, Jeremy Perler", year: "2018", klass: "FOUNDATION", limit: "Danh sách thủ thuật. Một cờ đỏ là giả thuyết, chưa phải án." },
  { id: "b22", group: "accounting", title: "Financial Statement Analysis and Security Valuation", authors: "Stephen Penman", year: "nhiều ấn bản", klass: "FOUNDATION", limit: "Nối kế toán với định giá. Giả định sạch của mô hình vẫn là giả định." },
  { id: "b23", group: "accounting", title: "Business Analysis and Valuation", authors: "Krishna Palepu, Paul Healy, Erik Peek", year: "nhiều ấn bản", klass: "FOUNDATION", limit: "Khung chiến lược cộng báo cáo. Phần chiến lược dễ bị viết thành chuyện." },
  { id: "b24", group: "accounting", title: "International Financial Statement Analysis", authors: "Thomas Robinson, Elaine Henry, Wendy Pirie, Michael Broihahn", year: "nhiều ấn bản", klass: "FOUNDATION", limit: "Giáo trình chuẩn mực. Hữu ích vì đa chế độ kế toán, không phải vì nó tìm ra alpha." },
  { id: "b25", group: "corporate", title: "Principles of Corporate Finance", authors: "Richard Brealey, Stewart Myers, Franklin Allen", year: "nhiều ấn bản", klass: "FOUNDATION", limit: "Giáo trình lõi. Thị trường hoàn hảo trong chương đầu không phải thế giới đang sống." },
  { id: "b26", group: "corporate", title: "Corporate Finance", authors: "Jonathan Berk, Peter DeMarzo", year: "nhiều ấn bản", klass: "FOUNDATION", limit: "Cùng truyền thống với Brealey. Đọc để thấy công cụ, không để lập lại một trường phái." },
  { id: "b27", group: "corporate", title: "Applied Corporate Finance", authors: "Aswath Damodaran", year: "nhiều ấn bản", klass: "FOUNDATION", limit: "Ứng dụng thực hành của một tác giả rất hiện diện. Đừng để một người thành cả ngành." },
  { id: "b28", group: "corporate", title: "The Theory of Corporate Finance", authors: "Jean Tirole", year: "2006", klass: "ADVANCED", limit: "Lý thuyết hợp đồng và quản trị. Không phải sổ tay định giá." },
  { id: "b29", group: "corporate", title: "Corporate Financial Distress, Restructuring, and Bankruptcy", authors: "Edward Altman, Edith Hotchkiss", year: "nhiều ấn bản", klass: "ADVANCED", limit: "Điểm tín dụng là mô hình. Tỷ lệ phá sản lịch sử không phải định mệnh của một tên." },
  { id: "b30", group: "valuation", title: "The Theory of Investment Value", authors: "John Burr Williams", year: "1938", klass: "HISTORICAL", limit: "Gốc cổ tức chiết khấu. Giả định dòng tiền và lãi suất là cả vấn đề." },
  { id: "b31", group: "valuation", title: "Investment Valuation", authors: "Aswath Damodaran", year: "nhiều ấn bản", klass: "FOUNDATION", limit: "Bách khoa phương pháp. Một chương không được phép thắng cả ensemble." },
  { id: "b32", group: "valuation", title: "Narrative and Numbers", authors: "Aswath Damodaran", year: "2017", klass: "ADVANCED", limit: "Câu chuyện phải cãi nhau với số. Câu chuyện hay không được nâng xác suất." },
  { id: "b33", group: "valuation", title: "Valuation: Measuring and Managing the Value of Companies", authors: "Tim Koller, Marc Goedhart, David Wessels", year: "nhiều ấn bản", klass: "FOUNDATION", limit: "DCF kiểu McKinsey. Rất nhạy với tăng trưởng cuối và vốn. Khoảng nhạy cảm quan trọng hơn một giá." },
  { id: "b34", group: "valuation", title: "Expectations Investing", authors: "Alfred Rappaport, Michael Mauboussin", year: "2001; sửa 2021", klass: "FOUNDATION", limit: "Đọc giá thành kỳ vọng. Đòi hỏi số sạch. Sai số kế toán làm méo kỳ vọng suy ra." },
  { id: "b35", group: "valuation", title: "Valuation for Mergers, Buyouts, and Restructuring", authors: "Enrique Arzac", year: "nhiều ấn bản", klass: "ADVANCED", limit: "Định giá giao dịch và đòn bẩy. Không chép hệ số mua lại sang một cổ phiếu thiểu số không kiểm soát." },
  { id: "b36", group: "valuation", title: "The Quest for Value", authors: "G. Bennett Stewart", year: "1991", klass: "ADVANCED", limit: "EVA là một ngôn ngữ lợi nhuận kinh tế. Điều chỉnh kế toán có thể thành nghệ thuật." },
  { id: "b37", group: "value", title: "Security Analysis", authors: "Benjamin Graham, David Dodd", year: "1934", klass: "HISTORICAL", limit: "Viết sau 1929. Biên an toàn còn sống. Nhiều quy tắc số không còn đúng môi trường." },
  { id: "b38", group: "value", title: "The Intelligent Investor", authors: "Benjamin Graham", year: "1949", klass: "FOUNDATION", limit: "Kỷ luật và ông thị trường. Các ví dụ định lượng cần được đặt lại vào thời của chúng." },
  { id: "b39", group: "value", title: "Margin of Safety", authors: "Seth Klarman", year: "1991", klass: "FOUNDATION", limit: "Sách hiếm không phải sách đúng hơn. Bối cảnh là một quỹ cụ thể, một thời thanh khoản." },
  { id: "b40", group: "value", title: "The Essays of Warren Buffett", authors: "Warren Buffett; biên tập Lawrence Cunningham", year: "nhiều ấn bản", klass: "FOUNDATION", limit: "Thư là nguồn sơ cấp của một người. Lời người biên tập là tầng khác. Sự nghiệp này không chép được bằng cách bắt chước câu chữ." },
  { id: "b41", group: "value", title: "Value Investing: From Graham to Buffett and Beyond", authors: "Bruce Greenwald và cộng sự", year: "nhiều ấn bản", klass: "FOUNDATION", limit: "Có khung tái sản xuất và tăng trưởng. Đừng rút mỗi phần dễ kể." },
  { id: "b42", group: "value", title: "The Most Important Thing", authors: "Howard Marks", year: "2011", klass: "FOUNDATION", limit: "Chu kỳ tâm lý và giá. Ít công thức. Dễ bị đọc thành châm ngôn." },
  { id: "b43", group: "value", title: "Value Investing", authors: "James Montier", year: "2009", klass: "ADVANCED", limit: "Gắn giá trị với sai lệch hành vi. Bằng chứng định lượng trong sách có hạn dùng." },
  { id: "b44", group: "value", title: "The Aggressive Conservative Investor", authors: "Martin Whitman, Martin Shubik", year: "1979", klass: "ADVANCED", limit: "Nhìn từ bảng cân đối và kiểm soát. Khác Graham đại chúng. Không phải trường phái duy nhất còn thiếu." },
  { id: "b45", group: "value", title: "Contrarian Investment Strategies", authors: "David Dreman", year: "nhiều ấn bản", klass: "FOUNDATION", limit: "Mua cái bị ghét có giai đoạn dài đau. Công bố chiến lược làm nó đông hơn." },
  { id: "b46", group: "value", title: "The Little Book That Still Beats the Market", authors: "Joel Greenblatt", year: "nhiều ấn bản", klass: "COUNTERPOINT", limit: "Công thức công bố là ứng viên cho suy giảm và đông đúc. Đọc như một phản ví dụ về cái gì xảy ra sau khi một mẹo được in." },
  { id: "b47", group: "growth", title: "Common Stocks and Uncommon Profits", authors: "Philip Fisher", year: "1958", klass: "FOUNDATION", limit: "Scuttlebutt đòi nguồn. Lời đồn không nguồn vẫn là chưa xác minh." },
  { id: "b48", group: "growth", title: "One Up on Wall Street", authors: "Peter Lynch", year: "1989", klass: "FOUNDATION", limit: "Truyện cửa hàng dễ thành ảo giác am hiểu. Một sản phẩm mình thích không phải một luận điểm." },
  { id: "b49", group: "growth", title: "Competitive Strategy", authors: "Michael Porter", year: "1980", klass: "FOUNDATION", limit: "Năm lực lượng là bản đồ, không phải đo hào. Ngành đổi thì bản đồ cũ." },
  { id: "b50", group: "growth", title: "Competitive Advantage", authors: "Michael Porter", year: "1985", klass: "FOUNDATION", limit: "Chuỗi giá trị hữu ích khi có số. Không có số thì chỉ là sơ đồ." },
  { id: "b51", group: "growth", title: "7 Powers", authors: "Hamilton Helmer", year: "2016", klass: "ADVANCED", limit: "Bảy dạng quyền lực định giá. Dễ gán nhãn cho công ty mình thích." },
  { id: "b52", group: "growth", title: "The Little Book That Builds Wealth", authors: "Pat Dorsey", year: "2008", klass: "FOUNDATION", limit: "Hào kinh tế viết cho độc giả rộng. Ngắn nên dễ bị dùng thay cho báo cáo." },
  { id: "b53", group: "growth", title: "Quality Investing", authors: "Lawrence Cunningham, Torkell Eide, Patrick Hargreaves", year: "2016", klass: "ADVANCED", limit: "Thư của một nhà đầu tư chất lượng. Một quỹ không phải một quy luật." },
  { id: "b54", group: "growth", title: "Investing for Growth", authors: "Terry Smith", year: "2020", klass: "ADVANCED", limit: "Tuyển thư hàng năm. Kết quả một giai đoạn không chứng minh phương pháp ở regime sau." },
  { id: "b55", group: "growth", title: "The Innovator's Dilemma", authors: "Clayton Christensen", year: "1997", klass: "FOUNDATION", limit: "Hào có thể chết vì thứ lúc đầu tệ hơn. Lý thuyết này cũng đã bị tranh luận về bằng chứng." },
  { id: "b56", group: "growth", title: "The End of Competitive Advantage", authors: "Rita Gunther McGrath", year: "2013", klass: "COUNTERPOINT", limit: "Đối trọng với ý tưởng hào bền. Không suy ra rằng không có lợi thế nào kéo dài." },
  { id: "b57", group: "growth", title: "Good to Great", authors: "Jim Collins", year: "2001", klass: "COUNTERPOINT", limit: "Chọn công ty đã thắng rồi mới tìm phẩm chất. Một số tên trong danh sách sau đó sa sút. Đọc như bài học về thiên lệch sống sót." },
  { id: "b58", group: "portfolio", title: "Portfolio Selection", authors: "Harry Markowitz", year: "1959", klass: "HISTORICAL", limit: "Đa dạng hóa có cơ sở. Đầu vào kỳ vọng và hiệp phương sai rất nhiễu. Tối ưu hóa ngây thơ phóng đại sai số." },
  { id: "b59", group: "portfolio", title: "Active Portfolio Management", authors: "Richard Grinold, Ronald Kahn", year: "nhiều ấn bản", klass: "FOUNDATION", limit: "Luật cơ bản về bề rộng và hệ số thông tin. Hệ số thông tin lịch sử dễ bị nhồi." },
  { id: "b60", group: "portfolio", title: "Expected Returns", authors: "Antti Ilmanen", year: "2011", klass: "FOUNDATION", limit: "Các nguồn lợi nhuận kỳ vọng qua tài sản. Ước lượng không phải lời hứa của thập kỷ tới." },
  { id: "b61", group: "portfolio", title: "Pioneering Portfolio Management", authors: "David Swensen", year: "nhiều ấn bản", klass: "FOUNDATION", limit: "Quỹ đại học có chân trời, dòng tiền và cửa tiếp cận khác một cá nhân. Đừng chép phân bổ." },
  { id: "b62", group: "portfolio", title: "Efficient Asset Management", authors: "Richard Michaud, Robert Michaud", year: "nhiều ấn bản", klass: "ADVANCED", limit: "Phê bình tối ưu hóa trung bình-phương sai ngây thơ. Bản thân resampling cũng là một mô hình." },
  { id: "b63", group: "portfolio", title: "Asset Management: A Systematic Approach to Factor Investing", authors: "Andrew Ang", year: "2014", klass: "ADVANCED", limit: "Yếu tố có bằng chứng dài và có giai đoạn đông, định nghĩa lại, chi phí ăn hết." },
  { id: "b64", group: "behavior", title: "Thinking, Fast and Slow", authors: "Daniel Kahneman", year: "2011", klass: "FOUNDATION", limit: "Một số hiệu ứng sao y yếu hơn chương trình gốc. Không biến mọi quyết định thành một danh sách thiên lệch." },
  { id: "b65", group: "behavior", title: "Judgment Under Uncertainty: Heuristics and Biases", authors: "Daniel Kahneman, Paul Slovic, Amos Tversky (biên tập)", year: "1982", klass: "HISTORICAL", limit: "Nguồn của chương trình thiên lệch. Đọc kèm các phê bình sau này về cỡ hiệu ứng." },
  { id: "b66", group: "behavior", title: "Misbehaving", authors: "Richard Thaler", year: "2015", klass: "FOUNDATION", limit: "Lịch sử đưa tâm lý vào kinh tế. Không phải một mô hình định giá." },
  { id: "b67", group: "behavior", title: "Irrational Exuberance", authors: "Robert Shiller", year: "2000", klass: "FOUNDATION", limit: "Định giá và câu chuyện xã hội. Đúng về một bong bóng không cho thời điểm thoát." },
  { id: "b68", group: "behavior", title: "Behavioural Investing", authors: "James Montier", year: "2007", klass: "ADVANCED", limit: "Ứng dụng thực hành. Một số mẹo đã thành folklore và vì thế bớt sắc." },
  { id: "b69", group: "behavior", title: "The Success Equation", authors: "Michael Mauboussin", year: "2012", klass: "FOUNDATION", limit: "Tách kỹ năng và may. Hữu ích cho mổ sau cuộc. Không đo được kỹ năng bằng một vụ." },
  { id: "b70", group: "behavior", title: "Risk Savvy", authors: "Gerd Gigerenzer", year: "2014", klass: "COUNTERPOINT", limit: "Đối trọng với cách kể rằng con người hầu như không thể quyết định. Heuristic đơn đôi khi bền hơn mô hình thừa tham số." },
  { id: "b71", group: "quant", title: "Fooled by Randomness", authors: "Nassim Nicholas Taleb", year: "2001", klass: "FOUNDATION", limit: "May mắn giả dạng kỹ năng. Giọng văn không phải một hệ thống giao dịch." },
  { id: "b72", group: "quant", title: "The Black Swan", authors: "Nassim Nicholas Taleb", year: "2007", klass: "FOUNDATION", limit: "Đuôi dày và khiêm nhường mô hình. Dễ bị đọc thành lý do để không đo gì cả." },
  { id: "b73", group: "quant", title: "The (Mis)Behavior of Markets", authors: "Benoit Mandelbrot, Richard Hudson", year: "2004", klass: "ADVANCED", limit: "Phê phán giả định chuẩn. Không tự nó cho một danh mục." },
  { id: "b74", group: "quant", title: "A Man for All Markets", authors: "Edward Thorp", year: "2017", klass: "FOUNDATION", limit: "Hồi ký về lợi thế và Kelly. Lợi thế của tác giả không có sẵn trên kệ sách." },
  { id: "b75", group: "quant", title: "Fortune's Formula", authors: "William Poundstone", year: "2005", klass: "FOUNDATION", limit: "Lịch sử Kelly. Full Kelly trên xác suất ước lượng là cách làm mình vỡ." },
  { id: "b76", group: "quant", title: "Advances in Financial Machine Learning", authors: "Marcos López de Prado", year: "2018", klass: "ADVANCED", limit: "Cảnh báo rò rỉ, nhãn và overfitting. Cuốn sách không tiêm phòng cho một backtest xấu." },
  { id: "b77", group: "quant", title: "Inside the Black Box", authors: "Rishi Narang", year: "nhiều ấn bản", klass: "FOUNDATION", limit: "Bản đồ quỹ hệ thống nhìn từ ngoài. Không chứa bí mật của một quỹ cụ thể." },
  { id: "b78", group: "quant", title: "Evidence-Based Technical Analysis", authors: "David Aronson", year: "2007", klass: "COUNTERPOINT", limit: "Đòi hỏi thống kê cho phân tích kỹ thuật và cho thấy phần lớn quy tắc không sống. Cũng là lời cảnh báo cho mọi mẹo có vẻ định lượng." },
  { id: "b79", group: "quant", title: "Adaptive Markets", authors: "Andrew Lo", year: "2017", klass: "ADVANCED", limit: "Thị trường như hệ thích nghi. Một ẩn dụ hay có thể bị kéo quá sức giải thích." },
  { id: "b80", group: "quant", title: "Asset Pricing", authors: "John Cochrane", year: "2001; sửa sau", klass: "ADVANCED", limit: "Lý thuyết giá tài sản. Không đọc lướt thành một tín hiệu giao dịch." },
  { id: "b81", group: "quant", title: "Efficiently Inefficient", authors: "Lasse Heje Pedersen", year: "2015", klass: "ADVANCED", limit: "Các chiến lược nổi tiếng sau khi đã được kể thường bớt chỗ trống. Sức chứa và chi phí là một phần của lợi thế." },
  { id: "b82", group: "quant", title: "Quantitative Risk Management", authors: "Alexander McNeil, Rüdiger Frey, Paul Embrechts", year: "nhiều ấn bản", klass: "ADVANCED", limit: "Công cụ đuôi và phụ thuộc. Đòi hỏi dữ liệu và sự khiêm nhường về mô hình copula." },
  { id: "b83", group: "crises", title: "Manias, Panics, and Crashes", authors: "Charles Kindleberger, Robert Aliber", year: "nhiều ấn bản", klass: "FOUNDATION", limit: "Mẫu khủng hoảng lặp hình dạng, không lặp lịch." },
  { id: "b84", group: "crises", title: "The Great Crash 1929", authors: "John Kenneth Galbraith", year: "1955", klass: "HISTORICAL", limit: "Văn kể của một nhà kinh tế. Đối chiếu số với nguồn sơ cấp trước khi dùng một chi tiết." },
  { id: "b85", group: "crises", title: "Devil Take the Hindmost", authors: "Edward Chancellor", year: "1999", klass: "FOUNDATION", limit: "Lịch sử đầu cơ. Sự tương tự lịch sử dễ bị lạm dụng để đặt tên cho hiện tại." },
  { id: "b86", group: "crises", title: "When Genius Failed", authors: "Roger Lowenstein", year: "2000", klass: "FOUNDATION", limit: "LTCM qua báo chí sách. Cơ chế đòn bẩy và thanh khoản là bài học. Con số chi tiết cần hồ sơ gốc nếu đem vào mô hình." },
  { id: "b87", group: "crises", title: "A Demon of Our Own Design", authors: "Richard Bookstaber", year: "2007", klass: "ADVANCED", limit: "Phức tạp và chặt chẽ trong hệ thống thị trường. Viết sát khủng hoảng, không phải lời tiên tri hoàn hảo." },
  { id: "b88", group: "crises", title: "The Crisis of Crowding", authors: "Ludwig Chincarini", year: "2012", klass: "ADVANCED", limit: "LTCM, cuộc khủng hoảng lượng hóa 2007 và chỗ đông. Dùng như bản đồ cơ chế, không như bảng lỗ lãi đã kiểm toán." },
  { id: "b89", group: "crises", title: "The Man Who Solved the Market", authors: "Gregory Zuckerman", year: "2019", klass: "HISTORICAL", limit: "Báo chí về Renaissance. Không chứa hệ thống tái lập được. Mọi con số lợi nhuận lưu hành không được nhập khi chưa có nguồn sơ cấp." },
  { id: "b90", group: "crises", title: "More Money Than God", authors: "Sebastian Mallaby", year: "2010", klass: "HISTORICAL", limit: "Lịch sử quỹ từ bên ngoài. Thành công được kể nhiều hơn quỹ đã chết." },
  { id: "b91", group: "crises", title: "Lords of Finance", authors: "Liaquat Ahamed", year: "2009", klass: "HISTORICAL", limit: "Tiền tệ giữa hai cuộc chiến qua chân dung người. Đừng rút một quy tắc lãi suất hôm nay từ một chương." },
  { id: "b92", group: "crises", title: "The Financial Crisis Inquiry Report", authors: "Financial Crisis Inquiry Commission", year: "2011", klass: "FOUNDATION", limit: "Báo cáo chính thức có tranh luận nội bộ và ý kiến thiểu số. Đọc cả phần bất đồng, đúng tinh thần không xóa phe kia." },
  { id: "b93", group: "decision", title: "Expert Political Judgment", authors: "Philip Tetlock", year: "2005", klass: "ADVANCED", limit: "Chuyên gia kém hơn họ tưởng, và kém hơn những quy tắc đơn giản trong nhiều việc. Đo bằng hiệu chỉnh, không bằng sự nổi tiếng." },
  { id: "b94", group: "decision", title: "Superforecasting", authors: "Philip Tetlock, Dan Gardner", year: "2015", klass: "FOUNDATION", limit: "Dự báo xác suất có thể luyện ở một số lĩnh vực. Không chứng minh một người đoán được giá cổ phiếu tuần sau." },
  { id: "b95", group: "decision", title: "How to Measure Anything", authors: "Douglas Hubbard", year: "2007", klass: "FOUNDATION", limit: "Giá trị thông tin trước khi thu thập. Dễ bị biến thành lý do đo mọi thứ." },
  { id: "b96", group: "decision", title: "The Book of Why", authors: "Judea Pearl, Dana Mackenzie", year: "2018", klass: "ADVANCED", limit: "Nhân quả không phải tương quan. Một mũi tên vẽ tay chưa phải một đồ thị đã nhận diện." },
  { id: "b97", group: "decision", title: "Against the Gods", authors: "Peter Bernstein", year: "1996", klass: "FOUNDATION", limit: "Lịch sử ý tưởng về rủi ro, viết rất trôi. Sự trôi không phải độ chính xác của từng giai thoại." },
  { id: "b98", group: "decision", title: "Poor Charlie's Almanack", authors: "Charles Munger; biên tập Peter Kaufman", year: "2005", klass: "FOUNDATION", limit: "Các bài nói. Mô hình tinh thần là danh sách nhắc, không phải máy ra quyết định." },
  { id: "b99", group: "decision", title: "Winning the Loser's Game", authors: "Charles Ellis", year: "nhiều ấn bản", klass: "FOUNDATION", limit: "Phần lớn người chơi tích cực thua sau chi phí. Không chứng minh rằng không tồn tại lợi thế. Nó nâng chuẩn bằng chứng." },
  { id: "b100", group: "decision", title: "Thinking in Bets", authors: "Annie Duke", year: "2018", klass: "FOUNDATION", limit: "Tách chất lượng quyết định khỏi kết quả. Một ẩn dụ poker không phải một công thức vị thế." },
];
