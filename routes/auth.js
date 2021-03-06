const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/login', function (req, res) {
	res.render('login', { user: req.user });
});

router.get('/callback',
	passport.authenticate('auth0'), (req, res) => {
		let returnTo = req.session.returnTo || '/';
		delete req.session.returnTo;
		res.redirect(returnTo);
	});

router.get('/logout', function (req, res) {
	req.logout();
	res.redirect('/');
});

module.exports = router;