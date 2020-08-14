const express = require("express");
const router = express.Router();

router.get('/profile', (req,res) => {
    res.render('auth/profile');
});
module.exports = router;