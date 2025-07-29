import axios from "axios";
import { useLocation } from "react-router-dom";
import React from "react";

function ProductDetails() {
  const location = useLocation();
  const product = location.state?.product;

  if (!product) {
    return <div className="text-center mt-10 text-red-600">Product not found</div>;
  }

  const handlePayment = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/user/order/${product._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const order = res.data.order;

      const options = {
        key: "rzp_test_cAa3gCF0eP8i4R",
        amount: order.amount,
        currency: order.currency,
        name: "Test Company",
        description: "Test Transaction",
        order_id: order.id,
        handler: async function (response) {
          try {
            await axios.post(
              `http://localhost:3000/user/verify/${order._id}`,
              {
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature,
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );
            alert("Payment Successful!");
          } catch (err) {
            console.error("Verification failed", err);
            alert("Payment verification failed");
          }
        },
        prefill: {
          name: "John Doe",
          email: "john@example.com",
          contact: "9999999999",
        },
        theme: { color: "#F37254" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error("Error creating payment:", err);
      alert("Failed to start payment.");
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
            onClick={handlePayment}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-200"
          >
            Buy Now
          </button>
        </div>
      </div>
    </main>
  );
}

export default ProductDetails;
