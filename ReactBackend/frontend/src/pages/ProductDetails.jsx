import axios from 'axios';
import React from 'react';
import { useLocation } from 'react-router-dom';

function ProductDetails() {
  const location = useLocation();

  // 🛑 1. SAFEGUARD AGAINST UNDEFINED STATE
  if (!location.state || !location.state.product) {
    return <div className="text-center mt-10 text-red-600">Product not found</div>;
  }

  const product = location.state.product;

  const handlePayment = async () => {
    try {
      // ✅ 2. GET Razorpay PUBLIC KEY
      const keyRes = await axios.get('http://localhost:3000/payment/getkey');
      const razorpayKey = keyRes.data.key;

      // ✅ 3. CREATE ORDER ON BACKEND (POST)
      const orderRes = await axios.post(
        'http://localhost:3000/payment/order',
        { amount: product.price }, // backend expects `amount` in rupees
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      const { order } = orderRes.data;

      // ✅ 4. INIT Razorpay Payment
      const options = {
        key: razorpayKey,
        amount: order.amount,
        currency: order.currency,
        name: 'Test Company',
        description: product.name,
        image: product.images[0],
        order_id: order.id,
        handler: async function (response) {
          try {
            // ✅ 5. VERIFY PAYMENT SIGNATURE
            const verifyRes = await axios.post(
              'http://localhost:3000/payment/verify',
              {
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature,
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
              }
            );
            alert('✅ Payment Successful!');
            console.log(verifyRes.data);
          } catch (verifyErr) {
            console.error('❌ Payment verification failed', verifyErr);
            alert('Payment verification failed');
          }
        },
        prefill: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#F37254',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error('❌ Payment init failed:', err);
      alert('Unable to initialize payment.');
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row gap-6">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full md:w-1/2 h-64 object-cover rounded-lg"
        />
        <div className="flex flex-col justify-between w-full">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-gray-800">
              {product.name}
            </h1>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <p className="text-xl font-semibold text-green-600">
              ₹{product.price}
            </p>
          </div>
          <button
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-200"
            onClick={handlePayment}
          >
            Buy Now
          </button>
        </div>
      </div>
    </main>
  );
}

export default ProductDetails;

