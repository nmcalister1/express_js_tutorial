import { Router } from 'express';
import { query, validationResult, body, matchedData, checkSchema } from 'express-validator';
import { createUserValidationSchema } from "../utils/validationSchemas.mjs";
import { mockUsers } from "../utils/constants.mjs";
import { resolveIndexByUserId } from '../utils/middlewares.mjs';
import { User } from '../mongoose/schemas/user.mjs';
import { hashPassword } from '../utils/helpers.mjs';
import { createUserHandler, getUserByIdHandler } from '../handlers/users.mjs';

const router = Router();

router.get("/api/users", query('filter').isString().notEmpty().withMessage("Must not be empty").isLength({ min: 3, max: 10}).withMessage("Must be at least 3-10 characters"), (req, res) => {
    const errors = validationResult(req);
    const { query: { filter, value }} = req;
    
    if (filter && value) return res.send(
        mockUsers.filter(user => user[filter].includes(value))
    );

    return res.send(mockUsers);
});

router.post("/api/users", checkSchema(createUserValidationSchema), createUserHandler);  

router.get("/api/users/:id", resolveIndexByUserId, getUserByIdHandler);

router.put("/api/users/:id", resolveIndexByUserId, (req, res) => {
    const { body, userIndex } = req;

    mockUsers[userIndex] = { id: mockUsers[userIndex].id, ...body };

    return res.sendStatus(200);

});

router.patch("/api/users/:id", resolveIndexByUserId, (req, res) => {
    const { body, userIndex } = req;

    mockUsers[userIndex] = { ...mockUsers[userIndex], ...body };

    return res.sendStatus(200);

});

router.delete("/api/users/:id", resolveIndexByUserId, (req, res) => {
    const { userIndex } = req;
    mockUsers.splice(userIndex, 1);
    res.sendStatus(200);
});

export default router;