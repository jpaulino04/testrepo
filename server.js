const express   = require('express');
const app       = express();
const mongoConnect = require('./config/db')

//Connect to mongo
mongoConnect();

//bodyParser
app.use(express.json({extended: false})); // for parsing application/json

const port = process.env.PORT || 5010;


//User routes
app.use('/api/users', require('./routes/api/users'))

app.get('/', (req, res) => {
    res.send("Keep reaching out!")
})


app.listen(port, ()=> {
    console.log("Server Running on port "+ port)
})
