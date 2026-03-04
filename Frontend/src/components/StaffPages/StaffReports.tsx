// // src/pages/StaffReports.tsx
// import React from "react";
// import {
//   Button,
//   Card,
//   CardContent,
//   Typography,
//   Table,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableBody,
//   Stack,
// } from "@mui/material";
// import { useBooks } from "../Context/BookContext";
// import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
// import { useTransactions } from "../Context/TransactionContext";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import * as XLSX from "xlsx";

// // Giả sử bạn có Transaction context, tạm dùng data cứng cho demo

// const StaffReports: React.FC = () => {
//   const { books } = useBooks();

//   // ⚡ Giả sử dữ liệu giao dịch mượn
//   const { transactions, borrowedBooks, overdueBooks, totalFine, calcFine } = useTransactions();

//   // 📌 Tính toán

//   // 📊 Biểu đồ phí phạt
//   const fineData = [
//     { name: "Doanh thu phí phạt", value: totalFine },
//     { name: "Không phạt", value: 100000 - totalFine }, // giả định tổng 100k
//   ];
//   const COLORS = ["#ff4d4f", "#52c41a"];

//   // 📂 Xuất PDF
//   const exportPDF = () => {
//     const doc = new jsPDF();
//     doc.text("Báo cáo thống kê", 14, 16);

//     autoTable(doc, {
//       head: [["ID", "Người mượn", "Sách", "Ngày mượn", "Hạn trả", "Trạng thái", "Phí phạt"]],
//       body: transactions.map(t => {
//         const book = books.find(b => b.id === t.bookId);
//         return [
//           t.id,
//           t.reader,
//           book?.title || "N/A",
//           t.borrowDate,
//           t.returnDeadline,
//           t.status,
//           t.fine ? `${t.fine} VND` : "-",
//         ];
//       }),
//     });

//     doc.save("bao_cao.pdf");
//   };

//   // 📂 Xuất Excel
//   const exportExcel = () => {
//     const ws = XLSX.utils.json_to_sheet(
//       transactions.map(t => {
//         const book = books.find(b => b.id === t.bookId);
//         return {
//           ID: t.id,
//           "Người mượn": t.reader,
//           Sách: book?.title || "N/A",
//           "Ngày mượn": t.borrowDate,
//           "Hạn trả": t.returnDeadline,
//           "Trạng thái": t.status,
//           "Phí phạt": t.fine || 0,
//         };
//       })
//     );

//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Báo cáo");
//     XLSX.writeFile(wb, "bao_cao.xlsx");
//   };

//   return (
//     <div style={{ padding: 20 }}>
//       <Typography variant="h5" gutterBottom>
//         Báo cáo thống kê
//       </Typography>

//       <Stack direction="row" spacing={2} style={{ marginBottom: 16 }}>
//         <Button variant="contained" color="primary" onClick={exportPDF}>
//           Xuất PDF
//         </Button>
//         <Button variant="contained" color="success" onClick={exportExcel}>
//           Xuất Excel
//         </Button>
//       </Stack>

//       <Stack direction="row" spacing={2}>
//         <Card style={{ flex: 1 }}>
//           <CardContent>
//             <Typography variant="h6">📚 Sách đang mượn</Typography>
//             <Typography>{borrowedBooks.length} cuốn</Typography>
//           </CardContent>
//         </Card>

//         <Card style={{ flex: 1 }}>
//           <CardContent>
//             <Typography variant="h6">⚠️ Sách trễ hạn</Typography>
//             <Typography>{overdueBooks.length} cuốn</Typography>
//           </CardContent>
//         </Card>

//         <Card style={{ flex: 1 }}>
//           <CardContent>
//             <Typography variant="h6">💰 Doanh thu phí phạt</Typography>
//             <Typography>{totalFine} VND</Typography>
//           </CardContent>
//         </Card>
//       </Stack>

//       <div style={{ height: 300, marginTop: 20 }}>
//         <ResponsiveContainer>
//           <PieChart>
//             <Pie
//               data={fineData}
//               dataKey="value"
//               nameKey="name"
//               cx="50%"
//               cy="50%"
//               outerRadius={100}
//               label
//             >
//               {fineData.map((entry, index) => (
//                 <Cell key={index} fill={COLORS[index % COLORS.length]} />
//               ))}
//             </Pie>
//             <Tooltip />
//             <Legend />
//           </PieChart>
//         </ResponsiveContainer>
//       </div>

//       {/* Bảng chi tiết */}
//       <Typography variant="h6" style={{ marginTop: 20 }}>
//         Chi tiết giao dịch
//       </Typography>
//       <Table>
//         <TableHead>
//           <TableRow>
//             <TableCell>ID</TableCell>
//             <TableCell>Người mượn</TableCell>
//             <TableCell>Sách</TableCell>
//             <TableCell>Ngày mượn</TableCell>
//             <TableCell>Hạn trả</TableCell>
//             <TableCell>Ngày trả</TableCell>
//             <TableCell>Trạng thái</TableCell>
//             <TableCell>Phí phạt</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {transactions.map(t => {
//             const book = books.find(b => b.id === t.bookId);
//             return (
//               <TableRow key={t.id}>
//                 <TableCell>{t.id}</TableCell>
//                 <TableCell>{t.reader}</TableCell>
//                 <TableCell>{book?.title || "N/A"}</TableCell>
//                 <TableCell>{t.borrowDate}</TableCell>
//                 <TableCell>{t.returnDeadline}</TableCell>
//                 <TableCell>{t.returnDate ?? "-"}</TableCell>
//                 <TableCell>{t.status}</TableCell>
//                 <TableCell>{calcFine(t) > 0 ? `${calcFine(t)} VND` : "-"}</TableCell>
//               </TableRow>
//             );
//           })}
//         </TableBody>
//       </Table>
//     </div>
//   );
// };

// export default StaffReports;
