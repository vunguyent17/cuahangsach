import Header from "../template/header";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "react-bootstrap/Navbar";
import axios from "axios";
import LoadingData from "../utilities/loading_data";

function GioHang() {
  const [, setUpdateCart] = useState(false);
  const [chi_tiet_gio_hang, setChiTietGH] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [loadingValue, setLoading] = useState(0);
  const [sach_checked, setSachChecked] = useState([]);

  //Xử lý dữ liệu lấy dữ liệu sách và dữ liệu giỏ hàng
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
      if (user_res.data.length > 0) {
        let ds_sach_dat = user_res.data[0].cart;
        setChiTietGH(
          ds_sach_dat.map((sach_dat) => {
            let sach_info = sach_get.data.find(
              (sach) => sach.ma_sach === sach_dat.ma_sach
            );
            return Object.assign(sach_dat, sach_info);
          })
        );
      } else {
        alert("Lỗi khi truy cập. Xin hãy đăng xuất và đăng nhập lại");
      }
      setLoadingData(false);
    }
    getData();
  }, [loadingValue]);


  // Xử lý khi người dùng chọn sách lưu toàn bộ sách được checked
  const handleCheck = () => {
    let array = [];
    let checkboxes = document.querySelectorAll("input[name=chon_sach]:checked");
    for (let i = 0; i < checkboxes.length; i++) {
      array.push(checkboxes[i].value);
    }
    setSachChecked(array);
    if (array.length === chi_tiet_gio_hang.length) {
      document.getElementById("chon_tat_ca").checked = true;
    } else {
      document.getElementById("chon_tat_ca").checked = false;
    }
  };

  // Xử lý khi người dùng xóa sách ra khỏi giỏ hàng: xóa dữ liệu bên db
  const handleDelete = async (event) => {
    event.preventDefault();
    let user_input = {
      username: JSON.parse(localStorage.getItem("ch_sach_dang_nhap")).username,
      ma_sach: event.currentTarget.getAttribute("data-masach"),
    };

    let res = await axios
      .delete("http://localhost:8081/giohang", {
        data: user_input,
      })
      .catch((error) => {
        alert(`Error: ${error.message}`);
        console.error("There was a error!", error);
      });
    alert("Đã xóa " + res.data.modifiedCount + " sản phẩm ra khỏi giỏ hàng");
    setUpdateCart(true);
    setLoading(loadingValue+1)
    setSachChecked(sach_checked.filter((ma_sach_checked) => ma_sach_checked!== user_input.ma_sach))
  };

  // console.log(document.querySelectorAll("input[name=chon_sach]:checked"))

  let tong_tien = 0;
  // Xử lý khi người dùng chọn thanh toán toàn bộ sách trong giỏ hàng
  let chonTatCa = (event) => {
    let checkboxes = document.querySelectorAll("input[name=chon_sach]");
    checkboxes.forEach((checkbox) => (checkbox.checked = event.target.checked));
    handleCheck();
  };

  // Xử lý hiển thị danh sách sách kèm thông tin trong giỏ hàng
  let hien_thi_sach = () => 
    chi_tiet_gio_hang.map((sach) => {
      let thanh_tien = sach.so_luong * sach.don_gia;
      if (
        sach_checked.findIndex(
          (ma_sach_checked) => ma_sach_checked === sach.ma_sach
        ) !== -1
      ) {
        tong_tien += thanh_tien;
      }

      let hinh_sach;
      try {
        hinh_sach = "http://localhost:8081/img/" + sach.hinh;
      } catch (error) {
        hinh_sach = "http://localhost:8081/img/img-default.jpg";
      }

      // Cập nhật lại thành tiền cho từng sách khi người dùng thay đổi số lượng
      // Cập nhật số lượng mới lên db
      const updatePrice = async (event) => {
        sach.so_luong = parseInt(event.currentTarget.value);
        setLoading(loadingValue + 1);
        let user_input = {
          username: JSON.parse(localStorage.getItem("ch_sach_dang_nhap"))
            .username,
          ma_sach: event.currentTarget.getAttribute("data-masach"),
          so_luong: sach.so_luong,
        };

        await axios
          .put("http://localhost:8081/giohang", user_input)
          .then((res) => {
            setUpdateCart(true);
            setLoading(loadingValue + 1);
            alert(res.data);
          })
          .catch((error) => {
            alert(`Error: ${error.message}`);
            console.error("There was a error!", error);
          });
      };

      return (
        <tr key={sach.ma_sach}>
          <td className="align-middle text-center">
            <input
              className="form-check-input mt-0"
              type="checkbox"
              name="chon_sach"
              value={sach.ma_sach}
              aria-label="Checkbox htmlFor following input"
              onClick={handleCheck}
            ></input>
          </td>
          <td className="col-2">
            <img
              src={hinh_sach}
              className="img-fluid"
              alt={sach.ten_sach}
            ></img>
          </td>
          <td>
            <h5>{sach.ten_sach}</h5>
            <p className="text-secondary">
              Tác giả: <span className="text-success">{sach.tac_gia} </span>|
              Năm xuất bản: {sach.nam_xuat_ban} | Đơn giá:{" "}
              {sach.don_gia.toLocaleString()} đ
            </p>
            <button
              className="btn btn-link"
              data-masach={sach.ma_sach}
              onClick={handleDelete}
            >
              Xóa
            </button>
          </td>
          <td className="col-1">
            <input
              type="number"
              min={1}
              className="form-control"
              defaultValue={sach.so_luong}
              data-masach={sach.ma_sach}
              onChange={updatePrice}
            />
          </td>
          <td className="fw-bold text-secondary fs-4">
            {thanh_tien.toLocaleString()} đ
          </td>
        </tr>
      );
    });

  // Trả về client
  return (
    <div className="container-fluid">
      <Header setUpdateCart={setUpdateCart} />
      <div className="container">
        <form className="row g-3 py-3">
          <div className="col-12">
            <h1 className="text-secondary fs-3">Giỏ hàng</h1>
            <hr></hr>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col" className="align-middle text-center">
                    <input
                      className="form-check-input mt-0"
                      type="checkbox"
                      defaultValue=""
                      id="chon_tat_ca"
                      aria-label="Checkbox htmlFor following input"
                      onClick={chonTatCa}
                    ></input>{" "}
                    Tất cả
                  </th>
                  <th colSpan="2" scope="col">
                    Sản phẩm
                  </th>
                  <th scope="col">Số lượng</th>
                  <th scope="col">Tạm tính</th>
                </tr>
              </thead>
              <tbody>
                {loadingData ? (
                  <tr>
                    <td className="text-center" colSpan={5}>
                      <LoadingData />
                    </td>
                  </tr>
                ) : (
                  hien_thi_sach()
                )}
              </tbody>
            </table>
          </div>
        </form>
      </div>
      <Navbar
        className="border-top border-3 border-success"
        expand="lg"
        variant="light"
        bg="light"
        fixed="bottom"
      >
        <div className="container">
          <div className="col-10">
            <span className="float-end fs-3">
              Tổng tiền:{" "}
              <span className="fw-bold fs-3 text-danger">
                {tong_tien.toLocaleString()} đ
              </span>
            </span>
          </div>
          <div className="col-auto">
            <Link
              to="/donhang"
              state={{ ds_sach_dat: sach_checked }}
              className="btn btn-success btn-lg float-end"
            >
              Thanh toán
            </Link>
          </div>
        </div>
      </Navbar>
    </div>
  );
}

export default GioHang;
