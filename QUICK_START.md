# 🚀 Quick Start Guide - DayFlow HRMS

## Get Started in 5 Minutes!

### Step 1: Install Node.js (If not already installed)
- Download from: https://nodejs.org (LTS version recommended)
- Verify installation: `node --version`

### Step 2: Navigate to Backend Folder
```bash
cd backend
```

### Step 3: Install Dependencies
```bash
npm install
```
This downloads and installs all required libraries.

### Step 4: Create Environment File
Create a file named `.env` in the backend folder with:
```
DATABASE_URL="file:./dev.db"
PORT=3000
NODE_ENV=development
```

### Step 5: Initialize Database
```bash
npm run prisma:migrate
```
When asked, type: `init` or just press Enter

### Step 6: Start Server
```bash
npm run dev
```

### Step 7: Test It Works
- Open browser: http://localhost:3000
- Should see: `{ message: "Welcome to DayFlow HRMS Backend API", ... }`

### ✅ You're Ready!

---

## 📚 Next: Learn the Basics

Read these in order:
1. **docs/JAVASCRIPT_PRISMA_PRIMER.md** - JavaScript & Prisma crash course
2. **docs/PHASE_1_DATABASE_DESIGN.md** - Understand the database structure
3. **docs/DEVELOPMENT_ROADMAP.md** - See the full plan

---

## 🔍 Useful Commands

```bash
# See your database
npm run prisma:studio

# Regenerate Prisma client
npm run prisma:generate

# Stop the server
Ctrl + C

# Update database schema
npm run prisma:migrate
```

---

## 💡 Common Issues & Solutions

### `npm: command not found`
Install Node.js from nodejs.org

### `Port 3000 already in use`
Change PORT in .env file to 3001 or 3002

### `Database error`
Delete `dev.db` file and run `npm run prisma:migrate` again

### Confused about something?
Check **docs/JAVASCRIPT_PRISMA_PRIMER.md** - it has examples!

---

## 🎯 What We've Built (Phase 1)

✅ Database schema with 7 models
✅ Express.js server
✅ Project structure
✅ Comprehensive documentation
✅ Learning guides for beginners

---

## 📋 What's Next (Phase 2)

🔐 User authentication (Sign up & Sign in)
🔑 Password security
🎫 JWT token sessions
🛡️ Protected routes

---

## 🤝 Need Help?

1. Read the error message carefully
2. Check docs/ folder for detailed explanations
3. Use Prisma Studio to inspect your database
4. Verify the .env file is correct

