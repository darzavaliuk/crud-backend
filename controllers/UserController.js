import {validationResult} from "express-validator";
import bcrypt from "bcrypt";
import UserModel from "../models/Users.js";
import jwt from "jsonwebtoken";

export default async function register(req, res) {
    try {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400)
        }
        console.log(req.body)
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash,
        });

        const user = await doc.save();
        const token = jwt.sign({"email": req.body.email}, "12345678", {expiresIn: "30d"})
        res.json({...user._doc, token})
    } catch (err) {
        res.status(500).json({
            message: 'Не удалось зарегистрироваться',
        });
    }
}

export default async function login(req, res) {
    try {
        const user = await UserModel.findOne({email: req.body.email});

        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден',
            });
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if (!isValidPass) {
            return res.status(400).json({
                message: 'Неверный логин или пароль',
            });
        }

        const token = jwt.sign(
            {
                _id: user._id,
            },
            'secret123',
            {
                expiresIn: '30d',
            },
        );

        const {passwordHash, ...userData} = user._doc;

        res.json({
            ...userData,
            token,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось авторизоваться',
        });
    }
}