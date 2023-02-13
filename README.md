# Cửa Hàng Sách Website

<img src="https://github.com/vunguyent17/cuahangsach/blob/main/Screenshots/Picture1.png" data-canonical-src="https://github.com/vunguyent17/cuahangsach/blob/main/Screenshots/Picture1.png" style="display:block; margin-left: auto; margin-right: auto; width: 80%" alt="Trang chủ" />

## Giới thiệu / Introduction

Cửa Hàng Sách Website là ứng dụng web cho phép khách hàng có thể xem danh mục và chi tiết các đầu sách, tìm kiếm, tạo tài khoản và tiến hành đặt hàng mua sách.


Cửa Hàng Sách Website is a web application that allows users to browse and find information about books, create account and send orders to bookstore.


### Chức năng của ứng dụng / Functionality:
- Hiển thị danh sách các sách, thể loại sách
- Hiển thị thông tin chi tiết liên quan đến sách
- Tìm kiếm sách, lọc hiển thị sách theo thể loại
- Đăng nhập, Đăng ký tài khoản
- Thêm sách vào giỏ hàng, tiến hành đặt hàng, xuất hóa đơn
- (Cho tài khoản Admin) Thêm, xóa, sửa sách, loại sách trong cơ sở dữ liệu

 <br/>

- Display book categories, book details
- Browse and search book by name
- Sign up, log in
- Add books to cart, order books, export receipt
- (Admin account) Add, Update, Delete book data in database

### Công nghệ sử dụng / Tech stack:
- MERN stack
- Deploy database on MongoDB Atlas, backend server on render.com, client application on netlify


## Demo
[Link video demo](https://drive.google.com/file/d/1CPeXM-KrIgxk5_Hl1L76cXSQAfOE3wlH/view?usp=sharing)
<br/>
[Link website](https://cuahangsach.netlify.app/)

## Set up project locally
### Prerequisites
- NodeJS
- MongoDB

### Installation

1. Clone the repo

2. Create database
- Create MongoDB Database `quan_ly_sach` on local.
- Create collections: hoadon, loaisach, sach, users
- Import JSON files (`loaisach.json`, `sach.json`, `users.json`) in repo to each corresponding collection

3. Run web server:
- Run `npm install .` to install node modules
- In the server folder, run `node ./src/server.js` to run web server at localhost:8081

4. Run web client:
- Run `npm install .` to install node modules
- Run `npm start` to run web client at localhost:3000

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
