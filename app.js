const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const cors = require("cors");
const corsOptions = {
    origin: '*',
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
}

app.use(cors(corsOptions)) // Use this after the variable declaration

//MYSQL
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'intern_management'
});

//Use MYSQL
// app.get('', (req,res)=>{
//     pool.getConnection((err, connection)=>{
//         if(err) throw err;
//         console.log(`connected as ID ${connection.threadId}`);
//         //query
//         connection.query('SELECT * FROM customers',(err,rows)=>{
//             connection.release();
//             if(!err){
//                 res.send(rows);
//             }else{
//                 console.log(err);
//             }
//         })
//     });
// });

//MANAGER APIS
app.get('/manager/:managerid', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log(`connected as ID ${connection.threadId}`);
        //query
        connection.query('SELECT ManagerID, Name, Email, PhoneNumber FROM manager WHERE ManagerID = ?', [req.params.managerid], (err, rows) => {
            connection.release();
            if (!err) {
                res.send(rows);
            } else {
                console.log(err);
            }
        })
    });
});
app.get('/manager', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log(`connected as ID ${connection.threadId}`);
        //query
        connection.query('SELECT ManagerID, Name, Email, PhoneNumber FROM manager', (err, rows) => {
            connection.release();
            if (!err) {
                res.send(rows);
            } else {
                console.log(err);
            }
        })
    });
});

app.post('/updatemanager', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log(`connected as ID ${connection.threadId}`);
        connection.query('UPDATE manager SET Name= ?, Email= ?, PhoneNumber= ? WHERE ManagerID= ?', [req.body.Name, req.body.Email, req.body.PhoneNumber, req.body.ManagerID], (err, rows) => {
            connection.release();
            if (!err) {
                res.send("Cập nhật thành công");
            } else {
                res.send("Cập nhật thất bại");
            }
        })
        // console.log(req.body);
    });
});
app.post('/addmanager', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log(`connected as ID ${connection.threadId}`);
        connection.query('INSERT INTO manager (ManagerID, Password, Name, Email, PhoneNumber) VALUES (?, ?, ?, ?, ?)', [req.body.ManagerID, req.body.Password, req.body.Name, req.body.Email, req.body.PhoneNumber], (err, rows) => {
            connection.release();
            if (!err) {
                res.send("Thêm thành công");
            } else {
                res.send("Thêm thất bại");
            }
        })
        // console.log(req.body);
    });
});
app.delete('/deletemanager', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log(`connected as ID ${connection.threadId}`);
        connection.query('DELETE FROM manager WHERE ManagerID = ?', [req.body.ManagerID], (err, rows) => {
            connection.release();
            if (!err) {
                res.send("Xóa thành công");
            } else {
                res.send("Xóa thất bại");
            }
        })
        // console.log(req.body);
    });
});

app.post('/updatepassword', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log(`connected as ID ${connection.threadId}`);
        connection.query('SELECT ManagerID, Password FROM manager WHERE ManagerID=? AND Password= ?', [req.body.ManagerID, req.body.OldPassword],(err, row)=>{
            if(row!=''){
                connection.query('UPDATE manager SET Password = ? WHERE ManagerID = ?', [req.body.NewPassword, req.body.ManagerID], (err, rows) => {
                    connection.release();
                    if (!err) {
                        res.send("Cập nhật thành công");
                        
                    } else {
                        res.send("Cập nhật thất bại");
                        
                    }
                })
            }else{
                res.send("error");
            }
        })
        // console.log(req.body);
    });
});

//INTERN APIS
//GET ONE
app.get('/intern/:internid', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log(`connected as ID ${connection.threadId}`);
        //query
        connection.query('SELECT * FROM intern WHERE InternID = ?', [req.params.internid], (err, rows) => {
            connection.release();
            if (!err) {
                res.send(rows);
            } else {
                console.log(err);
            }
        })
    });
});
// GET ALL
app.get('/intern', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log(`connected as ID ${connection.threadId}`);
        //query
        connection.query('SELECT * FROM intern', (err, rows) => {
            connection.release();
            if (!err) {
                res.send(rows);
            } else {
                console.log(err);
            }
        })
    });
});

//LOGIN API
app.post('/login', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log(`connected as ID ${connection.threadId}`);
        //query
        let taiKhoan = { name: req.body.taiKhoan };
        let matKhau = { name: req.body.matKhau };
        connection.query('SELECT ManagerID FROM manager WHERE ManagerID = ? AND Password = ?', [req.body.taiKhoan, req.body.matKhau], (err, rows) => {
            connection.release();
            if (!err) {
                res.send(rows);
            } else {
                console.log(err);
            }
        })
    });
});

//TASK APIS
app.get('/task', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log(`connected as ID ${connection.threadId}`);
        //query
        connection.query('SELECT * FROM task', (err, rows) => {
            connection.release();
            if (!err) {
                res.send(rows);
            } else {
                console.log(err);
            }
        })
    });
});


//Liten on env
app.listen(port, () => console.log('listening'));