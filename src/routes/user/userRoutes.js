const express = require('express');

const getAllUsers = require('../../controllers/getAllUsers');
const getUser = require('../../controllers/getUser');
const { getOneUser } = require('../../controllers/findOneUser');
const updateUser = require('../../controllers/updateUser');
const deleteUser = require('../../controllers/deleteUser');
const { signup, signupAuth } = require('../../controllers/signup');

const router = express.Router({ mergeParams: true });

router.route('/getOneUser').post(getOneUser);

router.route('/').get(getAllUsers).post(signup, signupAuth);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
