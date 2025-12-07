# System Architecture

## Overview
The Retail Sales Management System is a full-stack application built to manage and visualize sales data. It separates concerns between a Node.js/Express backend and a React/Vite frontend.

## Backend Architecture
- **Framework**: Express.js
- **Data Source**: In-memory JSON mock dataset (`sales_data.json`).
- **Structure**:
    - `controllers/`: Contains business logic for request processing (filtering, sorting, searching).
    - `routes/`: Defines API endpoints.
    - `data/`: Stores the generated mock data.
    - `utils/`: Helper functions (if any).
- **Data Flow**: Request -> Router -> Controller -> Filter Logic -> Response.

## Frontend Architecture
- **Framework**: React (Vite)
- **Styling**: Vanilla CSS with CSS variables for theming.
- **State Management**: React `useState` and `useEffect` hooks.
- **Structure**:
    - `App.jsx`: Main layout wrapper (Sidebar, Header).
    - `components/`: Reusable UI components (Dashboard, Search, Filter, Table).
    - `services/`: API communication layer (Axios).
- **Data Flow**: User Action -> Handler -> API Call -> State Update -> Re-render.

## Folder Structure
```
root/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── index.js
│   ├── data/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── styles/
│   │   └── App.jsx
│   └── package.json
└── docs/
    └── architecture.md
```

## Module Responsibilities
1. **Sales Controller**: Handles all complex query parameters (search, multi-select filters, sorting, pagination).
2. **Dashboard Component**: Orchestrates the UI state and calls the API service.
3. **API Service**: Centralizes HTTP requests to the backend.
