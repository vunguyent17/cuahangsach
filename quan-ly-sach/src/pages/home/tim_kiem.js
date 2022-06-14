import Header from "../template/header";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Footer from "../template/footer";
import axios from "axios";
import LoadingData from "../utilities/loading_data";
import HienThiSach from "./hien_thi_sach";

function TimKiem() {
  const [ds_sach, setDSSach] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const location = useLocation();

  const tu_khoa = location.state.tu_khoa;

  // Xử lý dữ liệu
  useEffect(() => {
    let ds_sach_get = async () => {
      let res = await axios.get("http://localhost:8081/timkiem/" + tu_khoa);
      setDSSach(res.data);
      setLoading(false);
    };
    ds_sach_get();
  }, [tu_khoa]);

  // Trả về client
  return (
    <div className="container-fluid">
      <Header tu_khoa={tu_khoa} />
      <div className="container py-3">
        <div className="row">
          <p className="fs-2 py-3">
            <strong>Kết quả tìm kiếm tên sách có từ khóa </strong>:{" "}
            <span className="text-success">{tu_khoa}</span>
          </p>
        </div>
        {isLoading ? (
          <LoadingData />
        ) : ds_sach.length === 0 ? (
          <p className="fs-3 text-center">
            Không tìn thấy sách có từ khóa bạn cần tìm :&#40;
          </p>
        ) : (
          <HienThiSach ds_sach={ds_sach} />
        )}
      </div>
      <Footer />
    </div>
  );
}

export default TimKiem;
