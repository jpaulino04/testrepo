const mongoose  = require('mongoose');
const express   = require('express');
const router    = express.Router();
const bcrypt    = require('bcryptjs');
const jwt       = require('jsonwebtoken');
const config    = require('config');
const { check, validationResult }   = require('express-validator');


router.get('/', (req, res) => {
    res.send('users route!')
})





module.exports = router;