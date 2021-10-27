let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let mysql = require('mysql');
const bcrypt = require('bcrypt');
// const router = require('./router');

// app.use(router)
let session = require('express-session');
const cookieSession = require('cookie-session');
// var session = require('express-session');
var path = require('path');
const { body,validationResult } = require('express-validator');
// const { Router } = require('express');

const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false 
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.set('client',path.join(__dirname,'../../client'));
app.set ( "view engine", "ejs" );
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // req methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // req headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-reqed-With,content-type');

    // Set to true if you need the website to include cookies in the reqs sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
// connection to mysql database
let dbCon = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'webproject'
    // timezone: 'utc'
})
dbCon.connect();
app.get('/all-sickbed', (req, res) => {
    dbCon.query(
        "SELECT a.sit_id as sit_id ,CONCAT(a.sick_name,' จำนวน ',a.sick_amount,' ตัว') as data_sickbed,a.sick_note,'  ',CONCAT('-- ',a.date_add,'--') as date_add,b.sit_name,CONCAT(d.pre_th_name,c.user_firstname,' ',c.user_lastname) as users, CONCAT('ติดต่อ : ',' ',c.user_phone) as user_phone FROM tbsick_bed as a INNER JOIN tbsick_status as b ON a.sit_id = b.sit_id INNER JOIN tbusers as c ON c.user_username = a.user_username INNER JOIN tbprefix as d ON d.prefix_id = c.prefix_id ORDER BY b.sit_name ASC;", (error, results, fields) => {
        if (error) throw error;

        let message = ""
        if (results === undefined || results.length == 0) {
            message = "Data is empty";
        } else {
            message = "Successfully";
        }
        return res.send({ error: false, data: results, message: message});
    })
})
// ------------------------------------------prefix---------------------------------------
app.get('/prefix', (req, res) => {
    dbCon.query(
        "SELECT prefix_id,pre_th_name FROM tbprefix;", (error, results, fields) => {
        if (error) throw error;

        let message = ""
        if (results === undefined || results.length == 0) {
            message = "Data is empty";
        } else {
            message = "Successfully";
        }
        return res.send({ error: false, data: results, message: message});
    })
})
//-------------------------------------Sex------------------------------
app.get('/sex', (req, res) => {
    dbCon.query(
        "SELECT sex_id,sex_name FROM tbsex;", (error, results, fields) => {
        if (error) throw error;

        let message = ""
        if (results === undefined || results.length == 0) {
            message = "Data is empty";
        } else {
            message = "Successfully";
        }
        return res.send({ error: false, data: results, message: message});
    })
})
// -------------------------------------Province-----------------------------------
app.get('/ReadProvince', (req, res) => {
    dbCon.query(
        "SELECT province_id,name_th FROM provinces ORDER BY name_th ASC;", (error, results, fields) => {
        if (error) throw error;

        let message = ""
        if (results === undefined || results.length == 0) {
            message = "Data is empty";
        } else {
            message = "Successfully";
        }
        return res.send({ error: false, data: results, message: message});
    })
})
// --------------------------------Amphures--------------------------------------
app.put('/ReadAmphures', (req, res) => {
    let province_id = req.body.province_id;

    if (!province_id) {
        return res.status(400).send({ error: true, message: "Plese input id"});
    } else {
        dbCon.query("SELECT amphure_id,name_th FROM amphures WHERE province_id = ?", [province_id], (error, results, fields) => {
            if (error) throw error;

            let message = "";
            if (results === undefined || results.length == 0) {
                message = "Data not found";
            } else {
                message = "Successfully";
            }

            return res.send({ error: false, data: results, message: message })
        })
    }
})
// ----------------------------------ReadDistrict-------------------------------
app.put('/ReadDistrict', (req, res) => {
    let amphure_id = req.body.amphure_id;

    if (!amphure_id) {
        return res.status(400).send({ error: true, message: "Please provide book id"});
    } else {
        dbCon.query("SELECT districts_id,name_th FROM districts WHERE amphure_id = ?", [amphure_id], (error, results, fields) => {
            if (error) throw error;

            let message = "";
            if (results === undefined || results.length == 0) {
                message = "Data not found";
            } else {
                message = "Successfully ";
            }

            return res.send({ error: false, data: results, message: message })
        })
    }
})
// ---------------------------------------------Insert Register-------------------------------
app.post('/registers', (req, res) => {
    let user_username = req.body.user_username;
    let user_passwords = req.body.user_passwords;
    let user_firstname = req.body.user_firstname;
    let user_lastname = req.body.user_lastname;
    let user_email = req.body.user_email;
    let user_phone = req.body.user_phone;
    let prefix_id = req.body.prefix_id;
    let sex_id = req.body.sex_id;
    let province_id = req.body.province_id;
    let amphure_id = req.body.amphure_id;
    let districts_id = req.body.districts_id;
    let user_passwords_conf = req.body.user_passwords_conf;
   
    // let hash_password = has(req.body.user_passwords);
    // validation
    if(user_passwords_conf !== user_passwords)
    {
        return res.send({ error: true, message: "รหัสผ่านของท่านไม่ตรงกัน"});
    }
    if(user_username === '' || user_passwords === '' || user_firstname === '' || user_lastname === '' || user_email === ''
    || user_phone === '' || prefix_id === '' || sex_id === '' || province_id === '' || amphure_id === '' || districts_id === ''
    ){
        return res.send({ error: true, message: "กรุณากรอกข้อมูลให้ครบถ้วน"});
        
    }
    else {
    if (user_passwords.length >= 6) {
        bcrypt.hash(user_passwords,12).then((hash_passwords) =>{
            dbCon.query('INSERT INTO tbusers(user_username,user_passwords,user_firstname,user_lastname,user_email,user_phone,prefix_id,sex_id,province_id,amphure_id,districts_id,roles_id)  VALUES(?, ?,?,?,?,?,?,?,?,?,?,1)', [user_username, hash_passwords,user_firstname,user_lastname,user_email,user_phone,prefix_id,sex_id,province_id,amphure_id,districts_id], (error, results, fields) => {
                if (error){
                    return res.send({ error: true, data: results, message: "โปรดลองอีกครั้งบัญชีนี้มีผู้ใช้แล้ว"})
                }
                else
                {
                return res.send({ error: false, data: results, message: "สมัครบัญชีผู้ใช้สำเร็จ"})
                }
                
            })
        })
    } else {
        return res.send({ error: true, message: "รหัสผ่านไม่น้อยกว่า 6 ตัวอักษร"});
        }
    }
});
app.post('/insert-sickbed', (req, res) => {
    
    let user_username = req.body.user_username;
    let sick_name = req.body.sick_name;
    let sick_amount = req.body.sick_amount;
    let sick_note = req.body.sick_note;
    let sit_id = req.body.sit_id;
    let districts_id = req.body.districts_id;
    let province_id = req.body.province_id;
    let amphure_id = req.body.amphure_id;
    let village = req.body.village;
   // session = req.session
    // session.user_username = req.body.sick_name
    // console.log(session.user_username)
   // console.log(session);
    // let hash_password = has(req.body.user_passwords);
    // validation
    if(user_username === '' || sick_name === '' || sick_amount === '' || sick_note === '' || sit_id === '' || districts_id === ''
  || province_id === '' || amphure_id === ''  || village ===''
    ){
        return res.send({ error: true, status : false});
    }
    else {
            dbCon.query('INSERT INTO tbsick_bed(sick_name,sick_amount,sick_note,sit_id,user_username,districts_id,province_id,amphure_id,village)  VALUES(?,?,?,2,?,?,?,?,?)', [sick_name,sick_amount,sick_note,user_username,districts_id,province_id,amphure_id,village], (error, results, fields) => {
                if (error) { 
                    return res.send({ error: true, data: results, message: "โปรดลองอีกครั้ง"})
                }
                else
                {
                return res.send({ error: false, data: results, status: true})
                }
            })
    }
});

