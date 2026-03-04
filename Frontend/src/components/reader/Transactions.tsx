import React from "react";
import {
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaUser,
  FaBook,
  FaStickyNote,
} from "react-icons/fa";
import QRCode from "react-qr-code";
import { useTransactions } from "../context/TransactionContext";
import "./Transactions.css";

function formatDate(arr?: number[] | null) {
  if (!arr) return "—";
  const [y, m, d, hh = 0, mm = 0] = arr;
  return `${String(d).padStart(2, "0")}/${String(m).padStart(2, "0")}/${y} ${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

const statusLabel = {
  BORROWED: { icon: <FaClock />, text: "Đang mượn", class: "BORROWED" },
  RETURNED: { icon: <FaCheckCircle />, text: "Đã trả", class: "RETURNED" },
  LATE: { icon: <FaExclamationTriangle />, text: "Trễ hạn", class: "LATE" },
};

const Transactions: React.FC = () => {
  const { transactions, loading, error } = useTransactions();

  if (loading) return <p className="loading">⏳ Đang tải dữ liệu giao dịch...</p>;
  if (error) return <p className="error">❌ Lỗi: {error}</p>;
  if (!transactions.length) return <p className="no-result">Không có giao dịch nào.</p>;

  return (
    <div className="transactions-wrapper">
      <h3 className="transactions-title">📚 Lịch sử mượn – trả sách</h3>

      <div className="transactions-list">
        {transactions.map((t) => (
          <div key={t.id} className={`transaction-card ${t.status}`}>
            <div className="transaction-header">
              <div className="transaction-header-left">
                <span className="transaction-id">#{t.id}</span>
                <span className={`transaction-status ${t.status}`}>
                  {statusLabel[t.status].icon} {statusLabel[t.status].text}
                </span>
              </div>
              <div className="transaction-date">
                <FaClock /> {formatDate(t.borrowDate)}
              </div>
            </div>

            <div className="transaction-body">
              <div className="transaction-info">
                <p><FaUser /> <strong>Người mượn:</strong> {t.readerName}</p>
                <p><FaUser /> <strong>Nhân viên:</strong> {t.staffName}</p>
                <p><FaClock /> <strong>Hạn trả:</strong> {formatDate(t.dueDate)}</p>
                <p><FaClock /> <strong>Ngày trả:</strong> {formatDate(t.returnDate)}</p>
                {t.fineAmount && (
                  <p className="transaction-fine">
                    💸 <strong>Phí phạt:</strong> {t.fineAmount.toLocaleString()}đ
                  </p>
                )}
                {t.note && (
                  <p><FaStickyNote /> <strong>Ghi chú:</strong> {t.note}</p>
                )}
              </div>

              <div className="transaction-books">
                <strong><FaBook /> Danh sách sách:</strong>
                <ul>
                  {t.details?.map((b, idx) => (
                    <li key={idx}>
                      <b>{b.bookTitle}</b>
                      {b.status !== t.status && (
                        <span className={`book-status ${b.status}`}>
                          {statusLabel[b.status].icon} {statusLabel[b.status].text}
                        </span>
                      )}
                      {b.conditionNote && <> – <i>{b.conditionNote}</i></>}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="transaction-qr">
                <QRCode value={String(t.id)} size={72} />
                <div className="qr-label">Mã giao dịch: <strong>{t.id}</strong></div>
                <div className="qr-tip">Đưa mã này cho nhân viên khi trả sách</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Transactions;
