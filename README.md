# RateMyStore

A full-stack web application that allows users to submit ratings for registered stores. The application features a robust role-based access control (RBAC) system supporting System Administrators, Store Owners, and Normal Users.

## Tech Stack
- **Frontend:** React, Vite, Tailwind CSS, React Router, Axios, Lucide-React
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL (with `pg` driver)
- **Authentication:** JSON Web Tokens (JWT), Bcrypt

## Features by Role

**1. System Administrator**
- Overview dashboard with platform statistics (total users, stores, ratings).
- Add new platform users and define their roles.
- Add new stores and assign them to existing Store Owners.
- View and search comprehensive listings of all users and stores.

**2. Store Owner**
- Dedicated analytics dashboard.
- View the overall average rating for their specific store.
- View a table of all normal users who have rated their store (includes names, emails, and the rating value).

**3. Normal User**
- Self-registration / Signup with strict validation constraints.
- View a list of all registered stores on the platform.
- Search stores by name or address.
- Submit a 1-5 star rating for any store.
- Update/modify previously submitted ratings.

*(Note: All authenticated users have access to change their password securely).*

---

## Prerequisites
Before running this project, ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/en/) (v16+ recommended)
- [PostgreSQL](https://www.postgresql.org/download/)

---

## Step-by-Step Setup Guide

### 1. Database Setup
Ensure your local PostgreSQL server is running. You need to create an empty database for the application to use.
1. Open your PostgreSQL terminal (psql) or PgAdmin.
2. Create a new database named `store_ratings`:
```sql
CREATE DATABASE store_ratings;
```

### 2. Backend Setup
Navigate into the `backend` directory and install the required dependencies.

```bash
cd backend
npm install
```

**Environment Variables:**
In the `backend` directory, there is an `.env` file. Ensure the `DATABASE_URL` matches your local PostgreSQL credentials. The default structure looks like this:
```env
PORT=5000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/store_ratings
JWT_SECRET=super_secret_key_123
```
*(Change `postgres:postgres` to your actual postgres username and password).*

**Initialize the Database:**
Run the initialization script. This creates all necessary tables (`users`, `stores`, `ratings`) and seeds the default System Administrator account.
```bash
node init_db.js
```

**Start the Server:**
Once the database is initialized, start the backend server.
```bash
node index.js
```
*The backend should now be running on `http://localhost:5000`.*

### 3. Frontend Setup
Open a **new** terminal window (leave the backend running), and navigate to the `frontend` directory.

```bash
cd frontend
npm install
```

**Start the React Development Server:**
```bash
npm run dev
```
*The frontend should now be running on `http://localhost:5173` (or the port Vite provides).*

---

## Default Admin Credentials
To start testing the application, log in with the default System Administrator credentials created during the initialization script:

- **Email:** `admin@system.com`
- **Password:** `Admin@123`

From the Admin Dashboard, you can start creating Store Owners, Stores, and Normal Users!
