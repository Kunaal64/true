# Retail Sales Management System

## Overview
A full-stack application for managing retail sales data with advanced search, filtering, and sorting capabilities. Built to demonstrate clean architecture and professional engineering standards.

## Tech Stack
- **Frontend**: React, Vite, Vanilla CSS
- **Backend**: Node.js, Express
- **Data**: JSON Mock Data

## Search Implementation Summary
Full-text search is implemented on the backend. It filters the "Customer Name" and "Phone Number" fields case-insensitively using string inclusion checks.

## Filter Implementation Summary
Multi-select filtering is supported for fields like Region, Category, and Payment Method. The backend accepts comma-separated values and strictly filters the dataset to match any of the selected values.

## Sorting Implementation Summary
Sorting is dynamic based on user selection. Supported keys include Date (Newest/Oldest), Quantity, and Customer Name.

## Pagination Implementation Summary
Server-side pagination is implemented. The frontend requests a specific page and limit (10 items), and the backend slices the filtered result set accordingly.

## Setup Instructions
1. **Backend**:
   ```bash
   cd backend
   npm install
   npm run generate-data
   npm start
   ```
   Server runs on http://localhost:5000

2. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   App runs on http://localhost:3000
