import { verifyStripeEvent, isCheckoutCompletedEvent, extractSessionMetadata } from '../utils/stripeUtils.js';
import { renewContract, createContract } from '../utils/contractUtils.js';

/**
 * Servicio para procesar webhooks de Stripe
 */
class WebhookService {
  /**
   * Procesa un evento de webhook de Stripe
   * @param {Object} req - Objeto de solicitud HTTP
   * @returns {Object} - Respuesta procesada
   */
  async processStripeWebhook(req) {
    const verificationResult = verifyStripeEvent(req);
    if (!verificationResult.success) {
      return {
        success: false,
        status: verificationResult.status,
        error: verificationResult.error
      };
    }

    const { event } = verificationResult;

    if (!isCheckoutCompletedEvent(event)) {
      return {
        success: false,
        status: 400,
        error: 'Evento no soportado'
      };
    }

    // Procesar el evento de checkout completado
    return await this.processCheckoutCompletedEvent(event);
  }

  /**
   * Procesa un evento de checkout completado
   * @param {Object} event - Evento de Stripe
   * @returns {Object} - Respuesta procesada
   */
  async processCheckoutCompletedEvent(event) {
    const session = event.data.object;
    const metadata = extractSessionMetadata(session);

    // Verificar si es una renovación de contrato
    if (metadata.isRenewal && metadata.contractId) {
      return await this.processContractRenewal(metadata);
    }

    // Si no es renovación, es un nuevo contrato
    return await this.processNewContract(metadata);
  }

  /**
   * Procesa una renovación de contrato
   * @param {Object} metadata - Metadatos de la sesión
   * @returns {Object} - Respuesta procesada
   */
  async processContractRenewal(metadata) {
    const { userId, contractId, paymentReference } = metadata;

    const result = await renewContract(contractId, userId, paymentReference);

    if (!result.success) {
      return {
        success: false,
        status: result.status,
        error: result.error
      };
    }

    return { success: true };
  }

  /**
   * Procesa la creación de un nuevo contrato
   * @param {Object} metadata - Metadatos de la sesión
   * @returns {Object} - Respuesta procesada
   */
  async processNewContract(metadata) {
    const { userId, membershipId } = metadata;

    if (!userId || !membershipId) {
      return {
        success: false,
        status: 400,
        error: 'Metadata incompleta en el webhook'
      };
    }

    const result = await createContract(metadata);

    if (!result.success) {
      return {
        success: false,
        status: result.status,
        error: result.error
      };
    }

    return { success: true };
  }
}

export default new WebhookService();