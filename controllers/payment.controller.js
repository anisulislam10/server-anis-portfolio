import stripe from '../config/stripe.config.js';

// 1. Create Payment Intent
export const createPaymentIntent = async (req, res) => {
  try {
    const { amount } = req.body;

    // Validate amount is an integer (in cents)
    if (!amount || !Number.isInteger(amount) || amount <= 0) {
      return res.status(400).json({ error: 'Amount must be a positive integer (in cents)' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Already in cents
      currency: 'pkr',
      payment_method_types: ['card'],
      metadata: { userId: req.user?.id || 'guest' },
    });

    console.log('PaymentIntent created:', paymentIntent.id);
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating PaymentIntent:', error.message);
    res.status(500).json({ error: `Failed to create payment intent: ${error.message}` });
  }
};

// 2. Handle Webhooks (for payment confirmation)
export const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!endpointSecret) {
    console.error('Stripe webhook secret not configured');
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('Payment succeeded:', paymentIntent.id);
      // TODO: Update your database
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('Payment failed:', failedPayment.id, failedPayment.last_payment_error?.message);
      // TODO: Notify user or log failure
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
};