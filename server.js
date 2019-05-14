const express  = require('express');
const app      = express();
const dbConn   = require('./config/db');

//Connect to mongodb
dbConn();

//Init bodyParser Middleware
app.use(express.json({ extended: false }));

//Set port
const port = process.env.PORT || 5010;

//Simple test route
app.get('/', (req, res) => {
    res.send("Hello from Server")
})


//use your routes!
app.use('/api/users', require('./routes/api/users'));

app.listen(port, () =>{
    console.log("Server running on "+port)
})
