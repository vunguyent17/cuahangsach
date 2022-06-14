import Header from "../template/header";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import { useState } from "react";
import ChinhSuaSach from "./chinh_sua_sach";
import ChinhSuaLoaiSach from "./chinh_sua_loai_sach";
import Footer from "../template/footer";

function ChinhSua() {
  const [show, setShow] = useState(false);

  // Tắt hay bật Offcanvas
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Trả về client
  return (
    <div className="container-fluid">
      <Header />
      <div className="container-fluid my-3">
      <h2 className="text-secondary fs-3">Chỉnh sửa danh mục sách</h2>
      <hr></hr>
      <Button variant="success" className = "my-3" onClick={handleShow}>
        Chỉnh sửa danh mục sách
      </Button>

      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header className="bg-success" closeButton closeVariant="white">
          <Offcanvas.Title className="text-white fs-3">Chỉnh sửa danh mục sách</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-0">
          <ChinhSuaLoaiSach />
        </Offcanvas.Body>
      </Offcanvas>
      </div>
      <ChinhSuaSach />
      <Footer />
    </div>
  );
}

export default ChinhSua;