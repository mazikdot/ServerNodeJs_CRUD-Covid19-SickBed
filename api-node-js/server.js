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
// app.use(session({
//     secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
//     saveUninitialized:true,
//     cookie: { maxAge: oneDay },
//     resave: false 
// }));

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
    database: 'webproject',
    timezone: 'utc'
})
dbCon.connect();
app.get('/all-sickbed', (req, res) => {
    const myBackslash = `\\`;
    dbCon.query(
        "SELECT a.sit_id as sit_id ,CONCAT(a.sick_name,' จำนวน ',a.sick_amount,' ตัว') as data_sickbed,CONCAT('หมายเหตุ ',a.sick_note) as sick_note,CONCAT(a.date_add) as date_add,b.sit_name,CONCAT(d.pre_th_name,c.user_firstname,' ',c.user_lastname) as users,c.user_email as user_email, CONCAT('',' ',c.user_phone) as user_phone ,CONCAT('ตำแหน่งที่ตั้ง ','เลขที่ ',a.village,' จังหวัด ',e.name_th,' อำเภอ ',r.name_th,' ตำบล ',y.name_th) as address FROM tbsick_bed as a INNER JOIN tbsick_status as b ON a.sit_id = b.sit_id INNER JOIN tbusers as c ON c.user_username = a.user_username INNER JOIN provinces as e ON e.province_id = a.province_id INNER JOIN amphures as r ON r.amphure_id = a.amphure_id INNER JOIN districts as y ON y.districts_id = a.districts_id INNER JOIN tbprefix as d ON d.prefix_id = c.prefix_id ORDER BY b.sit_name ASC;", (error, results, fields) => {
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
app.get('/all-sickwant', (req, res) => {
    const myBackslash = `\\`;
    dbCon.query(
        "SELECT a.give_id as give_id,a.sickw_name as sickw_name , a.sickw_amount as sickw_amount , a.sickw_note as sickw_note ,a.datebetween as datebetween ,b.give_name as give_name, CONCAT(r.pre_th_name,e.user_firstname,' ',e.user_lastname) as name , e.user_email as user_email, e.user_phone as user_phone ,z.name_th as province ,q.name_th as districts , v.name_th as amphures FROM tbsick_want as a INNER JOIN tbgive_status as b ON b.give_id = a.give_id INNER JOIN tbusers as e ON e.user_username = a.user_username INNER JOIN tbprefix as r ON r.prefix_id = e.prefix_id INNER JOIN provinces as z ON z.province_id = e.province_id INNER JOIN districts as q ON q.districts_id = e.districts_id INNER JOIN amphures as v ON v.amphure_id = e.amphure_id;", (error, results, fields) => {
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
                return res.send({data: results, status: true})
                }
            })
    }
});

app.post('/insert-sickbed-want', (req, res) => {
    
    let user_username = req.body.user_username;
    let sickw_name = req.body.sickw_name;
    let sickw_amount = req.body.sickw_amount;
    let sickw_note = req.body.sickw_note;
    let give_id = req.body.give_id;
    let districts_id = req.body.districts_id;
    let province_id = req.body.province_id;
    let amphure_id = req.body.amphure_id;
    let village = req.body.village;
    let datebetween = req.body.datebetween;
   // session = req.session
    // session.user_username = req.body.sick_name
    // console.log(session.user_username)
   // console.log(session);
    // let hash_password = has(req.body.user_passwords);
    // validation
    if(user_username === '' || sickw_name === '' || sickw_amount === '' || sickw_note === '' || give_id === ''  || datebetween === ''
    ){
        return res.send({ error: true, status : false});
    }
    else {
            dbCon.query('INSERT INTO tbsick_want(sickw_name,sickw_amount,sickw_note,give_id,user_username,datebetween)  VALUES(?,?,?,1,?,?)', [sickw_name,sickw_amount,sickw_note,user_username,datebetween], (error, results, fields) => {
                if (error) { 
                    throw error;
                    return res.send({ error: true, data: results, message: "โปรดลองอีกครั้ง"})
                }
                else
                {
                return res.send({data: results, status: true})
                }
            })
    }
});

app.get('/FetchDataUserOne/:user_username', (req, res) => {
    let user_username = req.params.user_username;

    if (!user_username) {
        return res.status(400).send({ error: true, message: "Please provide book id"});
    } else {
        dbCon.query("SELECT * FROM tbusers WHERE user_username = ?", user_username, (error, results, fields) => {
            if (error) throw error;

            let message = "";
            if (results === undefined || results.length == 0) {
                message = "Data is empty";
            } else {
                message = "Successfully";
            }

            return res.send({data: results[0], message: message })
        })
    }
})
app.get('/SickbedOne/:user_username', (req, res) => {
    let user_username = req.params.user_username;

    if (!user_username) {
        return res.status(400).send({ error: true, message: "Please provide book id"});
    } else {
        dbCon.query("SELECT a.sick_id as sick_id,a.sit_id as sit_id, a.sick_name as sick_name,a.sick_amount as sick_amount,a.sick_note as sick_note,b.sit_name as give_name FROM tbsick_bed as a INNER JOIN tbsick_status as b ON a.sit_id = b.sit_id WHERE a.user_username = ?;", user_username, (error, results, fields) => {
            if (error) throw error;

            let message = "";
            if (results === undefined || results.length == 0) {
                message = "Data is empty";
            } else {
                message = "Successfully";
            }

            return res.send({data: results, message: message })
        })
    }
})

app.get('/SickOne/:sick_id', (req, res) => {
    let sick_id = req.params.sick_id;

    if (!sick_id) {
        return res.status(400).send({ error: true, message: "Please provide book id"});
    } else {
        dbCon.query("SELECT * FROM tbsick_bed WHERE sick_id = ?", sick_id, (error, results, fields) => {
            if (error) throw error;

            let message = "";
            if (results === undefined || results.length == 0) {
                message = "Data is empty";
            } else {
                message = "Successfully";
            }

            return res.send({data: results[0], message: message })
        })
    }
})


app.post('/UpdateDataUser', (req, res) => {
    let user_username = req.body.user_username;
    // let user_password = req.body.user_password;
    let user_firstname = req.body.user_firstname;
    let user_lastname = req.body.user_lastname;
    let user_email = req.body.user_email;
    let user_phone = req.body.user_phone;
    let prefix_id = req.body.prefix_id;
    let sex_id = req.body.sex_id;
   



    // validation
    if (!user_username || !user_firstname || !user_lastname || !user_email || !user_phone || !prefix_id || !sex_id) {
        return res.status(400).send({ message: 'Please Enter Data',status : false});
    } else {
        dbCon.query('UPDATE tbusers SET  user_firstname = ? , user_lastname = ? , prefix_id = ?  , user_phone = ? , user_email = ? , sex_id = ?  WHERE user_username = ?', [user_firstname,user_lastname,prefix_id,user_phone,user_email,sex_id,user_username], (error, results, fields) => {
            // UPDATE books SET name = ?, author = ? WHERE id = ?', [name, author, id], (error, results, fields)
            if (error) throw error;

            let message = "";
            if (results.changedRows === 0) {
                message = "No Data";
            } else {
                message = "Update Successfully";
            }

            return res.send({ error: false, data: results, message: message })
        })
    }
})

app.post('/Usickbed', (req, res) => {
    let sick_name = req.body.sick_name;
    // let user_password = req.body.user_password;
    let sick_amount = req.body.sick_amount;
    let sick_note = req.body.sick_note;
    let sit_id = req.body.sit_id;
    let sick_id = req.body.sick_id;



    // validation
    if (!sick_name || !sick_amount || !sick_note || !sit_id) {
        return res.status(400).send({ message: 'Please Enter Data',status : false});
    } else {
        dbCon.query('UPDATE tbsick_bed SET  sick_name = ? , sick_amount = ? , sick_note = ?  , sit_id = ? WHERE sick_id = ?', [sick_name,sick_amount,sick_note,sit_id,sick_id], (error, results, fields) => {
            // UPDATE books SET name = ?, author = ? WHERE id = ?', [name, author, id], (error, results, fields)
            if (error) throw error;

            let message = "";
            if (results.changedRows === 0) {
                message = "No Data";
            } else {
                message = "Update Successfully";
            }

            return res.send({ error: false, data: results, message: message })
        })
    }
})

app.get('/fetchSickStatus', (req, res) => {
    dbCon.query(
        "SELECT * FROM tbsick_status", (error, results, fields) => {
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

app.post('/deleteSickbed', (req, res) => {
    let sick_id = req.body.sick_id;

    if (!sick_id) {
        return res.status(400).send({ error: true, message: "Enter Your Sick ID"});
    } else {
        dbCon.query('DELETE FROM tbsick_bed WHERE sick_id = ?', [sick_id], (error, results, fields) => {
            if (error) throw error;
            let message = "";
            if (results.affectedRows === 0) {
                message = "No data";
            } else {
                message = "Successfully deleted";
            }
            return res.send({ error: false, data: results, message: message })
        })
    }
})


app.get('/SickWantOne/:user_username', (req, res) => {
    let user_username = req.params.user_username;

    if (!user_username) {
        return res.status(400).send({ error: true, message: "Please provide book id"});
    } else {
        dbCon.query("SELECT a.sickw_id as sickw_id, a.give_id as give_id , a.sickw_name as sickw_name , a.sickw_amount  as sickw_amount,a.sickw_note as sickw_note , a.datebetween as datebetween , b.give_name as give_name FROM tbsick_want as a INNER JOIN tbgive_status as b ON b.give_id = a.give_id WHERE a.user_username = ?;", user_username, (error, results, fields) => {
            if (error) throw error;

            let message = "";
            if (results === undefined || results.length == 0) {
                message = "Data is empty";
            } else {
                message = "Successfully";
            }

            return res.send({data: results, message: message })
        })
    }
})


app.get('/SickWantOneEdit/:sickw_id', (req, res) => {
    let sickw_id = req.params.sickw_id;

    if (!sickw_id) {
        return res.status(400).send({ error: true, message: "Please provide book id"});
    } else {
        dbCon.query("SELECT * FROM tbsick_want WHERE sickw_id = ?", sickw_id, (error, results, fields) => {
            if (error) throw error;

            let message = "";
            if (results === undefined || results.length == 0) {
                message = "Data is empty";
            } else {
                message = "Successfully";
            }

            return res.send({data: results[0], message: message })
        })
    }
})

app.get('/fetchStatusGive', (req, res) => {
    dbCon.query(
        "SELECT * FROM tbgive_status", (error, results, fields) => {
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


app.post('/UpdateSickWant', (req, res) => {
    let sickw_name = req.body.sickw_name;
    // let user_password = req.body.user_password;
    let sickw_amount = req.body.sickw_amount;
    let sickw_note = req.body.sickw_note;
    let sickw_id = req.body.sickw_id;
    let give_id = req.body.give_id;
    let datebetween = req.body.datebetween;



    // validation
    if (!sickw_name || !sickw_amount || !sickw_note || !sickw_id || !give_id || !datebetween) {
        return res.status(400).send({ message: 'Please Enter Data',status : false});
    } else {
        dbCon.query('UPDATE tbsick_want SET  sickw_name = ? , sickw_amount = ? , sickw_note = ?  , give_id = ? , datebetween = ? WHERE sickw_id = ?', [sickw_name,sickw_amount,sickw_note,give_id,datebetween,sickw_id], (error, results, fields) => {
            // UPDATE books SET name = ?, author = ? WHERE id = ?', [name, author, id], (error, results, fields)
            if (error) throw error;

            let message = "";
            if (results.changedRows === 0) {
                message = "No Data";
            } else {
                message = "Update Successfully";
            }

            return res.send({ error: false, data: results, message: message })
        })
    }
})


app.post('/deleteSickWant', (req, res) => {
    let sickw_id = req.body.sickw_id;

    if (!sickw_id) {
        return res.status(400).send({ error: true, message: "Enter Your Sick ID"});
    } else {
        dbCon.query('DELETE FROM tbsick_want WHERE sickw_id = ?', [sickw_id], (error, results, fields) => {
            if (error) throw error;
            let message = "";
            if (results.affectedRows === 0) {
                message = "No data";
            } else {
                message = "Successfully deleted";
            }
            return res.send({ error: false, data: results, message: message })
        })
    }
})

app.get('/Count_freebed', (req, res) => {
    dbCon.query(
        "SELECT COUNT(sit_id) as count_freebed FROM tbsick_bed WHERE sit_id = 2;", (error, results, fields) => {
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

app.get('/Count_Nofreebed', (req, res) => {
    dbCon.query(
        "SELECT COUNT(sit_id) as count_nofreebed FROM tbsick_bed WHERE sit_id = 1;", (error, results, fields) => {
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

app.get('/Count_Sickwant', (req, res) => {
    dbCon.query(
        "SELECT COUNT(give_id) as sickbed_want FROM tbsick_want WHERE give_id = 2;", (error, results, fields) => {
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
app.get('/Count_NoSickwant', (req, res) => {
    dbCon.query(
        "SELECT COUNT(give_id) as Nosickbed_want FROM tbsick_want WHERE give_id = 1;", (error, results, fields) => {
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
// 
// --------------------Test CRUD Vue Component SPA-----------------------
// app.get('/SelectSpa', (req, res) => {
//     dbCon.query(
//         "SELECT * FROM users", (error, results, fields) => {
//         if (error) throw error;

//         let message = ""
//         if (results === undefined || results.length == 0) {
//             message = "Data is empty";
//         } else {
//             message = "Successfully";
//         }
//         return res.send({ error: false, data: results, message: message});
//     })
// })

// app.post('/InsertSpa', (req, res) => {
//     let user_username = req.body.user_username;
//     let user_password = req.body.user_password;
//     let user_firstname = req.body.user_firstname;
//     let user_lastname = req.body.user_lastname;
//     let prefix_id = req.body.prefix_id;

//     // validation
//     if (!user_lastname || !user_username || !user_password || !user_firstname || !prefix_id) {
//         return res.status(400).send({ error: true, message: "Please provide book name and author."});
//     } else {
//         dbCon.query('INSERT INTO users (user_username, user_password,user_firstname,user_lastname,prefix_id) VALUES(?,?,?,?,?)', [user_username, user_password,user_firstname,user_lastname,prefix_id], (error, results, fields) => {
//             if (error) throw error;
//             return res.send({ error: false, data: results, message: "Book successfully added"})
//         })
//     }
// });

// app.get('/Fetchone/:user_username', (req, res) => {
//     let user_username = req.params.user_username;

//     if (!user_username) {
//         return res.status(400).send({ error: true, message: "Please provide book id"});
//     } else {
//         dbCon.query("SELECT * FROM users WHERE user_username = ?", user_username, (error, results, fields) => {
//             if (error) throw error;

//             let message = "";
//             if (results === undefined || results.length == 0) {
//                 message = "Book not found";
//             } else {
//                 message = "Successfully retrieved book data";
//             }

//             return res.send({ error: false, data: results[0], message: message })
//         })
//     }
// })

// app.post('/UpdateSPA', (req, res) => {
//     let user_username = req.body.user_username;
//     let user_password = req.body.user_password;
//     let user_firstname = req.body.user_firstname;
//     let user_lastname = req.body.user_lastname;
//     let prefix_id = req.body.prefix_id;


//     // validation
//     if (!user_username || !user_password || !user_firstname || !user_lastname || !prefix_id) {
//         return res.status(400).send({ error: true, message: 'Please provide book id, name and author'});
//     } else {
//         dbCon.query('UPDATE users SET user_username = ?, user_password = ? , user_firstname = ? , user_lastname = ? , prefix_id = ? WHERE user_username = ?', [user_username, user_password, user_firstname,user_lastname,prefix_id,user_username], (error, results, fields) => {
//             // UPDATE books SET name = ?, author = ? WHERE id = ?', [name, author, id], (error, results, fields)
//             if (error) throw error;

//             let message = "";
//             if (results.changedRows === 0) {
//                 message = "Book not found or data are same";
//             } else {
//                 message = "Book successfully updated";
//             }

//             return res.send({ error: false, data: results, message: message })
//         })
//     }
// })

// app.post('/deleteSPA', (req, res) => {
//     let user_username = req.body.user_username;

//     if (!user_username) {
//         return res.status(400).send({ error: true, message: "Please provide book id"});
//     } else {
//         dbCon.query('DELETE FROM users WHERE user_username = ?', [user_username], (error, results, fields) => {
//             if (error) throw error;
//             let message = "";
//             if (results.affectedRows === 0) {
//                 message = "Book not found";
//             } else {
//                 message = "Book successfully deleted";
//             }
//             return res.send({ error: false, data: results, message: message })
//         })
//     }
// })

// add a new book
// app.post('/book', (req, res) => {
//     let name = req.body.name;
//     let author = req.body.author;

//     // validation
//     if (!name || !author) {
//         return res.status(400).send({ error: true, message: "Please provide book name and author."});
//     } else {
//         dbCon.query('INSERT INTO books (name, author) VALUES(?, ?)', [name, author], (error, results, fields) => {
//             if (error) throw error;
//             return res.send({ error: false, data: results, message: "Book successfully added"})
//         })
//     }
// });

// // retrieve book by id 
// app.get('/book/:id', (req, res) => {
//     let id = req.params.id;

//     if (!id) {
//         return res.status(400).send({ error: true, message: "Please provide book id"});
//     } else {
//         dbCon.query("SELECT * FROM books WHERE id = ?", id, (error, results, fields) => {
//             if (error) throw error;

//             let message = "";
//             if (results === undefined || results.length == 0) {
//                 message = "Book not found";
//             } else {
//                 message = "Successfully retrieved book data";
//             }

//             return res.send({ error: false, data: results[0], message: message })
//         })
//     }
// })

// // update book with id 
// app.put('/book', (req, res) => {
//     let id = req.body.id;
//     let name = req.body.name;
//     let author = req.body.author;

//     // validation
//     if (!id || !name || !author) {
//         return res.status(400).send({ error: true, message: 'Please provide book id, name and author'});
//     } else {
//         dbCon.query('UPDATE books SET name = ?, author = ? WHERE id = ?', [name, author, id], (error, results, fields) => {
//             if (error) throw error;

//             let message = "";
//             if (results.changedRows === 0) {
//                 message = "Book not found or data are same";
//             } else {
//                 message = "Book successfully updated";
//             }

//             return res.send({ error: false, data: results, message: message })
//         })
//     }
// })

// // delete book by id
// app.delete('/book', (req, res) => {
//     let id = req.body.id;

//     if (!id) {
//         return res.status(400).send({ error: true, message: "Please provide book id"});
//     } else {
//         dbCon.query('DELETE FROM books WHERE id = ?', [id], (error, results, fields) => {
//             if (error) throw error;
//             let message = "";
//             if (results.affectedRows === 0) {
//                 message = "Book not found";
//             } else {
//                 message = "Book successfully deleted";
//             }
//             return res.send({ error: false, data: results, message: message })
//         })
//     }
// })

app.listen(3000, () => {
    console.log('Node App is running on port 3000');
})

module.exports = app;
