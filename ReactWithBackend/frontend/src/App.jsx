// App.jsx
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails'; // ✅ Correctly capitalized

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/product-details" element={<ProductDetails />} /> {/* ✅ Correctly used */}
      </Routes>
    </Router>
  );
}

export default App;
