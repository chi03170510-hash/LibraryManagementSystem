// import { FaEnvelope, FaPhone, FaHome, FaQrcode, FaEdit } from "react-icons/fa";
// import "./Profile.css";

// const Profile = () => (
//   <div className="profile-wrapper">
//     <div className="profile-header">
//       <h3 className="profile-title">Thông tin cá nhân</h3>
//       <p className="profile-subtitle">Quản lý tài khoản và thẻ thư viện điện tử</p>
//     </div>

//     <div className="profile-card">
//       <div className="profile-info">
//         <div className="profile-item">
//           <FaEnvelope className="profile-icon" />
//           <div>
//             <div className="profile-label">Email</div>
//             <div className="profile-value">nguyenvana@example.com</div>
//           </div>
//         </div>

//         <div className="profile-item">
//           <FaPhone className="profile-icon" />
//           <div>
//             <div className="profile-label">Số điện thoại</div>
//             <div className="profile-value">+84 912 345 678</div>
//           </div>
//         </div>

//         <div className="profile-item">
//           <FaHome className="profile-icon" />
//           <div>
//             <div className="profile-label">Địa chỉ</div>
//             <div className="profile-value">123 Đường Lê Lợi, Quận 1, TP. HCM</div>
//           </div>
//         </div>
//       </div>

//       <div className="profile-actions">
//         <button className="profile-btn edit-btn">
//           <FaEdit /> Chỉnh sửa
//         </button>
//         <button className="profile-btn qr-btn">
//           <FaQrcode /> Xem QR E-Card
//         </button>
//       </div>
//     </div>
//   </div>
// );

// export default Profile;
import React from "react";
import { FaEnvelope, FaPhone, FaHome, FaQrcode, FaEdit, FaUser } from "react-icons/fa";
import { useProfile } from "../context/ProfileContext";
import "./Profile.css";

const Profile: React.FC = () => {
  const { profile, loading, error } = useProfile();

  if (loading) return <div className="profile-wrapper">Đang tải thông tin cá nhân...</div>;
  if (error) return <div className="profile-wrapper error">{error}</div>;
  if (!profile) return <div className="profile-wrapper">Không tìm thấy thông tin cá nhân.</div>;

  return (
    <div className="profile-wrapper">
      <div className="profile-header">
        <h3 className="profile-title"><FaUser /> Thông tin cá nhân</h3>
        <p className="profile-subtitle">Quản lý tài khoản và thẻ thư viện điện tử</p>
      </div>

      <div className="profile-card">
        <div className="profile-info">
          <div className="profile-item">
            <FaUser className="profile-icon" />
            <div>
              <div className="profile-label">Họ tên</div>
              <div className="profile-value">{profile.fullName}</div>
            </div>
          </div>
          <div className="profile-item">
            <FaEnvelope className="profile-icon" />
            <div>
              <div className="profile-label">Email</div>
              <div className="profile-value">{profile.email}</div>
            </div>
          </div>
          <div className="profile-item">
            <FaPhone className="profile-icon" />
            <div>
              <div className="profile-label">Số điện thoại</div>
              <div className="profile-value">{profile.phone}</div>
            </div>
          </div>
          <div className="profile-item">
            <FaHome className="profile-icon" />
            <div>
              <div className="profile-label">Địa chỉ</div>
              <div className="profile-value">{profile.address}</div>
            </div>
          </div>
          <div className="profile-item">
            <span className="profile-icon" style={{ fontWeight: 700 }}>👤</span>
            <div>
              <div className="profile-label">Tên đăng nhập</div>
              <div className="profile-value">{profile.username}</div>
            </div>
          </div>
          <div className="profile-item">
            <span className="profile-icon" style={{ fontWeight: 700 }}>🎫</span>
            <div>
              <div className="profile-label">Vai trò</div>
              <div className="profile-value">{profile.role}</div>
            </div>
          </div>
          <div className="profile-item">
            <span className="profile-icon" style={{ fontWeight: 700 }}>🔓</span>
            <div>
              <div className="profile-label">Trạng thái</div>
              <div className="profile-value">{profile.status}</div>
            </div>
          </div>
        </div>

        <div className="profile-actions">
          <button className="profile-btn edit-btn">
            <FaEdit /> Chỉnh sửa
          </button>
          <button className="profile-btn qr-btn">
            <FaQrcode /> Xem QR E-Card
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;