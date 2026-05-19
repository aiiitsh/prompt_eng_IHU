# Online Library Management System

This version runs with only a React frontend and an Express backend. It does not need MySQL, XAMPP, phpMyAdmin, or any database import.

## Stack

- Frontend: React with Vite
- Backend: Node.js with Express
- Storage: local JSON file at `server/data/library.json`

## Why There Is No Database Setup

The backend stores the same library records in a JSON file. This keeps the class setup simple while preserving the main functionality: login, signup, profile updates, book management, student management, and issue/return records.

## First-Time Setup

Install dependencies from the project root:

```powershell
npm.cmd run install:all
```

## Start The Project

The project folder can be placed anywhere on your computer. Replace `<your-folder-location>` with the parent folder where you keep the project.

Open one terminal for the backend:

```powershell
cd "<your-folder-location>\online_library_system\server"
npm.cmd run dev
```

Open a second terminal for the frontend:

```powershell
cd "<your-folder-location>\online_library_system\client"
npm.cmd run dev
```

Then open:

```text
http://localhost:5173
```

The backend runs at:

```text
http://localhost:5000
```

## Test Accounts

Admin:

```text
Username: admin
Password: admin
```

Student:

```text
Email: anujk@gmail.com
Password: admin
```

## Reset Demo Data

The first backend start creates `server/data/library.json`. If you want to reset the demo data, stop the backend, delete that file, and start the backend again.

## Presentation Summary

The old project used PHP pages connected to MySQL. The new project separates the system into two parts:

```text
React frontend -> Express API -> JSON file storage
```

React handles the interface. Express handles the application logic. The JSON file stores the project data locally without requiring database installation.
