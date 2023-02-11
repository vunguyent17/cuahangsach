import Header from "../template/header";
import DanhSachSach from "./ds_sach";
import Footer from "../template/footer";
import ScrollButton from "../utilities/scrollButton"
import { useState } from "react";

function Home() {
  const [, setUpdateCart] = useState(false);
  return (
    <div className="container-fluid">
      <Header setUpdateCart = {setUpdateCart}/>
      <DanhSachSach setUpdateCart = {setUpdateCart} />
      <Footer />
      <div className="position-relative">
        <ScrollButton />
      </div>
    </div>
  );
}

export default Home;
