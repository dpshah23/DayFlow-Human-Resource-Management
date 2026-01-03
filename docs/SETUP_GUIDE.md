# Phase 1: Database Setup Guide

## What We Just Created

We've set up the complete database schema for your HRMS system. Here's what exists:

### Files Created:
```
backend/
├── package.json          - Project dependencies
├── .env.example         - Environment variable template
├── .gitignore           - Files to ignore in git
├── src/
│   └── index.js         - Express server
└── prisma/
    └── schema.prisma    - Database schema (BLUEPRINT of your database)
```

## Installation & Setup Steps

### Step 1: Install Dependencies
Open terminal in `backend` folder and run:
```bash
npm install
```

This will download and install:
- **express**: Web framework
- **cors**: Communication between frontend & backend
- **dotenv**: Manage environment variables
- **@prisma/client**: Database client

### Step 2: Create .env File
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Or manually create `.env` with:
```
DATABASE_URL="file:./dev.db"
PORT=3000
NODE_ENV=development
```

### Step 3: Set Up Database
Initialize Prisma and create the database:
```bash
npm run prisma:generate
npm run prisma:migrate
```

When asked for migration name, type: `init` (or press enter)

### Step 4: View Database (Optional but Recommended)
Launch Prisma Studio to see your database structure:
```bash
npm run prisma:studio
```

This opens a web interface at `http://localhost:5555` where you can:
- View all tables
- Add/edit/delete records
- Test your schema

### Step 5: Start the Server
```bash
npm run dev
```

You should see:
```
╔════════════════════════════════════════╗
║     DayFlow HRMS Backend Server        ║
║                                        ║
║  Server running on http://localhost:3000  ║
...
```

Test it: Open browser and visit `http://localhost:3000`

---

## Understanding the Database Schema

### Key Tables (Models):

1. **User** - Stores login information
   - email, password, role (ADMIN/EMPLOYEE)
   - Links to one Employee profile

2. **Employee** - Stores employee details
   - Name, phone, address, department, position, salary
   - Can have many Attendance records
   - Can have many LeaveRequest records

3. **Attendance** - Daily attendance tracking
   - Date, status (PRESENT/ABSENT/HALF_DAY/LEAVE)
   - Check-in/check-out times
   - Belongs to one Employee

4. **LeaveRequest** - Leave applications
   - Leave type (PAID/SICK/UNPAID)
   - Status (PENDING/APPROVED/REJECTED)
   - Belongs to one Employee

5. **Payroll** - Monthly salary records
   - Base salary, allowances, deductions
   - Monthly records (one per employee per month)
   - Belongs to one Employee

6. **Document** - Employee documents
   - Passport, certificates, resumes, etc.
   - Belongs to one Employee

7. **ActivityLog** - Audit trail
   - Tracks all important actions in the system

---

## What's Next?

Once you confirm the database is set up, we'll move to Phase 2:
- **Authentication API** - Sign up & Sign in endpoints
- Hash passwords securely
- Create JWT tokens for session management

---

## Troubleshooting

### Problem: `npm: command not found`
**Solution**: Install Node.js from https://nodejs.org (LTS version)

### Problem: Database already exists
**Solution**: Delete `dev.db` file and run migrations again

### Problem: Port 3000 already in use
**Solution**: Change PORT in `.env` file

---

## Important Concepts

### What is ORM (Prisma)?
- ORM = Object-Relational Mapping
- It translates between database and JavaScript
- Instead of writing SQL, you write JavaScript
- Example: `const user = await prisma.user.findUnique({ where: { id: '1' } })`

### What is a Migration?
- A migration is a version-controlled change to your database
- It records exactly what changed: new tables, columns, etc.
- Allows team members to replicate database changes

### What is Prisma Studio?
- A visual tool to manage your database
- See all records, add test data, explore relationships
- Useful for development and debugging

---

## Quick Reference Commands

```bash
npm run dev                 # Start development server
npm run prisma:studio      # Open database viewer
npm run prisma:generate    # Generate Prisma client
npm run prisma:migrate     # Create & run migrations
npm start                  # Start production server
```

---

**Ready to proceed?** Confirm these steps work, then we'll build the authentication system!
