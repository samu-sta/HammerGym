import ContractModel from '../models/Contract.js';
import MembershipModel from '../models/Membership.js';
import StripeService from '../services/StripeService.js';

// Instanciar servicio de Stripe
const stripeService = new StripeService();

export const getUserContracts = async (req, res) => {
  const userId = req.account.id; // Get userId from authenticated account

  try {
    const contracts = await ContractModel.findAll({
      where: { userId },
      include: [{
        model: MembershipModel,
        attributes: ['type', 'price'],
        as: 'membership'  // Added the alias here
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      message: 'User contracts retrieved successfully',
      contracts
    });
  } catch (error) {
    console.error(`Error retrieving contracts for user ${userId}:`, error);
    res.status(500).json({
      message: 'Error retrieving user contracts',
      error: error.message
    });
  }
};

export const createContract = async (req, res) => {
  const { membershipId, expirationDate, paymentMethod, cardDetails } = req.body;
  const userId = req.account.id; // Get userId from authenticated account

  try {
    // Verificar si la membresía existe
    const membership = await MembershipModel.findByPk(membershipId);
    if (!membership) {
      return res.status(404).json({ message: 'Membership not found' });
    }

    // Procesamiento de pago con Stripe
    // Convertir el precio a centavos ya que Stripe trabaja con la moneda en su unidad más pequeña
    const amount = Math.round(membership.price * 100);
    const description = `Pago de membresía ${membership.type} - Usuario ID:${userId}`;

    let paymentResult;
    if (paymentMethod === 'credit_card' || paymentMethod === 'debit_card') {
      paymentResult = await stripeService.processCardPayment(
        amount,
        'usd', // Asumimos USD, pero se podría parametrizar
        cardDetails,
        description
      );
    } else {
      return res.status(400).json({
        message: 'Payment method not supported',
        success: false
      });
    }

    // Si el pago falló, devolver error
    if (!paymentResult.success) {
      return res.status(400).json({
        message: 'Payment processing failed',
        error: paymentResult.error,
        success: false
      });
    }

    // Crear el contrato con referencia al pago de Stripe
    const newContract = await ContractModel.create({
      userId,
      membershipId,
      expirationDate,
      paymentStatus: 'paid',
      paymentMethod,
      paymentReference: paymentResult.paymentIntent.id
    });

    res.status(201).json({
      message: 'Contract created successfully',
      contract: newContract,
      success: true
    });
  } catch (error) {
    console.error('Error creating contract:', error);
    res.status(500).json({
      message: 'Error creating contract',
      error: error.message,
      success: false
    });
  }
};

export const getContractById = async (req, res) => {
  const { id } = req.params;

  try {
    const contract = await ContractModel.findByPk(id, {
      include: [{
        model: MembershipModel,
        attributes: ['type', 'price'],
        as: 'membership'  // Added the alias here
      }]
    });

    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    res.json({
      message: 'Contract retrieved successfully',
      contract
    });
  } catch (error) {
    console.error(`Error retrieving contract with id ${id}:`, error);
    res.status(500).json({
      message: 'Error retrieving contract',
      error: error.message
    });
  }
};

export const createCheckoutSession = async (req, res) => {
  const { membershipId } = req.body;
  const userId = req.account.id; // Get userId from authenticated account

  try {
    // Validar que se reciben los parámetros necesarios
    if (!membershipId) {
      return res.status(400).json({
        message: 'Se requiere membershipId para crear una sesión de checkout',
        success: false
      });
    }

    // Buscar la membresía para obtener sus detalles
    const membership = await MembershipModel.findByPk(membershipId);
    if (!membership) {
      return res.status(404).json({
        message: 'Membership not found',
        success: false
      });
    }

    // Crear la sesión de checkout con Stripe
    const amount = Math.round(membership.price * 100);
    console.log('Datos para crear sesión checkout:', {
      amount,
      currency: 'usd',
      membershipType: membership.type,
      membershipId,
      userId
    });

    const sessionResult = await stripeService.createCheckoutSession(
      amount,
      'usd',
      membership.type,
      membershipId,
      userId
    );

    if (!sessionResult.success) {
      return res.status(400).json({
        message: 'Failed to create checkout session',
        error: sessionResult.error,
        success: false
      });
    }

    // Devolver el ID de la sesión al cliente para redirigir a la página de pago
    res.json({
      message: 'Checkout session created successfully',
      sessionId: sessionResult.session.id,
      success: true,
      url: sessionResult.session.url
    });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({
      message: 'Error creating checkout session',
      error: error.message,
      success: false
    });
  }
};

export const handleStripeWebhook = async (req, res) => {
  const signature = req.headers['stripe-signature'];
  let event;

  try {
    // Verificar que el evento viene de Stripe
    const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const stripe = new (await import('stripe')).default(process.env.STRIPE_SECRET_KEY);
    event = stripe.webhooks.constructEvent(req.body, signature, stripeWebhookSecret);
  } catch (error) {
    console.error('Error verificando firma de webhook:', error);
    return res.status(400).send(`Webhook error: ${error.message}`);
  }

  // Manejar el evento según su tipo
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    // Extraer datos de los metadatos
    const { userId, membershipId } = session.metadata;

    try {
      // Calcular fecha de expiración (3 meses)
      const expirationDate = new Date();
      expirationDate.setMonth(expirationDate.getMonth() + 3);

      // Crear un nuevo contrato
      await ContractModel.create({
        userId: parseInt(userId),
        membershipId: parseInt(membershipId),
        expirationDate,
        paymentStatus: 'paid',
        paymentMethod: 'stripe',
        paymentReference: session.payment_intent
      });

      console.log('Contrato creado exitosamente desde webhook');
    } catch (error) {
      console.error('Error creando contrato desde webhook:', error);
      return res.status(500).send(`Error interno: ${error.message}`);
    }
  }

  // Responder para confirmar la recepción
  res.json({ received: true });
};