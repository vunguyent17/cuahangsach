/* eslint-disable jsx-a11y/anchor-is-valid */
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import LoadingData from "../utilities/loading_data";

function ChinhSuaLoaiSach() {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const server_url = process.env.REACT_APP_SERVER_URI;

  // Xử lý lấy dữ liệu loại sách
  useEffect(() => {
    axios.get(server_url+"/loai-sach").then((res) => {
      setData(res.data);
      setLoading(false);
    });
  }, [server_url]);

  // Xử lý khi xóa một loại sách
  const handleDelete = (event) => {
    event.preventDefault();
    setLoading(true);
    let ma_loai = event.target.getAttribute("data-maloai");
    async function deleteData() {
      await axios
        .delete(server_url+"/loai-sach/" + ma_loai)
        .then((res) => {
          alert(res.data);
          window.location.reload();
        })
        .catch((error) => {
          alert(`Error: ${error.message}`);
          console.error("There was a error!", error);
        });
    }
    deleteData();
    setLoading(false);
  };

  // Xử lý hiển thị loại sách kèm tác vụ
  const ds_loai_sach = data;
  const hien_thi_loai_sach = () => ds_loai_sach.map((loai_sach) => (
      <li
        className={"list-group-item list-group-item-success"}
        key={loai_sach.ma_loai.toString()}
      >
        <div>
          {loai_sach.ten_loai}

          <div className="float-end">
            <Link
              to="/chinhsua/loaisach/form"
              state={{ prev_data: loai_sach, title: "Sửa thông tin loại sách" }}
              className="btn btn-primary btn-sm mx-2"
              role="button"
            >
              Sửa
            </Link>
            <a
              className="btn btn-danger btn-sm mx-2"
              data-maloai={loai_sach.ma_loai}
              role="button"
              onClick={handleDelete}
            >
              Xóa
            </a>
          </div>
        </div>
      </li>
    ));

  // Trả về client
  return (
    <>
      <ul className="list-group list-group-flush">
        <li
          className={
            "list-group-item list-group-item-success list-group-item-action d-grid"
          }
          key={"themloaisach"}
        >
          <Link
            to="/chinhsua/loaisach/form"
            className="btn btn-primary "
            state={{title: "Thêm thông tin loại sách mới"}}
            role="button"
          >
            + Thêm loại sách
          </Link>
        </li>
        {isLoading ? (
          <div className="my-3">
            <LoadingData />
          </div>
        ) : (
          hien_thi_loai_sach()
        )}
      </ul>
      <Outlet />
    </>
  );
}

export default ChinhSuaLoaiSach;
