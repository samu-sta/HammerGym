import ContractModel from '../models/Contract.js';
import MembershipModel from '../models/Membership.js';
import UserModel from '../models/User.js';
import AccountModel from '../models/Account.js';
import StripeService from './StripeService.js';
import { Op } from 'sequelize';
import { addMonths } from 'date-fns';

export default class ContractService {
  constructor() {
    this.stripeService = new StripeService();
  }

  async userHasActiveContract(userId) {
    const currentDate = new Date();
    const activeContracts = await ContractModel.findOne({
      where: {
        userId,
        expirationDate: {
          [Op.gt]: currentDate
        }
      }
    });
    return activeContracts !== null;
  }

  async getUserContract(userId) {
    const currentDate = new Date();
    return await ContractModel.findOne({
      where: {
        userId,
        expirationDate: {
          [Op.gt]: currentDate
        }
      },
      include: [{
        model: MembershipModel,
        attributes: ['type'],
        as: 'membership'
      }],
      attributes: ['id', 'expirationDate', 'createdAt'],
      order: [['createdAt', 'DESC']]
    });
  }

  async getMembershipById(membershipId) {
    return await MembershipModel.findByPk(membershipId);
  }

  async createCheckoutSession(membershipId, userId) {
    const hasActiveContract = await this.userHasActiveContract(userId);
    if (hasActiveContract) {
      return {
        success: false,
        message: 'Ya tienes un contrato activo. No puedes adquirir otra membresía hasta que expire tu contrato actual.'
      };
    }

    const membership = await this.getMembershipById(membershipId);
    if (!membership) {
      return { success: false, message: 'Membership not found' };
    }

    const amount = Math.round(membership.price * 100);
    return await this.stripeService.createCheckoutSession(
      amount, 'usd', membership.type, membershipId, userId
    );
  }

  async findContractByIdAndUser(contractId, userId) {
    return await ContractModel.findOne({
      where: { id: contractId, userId },
      include: [{ model: MembershipModel, as: 'membership' }]
    });
  }

  async createRenewalCheckoutSession(contractId, userId) {
    const contract = await this.findContractByIdAndUser(contractId, userId);

    if (!contract) {
      return {
        success: false,
        message: 'Contrato no encontrado o no tienes permiso para renovarlo'
      };
    }

    const membership = contract.membership;
    if (!membership) {
      return { success: false, message: 'Información de membresía no disponible' };
    }

    const amount = Math.round(membership.price * 100);
    return await this.stripeService.createRenewalCheckoutSession(
      amount, 'usd', `Renovación de ${membership.type} - 1 mes`, contract.id, userId
    );
  }

  calculateNewExpirationDate(currentExpirationDate) {
    let newExpirationDate = new Date(currentExpirationDate);
    const currentDate = new Date();

    if (newExpirationDate < currentDate) {
      newExpirationDate = currentDate;
    }

    return addMonths(newExpirationDate, 1);
  }

  async renewContract(contractId, userId) {
    const contract = await this.findContractByIdAndUser(contractId, userId);

    if (!contract) {
      return {
        success: false,
        message: 'Contrato no encontrado o no tienes permiso para renovarlo'
      };
    }

    const newExpirationDate = this.calculateNewExpirationDate(contract.expirationDate);

    await contract.update({ expirationDate: newExpirationDate });

    return {
      success: true,
      message: 'Contrato renovado exitosamente',
      contract: {
        id: contract.id,
        expirationDate: newExpirationDate,
        membershipType: contract.membership?.type
      }
    };
  }

  getContractIncludeConfig() {
    return [
      {
        model: MembershipModel,
        attributes: ['id', 'type', 'price'],
        as: 'membership'
      },
      {
        model: UserModel,
        as: 'user',
        include: [
          {
            model: AccountModel,
            as: 'account',
            attributes: ['username', 'email']
          }
        ]
      }
    ];
  }

  async getAllContracts() {
    return await ContractModel.findAll({
      include: this.getContractIncludeConfig(),
      order: [['createdAt', 'DESC']]
    });
  }

  async getContractById(id) {
    return await ContractModel.findByPk(id, {
      include: this.getContractIncludeConfig()
    });
  }

  async findAccountByUsername(username) {
    return await AccountModel.findOne({
      where: { username },
      include: [{ model: UserModel, as: 'user' }]
    });
  }

  async validateContractData(data) {
    const { username, membershipId } = data;
    let userId = null;

    if (username) {
      const account = await this.findAccountByUsername(username);
      if (!account || !account.user) {
        return { isValid: false, message: 'User not found' };
      }
      userId = account.user.accountId;
    }

    if (membershipId) {
      const membership = await this.getMembershipById(membershipId);
      if (!membership) {
        return { isValid: false, message: 'Membership not found' };
      }
    }

    return { isValid: true, userId };
  }

  async createContract(contractData) {
    const { username, membershipId, expirationDate, paymentStatus, paymentMethod, paymentReference } = contractData;

    const validationResult = await this.validateContractData(contractData);
    if (!validationResult.isValid) {
      return { success: false, message: validationResult.message };
    }

    const userId = validationResult.userId;

    const hasActiveContract = await this.userHasActiveContract(userId);
    if (hasActiveContract) {
      return { success: false, message: 'User already has an active contract' };
    }

    const newContract = await ContractModel.create({
      userId,
      membershipId,
      expirationDate,
      paymentStatus: paymentStatus || 'paid',
      paymentMethod,
      paymentReference
    });

    return await this.getContractById(newContract.id);
  }

  async updateContract(id, contractData) {
    const contract = await ContractModel.findByPk(id);
    if (!contract) {
      return { success: false, message: 'Contract not found' };
    }

    const validationResult = await this.validateContractData(contractData);
    if (!validationResult.isValid) {
      return { success: false, message: validationResult.message };
    }

    const userId = validationResult.userId || contract.userId;
    const { membershipId, expirationDate, paymentStatus, paymentMethod, paymentReference } = contractData;

    await contract.update({
      userId,
      membershipId: membershipId || contract.membershipId,
      expirationDate: expirationDate || contract.expirationDate,
      paymentStatus: paymentStatus || contract.paymentStatus,
      paymentMethod: paymentMethod || contract.paymentMethod,
      paymentReference: paymentReference || contract.paymentReference
    });

    return await this.getContractById(id);
  }

  async deleteContract(id) {
    const contract = await ContractModel.findByPk(id);
    if (!contract) {
      return { success: false, message: 'Contract not found' };
    }

    await contract.destroy();
    return { success: true, message: 'Contract deleted successfully' };
  }
}