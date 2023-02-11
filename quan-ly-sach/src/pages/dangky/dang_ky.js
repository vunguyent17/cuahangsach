import Header from "../template/header";
import Footer from "../template/footer";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function DangKy() {
  const server_url = process.env.REACT_APP_SERVER_URI;
  const navigate = useNavigate();
  const initialValues = {
    username: "",
    password: "",
    fullname: "",
    email: "",
  };
  const [userInputs, setUserInputs] = useState(initialValues);

  // Xử lý khi thay đổi input
  const onChangeHandler = useCallback(
    (event) => 
      setUserInputs((state) => ({
        ...state,
        [event.target.getAttribute("data-field")]: event.target.value,
      })),
    []
  );

  // Xử lý khi submit form đăng ký
  const disableButton = () => {
    let btnSignup = document.getElementById("btnSignup");
    btnSignup.disabled = true;
    btnSignup.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Đang xử lý ...';
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    disableButton();
    let user_input = userInputs;
    axios
      .post(server_url+"/dangky", user_input)
      .then((res) => {
        console.log(res.data);
        alert("Đăng ký thành công");
        navigate("/");
      })
      .catch((error) => {
        alert(`Error: ${error.message}`);
        console.error("There was a error!", error);
      });
  };

  // Trả về client
  return (
    <div className="container-fluid">
      <Header />
      <div className="container my-3">
        <form className="row g-3 w-50 mx-auto" onSubmit={handleSubmit}>
          <h1 className="text-success text-center fs-3">Đăng ký</h1>
          <div className="col-md-12">
            <label htmlFor="username" className="form-label">
              Tên tài khoản:
            </label>
            <input
              type="text"
              className="form-control"
              data-field="username"
              defaultValue=""
              onChange={onChangeHandler}
              required
            ></input>
          </div>
          <div className="col-md-12">
            <label htmlFor="email" className="form-label">
              Họ và tên:
            </label>
            <input
              type="text"
              className="form-control"
              data-field="fullname"
              defaultValue=""
              onChange={onChangeHandler}
              required
            ></input>
          </div>
          <div className="col-md-12">
            <label htmlFor="email" className="form-label">
              Email:
            </label>
            <input
              type="text"
              className="form-control"
              data-field="email"
              defaultValue=""
              onChange={onChangeHandler}
              required
            ></input>
          </div>
          <div className="col-md-12">
            <label htmlFor="dia-chi-nha-chi-tiet" className="form-label">
              Mật khẩu:
            </label>
            <input
              type="password"
              className="form-control"
              data-field="password"
              defaultValue=""
              onChange={onChangeHandler}
              required
            ></input>
          </div>
          <div className="col-md-12">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                defaultValue=""
                id="invalidCheck"
                required
              ></input>
              <label className="form-check-label" htmlFor="invalidCheck">
                Tôi đồng ý với các điều khoản và đồng ý tạo tài khoản trên hệ
                thống
              </label>
              <div className="invalid-feedback">
                Bạn phải đồng ý trước khi tạo tài khoản
              </div>
            </div>
          </div>
          <div className="col-12">
            <button id="btnSignup" className="btn btn-success btn-lg float-end" type="submit">
              Tạo tài khoản
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default DangKy;
