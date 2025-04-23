import WebhookService from '../services/WebhookService.js';

/**
 * Controlador para manejar los webhooks de Stripe
 */
export default class WebhookController {
  /**
   * Maneja los webhooks de Stripe
   * @param {Object} req - Objeto de solicitud HTTP
   * @param {Object} res - Objeto de respuesta HTTP
   * @returns {Object} - Respuesta HTTP
   */
  handleStripeWebhook = async (req, res) => {
    try {
      const result = await WebhookService.processStripeWebhook(req);

      if (!result.success) {
        return res.status(result.status || 400).json({
          error: result.error,
          received: false
        });
      }

      return res.json({ received: true });
    } catch (error) {
      console.error('Error inesperado en webhook:', error);
      return res.status(500).json({
        error: `Error inesperado: ${error.message}`,
        received: false
      });
    }
  };
}