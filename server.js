const   express = require('express');
        app     = express();
         
const port = process.env.PORT || 3010;

//json parser
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.get('/', (req, res) => {
    res.send('Beautiful!')
})


app.listen(port, () => {
    console.log("Server running on port ", port)
})