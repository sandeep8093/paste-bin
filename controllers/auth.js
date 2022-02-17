const User = require('../models/User');
const jwt = require('jsonwebtoken');
const Token = require('../models/Token');
const sendEmail = require('../utils/email');
const bcrypt = require('bcrypt');



exports.signup = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      if (user.verified === true)
        return res.status(400).json({ message: 'email already is in use' });
      else
        return res
          .status(401)
          .json({ message: 'verification of this email is in process' });
    } else {
      let { email, password } = req.body;
      password = bcrypt.hashSync(password, 10);
      user = new User({
        email,
        password,
      });

      let otp = Math.floor(Math.random() * 1000000).toString();
      console.log(otp)
      const subject = 'create account otp request';
      const isSent = sendEmail(email, subject, otp);
      if (!isSent) {
        await user.save();
        otp = bcrypt.hashSync(otp, 10);
        await new Token({
          email,
          otp,
        }).save();
        return res.status(200).json({ message: 'email is sent' });
      } else
        return res
          .status(400)
          .json({ message: 'something went wrong!! try again' });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

exports.verifyuser = async (req, res) => {
  const email = req.body.email;
  try {
    let user = await User.findOne({ email: email, verified: false });
    if (user) {
      const otp = await Token.findOne({ email: email }, { otp: 1 });

      if (bcrypt.compareSync(req.body.otp, otp.otp)) {
        user.verified = true;
        user.accountActivated = true;
        await otp.delete();
        await user.save();
        const payload = {
          id: user._id,
          email: user.email,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: '365d'
        });
        return res.status(200).json({
          token,
          payload
        }); 
      } else {
        return res.status(400).json({ message: 'wrong otp' });
      }
    } else {
      return res.status(400).json({ message: 'access denied' });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

exports.signin = async (req, res) => {
  // console.log(req.body.password);
  await User.findOne({ email: req.body.email }).exec((error, user) => {
    if (error) return res.status(400).json({ error });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        if (user.accountActivated == false) {
          return res.status(200).json({
            deactivationDate: user.deactivationDate,
            message: `account was deactivated on ${user.deactivationDate}, enter password to activate again`,
          });
        }

        const payload = {
          id: user._id,
          email: user.email,
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: '4h',
        });

        return res.status(200).json({
          token,
          payload,
        });
      } else {
        return res.status(400).json({ message: 'wrong password' });
      }
    } else {
      return res.status(400).json({ message: 'user not found' });
    }
  });
};

exports.signout = async (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'signout successfully' });
};

exports.forgotpassword = async (req, res) => {
  await User.findOne({ email: req.body.email, verified: true }).exec(
    async (error, user) => {
      if (error) return res.json({ message: 'something wrong' });
      if (user) {
        const { email } = req.body;
        let otp = Math.floor(Math.random() * 1000000);
        console.log(otp);
        otp = otp.toString();
        const token = Token.findOne({ email: email });
        if (token) await token.deleteOne();
        const subject = 'forget password otp request';
        const isSent = sendEmail(email, subject, otp);
        if (!isSent) {
          otp = bcrypt.hashSync(otp, 10);
          await new Token({
            email,
            otp,
          }).save();
          return res.status(200).json({ message: 'email is sent' });
        } else
          return res
            .status(400)
            .json({ message: 'something went wrong!! try again' });
      } else {
        res.json({ message: 'user not found' });
      }
    }
  );
};

exports.createpassword = async (req, res) => {
  let dbToken = await Token.findOne({ email: req.body.email });
  console.log(dbToken)
  if (bcrypt.compareSync(req.body.otp, dbToken.otp)) {
    let user = await User.findOne({ email: req.body.email });
    user.password = bcrypt.hashSync(req.body.password, 10);

    const payload = {
      id: user._id,
      email: user.email,
    };

    await user.save();
    await dbToken.delete();

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '2h',
    });

    return res.status(200).json({
      token,
      payload,
    });
  } else {
    res.status(400).json({ message: 'wrong otp' });
  }
  const { id, token } = req.query;

  await Token.findOne({ email: email }).exec(async (error, data) => {
    if (error) return res.json({ message: 'something wrong' });
    if (token) {
      const isValid = data.authenticate(token);
      if (isValid) {
        const password = bcrypt.hashSync(req.body.password, 10);
        const user = await User.findByIdAndUpdate(
          {
            _id: id,
          },
          { $set: { hash_password: password } }
        );
        if (user)
          return res.json({ message: 'password changed successfully!!!' });
      } else {
        return res.json({ message: 'expired link' });
      }
    }
  });
};

exports.activateAccount = async function (req, res) {
  console.log(req.body.email);
  console.log(req.body.password);
  let user = await User.findOne({ email: req.body.email });
  console.log(user.email);
  console.log(user.password);
  if (!req.body.password) {
    return res.status(400).json({ message: 'password not entered' });
  }
  if (bcrypt.compareSync(req.body.password, user.password)) {
    user.accountActivated = true;
    user.deactivationDate = 'N/A';
    await user.save();
    return res.status(200).json({ message: 'account activated' });
  } else {
    res.status(400).json({ message: 'wrong password' });
  }
};



exports.changePassword = async function (req, res) {
  let currentUser = req.user;

  let user = await User.findOne({ _id: currentUser.id });

  if (bcrypt.compareSync(req.body.oldPassword, user.password)) {
    user.password = bcrypt.hashSync(req.body.newPassword, 10);
    await user.save(function (err, doc) {
      if (err) res.status(500).json(err);
      else res.status(200).json({ message: 'password changed successfully' });
    });
  } else {
    res.status(400).json({ message: 'wrong password' });
  }
};

