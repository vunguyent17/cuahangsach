import {
  BrowserRouter, 
  Routes, // instead of "Switch"
  Route} from 'react-router-dom'
import Home from './home/home'
import ChiTietSach from './chitiet/chi_tiet_sach'
import GioHang from './giohang/gio_hang'
import DonHang from './giohang/don_hang'
import DangKy from './dangky/dang_ky'
import TimKiem from './home/tim_kiem'
import ChinhSua from './chinhsua/chinh_sua'
import ChinhSuaSachForm from './chinhsua/chinh_sua_sach_form'
import ChinhSuaLoaiSachForm from './chinhsua/chinh_sua_loai_sach_form'
import Error from './utilities/trang_loi'
import GiaoHang from './giohang/giao_hang'

function RouterBook() {
  
  return (
  <BrowserRouter>
  <div>  
    <Routes>
      <Route index element={<Home/>} />
      <Route path="*" element={<Error/>} />
      <Route path="chitietsach" element={<ChiTietSach/>} />
      <Route path="giohang" element={<GioHang/>} />
      <Route path="donhang" element={<DonHang/>}/>
      <Route path="giaohang" element={<GiaoHang/>}/>
      <Route path="timkiem" element={<TimKiem/>} />
      <Route path="dangky" element={<DangKy/>} />
      <Route path="chinhsua" element={<ChinhSua/>} />
      <Route path="chinhsua/sach/form" element={<ChinhSuaSachForm/>} />
      <Route path="chinhsua/loaisach/form" element={<ChinhSuaLoaiSachForm/>} />
    </Routes>
  </div>
  </BrowserRouter>
  )
}

export default RouterBook