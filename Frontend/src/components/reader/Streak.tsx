import React from 'react';
import './Reader.css';

const Streak = () => {
  return (
    <div className="reader-streak-container">
      <h2 className="reader-section-title">🔥 Daily Reading Streak</h2>

      {/* Thông tin tổng quan */}
      <div className="reader-streak-summary">
        <div className="reader-streak-score">
          <h3>Điểm streak</h3>
          <p className="score-number">42 ngày liên tiếp</p>
        </div>
        <div className="reader-streak-badges">
          <h3>Huy hiệu đạt được</h3>
          <div className="badges-list">
            <span className="badge gold">🏅 7 ngày</span>
            <span className="badge silver">🥈 14 ngày</span>
            <span className="badge bronze">🥉 30 ngày</span>
          </div>
        </div>
      </div>

      {/* Lịch streak */}
      <div className="reader-streak-calendar">
        <h3>Lịch streak</h3>
        <div className="calendar-grid">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className={`calendar-day ${i < 10 ? 'active' : ''}`}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Nhắc nhở */}
      <div className="reader-streak-reminder">
        <p>📚 Đừng quên đọc hôm nay để giữ streak nhé!</p>
        <button className="btn-remind">Đặt nhắc nhở</button>
      </div>
    </div>
  );
};

export default Streak;
