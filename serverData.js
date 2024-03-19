const express = require('express');

const cors = require('cors');
const pkg = require('pg');
const Jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const cookieParser = require('cookie-parser');
// const express = require('express');

const { Client } = pkg;

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.static('Public'))
app.use(cors());

// Template for server 
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH,DELETE,HEAD"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-with, Content-Type,Accept"
  );
  next();
});

app.post('/submit-form', (req, res) => {
    console.log('Received data:', req.body);
    res.send('Data received successfully');
  });











// const client = new Client({
//   user: "postgres",
//   password: "MAnoj123@786",
//   database: "postgres",
//   port: 5432,
//   host: "db.ffhgklroggnimgnnkarw.supabase.co",
//   ssl: { rejectUnauthorized: false },
// });

// client.connect()
//   .then(() => {
//     console.log("Connected!!!");
//   })
//   .catch((error) => {
//     console.error("Connection error:", error);
//   });

//   const verifyUser = (req, res, next) => {
//     const token = req.cookies.token;
//     if(token) {
//         Jwt.verify(token, "jwt_secret_key", (err, decoded) => {
//             if(err) return res.json({ Status: false, Error: "Wrong Token" });
//             req.id = decoded.id;
//             req.role = decoded.role;
//             next();
//         });
//     } else {
//         return res.json({ Status: false, Error: "Not authenticated" });
//     }
// };

// app.get('/verify', verifyUser, (req, res) => {
//     return res.json({ Status: true, role: req.role, id: req.id });
// });

// app.post("/adminlogin", (req, res) => {
//   const sql = "SELECT * from employee Where email = $1 and password = $2 and role=$3";
//   client.query(sql, [req.body.email, req.body.password,"admin"], (err, result) => {
//     if (err) return res.json({ loginStatus: false, Error: "Query error" });
//     if (result.rows.length > 0){
//       return res.json({ loginStatus: true});
//     }
//     else {
//         return res.json({ loginStatus: false, Error: "Plesse check email or password" });
//     }
//   });
// });

// app.post("/employee_login", (req, res) => {
// const sql = "SELECT * from employee Where email = $1 and password = $2 and role=$3 ";
// client.query(sql, [req.body.email, req.body.password,"user"], (err, result) => {
//   if (err) return res.json({ loginStatus: false, Error: "Query error" });
//   if(result.rows.length > 0) {
//       return res.json({ loginStatus: true, userData: result.rows});
//   }else {
//     return res.json({ loginStatus: false, Error: "Plesse check email or password" });
// }

// });
// });

// app.get("/allusers1", function (req, res) {
//     let query = "SELECT * FROM admin";
//     client.query(query, (err, result) => {
//       if (err) {
//         res.status(500).send(err);
//       } else {
//         res.send(result.rows);
//       }
//     });
//   });
//   // ,upload.single('image')
//   app.get("/employee", function (req, res) {
//     let query = "SELECT * FROM employee where role='user'";
//     client.query(query, (err, result) => {
//       if (err) {
//         res.status(500).send(err);
//       } else {
//         res.send(result.rows);
//       }
//     });
//   });
//   app.post("/addemployee", async (req, res) => {
//           const sql = `INSERT INTO employee 
//               (name, photo, designation, email, password, date_of_joining, manager) 
//               VALUES ($1, $2, $3, $4, $5, $6, $7)`;
//           const values = [
//               req.body.name,
//               "ass",
//               req.body.designation,
//               req.body.email,
//               req.body.password,
//               req.body.dateOfJoining,
//               req.body.manager,
//           ];
  
//           client.query(sql, values, (err, result) => {
//             if (err) {
//               res.status(500).send(err);
//             } else {
//               res.status(201).json({ message: 'User details inserted successfully' });
//             }
//           });
//   });
// app.get('/employee/:id', (req, res) => {
//     const id = req.params.id;
//     const sql = "SELECT * FROM employee WHERE id = $1";
//     client.query(sql,[id], (err, result) => {
//         if(err) return res.json({Status: false, Error: "Query Error"})
//         return res.json({Status: true, Result: result.rows})
//     })
// })

