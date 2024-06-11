const site = require('./site');
const rental = require('./rental')
const test = require('./test')
const user = require('./user')
<<<<<<< HEAD
<<<<<<< HEAD
const postNews = require('./postNews')
=======

>>>>>>> a503d10ea67dc4a8a4eb8e6a56dce9e6c0d636b7
=======

>>>>>>> a503d10ea67dc4a8a4eb8e6a56dce9e6c0d636b7
const partials = require('./partials')
const authGoogle = require('./authGoogle')


function route(app) {
    app.use('/api/auth', authGoogle);
    app.use('/test', test)
<<<<<<< HEAD
<<<<<<< HEAD
    app.use('/nha-cho-thue', rental)
    app.use('/quan-ly', user)
    app.use('/dang-tin', postNews)
    app.use('/', partials);
    app.use('/', site);

=======
=======
>>>>>>> a503d10ea67dc4a8a4eb8e6a56dce9e6c0d636b7
    app.use('/rental', rental)
    app.use('/quan-ly', user)
    app.use('/', site);
    app.use('/', partials);
    
<<<<<<< HEAD
>>>>>>> a503d10ea67dc4a8a4eb8e6a56dce9e6c0d636b7
=======
>>>>>>> a503d10ea67dc4a8a4eb8e6a56dce9e6c0d636b7
}
module.exports = route;
