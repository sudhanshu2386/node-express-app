const mongoose = require('mongoose')


mongoose.connect('mongodb://localhost:27017/oss-node-dev', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})

//Docker configuration for MongoDB

// mongoose.connect('mongodb://9.199.32.159:27017/oss-node-dev', {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false
// })