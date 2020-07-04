const express = require("express");
const router = express.Router();

router.get('/', (req,res) => {
        res.render('Nosotros');
});

module.exports = router;