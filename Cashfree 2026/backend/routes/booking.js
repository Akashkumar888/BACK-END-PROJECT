const express = require('express');
const { Cashfree, CFEnvironment } = require('cashfree-pg');
const Booking = require('../models/Booking');

const router = express.Router();

// Cashfree configuration
const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;

// Initialize Cashfree SDK
const cashfree = new Cashfree(
  process.env.NODE_ENV === 'production' ? CFEnvironment.PRODUCTION : CFEnvironment.SANDBOX,
  CASHFREE_APP_ID,
  CASHFREE_SECRET_KEY
);

// Helper function to generate order ID
const generateOrderId = () => {
  return 'ORDER_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

// POST /api/book - Create booking and initiate payment
router.post('/book', async (req, res) => {
  try {
    const { patientName, email, mobileNumber, bookingDateTime, reason } = req.body;

    // Validate required fields
    if (!patientName || !email || !mobileNumber || !bookingDateTime || !reason) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate Cashfree configuration
    if (!CASHFREE_APP_ID || !CASHFREE_SECRET_KEY) {
      return res.status(500).json({ 
        message: 'Cashfree configuration is missing. Please check CASHFREE_APP_ID and CASHFREE_SECRET_KEY environment variables.' 
      });
    }

    // Generate order ID
    const orderId = generateOrderId();

    // Create booking in database
    const booking = new Booking({
      patientName,
      email,
      mobileNumber,
      orderId,
      bookingDateTime: new Date(bookingDateTime),
      reason
    });

    await booking.save();

    // Create Cashfree order using SDK
    const orderData = {
      order_amount: 500.00,
      order_currency: "INR",
      order_id: orderId,
      customer_details: {
        customer_id: `CUST_${Date.now()}`,
        customer_phone: mobileNumber,
        customer_name: patientName,
        customer_email: email
      },
      order_meta: {
        return_url: `http://localhost:5173/payment-success?order_id=${orderId}`,
        notify_url: `http://localhost:5000/api/payment/webhook`,
        payment_methods: "cc,dc,upi"
      },
      cart_details: {
        cart_items: [
          {
            item_id: "consultation_fee",
            item_name: "Doctor Consultation",
            item_description: `Consultation for: ${reason}`,
            item_original_unit_price: 500.00,
            item_discounted_unit_price: 500.00,
            item_quantity: 1,
            item_currency: "INR"
          }
        ]
      },
      order_expiry_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
      order_note: `Booking for ${patientName} - ${reason}`,
      order_tags: {
        booking_type: "doctor_consultation",
        patient_name: patientName
      }
    };

    console.log('Creating Cashfree order with data:', orderData);

    const cashfreeResponse = await cashfree.PGCreateOrder(orderData);
    console.log('Cashfree response:', cashfreeResponse.data);

    if (cashfreeResponse.data.payment_session_id) {
      res.json({
        success: true,
        message: 'Booking created successfully',
        orderId: orderId,
        paymentUrl: cashfreeResponse.data.payment_link,
        paymentSessionId: cashfreeResponse.data.payment_session_id
      });
    } else {
      throw new Error('Failed to create payment session');
    }

  } catch (error) {
    console.error('Booking error:', error);
    
    // Log detailed error information
    if (error.response) {
      console.error('Cashfree API Error Response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers
      });
    }
    
    res.status(500).json({ 
      message: 'Failed to create booking',
      error: error.message,
      details: error.response?.data || 'No additional details available'
    });
  }
});

