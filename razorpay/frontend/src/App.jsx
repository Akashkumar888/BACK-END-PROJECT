import './App.css';

function App() {
  const paymentHandler = async (event) => {
    event.preventDefault();

    const amount = 500 * 100; // Amount in paise
    const currency = 'INR';
    const receiptId = 'receipt#123';

    // Fetch key and order from backend
    const keyResponse = await fetch('http://localhost:5000/getkey');
    const { key } = await keyResponse.json();

    const orderResponse = await fetch('http://localhost:5000/order', {
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
        const validateRes = await fetch("http://localhost:5000/validate", {
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
      <button className='button' onClick={paymentHandler}>Pay Now</button>
    </div>
  );
}

export default App;


