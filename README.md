# KITSW Smart Hostel Allocation System 🏨

![Live Status](https://img.shields.io/badge/Status-Live-success)
![Platform](https://img.shields.io/badge/Platform-Google%20Cloud%20Run-blue)

A full-stack hostel room allocation system built for **Kakatiya Institute of Technology and Science (KITSW)**. It features real-time room booking, student profiles, filtered room views, dynamic token generation, and an Admin dashboard.

---

## 🌐 Live URL
The application is deployed and live on Google Cloud Run:
👉 **[Live Application Link](https://smart-hostel-allocation-system-179720160936.europe-west1.run.app)**

- **Student Login:** `https://smart-hostel-allocation-system-179720160936.europe-west1.run.app`
- **Admin Portal:** `https://smart-hostel-allocation-system-179720160936.europe-west1.run.app/admin-login.html`

---

## 📸 Screenshots

*(You can add your own screenshots to the `screenshots/` folder and they will appear here)*

<div align="center">
  <img src="screenshots/login.png" alt="Login Page" width="400" />
  <img src="screenshots/dashboard.png" alt="Student Dashboard" width="400" />
</div>
<br>
<div align="center">
  <img src="screenshots/booking.png" alt="Booking Process" width="400" />
  <img src="screenshots/admin.png" alt="Admin Dashboard" width="400" />
</div>

---

## 🔄 System Workflows

### 👨‍🎓 Student Workflow
1. **Registration:** Student creates an account using their KITSW Roll Number (`B24AI089`), `@kitsw.ac.in` email, and selects their gender.
2. **Login & Dashboard:** Student logs in and lands on the dashboard. The system automatically fetches rooms corresponding to their gender (Boys/Girls Hostel).
3. **Filtering:** Students can filter the available 116 rooms across 3 floors (Ground, 1st, 2nd) and 3 room types (AC/Non-AC, Attached/Non-Attached).
4. **Booking:** Student selects an available room and books it. A unique `KITSW####` token is generated.
5. **Confirmation:** The dashboard UI updates to show the booked room, the generated token, and a list of all roommates in that room.

### 🛡️ Admin Workflow
1. **Admin Login:** Admin logs in using secure hardcoded credentials via the `/admin-login.html` portal.
2. **Dashboard Overview:** Admin views the central dashboard displaying all registered students and their booking statuses.
3. **Tracking & Analytics:** Admin can filter students by booked status, floor, or room type, allowing easy tracking of hostel capacity.
4. **Management:** Admin oversees total slot availability across the 3 floors (345 total slots).

---

## ⚙️ Technical Stack
- **Frontend:** HTML5, Vanilla CSS (Inter font, flexbox grid), Vanilla JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MySQL / In-Memory Mock System
- **Authentication:** JWT (JSON Web Tokens), `bcryptjs` for secure password hashing
- **Deployment:** Google Cloud Run (Serverless)

---

## 💻 Local Setup Instructions

### 1. Database Setup
1. Open your MySQL client (Command Line or Workbench).
2. Run the queries inside `schema.sql` to create the database and seed all 116 rooms.
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
Start the backend server (starts mock server for cloud, or `server.js` for local MySQL):
```cmd
npm start
```
The server will start on `http://localhost:8080` (or 5000 if using custom `.env`).

---

## 🏗️ Project Structure
```text
📦 Smart-Hostel-Allocation-System
 ┣ 📂 config          # Database connection
 ┣ 📂 public          # Frontend Assets (HTML, CSS, JS, Images)
 ┣ 📂 routes          # Express API Routes (auth, rooms, bookings, admin)
 ┣ 📜 server.js       # Main server file (MySQL)
 ┣ 📜 server-mock.js  # Server for Cloud Run (In-memory)
 ┣ 📜 schema.sql      # Database layout & room seeding
 ┗ 📜 package.json    # Node dependencies & scripts
```
