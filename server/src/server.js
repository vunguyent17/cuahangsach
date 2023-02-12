require('dotenv').config();
var sanitize = require('mongo-sanitize');

let http = require("http");
let express = require("express");
const bcrypt = require("bcrypt");
const saltRounds = 10;
let cors = require("cors");
let app = express();

const path = require("path");
const publicDirectoryPath = path.resolve(__dirname, '../public');
app.use(express.static(publicDirectoryPath));

let MongoClient = require("mongodb").MongoClient;
let url = process.env.RENDER_MONGODB_URI;
app.use(cors());
app.get("/", function (req, res) {
  res.send("Chào các bạn");
});

let bodyParser = require("body-parser");
const { unlink } = require("fs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Lấy hình ảnh
app.get("/public/img/:ten_file_anh", (req, res) => {
  let ten_file_anh = sanitize(req.params.ten_file_anh);
  let options = {
    root: path.join(path.resolve(__dirname, '../')),
  };
  if (ten_file_anh !== "undefined")
    res.sendFile("/public/img/" + ten_file_anh, options, function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Sent: ", ten_file_anh);
      }
    });
});

// Truy xuất loại sách từ db
app.get("/loai-sach", async (req, res) => {
  const client = await MongoClient.connect(url);
  const ql_sach_db = client.db("quan_ly_sach");
  let loai_sach_collect = ql_sach_db.collection("loaisach");
  const dsls = await loai_sach_collect.find().toArray();
  res.send(dsls);
});

// Thêm loại sách vào db
app.post("/loai-sach", async (req, res) => {
  const new_loai_sach = SanitizeObj(req.body);
  const client = await MongoClient.connect(url);
  const ql_sach_db = client.db("quan_ly_sach");
  let loai_sach_collect = ql_sach_db.collection("loaisach");
  try {
    loai_sach_collect.insertOne(new_loai_sach);
  } catch (error) {
    console.log(error);
  }
  const kq_loai_sach = await loai_sach_collect.find().toArray();
  res.send(kq_loai_sach);
});

// Sửa loại sách trong db
app.put("/loai-sach", async (req, res) => {
  const data = SanitizeObj(req.body);
  const client = await MongoClient.connect(url);
  const ql_sach_db = client.db("quan_ly_sach");
  let loai_sach_collect = ql_sach_db.collection("loaisach");
  let query = { ma_loai: data.ma_loai };
  const kq_cap_nhat = await loai_sach_collect.updateOne(query, { $set: data });
  res.send(kq_cap_nhat);
});

// Xóa loại sách trong db
app.delete("/loai-sach/:maloai", async (req, res) => {
  let ma_loai_url = parseInt(sanitize(req.params.maloai));
  const client = await MongoClient.connect(url);
  const ql_sach_db = client.db("quan_ly_sach");
  let sach_collect = ql_sach_db.collection("sach");
  let query = { ma_loai: ma_loai_url };
  const ds_sach_theo_loai = await sach_collect.find(query).toArray();
  if (ds_sach_theo_loai.length > 0) {
    res.send("Không xóa thành công. Còn sách trong danh mục này.");
  } else {
    const kq_xoa = await ql_sach_db.collection("loaisach").deleteOne(query);
    res.send(`Đã xóa ${kq_xoa.deletedCount} thành công`);
  }
});

// Truy xuất dữ liệu tất cả các sách trong db
app.get("/sach/all", async (req, res) => {
  const client = await MongoClient.connect(url);
  const ql_sach_db = client.db("quan_ly_sach");
  let sach_collect = ql_sach_db.collection("sach");
  const ds_sach = await sach_collect.find().toArray();
  res.send(ds_sach);
});

// Truy xuất dữ liệu các sách theo mã loại từ db
app.get("/sach/loai/:maloai", async (req, res) => {
  let ma_loai_url = parseInt(sanitize(req.params.maloai));
  const client = await MongoClient.connect(url);
  const ql_sach_db = client.db("quan_ly_sach");
  let sach_collect = ql_sach_db.collection("sach");

  let query = { ma_loai: ma_loai_url };
  const ds_sach_theo_loai = await sach_collect.find(query).toArray();
  res.send(ds_sach_theo_loai);
});

