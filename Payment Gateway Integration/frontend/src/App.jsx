import './App.css';
import { useState } from 'react';

function App() {
  const [amountInput, setAmountInput] = useState('');

  const paymentHandler = async (event) => {
    event.preventDefault();

    if (!amountInput || isNaN(amountInput) || Number(amountInput) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    const amount = parseInt(amountInput) * 100; // convert to paise
    const currency = 'INR';
    const receiptId = 'receipt#' + Math.floor(Math.random() * 1000000);

    // Fetch key and order from backend
    const keyResponse = await fetch('http://localhost:3000/getkey');
    const { key } = await keyResponse.json();

    const orderResponse = await fetch('http://localhost:3000/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, currency, receipt: receiptId })
    });

    const order = await orderResponse.json();

    const options = {
      key: key,
      amount,
      currency,
      name: "Web Codder",
      description: "Test Transaction",
      image: "https://i.ibb.co/5Y3m33n/test.png",
      order_id: order.id,
      handler: async function (response) {
        const validateRes = await fetch("http://localhost:3000/validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(response)
        });
        const resData = await validateRes.json();
        console.log(resData);
        alert("Payment successful and verified!");
      },
      prefill: {
        name: "Web Codder",
        email: "test@example.com",
        contact: "9999999999"
      },
      notes: {
        address: "Web Codder HQ"
      },
      theme: {
        color: "#3399cc"
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", function (response) {
      alert("Payment failed: " + response.error.description);
    });
    rzp.open();
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
          required
        />
        <button className='button' type="submit">Pay Now</button>
      </form>
    </div>
  );
}

export default App;

