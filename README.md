🚗 Delala.com Backend – Car Marketplace API

A clean and developer-friendly Node.js + Express + MongoDB backend for the Delala.com platform.
This project is a starter template for building car marketplace platforms focused solely on cars.

🌟 Features

✅ JWT Authentication (Register, Login, Logout)

✅ Secure password hashing with bcrypt

✅ Car management: Add, update, delete, view cars

✅ Image uploads via Cloudinary + Multer

✅ MongoDB with Mongoose models

✅ Role-based access (user vs admin)

✅ Clean & modular code structure

✅ Ready to connect with frontend at http://localhost:5173

⚙️ Installation

1️⃣ Clone the repository

git clone https://github.com/your-username/delala-backend.git
cd delala-backend


2️⃣ Install dependencies

npm install


3️⃣ Setup environment variables
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


Server runs at: http://localhost:5000

🚀 API Endpoints
Auth Routes (/api/auth)
Method	Endpoint	Description
POST	/register	Register new user
POST	/login	Login user + get JWT
POST	/logout	Logout user
Car Routes (/api/cars)
Method	Endpoint	Description
POST	/	Add new car (authenticated, with image)
GET	/	Get all cars
GET	/:id	Get single car by ID
PUT	/:id	Update car (only owner can update)
DELETE	/:id	Delete car (owner or admin only)
🛠️ Tech Stack

Backend: Node.js, Express.js

Database: MongoDB + Mongoose

Authentication: JWT + bcrypt

Image Storage: Cloudinary + Multer

Frontend: Vite + React (runs on http://localhost:5173
)

🤝 Contributing

Want to improve the project?

Fork the repository

Create a new branch

Make your changes

Submit a pull request 🚀

📜 License

MIT License © 2025 Delala.com
