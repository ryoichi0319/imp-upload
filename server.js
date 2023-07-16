const express = require('express')
const app = express()
var bodyParser = require('body-parser');
const port = 5003

const mysql = require('mysql');
app.set('view engine', 'ejs');
app.get('/', function(req, res) {
  res.render('index');
});

app.use(express.static('link'))
app.use(bodyParser.urlencoded({ extended: true }));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  port:8889,
  database: 'test',

});
app.post('/save-data', function(req, res) {
  var name = req.body.name;
  var email = req.body.email;

  var data = {
    name: name,
    email: email
  };
  connection.query('INSERT INTO users SET ?', data, function(err, result) {
    if (err) {
      console.error('Error saving data:', err);
      res.status(500).send('Error saving data');
      return;
    }
    console.log('Data saved successfully');

    // 保存されたデータを取得するクエリ
    const selectQuery = 'SELECT * FROM users';

    connection.query(selectQuery, function(err, result) {
      if (err) {
        console.error('Error retrieving data:', err);
        res.status(500).send('Error retrieving data');
        return;
      }

      console.log('Retrieved data:', result);

      // resultを/save-dataに表示する
      res.render('save-data', { result: result });
    });
  });
});

  
  
  /// もしテーブルが１つもない状態なら…
  /// 代わりにデータベース名を表示してみよう
  /*
  const sql = "SELECT database()";
  connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Result: ", result);
  });
  */

//   pref_category = [
//     {category: 1, category_name: "東北"},
//     {category: 2, category_name: "関東"},
//     {category: 3, category_name: "関西"},
//   ]
// prefectures = [
//   {todoufuken_no: "m101", category: 1, todoufuken: "北海道" },
//   {todoufuken_no: "m102", category: 1, todoufuken: "青森" },
//   {todoufuken_no: "m103", category: 2, todoufuken: "栃木" },
//   {todoufuken_no: "m104", category: 3, todoufuken: "滋賀" },
//   {todoufuken_no: "m105", category: 3, todoufuken: "大阪" },
    
//   ]
    
// pref_category.forEach(function(pref_value){
//   console.log(pref_value.category_name)
//   prefectures.forEach(function(prefectures_value){
//     if(pref_value.category === prefectures_value.category){
//     console.log(prefectures_value.todoufuken)}
//   })
// })
  

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
