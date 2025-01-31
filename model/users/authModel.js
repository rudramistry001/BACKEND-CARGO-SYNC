import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

// Base User Schema
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is Required"],
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, "Password is Required"]
    },
    fullname: {
        type: String,
        required: [true, 'Full Name is Required'],
        trim: true
    },
    contactno: {
        type: String,
        required: [true, 'Contact Number is Required'],
        trim: true
    },
    role: {
        type: String,
        required: [true, "Role is required"],
        enum: ['driver', 'agency', 'customer','admin']
    }
}, { 
    timestamps: true,
    discriminatorKey: 'role'
});

// Password hashing middleware
userSchema.pre("save", async function (next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

// Login method
userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email });
    
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw new Error('Incorrect password');
    }
    throw new Error('Incorrect email');
};

// Create base User model
const User = mongoose.model("User", userSchema);

// Customer Discriminator Schema
const customerSchema = new mongoose.Schema({
    preferredDeliveryTimes: [{
        type: String,
        default: []
    }],
    membershipStatus: {
        type: String,
        enum: ['regular', 'premium', 'vip'],
        default: 'regular'
    },
    specialInstructions: {
        type: String,
        trim: true
    }
});

// Driver Discriminator Schema
const driverSchema = new mongoose.Schema({
    licenseNumber: {
        type: String,
        required: [true, 'Driving license number is required'],
        trim: true
    },
    vehicleType: {
        type: String,
        enum: ['truck', 'van', 'bike'],
        required: [true, 'Vehicle type is required']
    },
    availabilityStatus: {
        type: String,
        enum: ['available', 'on duty', 'off duty'],
        default: 'available'
    },
    experienceYears: {
        type: Number,
        required: [true, 'Experience in years is required']
    }
});

// Agency Discriminator Schema
const agencySchema = new mongoose.Schema({
    agencyName: {
        type: String,
        required: [true, 'Agency name is required'],
        trim: true
    },
    registrationNumber: {
        type: String,
        required: [true, 'Registration number is required'],
        trim: true
    },
    establishedYear: {
        type: Number,
        required: [true, 'Established year is required']
    }
});

// Create discriminators
const Customer = User.discriminator("Customer", customerSchema);
const Driver = User.discriminator("Driver", driverSchema);
const Agency = User.discriminator("Agency", agencySchema);

export { User, Customer, Driver, Agency };