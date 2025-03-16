import userSchema from "../schemas/UserSchema.js";
import argon2 from 'argon2';
import auth from '../auth/auth.js';
import MESSAGES from "../messages/messages.js";

export default class UserController{
  constructor ({userModel}) {
    this.userModel = userModel;
  }

  register = async (req, res) => {
    const result = userSchema.validateRegisterUser(req.body);

    if (!result.success) {
      return res.status(400).json({ error: MESSAGES.INVALID_DATA });
    }

    const existingUser = await this.userModel.findOne({
      where: {
        email: result.data.email,
      }
    });

    if (existingUser) {
      return res.status(409).json({ error: MESSAGES.USER_ALREADY_EXISTS });
    }

    try {
      result.data.password = await argon2.hash(result.data.password);
      const newUser = await this.userModel.create(result.data);
      return res.status(201).send({success: true});
    }
    catch(error) {
      return res.status(500).json({ error: MESSAGES.ERROR_500 });
    }
  }

  login = async (req, res) => {

    console.log(req.body);
    const result = userSchema.validateLoginUser(req.body);

    if (!result.success) {
      return res.status(400).json({ error: MESSAGES.INVALID_DATA });
    }

    try {
      const user = await this.userModel.findOne({
        where: {email: result.data.email, }
      });

      if (!user) {
        return res.status(404).json({ error: MESSAGES.USER_NOT_FOUND });
      }

      const isPasswordValid = await argon2.verify(user.password, result.data.password);

      if (!isPasswordValid) {
        return res.status(401).json({ error: MESSAGES.INVALID_PASSWORD });
      }

      const token = auth.createToken(user);

      return res.status(200).cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
      }).json({ success: true, user });
    }
    catch(error) {
      return res.status(500).json({ error: MESSAGES.ERROR_500 });
    }
  }

  logout = async (req, res) => {
    return res.status(200).clearCookie('token').json({ success: MESSAGES.LOGOUT_SUCCESS });
  }

  
}