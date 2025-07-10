# 🚀 Evangelism Backend API

A robust Node.js backend for managing evangelism campaigns, candidates, and user authentication. Built with Express, Prisma, and Supabase PostgreSQL.

![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)
![Express](https://img.shields.io/badge/Express-4.x-blue?logo=express)
![Prisma](https://img.shields.io/badge/Prisma-ORM-purple?logo=prisma)
![JWT](https://img.shields.io/badge/JWT-Auth-orange?logo=jsonwebtokens)

## 📋 Prerequisites

- Node.js v18+
- npm or yarn
- Supabase account (free tier)
- Git

## 🛠️ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/evangelism-backend.git
cd evangelism-backend
2️⃣ Install Dependencies
bash
npm install
3️⃣ Set Up Supabase Database
Go to Supabase.com and create a new project

After creation, save your database password securely

Click the Connect button at the top

In the modal, select ORM → Prisma

Copy your connection strings

4️⃣ Configure Environment Variables
Create a .env file in the root directory with:

env
PORT=5000

# Connect to Supabase via connection pooling
DATABASE_URL="postgresql://postgres.xxxx.supabase.com:6543/postgres?pgbouncer=true"

# Direct connection for migrations
DIRECT_URL="postgresql://postgres.xxxxx.supabase.com:5432/postgres"

# JWT Secret Key
JWT_SECRET="go to https://jwtsecrets.com to generate random jwt key"
5️⃣ Run Database Migrations
bash
npx prisma generate
npx prisma db push
6️⃣ Start the Server
bash
node server.js
The API will be running at: http://localhost:5000 🎯

🌟 API Endpoints
Method	Endpoint	Description	Auth Required
POST	/api/auth/register	Register new user	❌ No
POST	/api/auth/login	Login user	❌ No
GET	/api/auth/me	Get current user profile	✅ Yes
POST	/api/candidates	Create new candidate	❌ No
GET	/api/candidates	Get all candidates	✅ Yes
DELETE	/api/candidates/:id	Delete candidate	✅ Yes
🔒 Authentication
Use the JWT token returned from /login in the Authorization header:

text
Bearer YOUR_JWT_TOKEN
🚨 Troubleshooting
If you get database connection errors:

Verify your Supabase credentials

Check if your IP is whitelisted in Supabase

For Prisma errors:

Run npx prisma generate

Ensure migrations are applied

📜 License
MIT © 2025 Perspicacious (P-Dev)

✨ Tip: Use Thunder Client in VS Code for easy API testing!
