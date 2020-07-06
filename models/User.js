const mongoose = require("mongoose")
const bcrypt = require("bcrypt")


mongoose.promise = Promise
let userSchema = new mongoose.Schema({
	username: {type: String, required: false, unique: true},
    email: {type: String, required: true},
    password: {type: String, required: false, unique:false},
	age: {type: Number, required: true},
	companyName: {type: String, required: true},
    businessEmail: {type: String, required: true},
    address: {type: String, required: true},
    country: {type: String, required: true},
    zipCode: {type: Number, required: true},
	region: {type: String, required: true},
	imgSrc: {type: String, required: false},
	imgId: {type: String, required: false},
	type: { type: String },
	githubId: { type: String },
	googleId: Number,
	review: [{productId: mongoose.SchemaTypes.ObjectId, _id: false}],
	comment: [{productId: mongoose.SchemaTypes.ObjectId, _id: false}],
	cart: [{productId: mongoose.SchemaTypes.ObjectId, quantity: {type: Number},_id: false}]
})

userSchema.methods = {
	checkPassword: function (inputPassword) {
		return bcrypt.compareSync(inputPassword, this.password)
	},
	hashPassword: plainTextPassword => {
		return bcrypt.hashSync(plainTextPassword, 10)
	}
}

userSchema.pre('save', function (next) {
	if (!this.password) {
		console.log('models/user.js =======NO PASSWORD PROVIDED=======')
		next()
	} else {
		console.log('models/user.js hashPassword in pre save');
		
		this.password = this.hashPassword(this.password)
		next()
	}
})

let User = mongoose.model("User", userSchema)

module.exports = User;