/**
 * Created by E84266 on 2/24/2017.
 */

'use strict';

const APP_BASE = process.env.NODE_PATH;
const logger = require(APP_BASE + '/utils/logger')(module.filename);
logger.trace('Initializing api.user');

const express = require('express');
const router = express.Router();

const User = require(APP_BASE + '/models/user');

//var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens

router.route('/')
// Get user list
    .get(function(req, res, next){
        User.find(function(err, users){
            if(err) {
                next(err);
            } else {
                res.json(users);
            }
        });
    })
    // Create a new user
    .post(function(req, res, next){
        const user = new User(req.body);
        user.save(function(err){
            if(err) {
                next(err);
            } else {
                res.json({message: 'User Added'});
            }
        });
    });

router.route('/:id')
// Get a specific user
    .get(function(req, res, next){
        User.findOne({_id:req.params.id}, function(err, user) {
            if(err) {
                next(err);
            } else {
                res.json(user);
            }
        });
    })
    // Update an existing user
    .put(function(req, res, next){
        User.findOne({_id:req.params.id}, function(err,user){
            if(err) {
                next(err);
            } else {
                for(var prop in req.body){
                    user[prop] = req.body[prop];
                }
                // save the user
                user.save(function(err) {
                    if (err) {
                        next(err);
                    } else {
                        res.json({ message: 'User updated!' });
                    }
                });
            }
        });
    })
    // Delete a user
    .delete(function(req, res, next){
        User.remove({_id: req.params.id}, function(err, user) {
            if (err) {
                next(err);
            } else {
                res.json({ message: 'User deleted' });
            }
        });
    });

module.exports = router;