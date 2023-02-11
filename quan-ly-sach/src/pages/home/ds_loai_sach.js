import { Link, Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import LoadingPage from "../utilities/loading_page";

function DanhSachLoaiSach(props) {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const server_url = process.env.REACT_APP_SERVER_URI;

  // Xử lý lấy dữ liệu
  useEffect(() => {
    axios.get(server_url+"/loai-sach").then((res) => {
      setData(res.data);
      setLoading(false);
    });
  }, [server_url]);

  const ds_loai_sach = data;
  const location = useLocation();

  // Xử lý hiển thị active mục "Tất cả"
  const dinh_dang_mac_dinh = "text-decoration-none text-success ";
  let dinh_dang_tat_ca = dinh_dang_mac_dinh;
  let active_tat_ca = "";
  if (location.state == null) {
    dinh_dang_tat_ca = dinh_dang_mac_dinh + " text-white";
    active_tat_ca = " active";
  }

  // Xử lý hiển thị từng loại sách
  let hien_thi_loai_sach = () =>
    ds_loai_sach.map((loai_sach) => {
      let dinh_dang_chon = "";
      let active_loai = "";
      if (
        location.state != null &&
        loai_sach.ma_loai === location.state.ma_loai
      ) {
        dinh_dang_chon = " text-white";
        active_loai = " active";
      }

      return (
        <li
          className={
            "list-group-item list-group-item-success list-group-item-action " +
            active_loai
          }
          key={loai_sach.ma_loai.toString()}
        >
          <Link
            to="/"
            state={{ ma_loai: loai_sach.ma_loai }}
            className={dinh_dang_mac_dinh + dinh_dang_chon}
            onClick={props.close_offcanvas}
          >
            {loai_sach.ten_loai}
          </Link>
        </li>
      );
    });

  // Trả về client
  return (
    <>
      {isLoading ? (
        <div className="my-3">
          <LoadingPage />
        </div>
      ) : (
        <div>
          <ul className="list-group list-group-flush">
            <li
              className={
                "list-group-item list-group-item-success list-group-item-action " +
                active_tat_ca
              }
              key={0}
            >
              <Link to="/" className={dinh_dang_tat_ca} onClick={props.close_offcanvas}>
                Tất cả
              </Link>
            </li>
            {hien_thi_loai_sach()}
          </ul>
          <Outlet />
        </div>
      )}
    </>
  );
}

export default DanhSachLoaiSach;
