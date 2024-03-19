const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = 4000;


// const { createClient } = require('@supabase/supabase-js');


const supabaseUrl = 'https://syiryyyqefdfopqaggcx.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5aXJ5eXlxZWZkZm9wcWFnZ2N4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA0MDA3MzksImV4cCI6MjAyNTk3NjczOX0.uh93IxcgZ2A_hjnyhMCYffTWH__i1dvZ3uViin-NUIE'
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

// Endpoint for admin login
app.post('/adminlogin', async (req, res) => {
  const { name, password } = req.body;

  try {
    const { data, error } = await supabase
      .from('admin')
      .select()
      .eq('username', name)
      .eq('password', password)
      .single();

    if (error) {
      return res.status(500).send('Error in database query');
    }

    if (data) {
      res.status(200).json({ success: true });
    } else {
      res.status(401).json({ success: false, message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('An error occurred');
  }
});

// Endpoint to fetch user profiles
app.get('/userProfiles', async (req, res) => {
  try {
    const { data, error } = await supabase.from('userdata').select('*');

    if (error) {
      return res.status(500).json({ error: 'An error occurred while fetching user profiles' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('An error occurred');
  }
});

// Endpoint to handle reset password request
app.post('/resetpassword', async (req, res) => {
  const { username, newpassword } = req.body;

  try {
    const { error: findError } = await supabase
      .from('userdata')
      .select('username')
      .eq('username', username)
      .single();

    if (findError) {
      return res.status(500).json({ error: 'Internal server error' });
    }

    if (!findError) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { error: updateError } = await supabase
      .from('userdata')
      .update({ password: newpassword, confirmPassword: newpassword })
      .eq('username', username);

    if (updateError) {
      return res.status(500).json({ error: 'Internal server error' });
    }

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('An error occurred');
  }
});

// Endpoint for user login
// app.post('/userlogin', async (req, res) => {
//     const { name, password } = req.body;
//     console.log('Received request:', { name, password }); // Log received request
  
//     try {
//       const { data, error } = await supabase
//         .from('userdata')
//         .select()
//         .eq('username', name)
//         .eq('password', password)
//         .single();
  
//       console.log('Data from Supabase:', data); // Log data received from Supabase
  
//       if (error) {
//         console.error('Supabase error:', error); // Log Supabase error
//         return res.status(500).json({ error: 'An error occurred while processing your request' });
//       }
  
//       if (data) {
//         res.json({ success: true, user: data });
//       } else {
//         res.status(401).json({ success: false, error: 'Incorrect username or password' });
//       }
//     } catch (error) {
//       console.error('Error:', error.message);
//       res.status(500).send('An error occurred');
//     }
//   });
  
app.post('/userlogin', (req, res) => {
    const { name, password } = req.body;
    connection.query('SELECT * from userdata where username = ? AND password = ?', [name, password], (error, results) => {
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
// Endpoint to handle PUT request to update user data
app.put('/users/:userId', async (req, res) => {
  const userId = req.params.userId;
  const updatedUserData = req.body;

  try {
    const { error } = await supabase
      .from('userdata')
      .update(updatedUserData)
      .eq('id', userId);

    if (error) {
      return res.status(500).json({ error: 'Error updating user data' });
    }

    res.status(200).json({ message: 'User data updated successfully' });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('An error occurred');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