// POST /api/payment/verify - Verify payment status and return booking data
router.post('/payment/verify', async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required' });
    }

    console.log(`Verifying payment for order: ${orderId}`);

    // Get order details from Cashfree using SDK
    const cashfreeResponse = await cashfree.PGFetchOrder(orderId);
    console.log('Cashfree order details:', cashfreeResponse.data);
    
    const orderStatus = cashfreeResponse.data.order_status;
    const paymentDetails = cashfreeResponse.data.payment_details || {};

    // Update booking status in database
    const booking = await Booking.findOne({ orderId });
    if (booking) {
      console.log(`Updating booking ${orderId} from status: ${booking.status} to: ${orderStatus}`);
      
      // Handle different payment statuses
      switch (orderStatus) {
        case 'PAID':
          booking.status = 'paid';
          booking.paymentId = paymentDetails.payment_id || paymentDetails.auth_id || 'PAYMENT_COMPLETED';
          booking.paymentMethod = paymentDetails.payment_method;
          booking.paymentTime = paymentDetails.payment_time;
          booking.bankReference = paymentDetails.bank_reference;
          console.log(`Payment verified as successful for order ${orderId}`);
          break;
          
        case 'EXPIRED':
          booking.status = 'cancelled';
          console.log(`Payment expired for order ${orderId}`);
          break;
          
        case 'FAILED':
          booking.status = 'failed';
          booking.paymentMessage = paymentDetails.payment_message;
          console.log(`Payment failed for order ${orderId}`);
          break;
          
        case 'PENDING':
          booking.status = 'pending';
          console.log(`Payment still pending for order ${orderId}`);
          break;
          
        default:
          console.log(`Unknown payment status for order ${orderId}: ${orderStatus}`);
          booking.status = orderStatus.toLowerCase();
      }
      
      await booking.save();
      console.log(`Booking ${orderId} updated successfully`);

      // Return both verification result and booking data
      res.json({
        success: true,
        orderStatus: orderStatus,
        bookingStatus: booking.status,
        paymentDetails: paymentDetails,
        booking: {
          id: booking._id,
          patientName: booking.patientName,
          email: booking.email,
          mobileNumber: booking.mobileNumber,
          bookingDateTime: booking.bookingDateTime,
          reason: booking.reason,
          status: booking.status,
          orderId: booking.orderId,
          amount: booking.amount,
          paymentId: booking.paymentId,
          paymentMethod: booking.paymentMethod,
          paymentTime: booking.paymentTime,
          bankReference: booking.bankReference,
          paymentMessage: booking.paymentMessage,
          createdAt: booking.createdAt,
          updatedAt: booking.updatedAt
        }
      });
    } else {
      console.error(`Booking not found for orderId: ${orderId}`);
      res.status(404).json({
        success: false,
        message: 'Booking not found',
        orderStatus: orderStatus
      });
    }

  } catch (error) {
    console.error('Payment verification error:', error);
    
    // Log detailed error information
    if (error.response) {
      console.error('Cashfree API Error Response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Failed to verify payment',
      error: error.message,
      details: error.response?.data || 'No additional details available'
    });
  }
});

// POST /api/payment/webhook - Handle Cashfree webhooks
router.post('/payment/webhook', async (req, res) => {
  try {
    console.log('Webhook received:', JSON.stringify(req.body, null, 2));

    const { 
      orderId, 
      orderAmount, 
      orderCurrency, 
      orderStatus, 
      paymentId,
      paymentAmount,
      paymentCurrency,
      paymentStatus,
      paymentMessage,
      paymentTime,
      bankReference,
      authId,
      paymentMethod
    } = req.body;

    if (!orderId) {
      console.error('Webhook missing orderId');
      return res.status(400).json({ message: 'Order ID is required' });
    }

    // Update booking status in database
    const booking = await Booking.findOne({ orderId });
    if (booking) {
      console.log(`Updating booking ${orderId} from status: ${booking.status} to: ${orderStatus}`);
      
      // Handle different payment statuses
      switch (orderStatus) {
        case 'PAID':
          booking.status = 'paid';
          booking.paymentId = paymentId || authId || 'PAYMENT_COMPLETED';
          booking.paymentMethod = paymentMethod;
          booking.paymentTime = paymentTime;
          booking.bankReference = bankReference;
          console.log(`Payment successful for order ${orderId}`);
          break;
          
        case 'EXPIRED':
          booking.status = 'cancelled';
          console.log(`Payment expired for order ${orderId}`);
          break;
          
        case 'FAILED':
          booking.status = 'failed';
          booking.paymentMessage = paymentMessage;
          console.log(`Payment failed for order ${orderId}: ${paymentMessage}`);
          break;
          
        case 'PENDING':
          booking.status = 'pending';
          console.log(`Payment pending for order ${orderId}`);
          break;
          
        default:
          console.log(`Unknown payment status for order ${orderId}: ${orderStatus}`);
          booking.status = orderStatus.toLowerCase();
      }
      
      await booking.save();
      console.log(`Booking ${orderId} updated successfully`);
    } else {
      console.error(`Booking not found for orderId: ${orderId}`);
    }

    res.json({ 
      success: true, 
      message: 'Webhook processed successfully',
      orderId: orderId,
      status: orderStatus
    });

  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ 
      message: 'Failed to process webhook',
      error: error.message 
    });
  }
});

// GET /api/status/:orderId - Get booking status
router.get('/status/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    const booking = await Booking.findOne({ orderId });
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({
      success: true,
      booking: {
        id: booking._id,
        patientName: booking.patientName,
        email: booking.email,
        mobileNumber: booking.mobileNumber,
        bookingDateTime: booking.bookingDateTime,
        reason: booking.reason,
        status: booking.status,
        orderId: booking.orderId,
        amount: booking.amount,
        paymentId: booking.paymentId,
        paymentMethod: booking.paymentMethod,
        paymentTime: booking.paymentTime,
        bankReference: booking.bankReference,
        paymentMessage: booking.paymentMessage,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt
      }
    });

  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({ 
      message: 'Failed to get booking status',
      error: error.message 
    });
  }
});

// GET /api/bookings - Get all bookings (for admin purposes)
router.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      bookings: bookings
    });

  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ 
      message: 'Failed to get bookings',
      error: error.message 
    });
  }
});

module.exports = router; 