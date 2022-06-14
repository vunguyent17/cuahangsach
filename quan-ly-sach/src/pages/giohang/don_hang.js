import Header from "../template/header";
import Footer from "../template/footer";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import LoadingData from "../utilities/loading_data";

function DonHang() {
  const [chi_tiet_don_hang, setChiTietDH] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const location = useLocation();
  const { ds_sach_dat } = location.state;
  let navigate = useNavigate();

  // Hien thi input dia chi dat hang
  const initialValues = {
    thanh_pho: "",
    duong: "",
    so_nha: "",
    ten_nguoi_nhan: JSON.parse(localStorage.getItem("ch_sach_dang_nhap")).fullname,
    so_dien_thoai: "",
  };
  const [userInputs, setUserInputs] = useState(initialValues);
  const thong_tin = [
    ["thanh_pho", "Thành phố"],
    ["duong", "Đường"],
    ["so_nha", "Số nhà"],
    ["ten_nguoi_nhan", "Tên người nhận"],
    ["so_dien_thoai", "Số điện thoại"],
  ];

  const onChangeHandler = useCallback(
    ({ target: { id, value } }) =>
      setUserInputs((state) => ({ ...state, [id]: value })),
    []
  );

  // Xử lý hiển thị form thông tin giao hàng
  const hien_thi_input = thong_tin.map((tt) => (
    <div key={tt[0]} className="col-md-12">
      <label htmlFor={tt[0]} className="form-label text-secondary">
        {tt[1]}
      </label>

      <input
        type="text"
        className="form-control"
        id={tt[0]}
        required
        onChange={onChangeHandler}
        value={userInputs[tt[0]]}
      ></input>
    </div>
  ));

  let tong_tien = 0;

  // Xử lý lấy dữ liệu, gồm dữ liệu sách và giỏ hàng của người dùng
  useEffect(() => {
    async function getData() {
      let user_info = JSON.parse(localStorage.getItem("ch_sach_dang_nhap"));
      let user_req = {
        username: user_info.username,
        password: user_info.password,
      };
      let sach_get = await axios.get("http://localhost:8081/sach/all");
      let user_res = await axios.post(
        "http://localhost:8081/dangnhap",
        user_req
      );
      if (user_res.data.length === 0) {
        alert("Lỗi khi truy cập. Xin hãy đăng xuất và đăng nhập lại");
      }
      setChiTietDH(
        ds_sach_dat.map((sach_dat) => {
          let sach_dat_sl = user_res.data[0].cart.find(
            (sach) => sach.ma_sach === sach_dat
          );
          let sach_info = sach_get.data.find(
            (sach) => sach.ma_sach === sach_dat
          );
          return Object.assign(sach_dat_sl, sach_info);
        })
      );
      setLoading(false);
    }
    getData();
  }, [ds_sach_dat]);

  if (isLoading === false) {
    tong_tien = chi_tiet_don_hang.reduce(
      (acc, val) => acc + val.don_gia * val.so_luong,
      0
    );
  }

  // Xử lý hiển thị danh sách sản phẩm
  const hien_thi_sach = () =>
    chi_tiet_don_hang.map((sach_dat, index) => (
      <tr key={sach_dat.ma_sach}>
        <td>{index + 1}</td>
        <td>
          {sach_dat.ten_sach} - {sach_dat.tac_gia}
        </td>
        <td className="col-1 text-end">
          {sach_dat.don_gia.toLocaleString()} đ
        </td>
        <td className="col-1 text-end">{sach_dat.so_luong}</td>
        <td className="fw-bold text-success text-end mr-3">
          {(sach_dat.don_gia * sach_dat.so_luong).toLocaleString()} đ
        </td>
      </tr>
    ));

  // Xử lý đặt hàng 
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Tạo và thêm hóa đơn vào db
    let currentdate = new Date();
    let ngay_dat =
      currentdate.getDate() +
      "/" +
      (currentdate.getMonth() + 1) +
      "/" +
      currentdate.getFullYear();
    let thoi_gian_dat =
      currentdate.getHours() +
      ":" +
      currentdate.getMinutes() +
      ":" +
      currentdate.getSeconds();

    let don_hang = {
      username: JSON.parse(localStorage.getItem("ch_sach_dang_nhap")).username,
      ngay_dat: ngay_dat,
      thoi_gian_dat: thoi_gian_dat,
      dia_chi: userInputs,
      chi_tiet_don_hang: chi_tiet_don_hang,
      tong_tien: tong_tien,
    };
    await axios
      .post("http://localhost:8081/hoadon", don_hang)
      .then((res) => {
        alert("Đã thêm hóa đơn mới");
      })
      .catch((error) => {
        alert(`Error: ${error.message}`);
        console.error("There was a error!", error);
      });

    let user_info = {
      username: JSON.parse(localStorage.getItem("ch_sach_dang_nhap")).username,
      ma_sach: ds_sach_dat,
    };

    // Xóa các sản phẩm đã đặt hàng ra khỏi giỏ hàng
    await axios
      .delete("http://localhost:8081/giohang", {data: user_info})
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => {
        alert(`Error: ${error.message}`);
        console.error("There was a error!", error);
      });

    navigate("/giaohang", { state: { don_hang: don_hang } });
  };

  // Trả về client
  return (
    <div className="container-fluid">
      <Header />
      <div className="container my-3">
        <h1 className="text-success my-3 text-center">Thông tin đơn hàng</h1>

        <div className="col-12">
          <form className="row g-3" onSubmit={handleSubmit}>
            <h2 className="text-secondary fs-3">Địa chỉ nhận hàng</h2>
            <hr></hr>
            {hien_thi_input}

            <div className="col-12 mt-5">
              <h2 className="text-secondary fs-3">Chi tiết đơn hàng</h2>
              <hr></hr>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th scope="col">No.</th>
                    <th scope="col">Sản phẩm</th>
                    <th className="text-end" scope="col">
                      Đơn giá
                    </th>
                    <th className="text-end" scope="col">
                      Số lượng
                    </th>
                    <th className="text-end" scope="col">
                      Thành tiền
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={5}>
                        <LoadingData />
                      </td>
                    </tr>
                  ) : (
                    hien_thi_sach()
                  )}
                  <tr key={"tongcong"}>
                    <th colSpan="4" className="fs-3 align-end">
                      Tổng cộng
                    </th>
                    <th className="fw-bold fs-3 text-danger text-end">
                      {tong_tien.toLocaleString()} đ
                    </th>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="col-12">
              <Link to="/giohang" className="btn btn-link btn-lg">
                Trở lại giỏ hàng
              </Link>
              <button className="btn btn-danger btn-lg float-end" type="submit">
                Đặt hàng
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default DonHang;
