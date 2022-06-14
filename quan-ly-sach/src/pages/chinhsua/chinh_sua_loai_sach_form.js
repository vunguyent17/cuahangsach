import Header from "../template/header";
import Footer from "../template/footer";
import { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingData from "../utilities/loading_data";

function ChinhSuaLoaiSachForm() {
  const [isLoading, setLoading] = useState(true);
  const [userInputs, setUserInputs] = useState({});

  const location = useLocation();
  const navigate = useNavigate();
  const thong_tin = ["ma_loai", "ten_loai"];

   // Xử lý lấy dữ liệu loại sách
  useEffect(() => {
    if (location.state === null) {
      setUserInputs({
        ma_loai: 0,
        ten_loai: "",
      });
    } else {
      let prev_data = location.state.prev_data;
      setUserInputs({
        ma_loai: prev_data.ma_loai,
        ten_loai: prev_data.ten_loai,
      });
    }
    async function getData() {
      let res = await axios.get("http://localhost:8081/loai-sach");
      setUserInputs({ ma_loai: res.data.length + 1, ten_loai: "" });
      setLoading(false);
    }
    if (location.state === null) getData();
    else setLoading(false);
  }, [location.state]);

  // Xử lý khi người dùng điền form
  const onChangeHandler = useCallback(
    ({ target: { id, value } }) =>
      setUserInputs((state) => {
        return {
          ...state,
          [id]: id === "ma_loai" ? parseInt(value) : value,
        };
      }),
    []
  );

  // Xử lý khi người dùng gửi form chỉnh sửa (thêm hoặc cập nhật sách)
  const handleSubmit = async (event) => {
    event.preventDefault();
    let user_input = userInputs;
    let method_http = location.state === null ? "post" : "put";
    let thong_bao =
      location.state === null
        ? "Đã thêm loại sách mới"
        : "Đã cập nhật loại sách";

    await axios
      .request({
        method: method_http,
        url: "http://localhost:8081/loai-sach",
        data: user_input,
      })
      .then((res) => {
        alert(thong_bao);
        console.log(res.data);
        if (location.state !== null) {
          navigate("/chinhsua");
        } else window.location.reload();
      })
      .catch((error) => {
        alert(`Error: ${error.message}`);
        console.error("There was a error!", error);
      });
  };

  // Xử lý hiển thị form
  const hien_thi_input = thong_tin.map((tt) => {
    let defaultValue = userInputs[tt];
    return (
      <div className="col-md-12">
        <label htmlFor={tt} className="form-label text-secondary">
          {tt}
        </label>
        <input
          type="text"
          className="form-control"
          id={tt}
          defaultValue={defaultValue}
          onChange={onChangeHandler}
          disabled={location.state !== null && tt === "ma_loai" ? true : false}
          required
        ></input>
      </div>
    );
  });

  // Trả về client
  return (
    <div className="container-fluid">
      <Header />
      <div className="container w-50 my-3">
        <h1 className="text-success my-3 text-center">Chỉnh sửa loại sách</h1>
        <div className="col-12">
          {isLoading ? (
            <div className="text-center">
              <LoadingData />
            </div>
          ) : (
            <form className="row g-3" onSubmit={handleSubmit}>
              {hien_thi_input}
              <div className="col-12">
                <button
                  className="btn btn-danger btn-lg float-end mx-2"
                  type="submit"
                >
                  Lưu
                </button>
                <Link
                  to="/"
                  className="btn btn-outline-black btn-lg float-end mx-2"
                >
                  Trở về trang chủ
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ChinhSuaLoaiSachForm;
