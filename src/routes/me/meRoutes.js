const express = require('express');

const protect = require('../../middlewares/protectMiddleware');
const me = require('../../controllers/getMe');
const updateMe = require('../../controllers/updateMe');
const deleteMe = require('../../controllers/deleteMe');

const router = express.Router({ mergeParams: true });

router.get('/', protect, me);
router.patch('/updateMe', protect, updateMe);
router.delete('/deleteMe', deleteMe);

module.exports = router;
