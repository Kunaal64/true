import React, { useState, useEffect, useCallback } from 'react';
import { getSales, getUniqueValues } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
    
    // State for filters and search
    const [filters, setFilters] = useState({
        search: '',
        region: [],
        category: [],
        paymentMethod: [],
        tags: [],
        sortBy: 'date_newest'
    });

    // Options for dropdowns
    const [options, setOptions] = useState({
        region: [],
        category: [],
        paymentMethod: [],
        tags: []
    });

    const fetchOptions = async () => {
        try {
            const [regions, categories, payments] = await Promise.all([
                getUniqueValues('region'),
                getUniqueValues('category'),
                getUniqueValues('payment')
            ]);
            setOptions(prev => ({ 
                ...prev, 
                region: regions.data, 
                category: categories.data, 
                paymentMethod: payments.data 
            }));
        } catch (error) {
            console.error("Failed to load filter options", error);
        }
    };

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const params = {
                page: pagination.page,
                limit: 10,
                search: filters.search,
                sortBy: filters.sortBy,
                region: filters.region.join(','),
                category: filters.category.join(','),
                paymentMethod: filters.paymentMethod.join(',')
            };
            
            const response = await getSales(params);
            setData(response.data.data);
            setPagination(prev => ({
                ...prev,
                totalPages: response.data.totalPages,
                total: response.data.total
            }));
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    }, [pagination.page, filters]);

    useEffect(() => {
        fetchOptions();
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSearchChange = (e) => {
        setFilters(prev => ({ ...prev, search: e.target.value }));
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const handleFilterChange = (field, value) => {
        setFilters(prev => {
           const current = prev[field];
           const updated = current.includes(value) 
               ? current.filter(item => item !== value)
               : [...current, value];
           return { ...prev, [field]: updated };
        });
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const handleSortChange = (e) => {
        setFilters(prev => ({ ...prev, sortBy: e.target.value }));
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            setPagination(prev => ({ ...prev, page: newPage }));
        }
    };

    return (
        <div className="dashboard">
            {/* Top Bar: Search & Sort */}
            <div className="dashboard-controls">
                <input 
                    type="text" 
                    placeholder="Search by Name or Phone..." 
                    value={filters.search}
                    onChange={handleSearchChange}
                    className="search-bar"
                />
                
                <select value={filters.sortBy} onChange={handleSortChange} className="sort-select">
                    <option value="date_newest">Date: Newest</option>
                    <option value="date_oldest">Date: Oldest</option>
                    <option value="quantity_high">Quantity: High to Low</option>
                    <option value="quantity_low">Quantity: Low to High</option>
                    <option value="name_asc">Name: A-Z</option>
                </select>
            </div>

            {/* Filter Panel */}
            <div className="filters-container">
                <div className="filter-group">
                    <label>Region</label>
                    <div className="checkbox-group">
                        {options.region.map(r => (
                            <label key={r} className="checkbox-label">
                                <input 
                                    type="checkbox" 
                                    checked={filters.region.includes(r)}
                                    onChange={() => handleFilterChange('region', r)}
                                /> {r}
                            </label>
                        ))}
                    </div>
                </div>
                 <div className="filter-group">
                    <label>Category</label>
                    <div className="checkbox-group">
                        {options.category.map(c => (
                            <label key={c} className="checkbox-label">
                                <input 
                                    type="checkbox" 
                                    checked={filters.category.includes(c)}
                                    onChange={() => handleFilterChange('category', c)}
                                /> {c}
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {/* Metrics */}
            <div className="metrics">
                <div className="metric-card">Total Results: {pagination.total}</div>
            </div>

            {/* Table */}
            {loading ? <p>Loading...</p> : (
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Transaction ID</th>
                                <th>Date</th>
                                <th>Customer Name</th>
                                <th>Phone</th>
                                <th>Region</th>
                                <th>Category</th>
                                <th>Quantity</th>
                                <th>Total Amount</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map(item => (
                                <tr key={item["Customer ID"] + item["Product ID"] + item["Date"]}>
                                    <td>{Math.floor(Math.random() * 100000)}</td>
                                    <td>{item.Date}</td>
                                    <td>{item["Customer Name"]}</td>
                                    <td>{item["Phone Number"]}</td>
                                    <td>{item["Customer Region"]}</td>
                                    <td>{item["Product Category"]}</td>
                                    <td>{item.Quantity}</td>
                                    <td>₹{item["Total Amount"]}</td>
                                    <td>
                                        <span className={`status-badge ${item["Order Status"].toLowerCase()}`}>
                                            {item["Order Status"]}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {data.length === 0 && <tr><td colSpan="9">No results found</td></tr>}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            <div className="pagination">
                <button 
                    className="btn" 
                    disabled={pagination.page === 1}
                    onChange={() => handlePageChange(pagination.page - 1)}
                    onClick={() => handlePageChange(pagination.page - 1)}
                >
                    Previous
                </button>
                <span>Page {pagination.page} of {pagination.totalPages}</span>
                <button 
                    className="btn" 
                    disabled={pagination.page === pagination.totalPages}
                    onClick={() => handlePageChange(pagination.page + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