// Truy xuất dữ liệu 1 sách trong db
app.get("/sach/:masach", async (req, res) => {
  let ma_sach_url = sanitize(req.params.masach);
  const client = await MongoClient.connect(url);
  const ql_sach_db = client.db("quan_ly_sach");
  let sach_collect = ql_sach_db.collection("sach");

  let query = { ma_sach: ma_sach_url };
  const kq_sach = await sach_collect.find(query).toArray();
  res.send(kq_sach);
});

// Xóa dữ liệu 1 sách trong db + xóa ảnh trong server
app.delete("/sach/:masach", async (req, res) => {
  let ma_sach_url = sanitize(req.params.masach);
  const client = await MongoClient.connect(url);
  const ql_sach_db = client.db("quan_ly_sach");
  let sach_collect = ql_sach_db.collection("sach");
  let query = { ma_sach: ma_sach_url };
  const sach = await sach_collect.find(query).toArray();
  try {
    unlink(
      "./public/img/" +
        sach[0].hinh,
      (err) => {
        if (err) console.log(err);
      }
    );
    console.log("/public/img/" + sach[0].hinh + " đã được xóa");
  } catch (error) {
    console.log("Xóa không thành công");
  }
  const kq_sach = await sach_collect.deleteOne(query);
  res.send(kq_sach);
});

// Truy xuất dữ liệu các sách theo từ khóa
app.get("/timkiem/:tukhoaurl", async (req, res) => {
  let tu_khoa = sanitize(req.params.tukhoaurl);
  const client = await MongoClient.connect(url);
  const ql_sach_db = client.db("quan_ly_sach");
  const sach_collect = ql_sach_db.collection("sach");
  let query = { ten_sach: new RegExp(tu_khoa, "i") };
  const kq_sach = await sach_collect.find(query).toArray();
  res.send(kq_sach);
});

// Gửi form đăng nhập truy xuất thông tin người dùng
app.post("/dangnhap", async (req, res) => {
  const username = sanitize(req.body.username);
  const password = sanitize(req.body.password);
  const client = await MongoClient.connect(url);
  const ql_sach_db = client.db("quan_ly_sach");
  let users_collect = ql_sach_db.collection("users");

  let query = { username: username };
  let kq_user = await users_collect.find(query).toArray();

  if (kq_user.length > 0)
  {
    let auth_res = false;
    await bcrypt
        .compare(password, kq_user[0].password)
        .then(_auth_res => {
          auth_res = _auth_res;
        })
        .catch(err => console.error(err.message))
    if (!auth_res)
    {
      kq_user.data = [];
    } 
  }
  res.send(kq_user);
});

// Thêm người dùng mới vào db
app.post("/dangky", async (req, res) => {
  let new_user = SanitizeObj(req.body);
  await bcrypt
  .genSalt(saltRounds)
  .then(salt => {
    return bcrypt.hash(sanitize(new_user.password), salt)
  })
  .then(hash => {
    new_user.password = hash;
  })
  .catch(err => console.error(err.message))
  new_user.cart = [];
  const client = await MongoClient.connect(url);
  const ql_sach_db = client.db("quan_ly_sach");
  let users_collect = ql_sach_db.collection("users");
  try {
    users_collect.insertOne(new_user);
  } catch (error) {
    console.log(error);
  }
  res.send(new_user);
});

// Thêm dữ liệu sách mới vào db
app.post("/sach", async (req, res) => {
  const new_sach = SanitizeObj(req.body);
  const client = await MongoClient.connect(url);
  const ql_sach_db = client.db("quan_ly_sach");
  let sach_collect = ql_sach_db.collection("sach");
  try {
    sach_collect.insertOne(new_sach);
  } catch (error) {
    console.log(error);
  }
  const kq_sach = await sach_collect.find().toArray();
  res.send(kq_sach);
});

