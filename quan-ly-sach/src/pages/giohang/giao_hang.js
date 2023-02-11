import Header from "../template/header";
import Footer from "../template/footer";
import { Link, useLocation } from "react-router-dom";

function GiaoHang() {
  const location = useLocation();
  const { don_hang } = location.state;
  const dia_chi = don_hang.dia_chi;

  let cthd = don_hang.chi_tiet_don_hang.reduce(
    (acc, val, index) =>
      acc +
      `
  ${index + 1}. ${val.ten_sach.toUpperCase()} (${val.tac_gia})\n
  \tDon gia: ${val.don_gia.toLocaleString()} đ --- SL: ${
        val.so_luong
      } --- Thanh tien: ${(val.don_gia * val.so_luong).toLocaleString()} đ\n`,
    ""
  );
  const XuatHoaDon = () => {
    let hoadon = `
    Cong ty TNHH Cua hang Sach\n
    ******* HON DON DAT HANG ******\n
    - Tai khoan: ${don_hang.username}\n
    - Ngay dat: ${don_hang.ngay_dat}\n
    - Thoi gian dat: ${don_hang.thoi_gian_dat}\n
    - Thong tin dia chi:\n
    \t+ Ten nguoi nhan: ${dia_chi.ten_nguoi_nhan}\n
    \t+ Dia chi nhan hang: ${dia_chi.so_nha}, ${dia_chi.duong}, ${
      dia_chi.thanh_pho
    }\n
    \t+ So dien thoai: ${dia_chi.so_dien_thoai}\n

    CHI TIET HOA DON\n
    __________________________________________\n
    ${cthd}
    ___________________________________________\n
    TONG CONG: ${don_hang.tong_tien.toLocaleString()} đ\n
    ---------------------------------------------\n
    Cam on quy khach da mua hang tai Cua hang sach.\n
    Hen gap lại quy khach lan sau :D\n
    `;
    const element = document.createElement("a");
    const file = new Blob([hoadon], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `DonDatHang_CuaHangSach_${don_hang.username}_${
      don_hang.ngay_dat
    }_${don_hang.thoi_gian_dat.replace(":", "")}.txt`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  // Trả về client
  return (
    <div className="container-fluid">
      <Header />
      <div className="text-center fs-3 m-3">
        <p>
          Cám ơn bạn đã đặt mua sách tại{" "}
          <span className="fw-bold text-success">Cửa hàng sách</span>
        </p>
        <p>
          Chúng tôi sẽ gửi hàng cho bạn tới địa chỉ{" "}
          <span className="text-success">
            {dia_chi.so_nha}, {dia_chi.duong}, {dia_chi.thanh_pho}
          </span>
        </p>
        <button
          className="btn btn-lg btn-link text-success mx-3"
          onClick={XuatHoaDon}
        >
          Xuất hóa đơn
        </button>
        <Link to="/" className="btn btn-lg  btn-success mx-3">
          Trở lại trang chủ
        </Link>
      </div>
      <Footer />
    </div>
  );
}

export default GiaoHang;
