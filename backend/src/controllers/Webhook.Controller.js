import Stripe from 'stripe';
import dotenv from 'dotenv';
import ContractModel from '../models/Contract.js';

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const handleStripeWebhook = async (req, res) => {
  const signature = req.headers['stripe-signature'];
  const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      stripeWebhookSecret
    );

    if (event.type !== 'checkout.session.completed') {
      return res.status(400).json({
        error: 'Evento no soportado',
        received: false
      });
    }
    const session = event.data.object;
    const { userId, membershipId } = session.metadata;

    if (!userId || !membershipId) {
      return res.status(400).json({
        error: 'Metadata incompleta en el webhook',
        received: false
      });
    }

    try {
      const expirationDate = new Date();
      expirationDate.setMonth(expirationDate.getMonth() + 1);

      await ContractModel.create({
        userId: parseInt(userId),
        membershipId: parseInt(membershipId),
        expirationDate,
        paymentStatus: 'paid',
        paymentMethod: 'stripe',
        paymentReference: session.id
      });

      return res.json({ received: true });

    }
    catch (error) {
      return res.status(500).json({
        error: `Error creando contrato: ${error.message}`,
        received: false
      });
    }

  }
  catch (error) {
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }
};