import { FaUserFriends, FaPenFancy, FaComments, FaUsers } from "react-icons/fa";
import "./Social.css";

const Social = () => (
  <div className="social-wrapper">
    <div className="social-header">
      <h3 className="social-title">Mạng xã hội đọc sách</h3>
      <p className="social-subtitle">
        Kết nối, chia sẻ và khám phá cùng cộng đồng độc giả
      </p>
    </div>

    <div className="social-actions">
      <button className="social-action">
        <FaPenFancy /> Viết bài / Đánh giá
      </button>
      <button className="social-action">
        <FaUserFriends /> Theo dõi bạn đọc
      </button>
      <button className="social-action">
        <FaUsers /> Tạo nhóm đọc
      </button>
    </div>

    <div className="social-feed">
      <h4 className="social-section-title">Hoạt động gần đây</h4>

      <div className="social-card">
        <FaComments className="social-icon" />
        <div>
          <strong>Nguyễn Văn B</strong> đã đánh giá <em>“Lão Hạc”</em> ⭐⭐⭐⭐☆
          <p className="social-comment">
            Một câu chuyện cảm động, khiến tôi suy ngẫm nhiều về tình người.
          </p>
        </div>
      </div>

      <div className="social-card">
        <FaUserFriends className="social-icon" />
        <div>
          <strong>Trần Thị C</strong> đã tham gia nhóm <em>“Yêu văn học Việt Nam”</em>
        </div>
      </div>

      <div className="social-card">
        <FaPenFancy className="social-icon" />
        <div>
          <strong>Lê Văn D</strong> đã viết bài mới:
          <p className="social-comment">
            “Tôi nghĩ rằng việc đọc sách cùng bạn bè giúp tôi hiểu sâu hơn nội dung.”
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default Social;
