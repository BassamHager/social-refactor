const express = require('express');
const connectDB = require('./config/db')

const PORT = process.env.PORT || 5000;

const app = express();

// connect db
connectDB()

// define routes
app.use('/api/users', require('./routes/api/users'))
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/profile', require('./routes/api/profile'))
app.use('/api/posts', require('./routes/api/posts'))

app.get('/', (req, res) => res.send('API is running...'))

app.listen(PORT, () => console.log(`This app started on port ${PORT}`))