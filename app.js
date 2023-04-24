const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Chainagri = require('./models/chainagri');

mongoose.connect('mongodb://localhost:27017/chai-nagri', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


app.get('/', (req, res) => {
    res.render('home')
});
app.get('/chainagri', async (req, res) => {
    const chainagri = await Chainagri.find({});
    res.render('chainagri/index', { chainagri })
});
app.get('/chainagri/new', (req, res) => {
    res.render('chainagri/new');
})

app.post('/chainagri', catchAsync(async (req, res) => {
    const chainagri = new Chainagri(req.body.chainagri);
    await chainagri.save();
    console.log(req.body)
    res.redirect(`/chainagri/${chainagri._id}`)
}))

app.get('/chainagri/:id', catchAsync(async (req, res,) => {
    const chainagri = await Chainagri.findById(req.params.id)
    res.render('chainagri/show', { chainagri });
}));

app.get('/chainagri/:id/edit', catchAsync(async (req, res) => {
    const chainagri = await Chainagri.findById(req.params.id)
    res.render('chainagri/edit', { chainagri });
}))

app.put('/chainagri/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const chainagri = await Chainagri.findByIdAndUpdate(id, { ...req.body.chainagri });
    res.redirect(`/chainagri/${chainagri._id}`)
}));

app.delete('/chainagri/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Chainagri.findByIdAndDelete(id);
    res.redirect('/chainagri');
}))

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})



app.listen(3000, () => {
    console.log('Serving on port 3000')
})