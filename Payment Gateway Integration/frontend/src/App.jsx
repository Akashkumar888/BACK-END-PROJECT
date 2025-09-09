import './App.css';
import { useState } from 'react';

function App() {
  const [amountInput, setAmountInput] = useState('');

  const paymentHandler = async (e) => {
    e.preventDefault();

    if (!amountInput || isNaN(amountInput) || Number(amountInput) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    const amount = parseInt(amountInput) * 100; // convert to paise
    const currency = 'INR';
    const receipt = 'receipt_' + Date.now();

    try {
      // 1️⃣ Create order on backend
      const orderRes = await fetch('http://localhost:4000/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, currency, receipt })
      });
      const { order } = await orderRes.json();

      // 2️⃣ Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // from frontend .env
        amount,
        currency,
        name: "My App",
        description: "Test Transaction",
        order_id: order.id,
        handler: async function (response) {
          // 3️⃣ Verify payment on backend
          const validateRes = await fetch("http://localhost:4000/api/razorpay/verify-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response)
          });

          const data = await validateRes.json();
          alert(data.message || "Payment Successful!");
        },
        prefill: {
          name: "Test User",
          email: "test@example.com",
          contact: "9999999999"
        },
        theme: { color: "#3399cc" }
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (err) => {
        alert("Payment failed: " + err.error.description);
      });
      rzp.open();
    } catch (err) {
      console.error("Payment error:", err);
      alert("Something went wrong!");
    }
  };

  return (
    <div className='product'>
      <h1>Razorpay Payment Gateway</h1>
      <form onSubmit={paymentHandler}>
        <input
          type="number"
          value={amountInput}
          placeholder="Enter amount"
          onChange={(e) => setAmountInput(e.target.value)}
        />
        <button className='button' type="submit">Pay Now</button>
      </form>
    </div>
  );
}

export default App;
