const Sale = require('../models/Sale');

exports.getSales = async (req, res) => {
    try {
        const {
            search,
            region,
            gender,
            ageRange,
            category,
            tags,
            paymentMethod,
            startDate,
            endDate,
            sortBy,
            page = 1,
            limit = 10
        } = req.query;

        const query = {};

        // 1. Search
        if (search) {
            query.$or = [
                { "Customer Name": { $regex: search, $options: 'i' } },
                { "Phone Number": { $regex: search, $options: 'i' } }
            ];
        }

        // 2. Filters
        if (region) query["Customer Region"] = { $in: region.split(',') };
        if (gender) query["Gender"] = { $in: gender.split(',') };
        if (category) query["Product Category"] = { $in: category.split(',') };
        if (paymentMethod) query["Payment Method"] = { $in: paymentMethod.split(',') };
        if (tags) query["Tags"] = { $in: tags.split(',') };

        // Age Range
        if (ageRange) {
            const ranges = ageRange.split(',');
            const orConditions = ranges.map(range => {
                const [min, max] = range.split('-').map(Number);
                return { "Age": { $gte: min, $lte: max } };
            });
            if (query.$or) {
                query.$and = [{ $or: query.$or }, { $or: orConditions }];
                delete query.$or;
            } else {
                query.$or = orConditions;
            }
        }

        // Date Range
        if (startDate || endDate) {
            query["Date"] = {};
            if (startDate) query["Date"].$gte = new Date(startDate);
            if (endDate) query["Date"].$lte = new Date(endDate);
        }

        // 3. Sorting
        let sort = {};
        if (sortBy) {
            switch (sortBy) {
                case 'date_newest': sort = { "Date": -1 }; break;
                case 'date_oldest': sort = { "Date": 1 }; break;
                case 'quantity_high': sort = { "Quantity": -1 }; break;
                case 'quantity_low': sort = { "Quantity": 1 }; break;
                case 'name_asc': sort = { "Customer Name": 1 }; break;
                case 'name_desc': sort = { "Customer Name": -1 }; break;
                default: sort = { "Date": -1 };
            }
        } else {
            sort = { "Date": -1 };
        }

        // 4. Pagination
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const [data, total] = await Promise.all([
            Sale.find(query).sort(sort).skip(skip).limit(limitNum),
            Sale.countDocuments(query)
        ]);

        res.json({
            data,
            total,
            page: pageNum,
            totalPages: Math.ceil(total / limitNum)
        });

    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.getUniqueValues = async (req, res) => {
    try {
        const field = req.params.field;

        const validFields = {
            'region': "Customer Region",
            'category': "Product Category",
            'payment': "Payment Method",
            'tags': "Tags" // Tags is an array, MongoDB distinct handles it well
        };

        if (!validFields[field]) {
            return res.status(400).json({ error: "Invalid field" });
        }

        const key = validFields[field];
        const values = await Sale.distinct(key);

        res.json(values);

    } catch (error) {
        console.error("Error fetching unique values:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
