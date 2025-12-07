require('dotenv').config();
const mongoose = require('mongoose');
const Sale = require('./src/models/Sale');

const NUM_RECORDS = 200;
const FIRST_NAMES = ['Aarav', 'Neha', 'Vihaan', 'Priya', 'Aditya', 'Diya', 'Rohan', 'Ananya', 'Karan', 'Sneha'];
const LAST_NAMES = ['Sharma', 'Yadav', 'Patel', 'Verma', 'Gupta', 'Singh', 'Kumar', 'Mehta', 'Reddy', 'Das'];
const REGIONS = ['North', 'South', 'East', 'West'];
const PRODUCT_CATEGORIES = ['Electronics', 'Clothing', 'Home & Kitchen', 'Beauty', 'Sports'];
const PAYMENT_METHODS = ['Credit Card', 'Debit Card', 'UPI', 'Cash', 'Net Banking'];
const ORDER_STATUSES = ['Completed', 'Pending', 'Cancelled', 'Returned'];
const BRANDS = ['BrandA', 'BrandB', 'BrandC', 'BrandD'];

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

const seed = async () => {
    try {
        console.log("Connecting to:", process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected. Deleting old data...");
        await Sale.deleteMany({});

        console.log("Generating data...");
        const salesData = [];
        for (let i = 0; i < NUM_RECORDS; i++) {
            const quantity = getRandomInt(1, 10);
            const price = getRandomInt(10, 500) * 10;
            salesData.push({
                "Customer ID": `CUST${1000 + i}`,
                "Customer Name": `${getRandomElement(FIRST_NAMES)} ${getRandomElement(LAST_NAMES)}`,
                "Phone Number": `+91 ${getRandomInt(9000000000, 9999999999)}`,
                "Gender": getRandomElement(['Male', 'Female']),
                "Age": getRandomInt(18, 70),
                "Customer Region": getRandomElement(REGIONS),
                "Customer Type": getRandomElement(['New', 'Returning']),
                "Product ID": `PROD${1000 + getRandomInt(1, 20)}`,
                "Product Category": getRandomElement(PRODUCT_CATEGORIES),
                "Tags": [getRandomElement(['New', 'Sale'])],
                "Quantity": quantity,
                "Total Amount": quantity * price,
                "Date": new Date(),
                "Payment Method": getRandomElement(PAYMENT_METHODS),
                "Order Status": getRandomElement(ORDER_STATUSES),
                "Store Location": 'Mumbai',
                "Store ID": 'STORE1',
                "Employee Name": 'John Doe'
            });
        }

        await Sale.insertMany(salesData);
        console.log("Data seeded successfully.");
        process.exit(0);
    } catch (err) {
        console.error("Seed error:", err);
        process.exit(1);
    }
};

seed();
