import Header from "../template/header";
import Footer from "../template/footer";
import { useState, useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import LoadingData from "../utilities/loading_data";
const FormData = require("form-data");

function ChinhSuaSachForm() {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const location = useLocation();
  const [userInputs, setUserInputs] = useState({});
  const navigate = useNavigate();
  const server_url = process.env.REACT_APP_SERVER_URI;

  // Gán dữ liệu sách được nhận nếu có (trường hợp sử dữ liệu sách)
  useEffect(() => {
    axios.get(server_url + "/loai-sach").then((res) => {
      setData(res.data);
      setLoading(false);
    });
    if (location.state.prev_data === undefined) {
      setUserInputs({
        isbn: "",
        ma_sach: "",
        ten_sach: "",
        tac_gia: "",
        nha_xuat_ban_id: "",
        don_gia: "",
        nam_xuat_ban: "",
        nha_xuat_ban: "",
        ma_loai: 1,
        hinh: "",
      });
    } else {
      let prev_data = location.state.prev_data;
      delete prev_data["_id"];
      setUserInputs(prev_data);
    }
  }, [location.state, server_url]);

  // Xử lý khi người dùng nhập hoặc sửa thông tin
  const onChangeHandler = useCallback(
    ({ target: { id, value } }) =>
      setUserInputs((state) => {
        let intFields = ["don_gia", "nam_xuat_ban", "ma_loai"];
        return {
          ...state,
          [id]:
            intFields.findIndex((field) => id === field) !== -1
              ? parseInt(value)
              : value,
        };
      }),
    []
  );

  // Xử lý khi người dùng submit form, bao gồm cả file hình ảnh
  const disableButton = () => {
    let btnSave = document.getElementById("btnSave");
    btnSave.disabled = true;
    btnSave.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Đang lưu ...';
  }
  const handleSubmit = async (event) => {
    event.preventDefault();
    disableButton();

    // - Lấy tên file
    let imageElement = document.getElementById("file_anh_sach");
    let fullPath = imageElement.value;
    let filename = "";
    if (fullPath) {
      let startIndex =
        fullPath.indexOf("\\") >= 0
          ? fullPath.lastIndexOf("\\")
          : fullPath.lastIndexOf("/");
      filename = fullPath.substring(startIndex);
      if (filename.indexOf("\\") === 0 || filename.indexOf("/") === 0) {
        filename = filename.substring(1);
      }
    }

    // - Đưa dữ liệu người dùng nhập và tên file vào db
    let user_input = userInputs;
    user_input["hinh"] = filename;

    // - Thêm sách mới hoặc cập nhật sách vào db
    let method_http = location.state.prev_data === undefined ? "post" : "put";
    let url_http =
      location.state.prev_data === undefined
        ? server_url + "/sach"
        : server_url + "/sach/" + userInputs.ma_sach;
    let thong_bao =
      location.state.prev_data === undefined
        ? "Đã thêm sách mới"
        : "Đã cập nhật sách";

    await axios
      .request({
        method: method_http,
        url: url_http,
        data: user_input,
      })
      .then((res) => {
        alert(thong_bao);
        console.log(res.data);
        if (location.state.prev_data !== undefined) {
          navigate("/chinhsua");
        } else window.location.reload();
      })
      .catch((error) => {
        alert(`Error: ${error.message}`);
        console.error("There was a error!", error);
      });

    // - Thêm file ảnh sách vào kho lưu trữ ảnh trên server
    let imagefile = imageElement.files[0];
    const formData = new FormData();
    formData.append("image", imagefile);
    console.log(imagefile);
    console.log(formData.get("image"));
    axios
      .post(server_url + `/sach/upload-anh`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        console.log({ res });
      })
      .catch((err) => {
        console.error({ err });
      });
  };

  const thong_tin = [
    "isbn",
    "ma_sach",
    "ten_sach",
    "tac_gia",
    "nha_xuat_ban_id",
    "don_gia",
    "nam_xuat_ban",
    "nha_xuat_ban",
    "ma_loai",
  ];

  // Xử lý hiển thị form
  const hien_thi_input = () => thong_tin.map((tt) => {
    let label = (
      <label htmlFor={tt} className="form-label text-secondary">
        {tt}
      </label>
    );
    let input_area;
    if (tt === "ma_loai") {
      let options = data.map((loaisach) => (
        <option value={loaisach.ma_loai}>
          {loaisach.ma_loai} - {loaisach.ten_loai}
        </option>
      ));
      input_area = (
        <select
          name="loaisach"
          id="ma_loai"
          className="form-select"
          required
          onChange={onChangeHandler}
          defaultValue={userInputs[tt]}
        >
          {options}
        </select>
      );
    } else {
      input_area = (
        <input
          type="text"
          className="form-control"
          id={tt}
          required
          onChange={onChangeHandler}
          defaultValue={userInputs[tt]}
        ></input>
      );
    }
    return (
      <div className="col-md-12">
        {label}
        {input_area}
      </div>
    );
  });

  // Xử lý đưa file lên phần input file và hiển thị ảnh sách trong form
  if (document.readyState === "complete" && userInputs.hinh !== "") {
    // Document already fully loaded
    if (location.state.prev_data !== undefined) loadPhotoType();
  } else {
    // Add event listener for DOMContentLoaded (fires when document is fully loaded)
    document.addEventListener("DOMContentLoaded", loadPhotoType);
  }

  function loadPhotoType() {
    loadURLToInputFiled(server_url + "/public/img/" + userInputs.hinh);
  }

  function loadURLToInputFiled(url) {
    getImgURL(url, (imgBlob) => {
      // Load img blob to input
      // WIP: UTF8 character error
      let fileName = userInputs.hinh;
      let file = new File(
        [imgBlob],
        fileName,
        { type: "image/jpg", lastModified: new Date().getTime() },
        "utf-8"
      );
      let container = new DataTransfer();
      container.items.add(file);
      document.querySelector("#file_anh_sach").files = container.files;
      let urlCreator = window.URL || window.webkitURL;
      let imageUrl = urlCreator.createObjectURL(imgBlob);
      document.querySelector("#anh_sach").src = imageUrl;
    });
  }
  // xmlHTTP return blob respond
  function getImgURL(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      callback(xhr.response);
    };
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.send();
  }

  // Xử lý hiển thị khi cập nhật ảnh sách mới
  const handleFileChange = (event) => {
    document.querySelector("#anh_sach").src = URL.createObjectURL(
      event.target.files[0]
    );
  };

  // Trả về client
  return (
    <div className="container-fluid">
      <Header />
      <div className="container w-50 my-3">
        <h1 className="text-success my-3 text-center">
          {location.state.title}
        </h1>
        <div className="col-12">
          {isLoading ? (
            <LoadingData />
          ) : (
            <form
              className="row g-3"
              method="post"
              encType="multipart/form-data"
              onSubmit={handleSubmit}
            >
              {hien_thi_input()}
              <div className="col-12">
                <label htmlFor="anh_sach" className="form-label text-secondary">
                  Ảnh sách
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="file_anh_sach"
                  accept="image/*"
                  onChange={handleFileChange}
                ></input>
                <img
                  id="anh_sach"
                  className="w-25 m-3"
                  alt={userInputs.ten_sach}
                ></img>
              </div>
              <div className="col-12">
                <button id="btnSave"
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

export default ChinhSuaSachForm;
