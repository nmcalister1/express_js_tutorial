import { matchedData, validationResult } from "express-validator";
import { mockUsers } from "../utils/constants.mjs";
import { hashPassword } from "../utils/helpers.mjs";
import { User } from "../mongoose/schemas/user.mjs";

export const getUserByIdHandler = (req, res) => {
    const { userIndex } = req;
    const findUser = mockUsers[userIndex];
    if (!findUser) return res.status(404).send({ message: "User not found" });
    return res.send(findUser);
}

export const createUserHandler = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send(errors.array());
    }

    const data = matchedData(req);
    data.password = hashPassword(data.password)
    const newUser = new User(data);
    try {
        const savedUser = await newUser.save();
        return res.status(201).send(savedUser);
    } catch (err) {
        return res.status(500).send
    }
}