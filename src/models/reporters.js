const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const reporterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        required: true,
        trim: true,
        validate(value) {
            if (value < 0) {
                throw new Error('Please enter the correct age')
            }
        }
    },
    address: {
        type: String,
        default: 'Egypt',
        trim: true

    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email')
            }
        }

    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 8,

        validate(value) {
            let regExpPw = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})")
            if (!regExpPw.test(value)) {
                throw new Error('Password have to include Uppercase,LowerCase,number,specical character')
            }
        }
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        minlength: 11,
        unique: true,
        validate(value) {
            // let regExpPhone = new RegExp("/^((\+?20)|0)?1(0|1|2)\d{8}$/")
            // if (!regExpPhone.test(value)) {
            if (!validator.isMobilePhone(value, ['ar-EG'])) {
                throw new Error('Please Enter correct phone number')
            }
        }
    },
    tokens: [{
        type: String,
        required: true
    }]

})


//to hash the password

reporterSchema.pre('save', async function() {
    const reporter = this
    if (reporter.isModified('password')) {
        reporter.password = await bcrypt.hash(reporter.password, 8)
    }
})

//login
reporterSchema.statics.findByCredentials = async(email, password) => {
    const reporter = await Reporter.findOne({ email })
    if (!reporter) {
        throw new Error('Unable to login..Please Check email and password')
    }
    const isMatch = await bcrypt.compare(password, reporter.password)
    if (!isMatch) {
        throw new Error('Unable to login..Please Check email and password')
    }
    return reporter

}


//to generate token for authorization
reporterSchema.methods.generateToken = async function() {
    const reporter = this
    const token = jwt.sign({ _id: reporter._id.toString() }, 'nodecourse')
    reporter.tokens = reporter.tokens.concat(token)
    await reporter.save()
    return token
}

const Reporter = mongoose.model('Reporter', reporterSchema)
module.exports = Reporter