const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator/check');


router.post('/', (req, res) => { 

    const user = req.body;
    console.log('user')
    res.json({user})

})


module.exports = router;