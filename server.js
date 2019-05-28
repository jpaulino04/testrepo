const   express     = require('express');
        app         = express();
const   dbConnect   = require('./config/db');
         
const port = process.env.PORT || 5010;

//connect to db
dbConnect();

//json parser
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.get('/', (req, res) => {
    res.send('Beautiful!')
})


//User your routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));

app.listen(port, () => {
    console.log("Server running on port ", port)
})