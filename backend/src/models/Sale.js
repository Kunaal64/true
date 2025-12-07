const mongoose = require('mongoose');

const SaleSchema = new mongoose.Schema({
    "Customer ID": String,
    "Customer Name": { type: String, index: true },
    "Phone Number": { type: String, index: true },
    "Gender": String,
    "Age": Number,
    "Customer Region": { type: String, index: true },
    "Customer Type": String,

    "Product ID": String,
    "Product Name": String,
    "Brand": String,
    "Product Category": { type: String, index: true },
    "Tags": [String],

    "Quantity": Number,
    "Price per Unit": Number,
    "Discount Percentage": Number,
    "Total Amount": Number,
    "Final Amount": Number,

    "Date": { type: Date, index: true },
    "Payment Method": String,
    "Order Status": String,
    "Delivery Type": String,
    "Store ID": String,
    "Store Location": String,
    "Salesperson ID": String,
    "Employee Name": String
});

// Text index for search
SaleSchema.index({ "Customer Name": 'text', "Phone Number": 'text' });

module.exports = mongoose.model('Sale', SaleSchema);
