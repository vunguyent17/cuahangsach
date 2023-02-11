import TitleBar from "./title_bar";
import NavBarCHSach from "./nav_bar_chsach";
import DangNhap from "./dang_nhap";

function Header(props) {
  return (
    <div className="container-fluid shadow-sm px-0">
      <div className="row">
        <DangNhap />
      </div>
      <div className="row">
        <TitleBar tu_khoa={props.tu_khoa} setUpdateCart = {props.setUpdateCart} />
      </div>
      <div className="row">
        <NavBarCHSach />
      </div>
    </div>
  );
}

export default Header;
