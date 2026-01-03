/**
 * PHASE 1: DATABASE DESIGN - LEARNING GUIDE
 * 
 * What is a Prisma Schema?
 * =======================
 * A schema.prisma file is like a blueprint that tells Prisma:
 * 1. What database tables to create
 * 2. What columns each table has
 * 3. What type of data each column holds
 * 4. How tables relate to each other
 * 
 * KEY CONCEPTS:
 * 
 * 1. MODELS
 *    - Think of models as "tables" in a database
 *    - Each model = one table
 *    - Example: User model = User table with user records
 * 
 * 2. FIELDS
 *    - Fields are "columns" in a table
 *    - Each field has a name, type, and optional modifiers
 *    - Types: String, Int, Boolean, DateTime, Float, etc.
 * 
 * 3. FIELD MODIFIERS
 *    @id           → This is the unique identifier (primary key)
 *    @unique       → This value must be unique (no duplicates)
 *    @default()    → Default value if not provided
 *    @updatedAt    → Automatically updates timestamp
 *    ?             → Field is optional (can be empty/null)
 * 
 * 4. RELATIONSHIPS
 *    One-to-One:   One user has one employee profile
 *    One-to-Many:  One employee has many attendance records
 *    Many-to-Many: (Will use in future phases)
 * 
 * 5. ENUMS
 *    - Like predefined choices
 *    - Role can only be ADMIN or EMPLOYEE
 *    - AttendanceStatus can only be PRESENT, ABSENT, HALF_DAY, LEAVE
 * 
 * EXAMPLE BREAKDOWN:
 * 
 * model User {
 *   id          String  @id @default(cuid())
 *   ↑           ↑       ↑  ↑
 *   field name  type    modifiers (unique ID generated automatically)
 * 
 *   email       String  @unique
 *   ↑           ↑       ↑
 *   field name  type    modifier (no two users can have same email)
 * 
 *   role        Role    @default(EMPLOYEE)
 *   ↑           ↑       ↑
 *   field name  enum    sets default value
 * 
 *   employee    Employee?
 *   ↑           ↑        ↑
 *   field name  type     optional (? means can be null)
 * }
 * 
 * ============= TABLE STRUCTURE OVERVIEW =============
 * 
 * 1. USER (Authentication)
 *    - Stores login credentials
 *    - Has role: ADMIN or EMPLOYEE
 *    - Links to Employee profile
 * 
 * 2. EMPLOYEE (Profile)
 *    - Personal details (name, phone, address)
 *    - Job details (department, position, salary)
 *    - Links to User account
 * 
 * 3. DOCUMENT (File Storage)
 *    - Stores employee documents
 *    - Many documents per employee
 * 
 * 4. ATTENDANCE (Time Tracking)
 *    - Daily attendance records
 *    - Status: Present, Absent, Half-day, Leave
 * 
 * 5. LEAVE_REQUEST (Leave Management)
 *    - Leave applications from employees
 *    - Status: Pending, Approved, Rejected
 * 
 * 6. PAYROLL (Salary)
 *    - Monthly salary records
 *    - Base salary + allowances - deductions = net salary
 * 
 * 7. ACTIVITY_LOG (Audit Trail)
 *    - Tracks all important actions
 * 
 * NEXT STEPS:
 * 1. Install dependencies: npm install
 * 2. Set up .env file with database URL
 * 3. Run migrations: npm run prisma:migrate
 * 4. View database: npm run prisma:studio
 * 
 */
