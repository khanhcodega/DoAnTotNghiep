const path = require('path');
const express = require('express');
const morgan = require('morgan');
const { engine } = require('express-handlebars');
const methodOverride = require('method-override');
const app = express();
const PORT = process.env.PORT || 3000;
const session = require('express-session');
const route = require('./routes');
const passport = require('passport');
require('dotenv').config();
require('./config/passport')
<<<<<<< HEAD
<<<<<<< HEAD
const Handlebars = require('handlebars');
=======

>>>>>>> a503d10ea67dc4a8a4eb8e6a56dce9e6c0d636b7
=======

>>>>>>> a503d10ea67dc4a8a4eb8e6a56dce9e6c0d636b7


// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Session middleware setup
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
<<<<<<< HEAD
<<<<<<< HEAD
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // chỉ cần true khi sử dụng HTTPS
        maxAge: 24 * 60 * 60 * 1000 // thời gian sống của session, ở đây là 1 ngày
    }
=======
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
>>>>>>> a503d10ea67dc4a8a4eb8e6a56dce9e6c0d636b7
=======
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
>>>>>>> a503d10ea67dc4a8a4eb8e6a56dce9e6c0d636b7
}));
// Đăng ký helper Handlebars
// Handlebars.registerHelper('eq', function (a, b) {
//     return a === b;
// });
// Passport middleware setup
app.use(passport.initialize());
app.use(passport.session());


app.use((req, res, next) => {

    if (!req.isAuthenticated() && req.originalUrl !== '/api/auth/google' && req.originalUrl !== '/api/auth/google/callback') {
        req.session.returnTo = req.originalUrl;
    }
    next();
});
// Middleware để thêm thông tin đăng nhập vào res.locals
app.use((req, res, next) => {
    res.locals.isLoggedIn = !!req.session.ma_so;
    res.locals.user = req.session.ma_so;
    next();
});



// HTTP logger
app.use(morgan('combined'));
app.use(methodOverride('_method'));

//template engine
app.engine(
    'hbs',
    engine({
        extname: '.hbs',
<<<<<<< HEAD
<<<<<<< HEAD
        helpers: {
            sum: (index, currentPage) => {
                // Calculate the index based on the current page
                return (currentPage - 1) * 10 + index + 1;
            },
            renderStars: function(diem_danh_gia) {
                let stars = '';
                for (let i = 1; i <= 5; i++) {
                    if (i <= diem_danh_gia) {
                        stars += '<i class="fa-solid fa-star"></i>';
                    } else {
                        stars += '<i class="fa-regular fa-star"></i>';
                    }
                }
                return new Handlebars.SafeString(stars);
            }
        },
=======
        helpers: {},
>>>>>>> a503d10ea67dc4a8a4eb8e6a56dce9e6c0d636b7
=======
        helpers: {},
>>>>>>> a503d10ea67dc4a8a4eb8e6a56dce9e6c0d636b7
    }),
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources//views'));

route(app);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
