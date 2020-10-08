const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    }, department: {
        type: String, 
        required: true
    }, salary: {
        type: Number,
        default: 0,
        validate(value) {
            if(value < 0){
                throw new Error('Salary details are incorrect')
            }
        }
    }, email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    }, password: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if(value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contains "Password"')
            }
        }
    }, tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})

employeeSchema.methods.getPublicProfile = function() {
    const employee = this
    const employeeObject = employee.toObject()

    delete employeeObject.password
    delete employeeObject.tokens
    return employeeObject
}

employeeSchema.methods.generateAuthToken = async function() {
    const employee = this
    const token = jwt.sign({ _id: employee._id.toString() }, 'secretToken')
    employee.tokens = employee.tokens.concat({ token })
    await employee.save()
     
    return token
}

employeeSchema.statics.findByCredentials = async(email, password) => {
    const employee = await Employee.findOne({email})
    if(!employee) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, employee.password)
    if(!isMatch) {
        throw new Error('password match not found !')
    }
    return employee
}

// Hash the plain text password before saving
employeeSchema.pre('save', async function(next) {
    const employee = this

    if(employee.isModified('password')) {
        employee.password = await bcrypt.hash(employee.password, 8)
    }
    next()
})

const Employee = mongoose.model('Employee', employeeSchema)

module.exports = Employee