// Cập nhật dữ liệu sách
app.put("/sach/:ma_sach", async (req, res) => {
  const data = SanitizeObj(req.body);
  const client = await MongoClient.connect(url);
  const ql_sach_db = client.db("quan_ly_sach");
  let sach_collect = ql_sach_db.collection("sach");
  let query = { ma_sach: sanitize(req.params.ma_sach) };
  const sach_cu = await sach_collect.find(query).toArray();
  if (sach_cu && sach_cu[0].hinh !== data.hinh) {
    try {
      unlink(
        "./public/img/" +
          sach_cu[0].hinh,
        (err) => {
          if (err) console.log(err);
        }
      );
      console.log("/public/img/" + sach_cu[0].hinh + "đã được xóa");
    } catch (error) {
      console.log("Xóa không thành công");
    }
    const kq_cap_nhat = await sach_collect.updateOne(query, { $set: data });
    res.send(kq_cap_nhat);
  }
  else {
    res.send("Không thể cập nhật");
  }

});

// Thêm ảnh mới vào kho lưu trữ trên server
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/img/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });
app.post(
  "/sach/upload-anh",
  upload.single("image"),
  function (req, res) {
    res.sendStatus(200);
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

// Sửa giỏ hàng: thêm sách, cập nhật số lượng sách
app.put("/giohang", async (req, res) => {
  let username_find = sanitize(req.body.username);
  let ma_sach_add = sanitize(req.body.ma_sach);
  let so_luong_add = sanitize(req.body.so_luong);
  if (ma_sach_add=== null || so_luong_add === null){
    res.send("Không thể cập nhật giỏ hàng. Xin hãy thử lại")
    return;
  }
  let result = "";
  const client = await MongoClient.connect(url);
  const ql_sach_db = client.db("quan_ly_sach");
  let users_collect = ql_sach_db.collection("users");
  try {
    let kq_update_sl;
    //Truong hop co sach trong gio hang:
    let update_query =
      so_luong_add === undefined
        ? { $inc: { "cart.$.so_luong": 1 } }
        : { $set: { "cart.$.so_luong": so_luong_add } };
    kq_update_sl = await users_collect.findOneAndUpdate(
      { username: username_find, "cart.ma_sach": ma_sach_add },
      update_query
    );
    //Truong hop khong co sach trong gio hang: them 1 sach (tu trang chu) hoac n sach tu trang chi tiet
    if (kq_update_sl.value === null) {
      let kq_add = await users_collect.updateOne(
        { username: username_find },
        {
          $addToSet: {
            cart: {
              ma_sach: ma_sach_add,
              so_luong: so_luong_add === undefined ? 1 : so_luong_add,
            },
          },
        }
      );
      if (kq_add.matchedCount == 1) {
        result = "Thêm sách mới vào giỏ hàng";
      }
    } else {
      result = "Đã cập nhật số lượng";
    }
  } catch (error) {
    console.log(error);
  }
  res.send(result);
});

// Xóa sách ra khỏi giỏ hàng
app.delete("/giohang", async (req, res) => {
  let username_find = sanitize(req.body.username);
  let ma_sach_del = sanitize(req.body.ma_sach);
  let kq_update
  const client = await MongoClient.connect(url);
  const ql_sach_db = client.db("quan_ly_sach");
  let users_collect = ql_sach_db.collection("users");
  try {
    let query_find = { username: username_find };
    let query_update =
      Array.isArray(ma_sach_del)
        ? { $pull: { cart: { ma_sach: { $in: ma_sach_del } } } }
        : { $pull: { cart: { ma_sach: ma_sach_del } } };
    kq_update = await users_collect.updateOne(query_find, query_update);
  } catch (error) {
    console.log(error);
  }
  res.send(kq_update);
});

// Thêm hóa đơn vào db
app.post("/hoadon", async (req, res) => {
  const new_hoa_don = SanitizeObj(req.body);
  const client = await MongoClient.connect(url);
  const ql_sach_db = client.db("quan_ly_sach");
  let hoa_don_collect = ql_sach_db.collection("hoadon");
  try {
    hoa_don_collect.insertOne(new_hoa_don);
  } catch (error) {
    console.log(error);
  }
  const kq_hoa_don = await hoa_don_collect.find().toArray();
  res.send(kq_hoa_don);
});

function SanitizeObj(obj){
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      obj[key] = sanitize(obj[key]);
    }
  }
  return obj;

}


let server = app.listen(process.env.PORT || 8081, function () {
  let host = server.address().address;
  let port = server.address().port;

  console.log(`Example app listening at http://${host}:${port}`);
});


