const express = require('express');
const router = express.Router();

//Render User Registration page
router.get('/signup', (req, res) =>
    res.render('register')
);

//Render Password Reset page
router.get('/passwordreset', (req, res) =>
    res.render('password_reset')
);

//Render User Login page
router.get('/login', (req, res) =>
    res.render('login')
);

module.exports = router;