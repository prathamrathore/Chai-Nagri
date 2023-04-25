const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Chainagri = require('../models/chainagri');
const { isLoggedIn, isAuthor, validateChainagri } = require('../middleware');





router.get('/', async (req, res) => {
    const chainagri = await Chainagri.find({});
    res.render('chainagri/index', { chainagri })
});
router.get('/new',isLoggedIn, (req, res) => {
    res.render('chainagri/new');
})

router.post('/',isLoggedIn,validateChainagri, catchAsync(async (req, res) => {
    const chainagri = new Chainagri(req.body.chainagri);
    chainagri.author = req.user._id;
    await chainagri.save();
    console.log(req.body)
    req.flash('success', 'Successfully made a new Tea Stall!');
    res.redirect(`/chainagri/${chainagri._id}`)
}))

router.get('/:id', catchAsync(async (req, res,) => {
    const chainagri = await Chainagri.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!chainagri) {
        req.flash('error', 'Cannot find the Tea Stall!');
        return res.redirect('/chainagri');
    }
    res.render('chainagri/show', { chainagri });
}));

router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(async (req, res) => {
    const chainagri = await Chainagri.findById(req.params.id)
    if (!chainagri) {
        req.flash('error', 'Cannot find the Tea Stall!');
        return res.redirect('/chainagri');
    }
    res.render('chainagri/edit', { chainagri });
}))

router.put('/:id',isLoggedIn,isAuthor,validateChainagri, catchAsync(async (req, res) => {
    const { id } = req.params;
    const chainagri = await Chainagri.findByIdAndUpdate(id, { ...req.body.chainagri });
    req.flash('success', 'Successfully updated Tea Stall!');
    res.redirect(`/chainagri/${chainagri._id}`)
}));

router.delete('/:id',isLoggedIn,isAuthor,catchAsync(async (req, res) => {
    const { id } = req.params;
    await Chainagri.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted Tea Stall')
    res.redirect('/chainagri');
}))

module.exports = router;