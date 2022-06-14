/* eslint-disable jsx-a11y/anchor-is-valid */
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LoadingData from "../utilities/loading_data";

function ChinhSuaSach() {
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);

  // Xử lý dữ liệu tải dữ liệu sách
  useEffect(() => {
    async function fetchData() {
      const fetchSach = await axios.get("http://localhost:8081/sach/all");
      setData(fetchSach.data);
      setLoading(false);
    }
    fetchData();
  }, []);

  // Xử lý khi người dùng xóa dữ liệu sách
  const handleDelete = (event) => {
    event.preventDefault();
    let ma_sach = event.target.getAttribute("data-masach");
    async function deleteData() {
      await axios
        .delete("http://localhost:8081/sach/" + ma_sach)
        .then((res) => {
          alert(`Đã xóa ${res.data.deletedCount} sách thành công`);
          window.location.reload();
        })
        .catch((error) => {
          alert(`Error: ${error.message}`);
          console.error("There was a error!", error);
        });
    }
    deleteData();
  };

  // Xử lý hiển thị bảng sách
  const hien_thi_sach = (ds_sach) => {
    let hien_thi_bang_sach = ds_sach.map((sach) => (
      <tr key={sach.ma_sach}>
        <td className="text-nowrap">{sach.isbn}</td>
        <td>
          <strong>{sach.ma_sach}</strong>
        </td>
        <td className="text-wrap">{sach.ten_sach}</td>
        <td>{sach.tac_gia}</td>
        <td>{sach.nha_xuat_ban_id}</td>
        <td>{(sach.don_gia).toLocaleString()}</td>
        <td>{sach.nam_xuat_ban}</td>
        <td>{sach.nha_xuat_ban}</td>
        <td>{sach.ma_loai}</td>
        <td className="text-nowrap">{sach.hinh}</td>
        <td className="text-nowrap">
          <Link
            to="sach/form"
            state={{ prev_data: sach }}
            className="btn btn-primary btn-sm "
            role="button"
          >
            Sửa
          </Link>
          <a
            className="btn btn-danger btn-sm "
            data-masach={sach.ma_sach}
            onClick={handleDelete}
            role="button"
          >
            Xóa
          </a>
        </td>
      </tr>
    ));
    return hien_thi_bang_sach;
  };

  // Trả về client
  return (
    <div className="container-fluid">
      <form className="row g-3 py-3">
        <div className="col-12">
          <h2 className="text-secondary fs-3">Chỉnh sửa thông tin sách</h2>
          <hr></hr>
          <Link to="sach/form" className="btn btn-primary">
            + Thêm sách
          </Link>
          {isLoading ? (
            <div className="text-center">
              {" "}
              <LoadingData />{" "}
            </div>
          ) : (
            <table className="table table-responsive table-striped small">
              <thead>
                <tr>
                  <th scope="col">isbn</th>
                  <th scope="col">ma_sach</th>
                  <th scope="col">ten_sach</th>
                  <th scope="col">tac_gia</th>
                  <th scope="col">nha_xuat_ban_id</th>
                  <th scope="col">don_gia</th>
                  <th scope="col">nam_xuat_ban</th>
                  <th scope="col">nha_xuat_ban</th>
                  <th scope="col">ma_loai</th>
                  <th scope="col">hinh</th>
                  <th scope="col">Tác vụ</th>
                </tr>
              </thead>
              <tbody>{hien_thi_sach(data)}</tbody>
            </table>
          )}
        </div>
      </form>
    </div>
  );
}

export default ChinhSuaSach;
