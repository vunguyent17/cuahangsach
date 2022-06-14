/* eslint-disable jsx-a11y/anchor-is-valid */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faArrowAltCircleLeft,
} from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import Header from "../template/header";
import Footer from "../template/footer";
import { useState, useEffect } from "react";
import axios from "axios";
import LoadingData from "../utilities/loading_data";

function ChiTietSach() {
  const [, setUpdateCart] = useState(false);
  const [sach_fetch, setSach] = useState([]);
  const [ds_loai_sach, setDSLoaiSach] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const location = useLocation();

  // Xử lý dữ liệu: lấy dữ liệu sách và loại sách
  useEffect(() => {
    async function getData() {
      let res_loai_sach = await axios.get("http://localhost:8081/loai-sach/");
      setDSLoaiSach(res_loai_sach.data);
      const { ma_sach } = location.state;
      let res_sach = await axios.get("http://localhost:8081/sach/" + ma_sach);
      setSach(res_sach.data);
      setLoading(false);
    }
    getData();
  }, [location.state]);

  // Xử lý khi người dùng thêm sách vào giỏ hàng
  const handleAddCart = async (event) => {
    event.preventDefault();
    let user_input = {
      username: JSON.parse(localStorage.getItem("ch_sach_dang_nhap")).username,
      ma_sach: event.target.getAttribute("data-masach"),
      so_luong: parseInt(document.getElementById("soluong").value),
    };
    await axios
      .put("http://localhost:8081/giohang", user_input)
      .then((res) => {
        setUpdateCart(true);
        alert(res.data);
      })
      .catch((error) => {
        alert(`Error: ${error.message}`);
        console.error("There was a error!", error);
      });
  };

  // Xử lý hiển thị
  let hien_thi_sach = () => {
    let sach = sach_fetch[0];
    let muc_chi_tiet = ["Tên sách", "ISBN", "Năm xuất bản", "Nhà xuất bản"];
    let nd_chi_tiet = [
      sach.ten_sach,
      sach.tac_gia,
      sach.isbn,
      sach.nam_xuat_ban,
      sach.nha_xuat_ban,
    ];
    let bang_chi_tiet = muc_chi_tiet.map((muc, index) => (
      <tr>
        <th scope="row">{muc}</th>
        <td>{nd_chi_tiet[index]}</td>
      </tr>
    ));

    let hinh_sach;
    try {
      hinh_sach = "http://localhost:8081/img/" + sach.hinh;
    } catch (error) {
      hinh_sach = "http://localhost:8081/img/img-default.jpg";
    }

    return (
      <div className="row mb-5">
        <div className="col-md-3">
          <img
            src={hinh_sach}
            className="img-fluid w-100 p-2"
            alt={sach.ten_sach}
          ></img>
        </div>
        <div className="col-md-6">
          <span className="text-secondary">
            {
              ds_loai_sach.find(
                (loai_sach) => loai_sach.ma_loai === sach.ma_loai
              ).ten_loai
            }
          </span>
          <hr className="mt-1"></hr>

          <div className="py-2">
            <h1 className="text-success">{sach.ten_sach}</h1>
            <p>
              Tác giả: <span className="text-success">{sach.tac_gia}</span>
            </p>
          </div>

          <h5 className="text-success">Thông tin sách</h5>
          <hr></hr>
          <table className="table table-bordered table-striped">
            <tbody>{bang_chi_tiet}</tbody>
          </table>
        </div>
        <div className="col-md-3">
          <ul className="list-group list-group-flush">
            <li className="list-group-item ">
              <p>Đơn giá:</p>
              <p className="text-right fw-bold text-success fs-3">
                {sach.don_gia.toLocaleString()} đ
              </p>
            </li>
            <li className="list-group-item">Giao hàng toàn quốc</li>
            <li className="list-group-item">
              Tình trạng: <span className="text-success fw-bold">Còn hàng</span>
            </li>
            <li className="list-group-item">
              <form>
                <div className="form-group mb-3">
                  <label htmlFor="soluong" className="form-label">
                    Số lượng:
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="form-control"
                    defaultValue={1}
                    id="soluong"
                  />
                </div>
                <a
                  data-masach={sach.ma_sach}
                  className="btn btn-lg btn-success d-block m-2"
                  onClick={handleAddCart}
                >
                  <FontAwesomeIcon icon={faShoppingCart} /> Thêm vào giỏ
                </a>
              </form>
            </li>
          </ul>
        </div>
      </div>
    );
  };

  // Trả về client
  return (
    <div className="container-fluid">
      <Header setUpdateCart={setUpdateCart} />
      <div className="container mt-5">
        {isLoading ? <LoadingData /> : hien_thi_sach()}
        <Link className="btn btn-link text-success" to="/">
          <FontAwesomeIcon icon={faArrowAltCircleLeft} /> Trở lại trang chủ
        </Link>
      </div>
      <Footer />
    </div>
  );
}

export default ChiTietSach;
