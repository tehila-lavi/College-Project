# TravelPlus - Vacations Management System 🌴
https://github.com/tehila-lavi/College-Project/commit/4b6257454916332594192eb83c6fcb4468efcbcf
A full-stack, real-time web application to manage, track, and follow vacation destinations. 

## 🚀 Features

- **Real-Time Updates**: Powered by Socket.IO. When an Admin adds, edits, or deletes a vacation—or when any user "follows" a destination—the user interface updates instantly across all connected clients without requiring a page refresh!
- **Admin Dashboard**:
  - Secure Admin authentication.
  - CRUD operations over Vacations (Create, Read, Update, Delete) via a beautiful Glassmorphic Modal.
  - **Reports Page**: Uses `react-charts` to provide a column-chart analytics dashboard tracking vacation popularity based on followers!
- **User Experience**:
  - Registration & Login flow using JWTs.
  - Users can view and follow/unfollow vacations.
  - Vacations are automatically sorted to prioritize tracked/upcoming trips.
- **Glassmorphic UI**: Beautiful, fully responsive modern design.

## 💻 Tech Stack

- **Frontend**: React (v19) with TypeScript, Vite, React Router, and `react-charts` (beta). Styling is managed using Vanilla CSS tailored for modern glassmorphism.
- **Backend**: Node.js, Express.js with TypeScript and Mongoose.
- **Database**: MongoDB (via Mongoose).
- **Real-Time Communication**: Socket.IO for event-based WebSockets capabilities between the Backend and Frontend.

---

## 🛠️ Installation & Setup

### Requirements
- Node.js (v18+)
- MongoDB connection string (set in backend environment)

### 1. Database & Environment Configuration

1. Navigate to the `backend` folder and create a `.env` file based on `.env.example` (or configure manually):
```env
PORT=3002
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/vacations?retryWrites=true&w=majority
JWT_SECRET=your_jwt_strong_secret
ADMIN_SECRET=secret_for_claiming_admin
```

2. Navigate to the `frontend` folder and optionally set API connection URLs in an `.env` file (by default it looks for localhost:3002):
```env
VITE_API_URL=http://localhost:3002/api
```

### 2. Running the Backend

```bash
cd backend
npm install
npm start
# Server will start on http://localhost:3002
```

### 3. Running the Frontend

```bash
cd frontend
npm install
npm run dev
# Vite will serve the UI on http://localhost:5173
```


Enjoy managing the world's best vacations! ✈️
