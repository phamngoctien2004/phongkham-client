import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'sonner';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './NewsDetailPage.css';

const NewsDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        serviceType: '',
        note: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Dữ liệu các bài viết - sau này có thể load từ API
    const articles = {
        1: {
            id: 1,
            title: 'Nam thanh niên đau vai đi khám phát hiện đột quỵ',
            date: '09/11/2025',
            author: 'Ban Biên tập',
            consultant: 'BSCKI. Bùi Thị Cẩm Bình',
            category: 'Nội khoa',
            image: '/news-1.1.jpg',
            intro: 'Đột quỵ không còn là bệnh lý chỉ gặp ở người lớn tuổi, thực tế cho thấy, ngày càng có nhiều trường hợp người trẻ gặp phải tình trạng nguy hiểm này, thậm chí để lại di chứng nặng nề nếu không được phát hiện và xử trí kịp thời. Trường hợp của anh K., 27 tuổi đến Phòng khám đa khoa Thái Hà khám là ví dụ điển hình, đi khám chỉ với dấu hiệu đau vai đơn giản, nhưng đi khám anh phát hiện mắc đột quỵ nguy hiểm.',
            relatedArticles: [
                { title: 'Những lưu ý khi cấp cứu đột quỵ tại chỗ', date: '30/11/2023' },
                { title: 'FAST đột quỵ - Phương pháp nhận diện sớm đột quỵ để tăng cơ hội sống sót', date: '27/08/2025' },
                { title: 'Tầm soát đột quỵ bao nhiêu tiền? Thực hiện bằng phương pháp nào?', date: '05/11/2025' }
            ]
        },
        2: {
            id: 2,
            title: 'Trẻ bị nóng đầu, chân tay nóng: Nguyên nhân và cách chăm sóc hiệu quả',
            date: '07/11/2025',
            author: 'Ban Biên tập',
            consultant: 'ThS.BS Trần Thị Kim Ngọc',
            category: 'Nhi khoa',
            image: '/news-2.1.jpg',
            intro: 'Nhiều bậc phụ huynh lo lắng khi thấy trẻ bị nóng đầu, chân tay nóng, đi kèm các biểu hiện khó chịu như quấy khóc, mệt mỏi hay mất ngủ. Đây có thể là dấu hiệu phản ánh cơ thể trẻ đang gặp vấn đề về nhiệt độ, tuần hoàn hoặc một số rối loạn sức khỏe khác. Bài viết dưới đây sẽ giúp cha mẹ tìm hiểu nguyên nhân, nhận biết các dấu hiệu và áp dụng cách chăm sóc hiệu quả để bảo vệ sức khỏe trẻ một cách an toàn.',
            relatedArticles: [
                { title: 'Cách điều trị sốt xuất huyết tại nhà và một số lưu ý quan trọng', date: '21/10/2025' },
                { title: 'Phân biệt sốt siêu vi và sốt xuất huyết chuẩn xác qua các dấu hiệu đặc trưng', date: '21/10/2025' },
                { title: 'Trẻ bị sốt và đau bụng quanh rốn là bệnh gì? Cần xử lý như thế nào?', date: '28/10/2025' }
            ]
        },
        3: {
            id: 3,
            title: 'Trẻ bị ngã đập đầu phía trước có sao không? Hướng dẫn xử trí an toàn',
            date: '09/11/2025',
            author: 'Ban Biên tập',
            consultant: 'ThS.BS Trần Thị Kim Ngọc',
            category: 'Nhi khoa',
            image: '/news-3.1.jpg',
            intro: 'Ngã là tai nạn thường gặp ở trẻ nhỏ, đặc biệt trong giai đoạn tập bò, tập đi hay vui chơi hiếu động. Tuy nhiên, trẻ bị ngã đập đầu phía trước luôn khiến cha mẹ hoang mang, lo sợ vì đầu là vị trí chứa não bộ - cơ quan trung ương điều khiển toàn bộ hoạt động của cơ thể. Vậy, trẻ bị ngã đập đầu phía trước có sao không, khi nào cần đưa đi viện và cách xử trí thế nào cho đúng?',
            relatedArticles: [
                { title: 'Trẻ bị ngã đập đầu phía trước có sao không? Cần xử lý như thế nào?', date: '15/09/2025' },
                { title: 'Trẻ bị ngã đập đầu phía sau​ có nguy hiểm không? Xử trí sao để đảm bảo an toàn?', date: '07/10/2025' }
            ]
        },
        4: {
            id: 4,
            title: 'Phổi bò có ăn được không? Giá trị dinh dưỡng và những lưu ý khi sử dụng',
            date: '07/11/2025',
            author: 'Ban Biên tập',
            consultant: 'BS Phạm Thị Nhi',
            category: 'Dinh dưỡng',
            image: '/news-4.1.png',
            intro: 'Phổi bò là một loại nội tạng động vật quen thuộc, thường xuất hiện trong nhiều món ăn dân dã của người Việt. Với kết cấu xốp, mềm và dễ thấm gia vị, phổi của bò có thể được chế biến thành nhiều món ngon như xào, hấp hay nướng. Tuy nhiên, không ít người vẫn thắc mắc phổi bò có ăn được không, liệu ăn có tốt cho sức khỏe hay tiềm ẩn rủi ro gì.',
            relatedArticles: [
                { title: 'Ăn hạt mít có béo không? Tìm hiểu về giá trị dinh dưỡng của hạt mít!', date: '03/10/2024' },
                { title: 'Ăn nho có béo không? Tìm hiểu về thành phần dinh dưỡng và lợi ích của nho!', date: '12/10/2024' },
                { title: 'Giải đáp về dinh dưỡng: Ăn dưa hấu có béo không?', date: '16/10/2024' },
                { title: 'Chia sẻ dinh dưỡng: Các loại rau tốt cho mẹ sau sinh mổ', date: '17/07/2025' },
                { title: 'Top các loại trái cây giàu dinh dưỡng nên bổ sung vào chế độ ăn hàng ngày', date: '08/10/2025' }
            ]
        }
    };

    // Lấy bài viết theo ID
    const article = articles[id] || articles[1];

    // Danh sách tin tức mới nhất cho sidebar
    const latestNews = [
        {
            id: 1,
            title: 'Nam thanh niên đau vai đi khám phát hiện đột quỵ',
            date: 'Thứ Hai, 10 tháng 11, 2025',
            image: '/news-1.1.jpg',
            excerpt: 'Đột quỵ không còn là bệnh lý chỉ gặp ở người lớn tuổi, thực tế cho thấy, ngay cảng...'
        },
        {
            id: 2,
            title: 'Trẻ bị nóng đầu, chân tay nóng: Nguyên nhân và cách chăm sóc hiệu quả',
            date: 'Thứ Bảy, 7 tháng 11, 2025',
            image: '/news-2.1.jpg',
            excerpt: 'Nhiều bậc phụ huynh lo lắng khi thấy trẻ bị nóng đầu, chân tay nóng, đi kèm các biểu hiện khó chịu như quấy khóc, mệt mỏi hay mất ngủ...'
        },
        {
            id: 3,
            title: 'Trẻ bị ngã đập đầu phía trước có sao không? Hướng dẫn xử trí an toàn',
            date: 'Chủ Nhật, 9 tháng 11, 2025',
            image: '/news-3.1.jpg',
            excerpt: 'Ngã là tai nạn thường gặp ở trẻ nhỏ, đặc biệt trong giai đoạn tập bò, tập đi...'
        },
        {
            id: 4,
            title: 'Phổi bò có ăn được không? Giá trị dinh dưỡng và những lưu ý khi sử dụng',
            date: 'Thứ Năm, 7 tháng 11, 2025',
            image: '/news-4.1.png',
            excerpt: 'Phổi bò là một loại nội tạng động vật quen thuộc, thường xuất hiện trong nhiều món ăn dân dã của người Việt...'
        }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.name || !formData.phone) {
            toast.error('Vui lòng nhập đầy đủ họ tên và số điện thoại');
            return;
        }

        try {
            setIsSubmitting(true);
            // Giả lập gọi API
            await new Promise(resolve => setTimeout(resolve, 1000));

            toast.success('Đăng ký thành công! Chúng tôi sẽ liên hệ với bạn sớm.');

            // Reset form
            setFormData({
                name: '',
                phone: '',
                email: '',
                serviceType: '',
                note: ''
            });
        } catch (error) {
            toast.error('Đăng ký thất bại. Vui lòng thử lại sau.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Render nội dung bài viết theo ID
    const renderArticleContent = () => {
        if (id === '2') {
            return (
                <>
                    <section className="content-section">
                        <h2>1. Trẻ bị nóng đầu, chân tay nóng là do đâu?</h2>
                        <p>
                            Khi trẻ bị nóng đầu, chân tay nóng, nhiều phụ huynh thường lo lắng và tự hỏi nguyên nhân từ đâu. Tuy nhiên tình trạng này nếu không kèm da tăng thân nhiệt quá cao đến ngưỡng sốt, tức nhiệt độ cơ thể bình thường thì được coi là sinh lý bình thường của cơ thể.
                        </p>
                        <p>
                            Cha mẹ cần xác định trẻ có sốt hay không, nếu trẻ kèm theo sốt thì đây là phản ứng của cơ thể chống lại các tác nhân gây viêm. Tuy nhiên, tình trạng này nếu không kèm da tăng thân nhiệt quá cao đến ngưỡng sốt, tức nhiệt độ cơ thể bình thường thì được coi là sinh lý bình thường của cơ thể.
                        </p>

                        <div className="article-image">
                            <img src="/news-2.1.jpg" alt="Sốt hoặc nhiễm trùng" />
                            <p className="image-caption">Sốt hoặc nhiễm trùng có thể là nguyên nhân khiến trẻ bị nóng đầu, chân tay nóng</p>
                        </div>

                        <ul>
                            <li><strong>Tuần hoàn máu kém hoặc rối loạn nhiệt độ cơ thể:</strong> Hệ tuần hoàn chưa hoàn thiện ở trẻ nhỏ đôi khi khiến máu dồn lên đầu, tay hoặc chân nhiều hơn bình thường, gây cảm giác nóng bức ở những vùng này. Nguyên nhân này thường gặp ở trẻ sơ sinh hoặc trẻ dưới 1 tuổi;</li>
                            <li><strong>Tăng chuyển hóa hoặc chế độ ăn uống chưa hợp lý:</strong> Trẻ ăn quá nhiều thực phẩm giàu đạm, đồ chiên rán, đồ cay nóng, hoặc uống nhiều sữa công thức có thể gây tăng nhiệt cơ thể, dẫn đến nóng đầu, nóng tay chân. Thêm vào đó, việc mặc quần áo quá dày hoặc môi trường nhiệt độ cao cũng làm trẻ dễ bị nóng đầu, chân tay, đặc biệt là trong mùa hè hoặc phòng điều hòa quá cao.</li>
                        </ul>
                    </section>

                    <section className="content-section">
                        <h2>2. Cha mẹ cần làm gì khi trẻ bị nóng đầu, chân tay nóng</h2>
                        <p>
                            Khi trẻ bị nóng đầu, chân tay nóng, cha mẹ không nên chủ quan. Dù đây có thể là hiện tượng sinh lý bình thường, nhưng cũng có thể là dấu hiệu cảnh báo trẻ đang bị sốt, nhiễm trùng hoặc rối loạn chuyển hóa. Việc chăm sóc kịp thời và đúng cách sẽ giúp trẻ cảm thấy dễ chịu hơn và giảm nguy cơ biến chứng với hướng dẫn chi tiết như sau:
                        </p>

                        <ul>
                            <li><strong>Theo dõi nhiệt độ cơ thể:</strong> Cha mẹ nên dùng nhiệt kế để kiểm tra thân nhiệt của trẻ, đặc biệt khi trẻ có biểu hiện quấy khóc, mệt mỏi hoặc kém ăn. Nếu nhiệt độ trên 38°C, cần áp dụng các biện pháp hạ sốt và liên hệ bác sĩ để được tư vấn điều trị phù hợp;</li>
                        </ul>

                        <div className="article-image">
                            <img src="/news-2.2.jpg" alt="Theo dõi nhiệt độ" />
                            <p className="image-caption">Cha mẹ cần theo dõi nhiệt độ cơ thể của trẻ một cách chặt chẽ</p>
                        </div>

                        <ul>
                            <li><strong>Điều chỉnh môi trường xung quanh trẻ:</strong> Đảm bảo phòng ở thoáng mát, nhiệt độ vừa phải, không quá nóng hay quá lạnh. Tránh cho trẻ mặc quần áo quá dày, thay vào đó nên chọn trang phục nhẹ, thoáng khí để cơ thể trẻ dễ thoát nhiệt. Việc giữ môi trường mát mẻ giúp giảm cảm giác nóng đầu, tay chân và làm trẻ cảm thấy dễ chịu hơn;</li>
                            <li><strong>Bổ sung nước và chế độ dinh dưỡng hợp lý:</strong> Trẻ bị nóng đầu, chân tay nóng thường mất nước nhanh hơn, vì vậy cần cho trẻ uống đủ nước, sữa hoặc các dung dịch oresol nếu cần. Chế độ ăn nên nhẹ nhàng, dễ tiêu hóa, ưu tiên các loại rau xanh, trái cây tươi và tránh đồ chiên rán, cay nóng;</li>
                            <li><strong>Áp dụng các biện pháp hạ nhiệt tại chỗ:</strong> Ví dụ, lau người trẻ bằng nước ấm, đặc biệt là vùng trán, nách, bẹn để giúp cơ thể thoát nhiệt, giảm cảm giác nóng. Tuyệt đối không dùng nước lạnh hoặc đá trực tiếp vì có thể gây sốc nhiệt, co mạch và làm trẻ khó chịu hơn.</li>
                        </ul>

                        <p>
                            Trong trường hợp trẻ có các dấu hiệu bất thường như: sốt cao liên tục, nôn mửa, quấy khóc dữ dội, co giật hoặc lừ đừ, cha mẹ cần đưa trẻ đến cơ sở y tế ngay lập tức. Việc phát hiện sớm nguyên nhân sẽ giúp bác sĩ xử lý kịp thời, tránh các biến chứng nguy hiểm.
                        </p>
                    </section>

                    <section className="content-section">
                        <h2>3. Những câu hỏi phổ biến khi trẻ bị nóng đầu, chân tay nóng</h2>
                        <p>
                            Khi trẻ xuất hiện tình trạng nóng đầu, chân tay nóng, nhiều bậc cha mẹ thường lo lắng và đặt ra vô số câu hỏi để tìm hiểu nguyên nhân và cách chăm sóc phù hợp. Việc nắm rõ các thắc mắc phổ biến sẽ giúp cha mẹ có hướng xử lý đúng đắn, giảm bớt lo lắng và chăm sóc trẻ hiệu quả hơn. Dưới đây là những câu hỏi thường gặp nhất:
                        </p>

                        <h3>Có cần dùng thuốc hạ sốt hay các loại thuốc khác không?</h3>
                        <p>
                            Cha mẹ tuyệt đối không tự ý dùng thuốc nếu chưa có chỉ định từ bác sĩ. Việc sử dụng thuốc sai liều, sai loại có thể che lấp triệu chứng hoặc gây tác dụng phụ, làm tình trạng bệnh của trẻ trở nên nguy hiểm hơn.
                        </p>

                        <div className="article-image">
                            <img src="/news-2.3.webp" alt="Không tự ý dùng thuốc" />
                            <p className="image-caption">Cha mẹ tuyệt đối không tự ý sử dụng thuốc hạ sốt hay các loại thuốc khác</p>
                        </div>

                        <h3>Có nên dùng các phương pháp dân gian hoặc lá thảo mát để hạ nhiệt cho trẻ không?</h3>
                        <p>
                            Nhiều cha mẹ thường dùng lá dứa, lá khế, nước mát… để hạ nhiệt cho trẻ. Các phương pháp này có thể hỗ trợ trong trường hợp trẻ chỉ nóng nhẹ. Tuy nhiên, nếu trẻ sốt cao hoặc xuất hiện các triệu chứng nguy hiểm, không nên phụ thuộc vào biện pháp dân gian mà cần đưa trẻ đến cơ sở y tế.
                        </p>

                        <h3>Có nên cho trẻ uống nước lạnh khi bị nóng đầu, chân tay nóng không?</h3>
                        <p>
                            Uống nước mát hoặc nước lọc bình thường là tốt, nhưng không nên cho trẻ uống nước quá lạnh hoặc đá trực tiếp vì có thể ảnh hưởng đến tiêu hóa, gây đau bụng hoặc co thắt dạ dày.
                        </p>

                        <div className="highlight-box">
                            <p>
                                Hy vọng những thông tin được trình bày trên đây đã giúp cha mẹ hiểu rõ về tình trạng trẻ bị nóng đầu, chân tay nóng bao gồm nguyên nhân và hướng xử trí phù hợp. Nếu có thêm thắc mắc cần giải đáp hoặc nhu cầu thăm khám sức khỏe cho trẻ, cha mẹ vui lòng liên hệ tới Hệ thống Y tế Thái Hà qua Tổng đài 1900 56 56 56 để được tư vấn và hỗ trợ kịp thời.
                            </p>
                        </div>
                    </section>
                </>
            );
        }

        if (id === '3') {
            return (
                <>
                    <section className="content-section">
                        <h2>1. Trẻ bị ngã đập đầu phía trước có sao không?</h2>
                        <p>
                            Phía trước đầu, đặc biệt là vùng trán, là nơi trẻ dễ bị chấn thương nhất khi ngã. Trong giai đoạn từ 1-3 tuổi, đầu trẻ chiếm tỷ lệ lớn so với cơ thể, khiến trọng tâm cao và dễ mất thăng bằng. Khi ngã, phản xạ chống đỡ chưa hoàn thiện khiến trẻ thường đập đầu hoặc trán xuống đất trước tiên. Mặc dù vùng trán có cấu trúc xương dày và khá cứng, giúp bảo vệ tốt não bộ, nhưng nếu va đập mạnh hoặc sai tư thế, nguy cơ tổn thương bên trong vẫn có thể xảy ra.
                        </p>
                        <p>
                            Mức độ nguy hiểm khi trẻ ngã đập đầu phía trước phụ thuộc vào lực va chạm cũng như mức độ tổn thương thực tế mà trẻ phải chịu. Cha mẹ có thể dựa vào hai dạng chấn thương đầu thường gặp như sau:
                        </p>

                        <h3>Chấn thương phần mềm</h3>
                        <p>
                            Đây là dạng chấn thương nhẹ, thường xảy ra khi trẻ chỉ va đập nhẹ vào vùng trán. Bé có thể bị trầy xước da, sưng tấy hoặc bầm tím tại chỗ nhưng không ảnh hưởng nghiêm trọng đến não bộ. Trong trường hợp này, trẻ có thể hơi khó chịu, quấy khóc, đau vùng tổn thương song vẫn tỉnh táo, ăn ngủ và vui chơi bình thường.
                        </p>

                        <div className="article-image">
                            <img src="/news-3.2.jpg" alt="Chấn thương phần mềm" />
                            <p className="image-caption">Trẻ bị ngã đập đầu phía trước có thể bị chấn thương phần mềm</p>
                        </div>

                        <h3>Chấn thương sọ não</h3>
                        <p>
                            Tình trạng này xuất hiện khi lực va đập mạnh hơn, có thể gây tổn thương sâu đến cấu trúc xương sọ hoặc não bộ. Trẻ thường có biểu hiện đau đầu dữ dội, nôn ói nhiều lần, quấy khóc không dứt, thậm chí rối loạn ý thức, co giật. Đây là dấu hiệu cảnh báo nguy cơ Chấn thương sọ não, cần được đưa đến cơ sở y tế để thăm khám và theo dõi kịp thời.
                        </p>
                    </section>

                    <section className="content-section">
                        <h2>2. Cha mẹ cần làm gì khi trẻ bị ngã đập đầu phía trước?</h2>
                        <p>
                            Dù chấn thương đầu của trẻ ở mức độ nhẹ hay nặng, việc xử lý đúng cách ngay trong những phút đầu tiên đóng vai trò cực kỳ quan trọng, giúp giảm thiểu biến chứng và hỗ trợ quá trình chẩn đoán - điều trị sau này. Khi phát hiện trẻ bị ngã đập đầu phía trước, cha mẹ nên bình tĩnh thực hiện theo các bước sau:
                        </p>

                        <h3>Sơ cứu ban đầu cho trẻ</h3>
                        <ul>
                            <li>Cha mẹ cần giữ bình tĩnh và nhanh chóng đưa trẻ ra khỏi các vị trí nguy hiểm (cầu thang, nền cứng, góc bàn,...). Nếu trẻ vẫn tỉnh táo, nên để bé nằm yên ở tư thế thoải mái và tránh tác động hoặc di chuyển đầu, cổ quá nhiều;</li>
                            <li>Sử dụng túi chườm lạnh hoặc khăn sạch bọc đá lạnh, áp nhẹ lên khu vực sưng trong khoảng 10-15 phút. Biện pháp này giúp giảm đau, co mạch, hạn chế sưng nề và tụ máu dưới da;</li>
                            <li>Nếu vùng trán hoặc đầu bị trầy xước, chảy máu, hãy nhẹ nhàng rửa sạch bằng nước muối sinh lý. Sau đó, dùng gạc vô trùng băng lại để tránh nhiễm khuẩn.</li>
                        </ul>

                        <h3>Theo dõi sát trong 48 giờ sau chấn thương</h3>
                        <ul>
                            <li><strong>Quan sát hành vi và ý thức của trẻ:</strong> Quan sát xem trẻ có giữ được sự tỉnh táo, nhận biết được người xung quanh và giao tiếp bình thường hay không. Nếu bé có biểu hiện ngủ nhiều, phản ứng chậm, sợ ánh sáng, sợ tiếng động hoặc khó chịu bất thường, cần đặc biệt lưu ý;</li>
                            <li><strong>Theo dõi thể trạng:</strong> Ghi nhận tần suất và mức độ nôn ói, than đau đầu, chóng mặt hoặc quấy khóc kéo dài;</li>
                            <li><strong>Chế độ sinh hoạt:</strong> Cho trẻ nghỉ ngơi hoàn toàn, tránh các hoạt động mạnh hoặc chơi điện tử, xem tivi quá lâu.</li>
                        </ul>

                        <h3>Đưa trẻ đi khám ngay khi có biểu hiện bất thường</h3>
                        <p>
                            Không phải mọi chấn thương đầu đều biểu hiện rõ ngay sau cú ngã. Vì vậy, nếu trong quá trình theo dõi, cha mẹ nhận thấy bất kỳ dấu hiệu lạ nào dưới đây, cần đưa trẻ đến bệnh viện càng sớm càng tốt:
                        </p>

                        <h4>Dấu hiệu liên quan đến nhận thức và hành vi</h4>
                        <ul>
                            <li>Trẻ ngủ li bì, khó đánh thức, mất ý thức hoặc phản ứng chậm;</li>
                            <li>Lú lẫn, không nhận ra người quen, trả lời sai hoặc không đáp lại khi được gọi;</li>
                            <li>Quấy khóc không dừng, cáu gắt hoặc ngược lại uể oải, thờ ơ khác thường.</li>
                        </ul>

                        <div className="article-image">
                            <img src="/news-3.3.webp" alt="Ngủ li bì" />
                            <p className="image-caption">Cha mẹ cần đặc biệt thận trọng nếu trẻ có tình trạng ngủ li bì, khó đánh thức sau ngã</p>
                        </div>

                        <h4>Biểu hiện thể chất</h4>
                        <p>Cơn đau đầu nghiêm trọng, kéo dài và không giảm bớt dù đã nghỉ ngơi.</p>

                        <h4>Biểu hiện thần kinh</h4>
                        <ul>
                            <li>Nôn nhiều lần, xảy ra bất thường, không liên quan đến việc ăn uống hay tiêu hóa;</li>
                            <li>Hoa mắt, mất thăng bằng, bước đi không vững;</li>
                            <li>Co giật tay chân hoặc toàn thân;</li>
                            <li>Mắt nhìn lác;</li>
                            <li>Trẻ mờ mắt, thị lực ảnh hưởng;</li>
                            <li>Yếu liệt tay chân.</li>
                        </ul>

                        <h4>Biểu hiện xuất huyết hoặc tổn thương nặng</h4>
                        <ul>
                            <li>Máu hoặc dịch chảy ra từ mũi, tai;</li>
                            <li>Xuất hiện vết bầm lan rộng quanh mắt hoặc sau tai - dấu hiệu đặc trưng của gãy nền sọ.</li>
                        </ul>
                    </section>

                    <section className="content-section">
                        <h2>3. Giải đáp một số thắc mắc của ba mẹ khi trẻ bị ngã đập đầu phía trước</h2>
                        <p>
                            Dưới đây là một số câu hỏi thường gặp khi trẻ bị ngã đập đầu phía trước:
                        </p>

                        <h3>Hành động cần tránh khi trẻ bị ngã đập đầu phía trước?</h3>
                        <p>
                            Thay vì hành động vội vàng, cha mẹ cần giữ bình tĩnh, đặt trẻ nằm yên trên mặt phẳng, quan sát biểu hiện và sơ cứu đúng cách. Việc xử lý đúng ngay từ đầu sẽ giúp giảm rủi ro và hỗ trợ bác sĩ trong chẩn đoán, điều trị sau này.
                        </p>

                        <h3>Có nên bôi dầu gió lên vết thương khi trẻ bị ngã đập đầu?</h3>
                        <p>
                            Nhiều phụ huynh vẫn giữ thói quen bôi dầu gió, cao xoa hoặc rượu thuốc lên vùng đầu bị va đập với hy vọng giúp tan bầm, giảm đau. Thực tế, dầu gió và các loại cao xoa có thể gây kích ứng da, bỏng rát hoặc làm che mờ các dấu hiệu sưng nề, bầm tím, khiến cha mẹ khó nhận biết mức độ chấn thương thực sự.
                        </p>

                        <div className="highlight-box">
                            <p>
                                Tóm lại, khi trẻ bị ngã đập đầu phía trước, cha mẹ tuyệt đối không được chủ quan. Dù nhiều trường hợp chỉ là Chấn thương phần mềm nhẹ, nhưng vẫn cần theo dõi sát sao ít để kịp thời phát hiện dấu hiệu bất thường. Xử trí đúng và kịp thời là yếu tố then chốt giúp hạn chế tối đa nguy cơ chấn thương sọ não hay biến chứng nguy hiểm. Nếu cha mẹ có thắc mắc liên quan cần giải đáp hoặc nhu cầu thăm khám sức khỏe của trẻ, vui lòng liên hệ tới Hệ thống Y tế Thái Hà qua Tổng đài 1900 56 56 56 để được hỗ trợ kịp thời.
                            </p>
                        </div>
                    </section>
                </>
            );
        }

        if (id === '4') {
            return (
                <>
                    <section className="content-section">
                        <h2>1. Giá trị dinh dưỡng của phổi bò</h2>
                        <p>
                            Phổi bò là nguồn cung cấp protein dồi dào – một dưỡng chất thiết yếu giúp xây dựng và sửa chữa các mô cơ bắp, duy trì sự khỏe mạnh của da, móng, tóc cũng như hỗ trợ nhiều chức năng sinh lý trong cơ thể.
                        </p>
                        <p>
                            Ngoài protein, phổi bò còn chứa nhiều vitamin quan trọng như vitamin A - tốt cho thị lực và sức đề kháng, vitamin B12 - cần thiết cho hệ thần kinh và quá trình tạo hồng cầu, cùng nhiều khoáng chất như sắt, kẽm, photpho giúp cơ thể hoạt động ổn định.
                        </p>

                        <div className="article-image">
                            <img src="/news-4.2.png" alt="Giá trị dinh dưỡng phổi bò" />
                            <p className="image-caption">Phổi bò chứa nhiều vitamin, khoáng chất và protein có lợi cho sức khỏe</p>
                        </div>
                    </section>

                    <section className="content-section">
                        <h2>2. Phổi bò có ăn được không?</h2>
                        <p>
                            Câu trả lời là hoàn toàn có thể ăn được, miễn là phổi bò có nguồn gốc rõ ràng, được vệ sinh sạch sẽ và chế biến đúng cách. Tuy nhiên, không phải ai cũng nên sử dụng loại thực phẩm này.
                        </p>

                        <h3>Đối tượng nên ăn phổi bò</h3>
                        <ul>
                            <li><strong>Người thiếu máu do thiếu sắt:</strong> Phổi bò chứa hàm lượng sắt heme cao, giúp cơ thể hấp thu tốt hơn sắt non - heme từ thực vật, từ đó hỗ trợ tăng sản xuất hồng cầu và cải thiện tình trạng thiếu máu.</li>
                            <li><strong>Trẻ em trong giai đoạn phát triển:</strong> Lượng protein, vitamin A, vitamin B12 và khoáng chất dồi dào trong phổi bò có thể giúp trẻ tăng cường miễn dịch, hỗ trợ quá trình phát triển xương và cơ bắp.</li>
                            <li><strong>Người luyện tập thể thao:</strong> Protein giúp xây dựng và sửa chữa cơ bắp, phục hồi nhanh sau tập luyện. Hàm lượng sắt và kẽm cũng góp phần tăng cường sức bền, năng lượng cho vận động viên.</li>
                        </ul>

                        <div className="article-image">
                            <img src="/news-4.3.jpg" alt="Đối tượng nên ăn phổi bò" />
                            <p className="image-caption">Phổi bò phù hợp với nhiều đối tượng như người thiếu máu, trẻ em</p>
                        </div>

                        <h3>Đối tượng không nên ăn phổi bò</h3>
                        <ul>
                            <li><strong>Người mắc bệnh gút:</strong> Phổi bò thuộc nhóm thực phẩm có hàm lượng purine cao. Khi ăn nhiều, cơ thể chuyển hóa purine thành acid uric, gây tích tụ và làm bùng phát hoặc trầm trọng hóa triệu chứng gút.</li>
                            <li><strong>Người có mỡ máu cao:</strong> Mặc dù chất béo trong phổi bò không quá cao, lượng cholesterol lại tương đối lớn. Người mắc bệnh mỡ máu cao, tim mạch hoặc có nguy cơ xơ vữa động mạch nên hạn chế.</li>
                            <li><strong>Người có bệnh lý thận:</strong> Ở người bị suy thận, việc lọc và thải chất cặn bã trong cơ thể kém hơn bình thường. Nếu ăn nhiều protein từ phổi bò, gánh nặng lên thận càng tăng cao.</li>
                        </ul>
                    </section>

                    <section className="content-section">
                        <h2>3. Cách sơ chế và chế biến phổi bò</h2>
                        <p>
                            Sơ chế phổi bò đúng cách là bước quan trọng nhất để loại bỏ mùi hôi, các tạp chất bên trong và đảm bảo món ăn thơm ngon, an toàn. Dưới đây là quy trình sơ chế phổi bò cơ bản:
                        </p>

                        <h3>Bước 1: Làm sạch bên ngoài</h3>
                        <p>
                            Sau khi mua phổi bò về, rửa qua với nước sạch để loại bỏ bụi bẩn bám bên ngoài. Loại bỏ các phần mỡ hoặc phế quản to, màng phủ nếu có.
                        </p>

                        <h3>Bước 2: Ép nước ra khỏi phổi</h3>
                        <p>
                            Dùng tay ấn nhẹ lên bề mặt phổi bò để đẩy nước, chất nhầy bên trong ra ngoài. Bạn có thể thực hiện nhiều lần cho đến khi nước chảy ra trong và ít bọt.
                        </p>

                        <h3>Bước 3: Ngâm muối, giấm hoặc chanh</h3>
                        <p>
                            Trộn đều muối (khoảng 2 thìa cà phê), giấm hoặc nước chanh tươi vào nước, sau đó ngâm phổi bò trong khoảng 15-20 phút. Chất acid từ giấm hoặc chanh sẽ giúp khử mùi hôi, làm mềm cơ phổi và diệt khuẩn tự nhiên.
                        </p>

                        <h3>Bước 4: Luộc sơ</h3>
                        <p>
                            Cho phổi bò vào nồi nước sôi, thêm ít gừng tươi hoặc hành tím đập dập, luộc khoảng 5-10 phút rồi vớt ra. Nước luộc lần đầu nên đổ bỏ vì có thể còn tạp chất và mùi hôi.
                        </p>
                    </section>

                    <section className="content-section">
                        <h2>4. Lưu ý khi sử dụng phổi bò</h2>
                        <p>
                            Để đảm bảo an toàn và tận dụng tối đa giá trị dinh dưỡng, người tiêu dùng cần lưu ý một số điều quan trọng:
                        </p>
                        <ul>
                            <li><strong>Chọn nguồn gốc rõ ràng:</strong> Ưu tiên mua phổi bò tươi từ các cơ sở có giấy tờ kiểm dịch, đảm bảo vệ sinh an toàn thực phẩm.</li>
                            <li><strong>Sơ chế kỹ lưỡng:</strong> Không nên bỏ qua bước ngâm muối, giấm hoặc luộc sơ để khử mùi hôi và diệt vi khuẩn.</li>
                            <li><strong>Chế biến chín kỹ:</strong> Nhiệt độ cao khi nấu nướng sẽ tiêu diệt các vi khuẩn, ký sinh trùng có thể còn tồn tại trong phổi bò.</li>
                            <li><strong>Không ăn quá nhiều:</strong> Mặc dù giàu dinh dưỡng, phổi bò vẫn chứa hàm lượng cholesterol và purine khá cao. Người bình thường nên ăn tối đa 1-2 lần/tuần.</li>
                        </ul>

                        <div className="highlight-box">
                            <p>
                                Phổi bò là một loại thực phẩm giàu dinh dưỡng nếu được sơ chế và chế biến đúng cách. Tuy nhiên, cần lưu ý đối tượng sử dụng và tần suất ăn để đảm bảo an toàn cho sức khỏe. Nếu có thắc mắc liên quan đến dinh dưỡng, vui lòng liên hệ Hệ thống Y tế Thái Hà qua Tổng đài 1900 56 56 56 để được tư vấn.
                            </p>
                        </div>
                    </section>
                </>
            );
        }

        // Mặc định: Bài viết số 1
        return (
            <>
                <section className="content-section">
                    <h2>Bất ngờ phát hiện đột quỵ từ dấu hiệu đau vai</h2>
                    <p>
                        Anh L.M.K (27 tuổi, ở TP. HCM) đến Phòng khám Đa khoa Thái Hà khám với lý do đau vai.
                    </p>
                    <p>
                        Anh K. cho biết: Thời gian gần đây anh không rõ có từng mắc Covid-19 hay không, cũng chưa thực hiện các xét nghiệm chuyên sâu như điện tim (ECG), xét nghiệm đông máu, D DIMER và các bệnh lý đông máu di truyền.
                    </p>
                    <p>
                        Trong quá trình thăm khám, BSCKI. Bùi Thị Cẩm Bình - Nội khoa, Phòng khám Đa khoa Thái Hà ghi nhận, bệnh nhân yếu sụi bên vai phải, góc vận động hạn chế, không dơ được tay lên cao (góc nâng vai {'<'} 90 độ), cơ lực tay phải giảm nhẹ, sức cơ 4/5, liệt nhẹ mặt phải. Ngoài ra, bệnh nhân không đau đầu, không muốn ói, không nói khó.
                    </p>

                    <div className="article-image">
                        <img src="/news-1.2.jpg" alt="Chụp MSCT" />
                        <p className="image-caption">Chụp MSCT không thể thiếu trong các trường hợp chẩn đoán chuyên sâu</p>
                    </div>

                    <p>
                        Bác sĩ Bình chia sẻ: Khi đến khám, anh K. khăng khăng nghĩ rằng mình chỉ bị tổn thương cơ - xương - khớp vùng vai. Tuy nhiên, với kinh nghiệm và sự nhạy bén trong khám lâm sàng của mình, bác sĩ nghi ngờ vấn đề không nằm ở khớp vai mà có thể bắt nguồn từ hệ thần kinh trung ương nên tư vấn bệnh nhân chụp MSCT sọ não. Dù bệnh nhân không đồng ý chụp MSCT sọ não và muốn tiếp tục điều trị đau vai, bác sĩ vẫn đề nghị thực hiện song song: Siêu âm, chụp X-quang khớp vai và chụp MSCT sọ não.
                    </p>

                    <p>
                        Kết quả siêu âm, chụp X-quang khớp vai hoàn toàn bình thường, không có dấu hiệu tổn thương phần mềm hay cấu trúc xương khớp.
                    </p>

                    <p>
                        Bác sĩ tiếp tục giải thích, động viên và bệnh nhân đã đồng ý chụp MSCT sọ não. Kết quả chụp MSCT sọ não có hình ảnh ổ giảm tỷ trọng nhu mô não trán trái. Theo dõi nhồi máu não.
                    </p>

                    <p>Trước diễn biến bất thường, bác sĩ lập tức chuyển bệnh nhân lên tuyến trên chụp MRI sọ não và mạch máu não ghi nhận:</p>

                    <ul>
                        <li>Hình ảnh nhồi máu não dạng mảng, vài nốt rải rác ở trán - đỉnh - chẩn và ổ nhỏ ở cạnh sừng chẩm não thất bên bên trái.</li>
                        <li>Hẹp nặng đoạn cuối động mạch cảnh trong trái, đoạn gốc động mạch não giữa trái.</li>
                    </ul>

                    <p>
                        Từ đó, bệnh nhân được chẩn đoán xác định nhồi máu não do hẹp nặng động mạch não bán cầu trái.
                    </p>
                </section>

                <section className="content-section">
                    <h2>Tại sao đột quỵ lại nguy hiểm?</h2>
                    <p>
                        Theo bác sĩ Bình, đột quỵ (hay còn gọi là tai biến mạch máu não) là tình trạng não bộ bị tổn thương do dòng máu cung cấp cho não bị gián đoạn hoặc giảm sút nghiêm trọng. Điều này có thể xảy ra do tắc nghẽn mạch máu (còn gọi là đột quỵ nhồi máu não) hoặc vỡ mạch máu (còn gọi là đột quỵ xuất huyết não).
                    </p>

                    <div className="article-image">
                        <img src="/news-1.3.jpg" alt="Đột quỵ" />
                        <p className="image-caption">Đột quỵ là tình trạng não bộ bị tổn thương do dòng máu cung cấp cho não bị gián đoạn</p>
                    </div>

                    <p>
                        Đột quỵ là một trong những nguyên nhân gây tử vong hàng đầu, ngày càng trẻ hóa và gia tăng. Theo các số liệu thống kê, tại Việt Nam, đột quỵ ở người trẻ tuổi có xu hướng gia tăng đáng báo động (khoảng 25% các ca đột quỵ).
                    </p>

                    <p>
                        Là một cấp cứu y tế nghiêm trọng, đột quỵ có thể dẫn đến tử vong hoặc các di chứng tàn tật vĩnh viễn.
                    </p>

                    <p>
                        Bác sĩ Bình lưu ý, việc phát hiện, cấp cứu kịp thời, can thiệp sớm ở bệnh nhân đột quỵ là rất quan trọng, giúp cứu sống bệnh nhân và giảm thiểu di chứng (với thời gian vàng khoảng 6 giờ).
                    </p>
                </section>
            </>
        );
    }

    return (
        <div className="news-detail-page">
            <Header />
            <main className="main">
                <div className="container">
                    <div className="news-detail-layout">
                        {/* Main Content */}
                        <div className="news-detail-main">
                            <div className="news-detail-container">
                                {/* Breadcrumb */}
                                <nav className="breadcrumb-nav">
                                    <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
                                        <i className="bi bi-house-door"></i> Trang chủ
                                    </a>
                                    <span className="separator">/</span>
                                    <a href="/news" onClick={(e) => { e.preventDefault(); navigate('/news'); }}>
                                        Tin tức y khoa
                                    </a>
                                    <span className="separator">/</span>
                                    <span className="current">{article.title}</span>
                                </nav>

                                {/* Article Header */}
                                <article className="article-detail">
                                    <header className="article-header">
                                        <div className="article-category">{article.category}</div>
                                        <h1 className="article-title">{article.title}</h1>
                                        <div className="article-metadata">
                                            <span className="metadata-item">
                                                <i className="bi bi-calendar3"></i>
                                                {article.date}
                                            </span>
                                            <span className="metadata-item">
                                                <i className="bi bi-person"></i>
                                                {article.author}
                                            </span>
                                            <span className="metadata-item">
                                                <i className="bi bi-person-badge"></i>
                                                Tham vấn: {article.consultant}
                                            </span>
                                        </div>
                                    </header>

                                    {/* Article Intro */}
                                    <div className="article-intro">
                                        <p>{article.intro}</p>
                                    </div>

                                    {/* Related Articles Box */}
                                    <div className="related-box">
                                        <div className="related-box-title">Bài viết liên quan:</div>
                                        <ul className="related-list">
                                            {article.relatedArticles.map((related, index) => (
                                                <li key={index}>
                                                    <span className="related-date">{related.date}</span> | {related.title}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Article Content */}
                                    <div className="article-content">
                                        {renderArticleContent()}
                                    </div>

                                    {/* Article Footer */}
                                    <footer className="article-footer">
                                        <div className="article-tags">
                                            <i className="bi bi-tags"></i>
                                            <a href="#" className="tag">Đột quỵ</a>
                                            <a href="#" className="tag">Nội khoa</a>
                                            <a href="#" className="tag">Sức khỏe</a>
                                        </div>

                                        <div className="article-share">
                                            <span>Chia sẻ:</span>
                                            <a href="#" className="share-btn facebook">
                                                <i className="bi bi-facebook"></i>
                                            </a>
                                            <a href="#" className="share-btn twitter">
                                                <i className="bi bi-twitter"></i>
                                            </a>
                                            <a href="#" className="share-btn linkedin">
                                                <i className="bi bi-linkedin"></i>
                                            </a>
                                        </div>
                                    </footer>
                                </article>

                                {/* Back Button
                        <div className="back-to-list">
                            <button onClick={() => navigate('/news')} className="btn-back-news">
                                <i className="bi bi-arrow-left"></i>
                                Quay lại danh sách tin tức
                            </button>
                        </div> */}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <aside className="news-detail-sidebar">
                            {/* Hotline Box */}
                            {/* <div className="sidebar-box hotline-box">
                                <div className="hotline-icon">
                                    <i className="bi bi-telephone-fill"></i>
                                </div>
                                <div className="hotline-content">
                                    <h3>Hotline</h3>
                                    <a href="tel:1900565565" className="hotline-number">1900565565</a>
                                    <p className="hotline-text">
                                        Liên hệ ngay với số hotline của Phòng khám đa khoa Thái Hà để được hỗ trợ và sử dụng các dịch vụ khám, chữa bệnh hiện đại & cao cấp nhất.
                                    </p>
                                    <a href="/lien-he" className="btn-contact-hotline">
                                        Liên hệ với chúng tôi
                                    </a>
                                </div>
                            </div> */}

                            {/* Registration Form */}
                            <div className="sidebar-box registration-box">
                                <h3 className="registration-title">Đăng ký khám và tư vấn</h3>
                                <form onSubmit={handleSubmit} className="registration-form">
                                    <div className="form-group">
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="Họ và tên *"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="Số điện thoại *"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="Email *"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <select
                                            name="serviceType"
                                            value={formData.serviceType}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Chọn hình thức khám</option>
                                            <option value="kham-tong-quat">Khám tổng quát</option>
                                            <option value="kham-chuyen-khoa">Khám chuyên khoa</option>
                                            <option value="xet-nghiem">Xét nghiệm</option>
                                            <option value="chan-doan-hinh-anh">Chẩn đoán hình ảnh</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <textarea
                                            name="note"
                                            value={formData.note}
                                            onChange={handleInputChange}
                                            placeholder="Nhu cầu khám của bạn là gì? *"
                                            rows="4"
                                        ></textarea>
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn-register-submit"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Đang gửi...' : 'Đăng ký'}
                                    </button>
                                </form>
                            </div>

                            {/* Latest News */}
                            <div className="sidebar-box latest-news-box">
                                <h3 className="latest-news-title">
                                    Tin tức mới nhất
                                    <a href="/news" className="view-all-link">Xem thêm</a>
                                </h3>
                                <div className="latest-news-list">
                                    {latestNews.map((news) => (
                                        <div
                                            key={news.id}
                                            className="latest-news-item"
                                            onClick={() => navigate(`/news/${news.id}`)}
                                        >
                                            <div className="news-item-image">
                                                <img src={news.image} alt={news.title} />
                                            </div>
                                            <div className="news-item-content">
                                                <div className="news-item-date">
                                                    <i className="bi bi-clock"></i> {news.date}
                                                </div>
                                                <h4 className="news-item-title">{news.title}</h4>
                                                <p className="news-item-excerpt">{news.excerpt}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </main>
            <Footer />

            {/* Scroll to top */}
            <a
                href="#"
                className="scroll-top d-flex align-items-center justify-content-center"
                onClick={(e) => {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
            >
                <i className="bi bi-arrow-up-short"></i>
            </a>
        </div>
    );
};

export default NewsDetailPage;
