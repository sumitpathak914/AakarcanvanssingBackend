const mongoose = require('mongoose');

// Function to generate a unique 5-digit shop ID
const generateUniqueShopId = async () => {
    let shopId;
    let isUnique = false;

    while (!isUnique) {
        // Generate a random 5-digit number
        shopId = Math.floor(10000 + Math.random() * 90000).toString();

        // Check if the generated shopId already exists
        const existingDealer = await Dealer.findOne({ shopId });
        if (!existingDealer) {
            isUnique = true;
        }
    }

    return shopId;
};

const dealerSchema = new mongoose.Schema({
    shopId: { type: String,  },
    shopName: { type: String, },
    CommissionDoneAmount: { type: String, },
    contactPerson: { type: String,  },
    email: { type: String,  unique: true },
    gstNumber: { type: String,  },
    FSSAINumber: { type: String,  },
    password: { type: String,  },
    contactNumber: { type: Number },
    confirmPassword: { type: String,}, 
    isAllowLogin: { type: Boolean, default: false }
});

// Pre-save hook to set the unique shopId
dealerSchema.pre('save', async function (next) {
    if (this.isNew) {
        this.shopId = await generateUniqueShopId();
    }
    next();
});

const Dealer = mongoose.model('Dealer', dealerSchema);
module.exports = Dealer;
