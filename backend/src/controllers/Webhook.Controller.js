import Stripe from 'stripe';
import dotenv from 'dotenv';
import ContractModel from '../models/Contract.js';
import { addMonths } from 'date-fns';

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
    const { userId, membershipId, isRenewal, contractId } = session.metadata;

    // Verificar si es una renovación de contrato
    if (isRenewal === 'true' && contractId) {
      try {
        // Buscar el contrato existente
        const contract = await ContractModel.findOne({
          where: {
            id: parseInt(contractId),
            userId: parseInt(userId)
          }
        });

        if (!contract) {
          return res.status(404).json({
            error: 'Contrato no encontrado para renovación',
            received: false
          });
        }

        // Calcular la nueva fecha de expiración (1 mes adicional)
        let newExpirationDate = new Date(contract.expirationDate);

        // Si la fecha de expiración ya pasó, comenzar a contar desde hoy
        const currentDate = new Date();
        if (newExpirationDate < currentDate) {
          newExpirationDate = currentDate;
        }

        // Añadir 1 mes a la fecha actual de expiración
        newExpirationDate = addMonths(newExpirationDate, 1);

        // Actualizar la fecha de expiración del contrato
        await contract.update({
          expirationDate: newExpirationDate,
          paymentReference: session.id // Actualizar referencia de pago
        });

        return res.json({ received: true });
      } catch (error) {
        return res.status(500).json({
          error: `Error renovando contrato: ${error.message}`,
          received: false
        });
      }
    }

    // Si no es renovación, es un nuevo contrato
    if (!userId || !membershipId) {
      return res.status(400).json({
        error: 'Metadata incompleta en el webhook',
        received: false
      });
    }

    try {
      const expirationDate = new Date();
      expirationDate.setMonth(expirationDate.getMonth() + 3); // 3 meses para nuevos contratos

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