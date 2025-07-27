# Cashfree Doctor Booking App

A full-stack booking and payment integration using:
- React + Vite + Tailwind CSS (Frontend)
- Express.js + MongoDB (Backend)
- Cashfree Payments (India)

## 🚀 Features

- Modern, responsive UI with Tailwind CSS
- Doctor consultation booking form
- Secure payment integration with Cashfree
- MongoDB database for booking storage
- Real-time payment status updates
- Clean, minimal design with custom color palette

## 📁 Project Structure

```
Cashfree 2026/
├── frontend/          # React + Vite application
│   ├── src/
│   │   ├── App.jsx    # Main booking form component
│   │   └── index.css  # Tailwind CSS styles
│   ├── package.json
│   └── tailwind.config.js
├── backend/           # Express.js server
│   ├── models/
│   │   └── Booking.js # MongoDB schema
│   ├── routes/
│   │   └── booking.js # API routes
│   ├── server.js      # Main server file
│   ├── package.json
│   └── env.example    # Environment variables template
└── README.md
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Cashfree merchant account

### 1. MongoDB Setup

#### Option A: Local MongoDB
1. Download and install MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start MongoDB service
3. Create database: `doctor-booking`

#### Option B: MongoDB Atlas (Cloud)
1. Sign up at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string

### 2. Cashfree Setup

1. Sign up for a Cashfree merchant account at [cashfree.com](https://www.cashfree.com)
2. Go to Developer Dashboard
3. Create a new app for testing
4. Get your App ID and Secret Key
5. For testing, use the sandbox environment

### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
copy env.example .env

# Edit .env file with your credentials
# MONGODB_URI=your_mongodb_connection_string
# CASHFREE_APP_ID=your_cashfree_app_id
# CASHFREE_SECRET_KEY=your_cashfree_secret_key

# Start development server
npm run dev
```

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🔧 Configuration

### Environment Variables (.env)

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/doctor-booking

# Cashfree Configuration
CASHFREE_APP_ID=your_cashfree_app_id_here
CASHFREE_SECRET_KEY=your_cashfree_secret_key_here

# Environment
NODE_ENV=development
PORT=5000
```

### Cashfree Test Credentials

For testing, you can use these test card details:
- **Card Number**: 4111 1111 1111 1111
- **Expiry**: Any future date
- **CVV**: Any 3 digits
- **Name**: Any name

## 🧪 Testing the Application

### 1. Start Both Servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 2. Test the Booking Flow

1. Open `http://localhost:5173` in your browser
2. Fill out the booking form:
   - Patient Name: Test User
   - Email: test@example.com
   - Mobile: 9876543210
   - Date/Time: Select future date
   - Reason: Test consultation
3. Click "Book Consultation & Pay ₹500"
4. You'll be redirected to Cashfree payment page
5. Use test card details to complete payment
6. Check payment status in your Cashfree dashboard

### 3. API Endpoints

- `POST /api/book` - Create booking and initiate payment
- `POST /api/payment/verify` - Verify payment status
- `GET /api/status/:orderId` - Get booking status
- `GET /api/bookings` - Get all bookings (admin)
- `GET /health` - Health check

## 🎨 Design Features

- **Color Palette**: Primary green (#10B98E) with light backgrounds
- **Typography**: Inter font from Google Fonts
- **Layout**: Responsive design with rounded corners
- **Animations**: Smooth transitions and hover effects
- **Modern UI**: Clean, minimal design with proper spacing

## 🔒 Security Features

- Input validation on both frontend and backend
- Secure payment processing through Cashfree
- Environment variable protection
- CORS configuration for frontend-backend communication

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy the dist folder
```

### Backend (Railway/Heroku)
```bash
cd backend
# Set environment variables in your hosting platform
npm start
```

## 📞 Support

For issues related to:
- **Cashfree Integration**: Check [Cashfree Documentation](https://docs.cashfree.com)
- **MongoDB**: Check [MongoDB Documentation](https://docs.mongodb.com)
- **React/Vite**: Check [Vite Documentation](https://vitejs.dev)

## 📝 License

This project is for educational purposes. Please ensure compliance with Cashfree's terms of service for production use.
