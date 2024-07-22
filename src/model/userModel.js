const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

// Define user schema
const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['Admin', 'Factory'], // Add more roles as needed
        default: 'Factory'
    },
    factoryId: { type: String, unique: true },
    factoryName: { type: String, },
    contactPerson: { type: String, },
    contactNo: { type: String, },
    email: { type: String, unique: true },
    website: { type: String },
    factoryAddress: { type: String, },
    city: { type: String, },
    postalCode: { type: String, },
    country: { type: String, },
    State: { type: String, },
    FASSAINumber: { type: String },
    GSTNumber: { type: String },
    products: [
        {
            brandName: { type: String, },
            category: { type: String, },
            subCategory: { type: String, },

        },
    ],

});

// Hash password before saving to database
// UserSchema.pre('save', async function (next) {
//     try {
//         if (!this.isModified('password')) {
//             return next();
//         }
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(this.password, salt);
//         this.password = hashedPassword;
//         next();
//     } catch (error) {
//         next(error);
//     }
// });

// Method to compare password
// UserSchema.methods.comparePassword = async function (candidatePassword) {
//     return await bcrypt.compare(candidatePassword, this.password);
// };

// Create model
const User = mongoose.model('User', UserSchema);

module.exports = User;
