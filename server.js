const express   = require('express');
const app       = express();
const dbConnect = require('./config/db');

//Set port
const port = process.env.Port || 5010;

//Connect to DB
dbConnect();

// for parsing application/json
app.use(express.json())

//Routes
app.use('/api/users', require('./routes/api/users'));


app.get('/', (req, res) => {
    res.send("Your are in the right track!")
});

app.listen(port, (err)=>{
    if(err) throw err;
    console.log("Server running on port "+ port);
})

