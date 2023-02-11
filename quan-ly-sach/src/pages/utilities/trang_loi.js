import Header from "../template/header"
import Footer from "../template/footer"
import { Link } from "react-router-dom"

function Error() {
  return (
    <div className="container-fluid">
      <Header />
      <h1 className="text-secondary text-center m-5">Trang bị lỗi hoặc không tồn tại</h1>
      <p className="text-center"><Link to="/" className="btn btn-link text-success">Quay trở lại trang chủ</Link></p>
      <Footer />
    </div>
    
  )
}

export default Error