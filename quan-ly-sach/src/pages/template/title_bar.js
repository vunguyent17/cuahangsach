/* eslint-disable jsx-a11y/anchor-is-valid */
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import { faShoppingCart} from '@fortawesome/free-solid-svg-icons'

function TitleBar(props) {
  const [SLGioHang, setSLGioHang] = useState(0);
  const navigate = useNavigate();

  // Xử lý khi tìm kiếm sách
  const handleSubmit = (event) => {
    event.preventDefault();
    let input = document.getElementById("tu_khoa_tim_kiem").value;
    navigate("/timkiem", { state: { tu_khoa: input } });
  };

  // Xử lý lấy dữ liệu giỏ hàng của người dùng
  useEffect(() => {
    const getSLGioHang = async () => {
      let user_info = JSON.parse(localStorage.getItem("ch_sach_dang_nhap"));
      if (user_info !== null) {
        let user_req = {
          username: user_info.username,
          password: user_info.password,
        };
        let user_res = await axios.post(
          "http://localhost:8081/dangnhap",
          user_req
        );
        if (user_res.data.length > 0) {
          setSLGioHang(user_res.data[0].cart.length);
          if (props.setUpdateCart !== undefined) props.setUpdateCart(false);
        } else {
          alert("Lỗi khi truy cập. Xin hãy đăng xuất và đăng nhập lại");
        }
      }
    };
    getSLGioHang();
  }, [props]);

  // Hiển thị menu giỏ hàng chỉ khi đã đăng nhập
  const hien_thi_gio_hang =
    localStorage.getItem("ch_sach_dang_nhap") !== null ? (
      <Link
        to="/giohang"
        className="btn btn-link nav-link text-success fw-bold"
      >
        <FontAwesomeIcon icon={faShoppingCart} /> Giỏ hàng <span className="badge bg-success">{SLGioHang}</span>
      </Link>
    ) : (
      <span className="text-success">Đăng nhập để truy cập giỏ hàng</span>
    );

  // Trả về client
  return (
    <nav className="navbar navbar-expand-lg p-2 navbar-light bg-light text-center py-5">
      <div className="container">
        <Link
          className="navbar-brand h2 text-center d-block col-auto text-success"
          to="/"
        >
          <img
            src="http://localhost:8081/logo/favicon-32x32.png"
            alt="logo"
            className="px-2"
          ></img>
          Cửa hàng sách
        </Link>

        <button
          className="navbar-toggler"
          data-bs-toggle="collapse"
          data-bs-target="#navbarText"
          aria-controls="navbarText"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <form className="form-inline d-flex mx-3 flex-nowrap col-md-7">
          <input
            id="tu_khoa_tim_kiem"
            className="form-control me-2 rounded-lg flex-grow-1"
            type="text"
            name="searchbox"
            placeholder="Nhập từ khóa cần tìm kiếm..."
            defaultValue={props.tu_khoa || ""}
          ></input>
          <button
            className="btn btn-success flex-shrink-0"
            onClick={handleSubmit}
          >
            Tìm kiếm
          </button>
        </form>

        <div className="collapse navbar-collapse col-auto" id="navbarText">
          <ul className="navbar-nav w-100 align-content-center flex-nowrap col-auto nav-justified">
            <li className="nav-item col-auto">{hien_thi_gio_hang}</li>
          </ul>
        </div>

      </div>
    </nav>
  );
}

export default TitleBar;
