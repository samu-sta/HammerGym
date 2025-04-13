import AccountModel from '../models/Account.js';
import AdminModel from '../models/Admin.js'; 
import auth from '../utils/auth.js';
import MESSAGES from '../messages/messages.js';

export const authAccount = async (req, res, next) => {
    const token =
        (req.cookies && req.cookies.token) ||
        req.headers.authorization?.split(' ')[1] ||
        req.headers['x-access-token'];

    if (!token) {
        return res.status(401).json({ success: false, message: MESSAGES.NO_TOKEN_PROVIDED });
    }

    try {
        const decoded = auth.verifyToken(token);
        const account = await AccountModel.findOne({
            where: { id: decoded.id }
        });
        if (!account) {
            return res.status(404).json({ success: false, message: MESSAGES.USER_NOT_FOUND });
        }
        req.account = account.dataValues;
        next();
    }
    catch (error) {
        return res.status(500).json({ success: false, message: MESSAGES.ERROR_500 });
    }
}

export const isAdmin = async (req, res, next) => {
    try {
      if (!req.account || !req.account.id) {
        return res.status(401).json({ 
          success: false, 
          message: MESSAGES.NO_TOKEN_PROVIDED 
        });
      }
      
      const admin = await AdminModel.findOne({
        where: { accountId: req.account.id }
      });
  
      if (!admin) {
        return res.status(403).json({ 
          success: false, 
          message: MESSAGES.UNAUTHORIZED 
        });
      }
      req.admin = admin;
      next();
    } catch (error) {
      console.error('Error al verificar rol de administrador:', error);
      return res.status(500).json({ 
        success: false, 
        message: MESSAGES.ERROR_500 
      });
    }
  };


