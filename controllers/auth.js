const User = require('./../models/User');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError } = require('./../errors');
const { UnauthenticatedError } = require('./../errors');

const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        throw new BadRequestError('Provide the name, email and password!');
    } else {
        const user = await User.create({ ...req.body });
        const token = user.createJWT(); 

        res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
    }

}

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new BadRequestError('Please provide email and password!');
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new UnauthenticatedError('Invalid credentials!');
    }

    const isPasswordOK = await user.comparePassword(password);
    if (!isPasswordOK) {
        throw new UnauthenticatedError('Invalid credentials!');
    }

    const token = user.createJWT();
    res.status(StatusCodes.OK).json({ user: { name: user.name }, token }); 
}

module.exports = {
    register,
    login
};