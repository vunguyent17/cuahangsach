import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import LoadingPage from "../utilities/loading_page";
import HienThiSach from "./hien_thi_sach";

function DanhSachSach(props) {
  const [data, setData] = useState([]);
  const [ds_loai_sach, setDSLoaiSach] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const location = useLocation();
  const server_url = process.env.REACT_APP_SERVER_URI;

  // Xử lý lấy dữ liệu
  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      const fetchLoaiSach = await axios.get(server_url+"/loai-sach/");
      let fetchSach;
      if (location.state == null) {
        fetchSach = await axios.get(server_url+"/sach/all");
      } else {
        const { ma_loai } = location.state;
        fetchSach = await axios.get(
          server_url+"/sach/loai/" + ma_loai
        );
      }
      setDSLoaiSach(fetchLoaiSach.data);
      setData(fetchSach.data);
      setLoading(false);
    }
    fetchData();
  }, [location.state, server_url]);

  const ds_sach_theo_loai = data;
  let ten_loai = "";

  // Xử lý hiển thị
  try {
    ten_loai =
      location.state == null
        ? "Tất cả sách"
        : ds_loai_sach.find(
            (loai_sach) => loai_sach.ma_loai === ds_sach_theo_loai[0].ma_loai
          ).ten_loai;
  } catch (error) {
    ten_loai = "";
  }

  // Trả về client
  return (
    <div className="container py-3">
      <div className="row">
        <p className="fs-3 py-3">
          <strong>Loại sách</strong>:{" "}
          <span className="text-success">{ten_loai}</span>
        </p>
      </div>
      {isLoading ? (
        <LoadingPage />
      ) : (
          <HienThiSach ds_sach={ds_sach_theo_loai} setUpdateCart={props.setUpdateCart}/>
      )}
    </div>
  );
}

export default DanhSachSach;
