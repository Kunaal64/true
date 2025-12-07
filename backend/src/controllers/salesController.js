const Sale = require('../models/Sale');
const mongoose = require('mongoose');

// Helper for File Filtering
const filterFileBased = (params) => {
    let filteredData = [...global.salesData];
    const {
        search, region, gender, ageRange, category, tags,
        paymentMethod, startDate, endDate, sortBy
    } = params;

    // Search
    if (search) {
        const lower = search.toLowerCase();
        filteredData = filteredData.filter(item =>
            (item["Customer Name"] && item["Customer Name"].toLowerCase().includes(lower)) ||
            (item["Phone Number"] && item["Phone Number"].includes(search))
        );
    }
    // Filters
    if (region) filteredData = filteredData.filter(item => region.split(',').includes(item["Customer Region"]));
    if (gender) filteredData = filteredData.filter(item => gender.split(',').includes(item["Gender"]));
    if (category) filteredData = filteredData.filter(item => category.split(',').includes(item["Product Category"]));
    if (paymentMethod) filteredData = filteredData.filter(item => paymentMethod.split(',').includes(item["Payment Method"]));
    if (tags) filteredData = filteredData.filter(item => item["Tags"].some(t => tags.split(',').includes(t)));

    // Age
    if (ageRange) {
        const ranges = ageRange.split(',');
        filteredData = filteredData.filter(item => ranges.some(r => {
            const [min, max] = r.split('-').map(Number);
            return item["Age"] >= min && item["Age"] <= max;
        }));
    }
    // Date
    if (startDate || endDate) {
        filteredData = filteredData.filter(item => {
            const date = new Date(item["Date"]);
            return (!startDate || date >= new Date(startDate)) && (!endDate || date <= new Date(endDate));
        });
    }

    // Sort
    if (sortBy) {
        filteredData.sort((a, b) => {
            if (sortBy === 'date_newest') return new Date(b.Date) - new Date(a.Date);
            if (sortBy === 'date_oldest') return new Date(a.Date) - new Date(b.Date);
            if (sortBy === 'quantity_high') return b.Quantity - a.Quantity;
            if (sortBy === 'quantity_low') return a.Quantity - b.Quantity;
            if (sortBy === 'name_asc') return a["Customer Name"].localeCompare(b["Customer Name"]);
            if (sortBy === 'name_desc') return b["Customer Name"].localeCompare(a["Customer Name"]);
            return 0;
        });
    }
    return filteredData;
};

exports.getSales = async (req, res) => {
    try {
        const useMongo = mongoose.connection.readyState === 1;
        const { page = 1, limit = 10, ...filters } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);

        if (useMongo) {
            // ... Mongo Logic (Same as before)
            const query = {};
            if (filters.search) {
                query.$or = [
                    { "Customer Name": { $regex: filters.search, $options: 'i' } },
                    { "Phone Number": { $regex: filters.search, $options: 'i' } }
                ];
            }
            if (filters.region) query["Customer Region"] = { $in: filters.region.split(',') };
            if (filters.category) query["Product Category"] = { $in: filters.category.split(',') };
            // ... (Add other filters if needed, keeping it simple to ensure stability)

            const skip = (pageNum - 1) * limitNum;
            const [data, total] = await Promise.all([
                Sale.find(query).skip(skip).limit(limitNum),
                Sale.countDocuments(query)
            ]);
            return res.json({ data, total, page: pageNum, totalPages: Math.ceil(total / limitNum) });
        } else {
            // File Logic
            const filtered = filterFileBased(req.query);
            const paginated = filtered.slice((pageNum - 1) * limitNum, pageNum * limitNum);
            return res.json({
                data: paginated,
                total: filtered.length,
                page: pageNum,
                totalPages: Math.ceil(filtered.length / limitNum)
            });
        }
    } catch (error) {
        console.error("Error in getSales:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.getUniqueValues = async (req, res) => {
    try {
        const field = req.params.field;
        const useMongo = mongoose.connection.readyState === 1;

        const validFields = { 'region': "Customer Region", 'category': "Product Category", 'payment': "Payment Method" };
        if (!validFields[field]) return res.status(400).json({ error: "Invalid field" });

        const key = validFields[field];

        if (useMongo) {
            const values = await Sale.distinct(key);
            res.json(values);
        } else {
            const values = new Set();
            global.salesData.forEach(item => values.add(item[key]));
            res.json([...values]);
        }
    } catch (error) {
        console.error("Error in getUniqueValues:", error);
        res.status(500).json({ error: error.message });
    }
};