// app.put('/edit_employee/:id', (req, res) => {
//     const id = req.params.id;
//     const sql = `UPDATE employee 
//         set name = $1, designation = $2, email = $3, password =$4, date_of_joining = $5, manager = $6 
//         Where id = $7`
//     const values = [
//         req.body.name,
//         req.body.designation,
//         req.body.email,
//         req.body.password,
//         req.body.dateOfJoining,
//         req.body.manager
//     ]
//     client.query(sql,[...values, id], (err, result) => {
//         if(err) return res.json({Status: false, Error: "Query Error"+err})
//         return res.json({Status: true, Result: result})
//     })
// })


//   app.delete('/deleteemployee/:id', (req, res) => {
//     const id = req.params.id;
//     const sql = "delete from employee where id = $1"
//     client.query(sql,[id], (err, result) => {
//         if(err) return res.json({Status: false, Error: "Query Error"+err})
//         return res.json({Status: true, Result: result})
//     })
// })

// app.post("/leaveapply", async (req, res) => {
//   const sql = `INSERT INTO leavedata
//       (name, designation, startDate, endDate, reason, status, leaves_days) 
//       VALUES ($1, $2, $3, $4, $5, $6, $7)`;

//   const values = [
//       req.body.name,
//       req.body.designation,
//       req.body.startDate,
//       req.body.endDate,
//       req.body.resion,
//       req.body.status,
//       req.body.daysDifference,
//   ];

//   client.query(sql, values, (err, result) => {
//     if (err) {
//       res.status(500).send(err);
//     } else {
//       res.status(201).json({ message: 'User details inserted successfully' });
//     }
//   });
// });

// app.get("/leaves", function (req, res) {
//   let query = "SELECT * FROM leavedata ";
//   client.query(query, (err, result) => {
//     if (err) {
//       res.status(500).send(err);
//     } else {
//       res.send(result.rows);
//     }
//   });
// });

// app.get('/Leave_employee/:id', (req, res) => {
//   const id = req.params.id;
//   const sql = "SELECT * FROM leavedata WHERE id = $1";
//   client.query(sql,[id], (err, result) => {
//       if(err) return res.json({Status: false, Error: "Query Error"})
//       return res.json({Status: true, Result: result.rows})
//   })
// })

// app.get('/getLeave/:name', (req, res) => {
//   const name = req.params.name;
//   const sql = "SELECT * FROM leavedata WHERE name = $1";
//   client.query(sql,[name], (err, result) => {
//       if(err) return res.json({Status: false, Error: "Query Error"})
//       return res.json(result.rows)
//   })
// })

// app.put('/edit_leave_form/:id', (req, res) => {
//   const id = req.params.id;
//   const sql = `UPDATE leavedata 
//       set name = $1, designation = $2, startdate = $3, enddate = $4, reason = $5, status = $6, leaves_days= $7
//       Where id = $8`
//   const values = [
//       req.body.name,
//       req.body.designation,
//       req.body.startdate,
//       req.body.enddate,
//       req.body.reason,
//       req.body.status,
//       req.body.leaves_days,

//   ]
//   client.query(sql,[...values, id], (err, result) => {
//       if(err) return res.json({Status: false, Error: "Query Error"+err})
//       return res.json({Status: true, Result: result})
//   })
// })

// app.put('/leave_reject/:id', (req, res) => {
//   const id = req.params.id;
//   const sql = `UPDATE leavedata 
//       set status = $1
//       Where id = $2`
//   const values = [req.body.data.status]
//   client.query(sql,[...values, id], (err, result) => {
//       if(err) 
//       return res.json({Status: true, Result: result})
//        return res.json({Status: false, Error: "Query Error"+err})
//   })
// })

// app.put('/leave_approve/:id', (req, res) => {
//   const id = req.params.id;
//   const sql = `UPDATE leavedata 
//       set status = $1
//       Where id = $2`
//   const values = [req.body.data.status]
//   client.query(sql,[...values, id], (err, result) => {
//       if(err) 
//       return res.json({Status: true, Result: result})
//        return res.json({Status: false, Error: "Query Error"+err})
//   })
// })


  
   
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Node app listening on port ${port}!`));