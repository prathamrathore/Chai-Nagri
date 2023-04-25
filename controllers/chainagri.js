const Chainagri = require("../models/chainagri");

module.exports.index = async (req, res) => {
  const chainagri = await Chainagri.find({});
  res.render("chainagri/index", { chainagri });
};

module.exports.renderNewForm = (req, res) => {
    res.render('chainagri/new');
}

module.exports.createChainagri = async (req, res) => {
    const chainagri = new Chainagri(req.body.chainagri);
    chainagri.author = req.user._id;
    await chainagri.save();
    console.log(req.body)
    req.flash('success', 'Successfully made a new Tea Stall!');
    res.redirect(`/chainagri/${chainagri._id}`)
}

module.exports.showChainagri = async (req, res,) => {
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
}

module.exports.renderEditForm = async (req, res) => {
    const chainagri = await Chainagri.findById(req.params.id)
    if (!chainagri) {
        req.flash('error', 'Cannot find the Tea Stall!');
        return res.redirect('/chainagri');
    }
    res.render('chainagri/edit', { chainagri });
}

module.exports.updateChainagri = async (req, res) => {
    const { id } = req.params;
    const chainagri = await Chainagri.findByIdAndUpdate(id, { ...req.body.chainagri });
    req.flash('success', 'Successfully updated Tea Stall!');
    res.redirect(`/chainagri/${chainagri._id}`)
}

module.exports.deleteChainagri = async (req, res) => {
    const { id } = req.params;
    await Chainagri.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted Tea Stall')
    res.redirect('/chainagri');
}