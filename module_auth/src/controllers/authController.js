const { KnexB2BLms } = require("../../../config/db");
const { BadRequest, Unauthorized } = require("../../../utils/errors");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const md5 = require("md5");
require('dotenv').config();

const saltRounds = 10;
const tblUser = "users";

// register
exports.register = async (req, res, next) => {
  try {
    const { email, password, cpassword, fname, lname, profile_picture } = req.body;

    if (!email || !password || !fname || !lname, !cpassword) {
      throw new BadRequest("Required data is missing");
    }
    if (password !== cpassword) {
      throw new BadRequest("Passwords do not match");
    }

    const userExist = await KnexB2BLms(tblUser)
      .select("id")
      .where("email", "iLike", email)
      .first();
      if (userExist) {
        throw new BadRequest("User already exists");
      }

    const encPass = await bcrypt.hashSync(password.trim(), saltRounds);

    const user = await KnexB2BLms(tblUser)
      .insert({
        email: email,
        password: encPass,
        username: email,
        firstname: fname,
        lastname: lname,
        profile_picture: profile_picture,
      })
      .returning("*");

    return res.status(200).json({
      status: true,
      msg: "User registered successfully",
      data: user[0],
    });
  } catch (error) {
    return next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password ) {
      throw new BadRequest("Required data is missing");
    }

    const user = await KnexB2BLms(tblUser)
      .select("id", "email", "password", "username", "firstname", "lastname", "profile_picture", "deleted_at", "login_count")
      .where('email', 'iLike', email)
      .first();

    if (user && user.deleted_at !== null) {
      return res.json({
        status: false,
        message: `Account deactivated.`,
      });
    }

    const passMatch = await bcrypt.compare(password, user.password);

    if (!passMatch) {
      const checked = md5(password) === user.password;
      if (!checked) {
        throw new Unauthorized("The username or password is incorrect");
      } else {
        const encPass = await bcrypt.hashSync(password.trim(), saltRounds);
        await KnexB2BLms("users").update({ password: encPass }).where({
          id: user.id,
        });
      }
    }

    const token = jwt.sign(
      { userId: user.id, user_email: user.email, user_name: user.username, company_id: user?.company_id },
      process.env.JWT_SECRET,
      {
        expiresIn: `1y`,
        issuer: process.env.JWT_ISSUER,
        audience: `Whizlabs User`,
        subject: `${user.email}`,
      }
    );

    await this.storeLoginDetails(user); // store user login time and login count

    return res.status(200).json({
        status: true,
        msg: "Login successful",
        data: {
            token,
            user_id: user.id,
            user_email: user.email,
            name: {
                first: user.firstname,
                last: user.lastname,
            },
            profile_img: user.profile_picture,
        },
    });
  } catch (error) {
    return next(error);
  }
};

exports.storeLoginDetails = async (user) => {
  const current_date_time = new Date();
  const user_id = user.id;
  const login_count = user.login_count;

  await KnexB2BLms(tblUser)
    .where({ id: user_id })
    .update({
      login_count: login_count + 1,
      login_at: current_date_time,
    });

  return true;
};
