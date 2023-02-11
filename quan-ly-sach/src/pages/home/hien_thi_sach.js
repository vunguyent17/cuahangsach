import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import { faCartPlus} from '@fortawesome/free-solid-svg-icons'
import LoadingPage from "../utilities/loading_page";
import axios from "axios";

function HienThiSach(props) {
  const [ds_loai_sach, setDSLoaiSach] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const server_url = process.env.REACT_APP_SERVER_URI;


  // Xử lý lấy dữ liệu
  useEffect(() => {
    async function fetchData() {
      const fetchLoaiSach = await axios.get(server_url+"/loai-sach/");
      setDSLoaiSach(fetchLoaiSach.data);
      setLoading(false);
    }
    fetchData();
    
  }, [server_url]);

  // Xử lý khi người dùng thêm sách vào giỏ hàng
  const handleAddCart = async (event) => {
    event.preventDefault();
    try {
      let data_masach = event.currentTarget.getAttribute("data-masach")
      let user_input = {
        username: await JSON.parse(localStorage.getItem("ch_sach_dang_nhap")).username,
        ma_sach: data_masach,
      };
      
      await axios
        .put(server_url+"/giohang", user_input)
        .then((res) => {
          props.setUpdateCart(true)
          alert(res.data);
        })
        .catch((error) => {
          alert(`Error: ${error.message}`);
          console.error("There was a error!", error);
        });
    } catch (error) {
      console.log(error)
      alert("Bạn phải đăng nhập mới có thể thêm sách vào giỏ hàng")
    }
  };

  // Xử lý hiển thị sách
  let hien_thi_sach = () => {
    return props.ds_sach.map((sach) => {
      let hinh_sach;
      if ( sach.hinh===""){
        hinh_sach = server_url+"/img/img-default.jpg";
      } else {
        hinh_sach = server_url+"/img/" + sach.hinh;
      }
      return (
        <div key={sach.ma_sach} className="col">
          <img
            src={hinh_sach}
            className="img-fluid py-2"
            alt={sach.ten_sach}
          ></img>
          <span className="text-secondary">
            {
              ds_loai_sach.find(
                (loai_sach) => loai_sach.ma_loai === sach.ma_loai
              ).ten_loai
            }
          </span>
          <hr className="mt-1"></hr>
          <div className="py-2" style={{ height: "8em" }}>
            <h5>
              <Link
                to="/chitietsach"
                state={{ ma_sach: sach.ma_sach }}
                className="text-secondary text-decoration-none"
              >
                {sach.ten_sach}
              </Link>
            </h5>
            <p>Tác giả: {sach.tac_gia} </p>
          </div>
          <p className="text-success fw-bold py-2">
            Giá bán: {sach.don_gia.toLocaleString()} đ
          </p>
          <button
            data-masach={sach.ma_sach}
            className="btn btn-outline-success rounded-pill border border-2 w-100"
            onClick={handleAddCart}
          >
            <FontAwesomeIcon icon={faCartPlus} /> Thêm vào giỏ
          </button>
        </div>
      );
    });
  };

  // Trả về client
  return (
    <div className="row row-cols-5 g-5">
      {isLoading ? (
        <div className="col-12 justify-content-center">
          <LoadingPage />
        </div>
      ) : (
        hien_thi_sach()
      )}
    </div>
  );
}

export default HienThiSach;
