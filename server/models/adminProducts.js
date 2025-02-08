const mongoose = require('mongoose')

const eachProductReviewSchema = new mongoose.Schema({
    name: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
})

const adminProductsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrls: {
        type: [String],
        validate: function (arr) {
            return arr.length > 0
        },
        message: 'Product must have at least one image'
    },
    reviews: [eachProductReviewSchema]
})

const AdminProducts = mongoose.model('AdminProducts', adminProductsSchema);

module.exports = AdminProducts