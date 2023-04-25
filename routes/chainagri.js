const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Chainagri = require('../models/chainagri');
const { isLoggedIn, isAuthor, validateChainagri } = require('../middleware');
const chainagri = require('../controllers/chainagri');





router.get('/', catchAsync(chainagri.index));
router.get('/new',isLoggedIn, chainagri.renderNewForm)

router.post('/',isLoggedIn,validateChainagri, catchAsync(chainagri.createChainagri))

router.get('/:id', catchAsync(chainagri.showChainagri));

router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(chainagri.renderEditForm))

router.put('/:id',isLoggedIn,isAuthor,validateChainagri, catchAsync(chainagri.updateChainagri));

router.delete('/:id',isLoggedIn,isAuthor,catchAsync(chainagri.deleteChainagri))

module.exports = router;