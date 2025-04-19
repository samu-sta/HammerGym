import dotenv from 'dotenv';
import Stripe from 'stripe';

dotenv.config();

// Inicializar Stripe con la clave secreta proporcionada
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default class StripeService {
  /**
   * Crear un objeto de pago en Stripe
   * @param {number} amount - Monto en centavos (para €/$/£, 1€ = 100 centavos)
   * @param {string} currency - Moneda en formato ISO (ej: 'eur', 'usd')
   * @param {object} paymentMethod - Información del método de pago
   * @param {string} description - Descripción del pago
   * @returns {Promise<Object>} - El objeto de pago creado en Stripe
   */
  async createPaymentIntent(amount, currency, paymentMethod, description) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        payment_method: paymentMethod,
        description,
        confirm: true,
        return_url: 'http://localhost:5173/contracts',
      });

      return {
        success: true,
        paymentIntent
      };
    } catch (error) {
      console.error('Error en Stripe al crear paymentIntent:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Procesar un pago con tarjeta sin almacenar la información de la tarjeta
   * @param {number} amount - Monto en centavos
   * @param {string} currency - Moneda ('eur', 'usd', etc.)
   * @param {object} cardDetails - Detalles de la tarjeta
   * @param {string} description - Descripción del pago
   * @returns {Promise<Object>} - Resultado del pago
   */
  async processCardPayment(amount, currency, cardDetails, description) {
    try {
      // Crear un token de tarjeta (obsoleto pero simple para este ejemplo)
      const token = await stripe.tokens.create({
        card: {
          number: cardDetails.number,
          exp_month: cardDetails.expMonth,
          exp_year: cardDetails.expYear,
          cvc: cardDetails.cvc
        }
      });

      // Crear un método de pago usando el token
      const paymentMethod = await stripe.paymentMethods.create({
        type: 'card',
        card: { token: token.id }
      });

      // Crear el pago
      return await this.createPaymentIntent(amount, currency, paymentMethod.id, description);
    } catch (error) {
      console.error('Error procesando el pago con tarjeta:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Crea una sesión de checkout de Stripe
   * @param {number} amount - Cantidad a cobrar (en centavos)
   * @param {string} currency - Moneda (eur, usd)
   * @param {string} membershipType - Tipo de membresía
   * @param {number} membershipId - ID de la membresía
   * @param {number} userId - ID del usuario
   * @returns {Promise<Object>} - Resultado de la creación de la sesión
   */
  async createCheckoutSession(amount, currency, membershipType, membershipId, userId) {
    try {
      // Validar que todos los parámetros requeridos existan
      if (!amount || !currency || !membershipType || !membershipId || !userId) {
        console.error('Parámetros faltantes para crear sesión de checkout:', {
          amount, currency, membershipType, membershipId, userId
        });
        throw new Error('Todos los parámetros son requeridos para crear una sesión de checkout');
      }

      // Convertir valores a string de forma segura
      const safeUserId = userId ? userId.toString() : '';
      const safeMembershipId = membershipId ? membershipId.toString() : '';

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: currency,
              product_data: {
                name: `Membresía ${membershipType}`,
                description: `Contrato de membresía ${membershipType} para HammerGym`,
              },
              unit_amount: amount,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `http://localhost:5173/usuario/contratos?success=true`,
        cancel_url: `http://localhost:5173/usuario/contratos?canceled=true`,
        metadata: {
          userId: safeUserId,
          membershipId: safeMembershipId
        }
      });

      return {
        success: true,
        session
      };
    }
    catch (error) {
      console.error('Error al crear la sesión de checkout:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}