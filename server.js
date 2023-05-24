const express = require("express");
const { engine } = require("express-handlebars");
const fileUpload = require("express-fileupload")
const app = express();
const mysql = require("mysql");


const PORT = 5000;

app.use(fileUpload());

app.use(express.static("upload"))

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

//connection pool
const pool = mysql.createPool({
    connectionLimit:10,
    host:"localhost",
    user: "root",
    password: "root",
    database: "image-uploader-youtube",
    port: 8889,
})

app.get("/", (req, res)=>{
    res.render("home");

    pool.getConnection((err, connection) =>{
        if (err)  throw err;
        console.log("mysql接続中")

        //データ取得から
        connection.query("SELECT * FROM image", (err, rows) => {
            connection.release();
            console.log(rows)
        })
    });
});
app.post("/",(req, res)=>{
    if(!req.files){
        return res.status(400).send("何も画像がアップロードされていません。")
    }
    console.log(req.files)
let imageFile = req.files.imageFile;
let uploadPath = __dirname + "/upload/" + imageFile.name

//サーバーに画像ファイルを置く場所の指定
imageFile.mv(uploadPath, function(err){
    if(err) return res.status(500).send(err);
    res.send("画像アップロードに成功しました。")
})
})
app.listen(PORT, ()=> console.log("サーバー起動中"))