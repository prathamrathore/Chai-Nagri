const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { chainagriSchema } = require('../schemas.js');
const ExpressError = require('../utils/ExpressError');
const Chainagri = require('../models/chainagri');


const validateCampground = (req, res, next) => {
    const { error } = chainagriSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}


router.get('/', async (req, res) => {
    const chainagri = await Chainagri.find({});
    res.render('chainagri/index', { chainagri })
});
router.get('/new', (req, res) => {
    res.render('chainagri/new');
})

router.post('/',validateCampground, catchAsync(async (req, res) => {
    const chainagri = new Chainagri(req.body.chainagri);
    await chainagri.save();
    console.log(req.body)
    req.flash('success', 'Successfully made a new Tea Stall!');
    res.redirect(`/chainagri/${chainagri._id}`)
}))

router.get('/:id', catchAsync(async (req, res,) => {
    const chainagri = await Chainagri.findById(req.params.id).populate('reviews');
    if (!chainagri) {
        req.flash('error', 'Cannot find the Tea Stall!');
        return res.redirect('/chainagri');
    }
    res.render('chainagri/show', { chainagri });
}));

router.get('/:id/edit', catchAsync(async (req, res) => {
    const chainagri = await Chainagri.findById(req.params.id)
    if (!chainagri) {
        req.flash('error', 'Cannot find the Tea Stall!');
        return res.redirect('/chainagri');
    }
    res.render('chainagri/edit', { chainagri });
}))

router.put('/:id',validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const chainagri = await Chainagri.findByIdAndUpdate(id, { ...req.body.chainagri });
    req.flash('success', 'Successfully updated Tea Stall!');
    res.redirect(`/chainagri/${chainagri._id}`)
}));

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Chainagri.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted Tea Stall')
    res.redirect('/chainagri');
}))

module.exports = router;