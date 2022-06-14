import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import DanhSachLoaiSach from "../home/ds_loai_sach";
import { useState } from "react";

function SidebarLoaiSach() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="success" onClick={handleShow}>
        Danh mục sách
      </Button>

      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header className="bg-success" closeButton closeVariant="white">
          <Offcanvas.Title className="text-white fs-3">Danh mục sách</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-0">
          <DanhSachLoaiSach />
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default SidebarLoaiSach;
