require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = express();

app.use(express.json());

const User = require("./model/user");

app.post("/register", async (req, res) => {

    try {
        const { first_name, last_name, email, password } = req.body;

        if (!(email && password && first_name && last_name)) {
            res.status(400).json({message: "All input is required"});
        }

        const oldUser = await User.findOne({ email });

        if (oldUser) {
            return res.status(409).json({message: "User Already Exist. Please Login"});
        }

        encryptedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            first_name,
            last_name,
            email: email.toLowerCase(), // sanitize: convert email to lowercase
            password: encryptedPassword,
        });

        const token = jwt.sign(
            { _id: user._id, email },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );
        user.token = token;
        user.password = undefined;

        res.status(201).json(user);
    } catch (err) {
        console.log(err);
    }
});

// Login
app.post("/login", async (req, res) => {

    try {
        const { email, password } = req.body;

        if (!(email && password)) {
            res.status(400).json({message: "All inputs are required."});
        }
        const user = await User.findOne({ email }).select('+password').exec();

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign(
                { _id: user._id, email },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h",
                }
            );

            user.token = token;
            user.password = undefined;
            res.status(200).json(user);
        }
        res.status(401).json({message: "Invalid Credentials."});
    } catch (err) {
        console.log(err);
    }
});

const auth = require("./middleware/auth");
app.use('/movies', require('./routes/movies'))

module.exports = app;