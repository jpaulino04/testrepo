const express   = require('express');
const app       = express();

//Set port
const port = process.env.Port || 5010;

// for parsing application/json
app.use(express.json())


app.get('/', (req, res) => {
    res.send("Your are in the right track!")
});


app.listen(port, (err)=>{
    if(err) throw err;
    console.log("Server running on port "+ port);
})

