const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('privacypolicy/privacypolicy');
});

module.exports = router;