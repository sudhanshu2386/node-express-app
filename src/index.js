const express = require('express')
require('./db/mongoose')
const employeeRouter = require('./router/employeeController')

const app = express()
const port = process.env.PORT || 3000

app.use((req, res, next) => {

    next()
})

app.use(express.json())
app.use(employeeRouter)

app.listen(port, () => {
    console.log('Server is up & running on port ' +port)
})