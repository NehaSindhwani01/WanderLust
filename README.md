# 🌍 Wanderlust - Travel Listings Web Application

Welcome to **Wanderlust** — a full-stack web application that allows users to browse, create, and manage travel destination listings. Think of it as a simplified Airbnb clone designed with modern web development technologies.

---

## 🌐 Live Demo

Check out the deployed version of **Wanderlust** here:  
🔗 [Wanderlust Live](https://wanderlust-e3yf.onrender.com)

---

## 🔧 Tech Stack

- **Frontend**: EJS (Embedded JavaScript Templates), HTML, CSS, Bootstrap
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Passport.js (Local Strategy)
- **Other Tools**: Cloudinary (for image uploads), Mapbox (for geolocation)

---

## 💡 Features

- ✅ User Authentication (Register/Login/Logout)
- 🗺️ Create, edit, and delete listings with title, price, location, and description
- 📷 Image upload support using Cloudinary
- 📍 Dynamic maps integration using Mapbox
- 💬 Review system (post and delete reviews)
- 🔒 Authorization checks for secure listing and review management

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/NehaSindhwani01/wanderlust.git
cd wanderlust
```
### 2. Install dependencies
npm install


### 3. Set up environment variables
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET=your_cloudinary_api_secret
MAPBOX_TOKEN=your_mapbox_token
DB_URL=your_mongodb_connection_string
SECRET=session_secret_key

Replace placeholder values with actual credentials.

### 4. Run the application locally
npm start
Navigate to http://localhost:3000 to see the app in action.

📂 Folder Structure
wanderlust/
│
├── models/              # Mongoose schemas (Listing, Review, User)
├── routes/              # Express route handlers
├── views/               # EJS templates for each route
├── public/              # Static assets (CSS, JS, images)
├── utils/               # Middleware, error handling, cloud config
├── app.js               # Main Express server file
└── .env                 # Environment variables (not committed)


🧑‍💻 Author
Neha Sindhwani
🎓 B.Tech CSE | 💻 Web Developer | 👩‍💻 DSA Enthusiast
LinkedIn | GitHub

📜 License
This project is licensed under the MIT License.
Feel free to fork, contribute, or suggest features!

⭐ Show Your Support
If you found this project helpful or inspiring, give it a ⭐ and share it with others!


Let me know if you want me to help you add a preview GIF or deploy this app live on Render.
