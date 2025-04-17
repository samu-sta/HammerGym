import AccountModel from '../models/Account.js';
import auth from '../utils/auth.js';
import MESSAGES from '../messages/messages.js';
import { whichAccount } from '../utils/account.js';

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

export const authUser = async (req, res, next) => {
    try {
        await authAccount(req, res, async () => {
            const accountType = await whichAccount(req.account.id);
            console.log('Account type:', accountType);
            if (accountType !== 'user') {
                return res.status(403).json({ success: false, message: MESSAGES.ACCESS_DENIED });
            }
            next();
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: MESSAGES.ERROR_500 });
    }
}
export const authTrainer = async (req, res, next) => {
    try {
        await authAccount(req, res, async () => {
            const account = req.account;
            const accountType = await whichAccount(account.id);
            if (accountType !== 'trainer') {
                return res.status(403).json({ success: false, message: MESSAGES.ACCESS_DENIED });
            }
            next();
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: MESSAGES.ERROR_500 });
    }
}
export const authAdmin = async (req, res, next) => {
    try {
        await authAccount(req, res, async () => {
            const account = req.account;
            const accountType = await whichAccount(account.id);
            if (accountType !== 'admin') {
                return res.status(403).json({ success: false, message: MESSAGES.ACCESS_DENIED });
            }
            next();
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: MESSAGES.ERROR_500 });
    }
}


