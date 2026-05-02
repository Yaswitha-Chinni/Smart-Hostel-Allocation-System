# KITSW Hostel Room Booking System

A full-stack hostel room allocation system built with Node.js, Express, and MySQL.

## Prerequisites
- Node.js installed
- MySQL Server installed and running

## Local Setup

### 1. Database Setup
1. Open your MySQL client (Command Line or Workbench).
2. Run the queries inside `schema.sql` to create the database and seed the rooms.
   ```sql
   source path/to/schema.sql
   ```
   *Note: Ensure you have no existing database named `kitsw_hostel` or modify the name in `.env` and `schema.sql`.*

### 2. Configuration
1. Open the `.env` file in the root directory.
2. Update the database credentials (`DB_USER`, `DB_PASS`) to match your local MySQL setup.

### 3. Install Dependencies
Open your Command Prompt in the project folder and run:
```cmd
npm install
```

### 4. Run the Server
Start the backend server:
```cmd
node server.js
```
The server will start on `http://localhost:5000`.

### 5. Access the App
Open your browser and navigate to:
`http://localhost:5000`

## Features
- **Modern UI**: Soft blue and white theme with Inter typography.
- **Authentication**: JWT-based login/registration with student email validation.
- **Dynamic Dashboard**: Shows rooms based on student gender and floor filters.
- **Booking System**: Real-time slot availability updates and booking restrictions.