// add a new book
app.post('/book', (req, res) => {
    let name = req.body.name;
    let author = req.body.author;

    // validation
    if (!name || !author) {
        return res.status(400).send({ error: true, message: "Please provide book name and author."});
    } else {
        dbCon.query('INSERT INTO books (name, author) VALUES(?, ?)', [name, author], (error, results, fields) => {
            if (error) throw error;
            return res.send({ error: false, data: results, message: "Book successfully added"})
        })
    }
});

// retrieve book by id 
app.get('/book/:id', (req, res) => {
    let id = req.params.id;

    if (!id) {
        return res.status(400).send({ error: true, message: "Please provide book id"});
    } else {
        dbCon.query("SELECT * FROM books WHERE id = ?", id, (error, results, fields) => {
            if (error) throw error;

            let message = "";
            if (results === undefined || results.length == 0) {
                message = "Book not found";
            } else {
                message = "Successfully retrieved book data";
            }

            return res.send({ error: false, data: results[0], message: message })
        })
    }
})

// update book with id 
app.put('/book', (req, res) => {
    let id = req.body.id;
    let name = req.body.name;
    let author = req.body.author;

    // validation
    if (!id || !name || !author) {
        return res.status(400).send({ error: true, message: 'Please provide book id, name and author'});
    } else {
        dbCon.query('UPDATE books SET name = ?, author = ? WHERE id = ?', [name, author, id], (error, results, fields) => {
            if (error) throw error;

            let message = "";
            if (results.changedRows === 0) {
                message = "Book not found or data are same";
            } else {
                message = "Book successfully updated";
            }

            return res.send({ error: false, data: results, message: message })
        })
    }
})

// delete book by id
app.delete('/book', (req, res) => {
    let id = req.body.id;

    if (!id) {
        return res.status(400).send({ error: true, message: "Please provide book id"});
    } else {
        dbCon.query('DELETE FROM books WHERE id = ?', [id], (error, results, fields) => {
            if (error) throw error;
            let message = "";
            if (results.affectedRows === 0) {
                message = "Book not found";
            } else {
                message = "Book successfully deleted";
            }
            return res.send({ error: false, data: results, message: message })
        })
    }
})

app.listen(3000, () => {
    console.log('Node App is running on port 3000');
})

module.exports = app;
