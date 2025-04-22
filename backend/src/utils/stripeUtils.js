import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Verifica y construye un evento de Stripe a partir de una solicitud
 * @param {Object} req - Objeto de solicitud HTTP
 * @returns {Promise<Object>} - Objeto con resultado de la verificación
 */
export const verifyStripeEvent = (req) => {
  try {
    const signature = req.headers['stripe-signature'];
    const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!signature || !stripeWebhookSecret) {
      return {
        success: false,
        status: 400,
        error: 'Faltan encabezados de firma o secreto de webhook'
      };
    }

    const event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      stripeWebhookSecret
    );

    return { success: true, event };
  } catch (error) {
    return {
      success: false,
      status: 400,
      error: `Error al verificar evento de Stripe: ${error.message}`
    };
  }
};

/**
 * Verifica si el evento es un evento de checkout completado
 * @param {Object} event - Evento de Stripe
 * @returns {boolean} - Indica si es un evento de checkout completado
 */
export const isCheckoutCompletedEvent = (event) => {
  return event.type === 'checkout.session.completed';
};

/**
 * Extrae los metadatos relevantes de la sesión de Stripe
 * @param {Object} session - Objeto de sesión de Stripe
 * @returns {Object} - Metadatos extraídos
 */
export const extractSessionMetadata = (session) => {
  const { userId, membershipId, isRenewal, contractId } = session.metadata || {};

  return {
    userId: userId ? parseInt(userId) : null,
    membershipId: membershipId ? parseInt(membershipId) : null,
    isRenewal: isRenewal === 'true',
    contractId: contractId ? parseInt(contractId) : null,
    paymentReference: session.id
  };
};