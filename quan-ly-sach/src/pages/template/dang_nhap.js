import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function DangNhap() {
  const [username_input, setUsername] = useState("");
  const [password_input, setPassword] = useState("");
  const [, setUserLogin] = useState();
  const navigate = useNavigate();
  const server_url = process.env.REACT_APP_SERVER_URI;

  const disableButton = () => {
    let btnLogin = document.getElementById("btnLogin");
    btnLogin.disabled = true;
    btnLogin.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Đang xử lý...';
  }
  //Xử lý đăng nhập
  const handleSubmit = async (event) => {
    event.preventDefault();
    disableButton();
    let user_input = { username: username_input, password: password_input };
    await axios
      .post(server_url+"/dangnhap", user_input)
      .then((res) => {
        if (res.data.length > 0) {
          alert("Đăng nhập thành công")
          let user_data = res.data;
          let user_info = (({ username, password, fullname }) => ({
            username,
            password,
            fullname,
          }))(user_data[0]);
          localStorage.setItem("ch_sach_dang_nhap", JSON.stringify(user_info));
          setUserLogin(user_info);
          navigate("/");
        } else {
          alert("Xin hãy đăng nhập lại");
          window.location.reload();
        }
      })
      .catch((error) => {
        alert(`Error: ${error.message}`);
        console.error("There was a error!", error);
      });
  };

  //Hiển thị form đăng nhập
  let form_dang_nhap = (
    <form className="row g-3" onSubmit={handleSubmit}>
      <div className="col-md-5">
        <div className="row">
          <label htmlFor="username" className="col-auto col-form-label">
            Tên tài khoản
          </label>
          <div className="col">
            <input
              type="text"
              className="form-control form-control-sm"
              id="username"
              required
              onChange={(event) => setUsername(event.target.value)}
            ></input>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="row">
          <label htmlFor="password" className="col-auto col-form-label">
            Mật khẩu
          </label>
          <div className="col">
            <input
              type="password"
              className="form-control form-control-sm"
              id="password"
              onChange={(event) => setPassword(event.target.value)}
              required
            ></input>
          </div>
        </div>
      </div>
      <div className="col-auto">
        <button id="btnLogin" className="btn btn-success btn-sm" type="submit">
          Đăng nhập
        </button>
      </div>
      <div className="col-auto">
        <Link
          to="/dangky"
          className="btn btn-outline-success btn-sm"
          type="submit"
        >
          Đăng ký
        </Link>
      </div>
    </form>
  );

  //Hiển thị chào mừng nếu đăng nhập thành công
  let chao_mung = () => (
    <div className="row">
      <div className="col-8 my-auto">
        <div className="float-end bg-light p-2">
          Chào bạn{" "}
          <span className="fw-bold text-success">
            {JSON.parse(localStorage.getItem("ch_sach_dang_nhap")).fullname}
          </span>
        </div>
      </div>
      <div className="col-auto">
        <button className="btn btn-link text-success" onClick={handleLogOut}>
          Thoát đăng nhập
        </button>
      </div>
      <div className="col-auto">
        <Link
          to="/dangky"
          className="btn btn-outline-success btn-sm"
          type="submit"
        >
          Đăng ký
        </Link>
      </div>
    </div>
  );

  //Xử lý đăng xuất
  const handleLogOut = () => {
    localStorage.removeItem("ch_sach_dang_nhap");
    alert("Bạn đã đăng xuất thành công");
    navigate("/");
  }

  // Trả về client
  return (
    <div className="row m-3">
      <div className="col-4 my-auto">
        Chào mừng bạn đến website của{" "}
        <span className="fw-bold text-success">Cửa hàng sách</span>
      </div>
      <div className="col-8 my-auto">
        {localStorage.getItem("ch_sach_dang_nhap") === null
          ? form_dang_nhap
          : chao_mung()}
      </div>
    </div>
  );
}

export default DangNhap;
