import Razorpay from 'razorpay';
import crypto from 'crypto';

const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID || 'rzp_test_TTTnaFSHUApEUQ';
  const key_secret = process.env.RAZORPAY_KEY_SECRET || 'z91XlkC1xUbRX0NTARULT4ig';

  return new Razorpay({
    key_id,
    key_secret,
  });
};

/**
 * @desc Create a new Razorpay order
 * @route POST /api/payment/create-order
 * @access Private
 */
export const createRazorpayOrder = async (req, res, next) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment amount',
      });
    }

    const razorpay = getRazorpayInstance();

    // Razorpay amount is in paise (1 INR = 100 Paise)
    const options = {
      amount: Math.round(amount * 100),
      currency: currency.toUpperCase(),
      receipt: receipt || `receipt_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_TTTnaFSHUApEUQ',
      order,
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create Razorpay order',
    });
  }
};

/**
 * @desc Verify Razorpay payment signature
 * @route POST /api/payment/verify-payment
 * @access Private
 */
export const verifyRazorpayPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing Razorpay signature verification parameters',
      });
    }

    const key_secret = process.env.RAZORPAY_KEY_SECRET || 'z91XlkC1xUbRX0NTARULT4ig';

    const hmac = crypto.createHmac('sha256', key_secret);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature === razorpay_signature) {
      return res.status(200).json({
        success: true,
        message: 'Razorpay payment verified successfully',
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid Razorpay payment signature verification failed',
      });
    }
  } catch (error) {
    console.error('Error verifying Razorpay payment:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Payment verification failed',
    });
  }
};
