import ContractService from '../services/ContractService.js';

export default class ContractController {
  constructor() {
    this.contractService = new ContractService();
  }

  getUserContracts = async (req, res) => {
    const userId = req.account.id;

    try {
      const contract = await this.contractService.getUserContract(userId);
      res.json(contract);
    } catch (error) {
      console.error(`Error retrieving contract for user ${userId}:`, error);
      res.status(500).json({
        message: 'Error retrieving user contract',
        error: error.message
      });
    }
  };

  createCheckoutSession = async (req, res) => {
    const { membershipId } = req.body;
    const userId = req.account.id;

    try {
      if (!membershipId) {
        return res.status(400).json({
          message: 'Se requiere membershipId para crear una sesión de checkout',
          success: false
        });
      }

      const result = await this.contractService.createCheckoutSession(membershipId, userId);

      if (!result.success) {
        return res.status(400).json({
          message: result.message || 'Failed to create checkout session',
          error: result.error,
          success: false
        });
      }

      res.json({
        message: 'Checkout session created successfully',
        sessionId: result.session.id,
        success: true,
        url: result.session.url
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error creating checkout session',
        error: error.message,
        success: false
      });
    }
  };

  createRenewalCheckoutSession = async (req, res) => {
    const { contractId } = req.params;
    const userId = req.account.id;

    try {
      const result = await this.contractService.createRenewalCheckoutSession(contractId, userId);

      if (!result.success) {
        return res.status(404).json({
          message: result.message || 'Error al crear la sesión de pago para renovación',
          success: false
        });
      }

      res.json({
        message: 'Sesión de pago para renovación creada',
        sessionId: result.session.id,
        success: true,
        url: result.session.url
      });
    } catch (error) {
      console.error('Error al crear la sesión de pago para renovación:', error);
      res.status(500).json({
        message: 'Error al crear la sesión de pago para renovación',
        error: error.message,
        success: false
      });
    }
  };

  renewContract = async (req, res) => {
    const { contractId } = req.params;
    const userId = req.account.id;

    try {
      const result = await this.contractService.renewContract(contractId, userId);

      if (!result.success) {
        return res.status(404).json({
          message: result.message || 'Error al renovar contrato',
          success: false
        });
      }

      res.json({
        message: result.message,
        contract: result.contract,
        success: true
      });
    } catch (error) {
      console.error('Error al renovar contrato:', error);
      res.status(500).json({
        message: 'Error al renovar contrato',
        error: error.message,
        success: false
      });
    }
  };

  // ======= ADMIN CRUD FUNCTIONS =======

  getAllContracts = async (req, res) => {
    try {
      const contracts = await this.contractService.getAllContracts();
      res.json(contracts);
    } catch (error) {
      console.error('Error retrieving contracts:', error);
      res.status(500).json({
        message: 'Error retrieving contracts',
        error: error.message
      });
    }
  };

  getContractById = async (req, res) => {
    const { id } = req.params;

    try {
      const contract = await this.contractService.getContractById(id);

      if (!contract) {
        return res.status(404).json({
          message: 'Contract not found',
          success: false
        });
      }

      res.json(contract);
    } catch (error) {
      console.error(`Error retrieving contract with ID ${id}:`, error);
      res.status(500).json({
        message: 'Error retrieving contract',
        error: error.message
      });
    }
  };

  createContract = async (req, res) => {
    const contractData = req.body;

    try {
      const result = await this.contractService.createContract(contractData);

      if (!result.success && result.message) {
        return res.status(400).json({
          message: result.message,
          success: false
        });
      }

      res.status(201).json({
        message: 'Contract created successfully',
        contract: result,
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

  updateContract = async (req, res) => {
    const { id } = req.params;
    const contractData = req.body;

    try {
      const result = await this.contractService.updateContract(id, contractData);

      if (!result.success && result.message) {
        return res.status(400).json({
          message: result.message,
          success: false
        });
      }

      res.json({
        message: 'Contract updated successfully',
        contract: result,
        success: true
      });
    } catch (error) {
      console.error(`Error updating contract with ID ${id}:`, error);
      res.status(500).json({
        message: 'Error updating contract',
        error: error.message
      });
    }
  };

  deleteContract = async (req, res) => {
    const { id } = req.params;

    try {
      const result = await this.contractService.deleteContract(id);

      if (!result.success) {
        return res.status(404).json({
          message: result.message || 'Contract not found',
          success: false
        });
      }

      res.json({
        message: result.message,
        success: true
      });
    } catch (error) {
      console.error(`Error deleting contract with ID ${id}:`, error);
      res.status(500).json({
        message: 'Error deleting contract',
        error: error.message,
        success: false
      });
    }
  };
}