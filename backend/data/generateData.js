require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const Sale = require('../src/models/Sale');

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

function generateDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

const generateData = async () => {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected. Clearing old data...");

        await Sale.deleteMany({});

        const salesData = [];

        for (let i = 0; i < NUM_RECORDS; i++) {
            const quantity = getRandomInt(1, 10);
            const pricePerUnit = getRandomInt(10, 500) * 10;
            const discount = getRandomInt(0, 20);
            const totalAmount = quantity * pricePerUnit;
            const finalAmount = totalAmount - (totalAmount * (discount / 100));

            salesData.push({
                "Customer ID": `CUST${1000 + i}`,
                "Customer Name": `${getRandomElement(FIRST_NAMES)} ${getRandomElement(LAST_NAMES)}`,
                "Phone Number": `+91 ${getRandomInt(9000000000, 9999999999)}`,
                "Gender": getRandomElement(['Male', 'Female']),
                "Age": getRandomInt(18, 70),
                "Customer Region": getRandomElement(REGIONS),
                "Customer Type": getRandomElement(['New', 'Returning', 'VIP']),

                "Product ID": `PROD${1000 + getRandomInt(1, 20)}`,
                "Product Name": `Product ${String.fromCharCode(65 + getRandomInt(0, 25))}`,
                "Brand": getRandomElement(BRANDS),
                "Product Category": getRandomElement(PRODUCT_CATEGORIES),
                "Tags": [getRandomElement(['New Arrival', 'Best Seller', 'Discounted', 'Limited'])],

                "Quantity": quantity,
                "Price per Unit": pricePerUnit,
                "Discount Percentage": discount,
                "Total Amount": totalAmount,
                "Final Amount": Math.round(finalAmount),

                "Date": generateDate(new Date(2023, 0, 1), new Date(2023, 11, 31)),
                "Payment Method": getRandomElement(PAYMENT_METHODS),
                "Order Status": getRandomElement(ORDER_STATUSES),
                "Delivery Type": getRandomElement(['Standard', 'Express', 'Store Pickup']),
                "Store ID": `STORE${getRandomInt(1, 5)}`,
                "Store Location": getRandomElement(['Mumbai', 'Delhi', 'Bangalore', 'Chennai']),
                "Salesperson ID": `EMP${getRandomInt(100, 150)}`,
                "Employee Name": `${getRandomElement(FIRST_NAMES)} ${getRandomElement(LAST_NAMES)}`
            });
        }

        await Sale.insertMany(salesData);
        console.log(`Successfully seeded ${NUM_RECORDS} records.`);
        process.exit(0);

    } catch (error) {
        console.error("Error generating data:", error);
        process.exit(1);
    }
};

generateData();
