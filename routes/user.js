const express = require('express'),
  router = express.Router(),
  bcrypt = require('bcryptjs'),
  jwt = require('jsonwebtoken'),
  passport = require('passport'),
  _= require('lodash');
  User = require('../models/userprofile');

router.post('/register', function(req, res) {

    if(_.isEmpty(req.body.email) || _.isEmpty(req.body.username) || _.isEmpty(req.body.password) || 
	_.isEmpty(req.body.firstname) || _.isEmpty(req.body.gender) || _.isEmpty(req.body.country)) {
	return res.status(400).json({
          missingParameter: 'Hey champ, Looks like you forgot to enter few required parameters'
        });
    }
    User.findOne({
        email: req.body.email
    }).then(user => {
        if(user) {
            return res.status(400).json({
                email: 'Email already exists'
            });
        }
        else {
            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
		firstname: req.body.firstname,
		lastname: req.body.lastname,
		gender: req.body.gender,
		country: req.body.country

            });
            
            bcrypt.genSalt(10, (err, salt) => {
                if(err) console.error('There was an error', err);
                else {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) console.error('There was an error in hash generation', err);
                        else {
                            newUser.password = hash;
                            newUser
                                .save()
                                .then(user => {
                                    res.json(user)
                                }); 
                        }
                    });
                }
            });
        }
    });
});

router.post('/login', (req, res) => {

    if( _.isEmpty(req.body.username) || _.isEmpty(req.body.password)) {
	return res.status(400).json({
          missingParameter: 'Hey champ, Looks like you forgot to enter username or password'
        });
    }

    const username = req.body.username;
    const password = req.body.password;
    let errors = {};

    User.findOne({username })
        .then(user => {
            if(!user) {
                errors.username = 'Invalid username'
                return res.status(404).json(errors);
            }
            bcrypt.compare(password, user.password)
                    .then(isMatch => {
                        if(isMatch) {
                            const payload = {
                                id: user.id,
                                name: user.name
                            }
                            jwt.sign(payload, 'secret', {
                                expiresIn: 3600
                            }, (err, token) => {
                                if(err) console.error('Token error', err);
                                else {
                                    res.json({
                                        success: true,
                                        token: `Bearer ${token}`
                                    });
                                }
                            });
                        }
                        else {
                            errors.password = 'Invalid Password';
                            return res.status(400).json(errors);
                        }
                    });
        });
});

router.get('/me', passport.authenticate('jwt', { session: false }), (req, res) => {
    return res.json({
        id: req.user.id,
        username: req.user.username,
        email: req.user.email
    });
});

module.exports = router;