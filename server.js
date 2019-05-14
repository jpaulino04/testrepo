const express  = require('express');
const app      = express();


const port = process.env.PORT || 5010;


app.get('/', (req, res) => {
    res.send("Hello from Server")
})



app.listen(port, () =>{
    console.log("Server running on "+port)
})
