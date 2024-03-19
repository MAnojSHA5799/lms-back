const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();
const PORT = 4000;
const jwt = require('jsonwebtoken'); // Import JWT library

app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true  // This enables passing cookies and other credentials in the request
}));
//-----------------------------This is Basic template------------------------------------------



// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header(
//       "Access-Control-Allow-Methods",
//       "GET, POST, OPTIONS, PUT, PATCH,DELETE,HEAD"
//     );
//     res.header(
//       "Access-Control-Allow-Headers",
//       "Origin, X-Requested-with, Content-Type,Accept"
//     );
//     next();
//   });



app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // Ensure this line is included
  next();
});



//--------------------------------------------------------------------------



//DATABASE CONNECTION
const connection = mysql.createConnection({
  host: 'localhost',  
  user: 'root',      
  password: 'Vishal@2024',   
  database: 'vishaldb_01' ,
});

// Connect to MySQL database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database');
});

// Middleware to parse JSON requests
app.use(bodyParser.json());



// connection.query('SELECT * FROM employee', (error, results, fields) => {
//   if (error) {
//       console.error('Error executing query:', error);
//       return;
//   }
//   console.log('Query results:', results);
// });



// app.post('/submit-form', (req, res) => {
//   console.log('Received data:', req.body);
//   res.send('Data received successfully');
// });



// app.get('/api/data', function(req, res, next) {
// 	connection.query('SELECT * FROM vishaldb_01.admin', function (error, results, fields) {
// 		if (error) throw error
//     {
//       console.log(results);
//     }
// 		res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
// 	});
// });


//****************************************************************************************************************************************************************** */
// Endpoint for admin login

app.post('/adminlogin', (req, res) => {
  const { name, password } = req.body;
  
  connection.query('SELECT * FROM vishaldb_01.admin where username = ? AND password = ?', [name, password], (error, results) => {
    if (error) {
      res.status(500).send('Error in database query');
    } else {
      if (results.length > 0) {
        // console.log('valid username or password');
        res.status(200).json({ success: true }); // Send success response
      } else {
        // console.log('Invalid username or password');
        res.status(401).json({ success: false, message: 'Invalid username or password' }); // Send failure response
      }
    }
  });
});


// Endpoint to fetch user profiles
app.get('/userProfiles', (req, res) => {
  // Fetch user profiles from database
  const sql = 'SELECT * FROM vishaldb_01.userdata;';
  // console.log(sql);
  connection.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching user profiles:', err);
      res.status(500).json({ error: 'An error occurred while fetching user profiles' });
    } else {
      res.json(result);
    }
  });
});


//----------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Endpoint for newdata

app.post('/newuserdata', (req, res) => {
  const { username, password, confirmPassword, name, dateOfJoining, designation, department} = req.body;
    const sql = `INSERT INTO userdata (username, password,confirmPassword, name, Dateofjoining, Designation, department) VALUES (?, ?, ?, ?, ?, ?,?)`;
  const values = [username, password,confirmPassword, name, dateOfJoining, designation, department];

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error saving employee details:', err);
      res.status(500).json({ error: 'Error saving employee details' });
      return;
    }
    console.log('Employee details saved successfully');
    res.status(200).json({ message: 'Employee details saved successfully' });
  });
});



//-------------------------------------------------------------------------------------------------------------------------------------------------------------------

// Route to handle reset password request
app.post('/resetpassword', (req, res) => {
  const { username,newpassword } = req.body;

  // Find user by username
  const query = `SELECT username FROM vishaldb_01.userdata where username=?`;
  connection.query(query, [username], (error, results) => {
    if (error) {
      console.error('Error finding user:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // const user = results[0];

    // Update user's password
    const updateQuery = `UPDATE vishaldb_01.userdata SET password = ?,confirmPassword= ?  WHERE username = ?`;
    connection.query(updateQuery, [newpassword,newpassword, username], (updateError, updateResults) => {
      if (updateError) {
        console.error('Error updating password:', updateError);
        return res.status(500).json({ error: 'Internal server error' });
      }

      res.json({ message: 'Password reset successfully' });
    });
  });
});


//------------------------------------------------------------------------------------------------------------------------------------------------------
// User login endpoint
app.post('/userlogin', (req, res) => {
  const { name, password } = req.body;
  connection.query('SELECT * from vishaldb_01.userdata where username = ? AND password = ?', [name, password], (error, results) => {
    if (error) {
      console.error('Error executing login query:', error);
      return res.status(500).json({ error: 'An error occurred while processing your request' });
    }

    if (results.length === 1) {
      
      console.log( results[0]);
      res.json({ success: true, user: results[0] });
    } else {
      // Login failed
      res.status(401).json({ success: false, error: 'Incorrect username or password' });
    }
  });
});


//-----------------------------------------------------------------------------------------------------------------------------------------------------------

// Route to handle PUT request to update user data
app.put('/users/:userId', (req, res) => {
  const userId = req.params.userId;
  const updatedUserData = req.body;

  // Update user data in the database
  const query = 'UPDATE vishaldb_01.userdata SET ? WHERE id = ?';
  connection.query(query, [updatedUserData, userId], (err, result) => {
    if (err) {
      console.error('Error updating user data:', err);
      res.status(500).json({ error: 'Error updating user data' });
    } else {
      console.log('User data updated successfully');
      res.status(200).json({ message: 'User data updated successfully' });
    }
  });
});

//------------------------------------------------------------------------------------------------------------------------------------------------
// API endpoints
app.get('/userProfiles', (req, res) => {
  const sql = 'SELECT * FROM vishaldb_01.userdata;';
  connection.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching user profiles:', err);
      res.status(500).json({ error: 'Error fetching user profiles' });
      return;
    }
    res.json(result);
  });
});

//-----------------------------------------------------------------------------------------------------------------------------------------------------

app.put('/userProfiles/:id', (req, res) => {
  const { id } = req.params;
  const { name, Dateofjoining, Designation, department } = req.body;
  const sql = `UPDATE vishaldb_01.userdata SET name=?, Dateofjoining=?, Designation=?, department=? WHERE id=?`;
  connection.query(sql, [name, Dateofjoining, Designation, department, id], (err, result) => {
    if (err) {
      console.error('Error updating user profile:', err);
      res.status(500).json({ error: 'Error updating user profile' });
      return;
    }
    res.json({ message: 'User profile updated successfully' });
  });
});


//---------------------------------------------------------------------------------------------------------------------------------------------------------------
app.delete('/userProfiles/:id', (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM vishaldb_01.userdata WHERE id=?`;
  connection.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error deleting user profile:', err);
      res.status(500).json({ error: 'Error deleting user profile' });
      return;
    }
    res.json({ message: 'User profile deleted successfully' });
  });
});



//------------------------------------------------------------------------------------------------------
// Endpoint to fetch admin's name
app.get('/admin/profile', (req, res) => {
  // const { demo } = req.body;
  // console.log(demo);
  // SQL query to fetch admin's name (replace 'admins' with your actual table name)
  const sql = "SELECT username FROM vishaldb_01.admin WHERE username = 'vis2_02'"; // Assuming there's a column 'isAdmin' to identify the admin
  
  // Execute the query
  connection.query(sql, (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    
    if (result.length == 0) {
      // console.log(result);
      res.status(404).json({ error: 'Admin not found' });
      return;
    }

    const adminName = result[0].username;
    console.log(adminName);
    res.json({ name: adminName });
  });
});


//listen the port number for server 
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
