🚗 Delala.com Backend – Car Marketplace API

A clean and developer-friendly Node.js + Express + MongoDB backend for the Delala.com platform.
This project is a starter template for building car marketplace platforms (no houses included).

It comes with:
✅ JWT Authentication (Login, Register, Logout)
✅ Secure password hashing with bcrypt
✅ Car management (upload, update, delete, view)
✅ Image uploads via Cloudinary + Multer
✅ MongoDB with Mongoose models
✅ Clean and modular code structure
✅ Ready to connect with frontend at http://localhost:5173

📂 Project Structure
delala-backend/
├── index.js              # Main server entry
├── config/               # DB + Cloudinary configs
├── models/               # Mongoose schemas
│   └── Car.js
│   └── User.js
├── routes/               # API routes
│   └── authRoutes.js
│   └── carRoutes.js
├── controllers/          # Business logic
│   └── authController.js
│   └── carController.js
├── middleware/           # Auth middlewares
├── .env                  # Environment variables
├── package.json

⚙️ Installation
1️⃣ Clone the repository
git clone https://github.com/your-username/delala-backend.git
cd delala-backend

2️⃣ Install dependencies
npm install

3️⃣ Set up .env file

Create a .env file in the root folder:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

CLOUD_NAME=your_cloudinary_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret

4️⃣ Run the server
# Development
npm run dev

# Production
npm start


Server will run at 👉 http://localhost:5000

🚀 API Endpoints
Auth Routes (/api/auth)

POST /register → Register new user

POST /login → Login user + get JWT

POST /logout → Logout user

Car Routes (/api/cars)

POST / → Add new car (authenticated, with image upload)

GET / → Get all cars

GET /:id → Get single car by ID

PUT /:id → Update car (only owner can update)

DELETE /:id → Delete car (only owner or admin can delete)

🛠️ Tech Stack

Backend: Node.js, Express.js

Database: MongoDB + Mongoose

Auth: JWT + bcrypt

Image Storage: Cloudinary + Multer

Frontend: Runs on http://localhost:5173

🌟 Features

✔ User authentication (JWT)
✔ Upload car details (name, price, location, type, description, images)
✔ Secure image hosting on Cloudinary
✔ Role-based access (user vs admin)
✔ Clean and scalable codebase

🤝 Contributing

Want to add features? Fork the repo and submit a PR 🚀

📜 License

MIT License © 2025 Delala.com
