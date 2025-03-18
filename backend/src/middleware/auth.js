import AccountModel from '../models/Account.js';
import auth from '../utils/auth.js';
import MESSAGES from '../messages/messages.js';

export const authAccount = async (req, res, next) => {
    const token =
        (req.cookies && req.cookies.token) ||
        req.headers.authorization?.split(' ')[1] ||
        req.headers['x-access-token'];

    if (!token) {
        return res.status(401).json({ error: MESSAGES.NO_TOKEN_PROVIDED });
    }

    try {
        const decoded = auth.verifyToken(token);
        const account = await AccountModel.findOne({
            where: { id: decoded.id }
        });
        if (!account) {
            return res.status(404).json({ error: MESSAGES.USER_NOT_FOUND });
        }
        req.account = account.dataValues;
        next();
    }
    catch (error) {
        return res.status(500).json({ error: MESSAGES.ERROR_500 });
    }
}


