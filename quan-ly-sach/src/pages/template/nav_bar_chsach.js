/* eslint-disable jsx-a11y/anchor-is-valid */
import { Outlet, Link, useLocation } from "react-router-dom";
import SidebarLoaiSach from "./sidebar_loai_sach";

function NavBarCHSach() {
  const location = useLocation();
  const pathname = location.pathname;
  const user_info = JSON.parse(localStorage.getItem("ch_sach_dang_nhap"))

  //Hiển thị vị trí hiện tại trên navbar
  const active_style = "border-bottom border-success border-3 w-50 pb-2";

  //Hiển thị menu chỉnh sửa
  const hien_thi_menu_chinh_sua =
    user_info !== null && user_info.username ===
    "admin" ? (
      <li className="nav-item">
        <Link className="nav-link" to="/chinhsua">
          <span
            className={
              new RegExp("^/chinhsua").test(pathname) ? active_style : ""
            }
          >
            Chỉnh sửa
          </span>
        </Link>
      </li>
    ) : (
      ""
    );

  // Trả về client
  return (
    <nav className="nav navbar-green py-2">
      <div className="container">
        <ul className="nav nav-pills nav-fill justify-content-center">
          <li className="nav-item">
            <SidebarLoaiSach />
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/">
              <span className={pathname === "/" ? active_style : ""}>
                Trang chủ
              </span>
            </Link>
          </li>
          {hien_thi_menu_chinh_sua}
        </ul>
        <Outlet />
      </div>
    </nav>
  );
}

export default NavBarCHSach;
