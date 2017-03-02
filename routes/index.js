const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {
	res.render('index');
});

router.get('/login', function (req, res) {
	res.render('login', {
		redirectTo: req.session.redirectTo
	});
});

module.exports = router;