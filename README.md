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
