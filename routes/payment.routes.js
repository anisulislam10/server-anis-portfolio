import express from 'express';
import { createPaymentIntent, handleWebhook } from '../controllers/payment.controller.js';

const router = express.Router();

// Client uses this to initiate payment
router.post('/create-payment-intent', express.json(), createPaymentIntent);

// Stripe calls this to confirm payments
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

export default router;