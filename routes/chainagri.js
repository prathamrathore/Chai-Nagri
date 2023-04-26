const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Chainagri = require('../models/chainagri');
const { isLoggedIn, isAuthor, validateChainagri } = require('../middleware');
const chainagri = require('../controllers/chainagri');




router.route('/')
    .get(catchAsync(chainagri.index))
    .post(isLoggedIn,validateChainagri, catchAsync(chainagri.createChainagri))

router.get('/new',isLoggedIn, chainagri.renderNewForm)

router.route('/:id')
    .get( catchAsync(chainagri.showChainagri))
    .put(isLoggedIn,isAuthor,validateChainagri, catchAsync(chainagri.updateChainagri))
    .delete(isLoggedIn,isAuthor,catchAsync(chainagri.deleteChainagri))

router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(chainagri.renderEditForm))

module.exports = router;