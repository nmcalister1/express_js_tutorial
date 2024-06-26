import { checkSchema, validationResult, matchedData } from 'express-validator';
import { hashPassword } from '../utils/helpers.mjs';
import { User } from "../mongoose/schemas/user.mjs"

// Create mocks for external dependencies
jest.mock('express-validator');
jest.mock('../utils/helpers'); // Updated mock for helpers
jest.mock('../mongoose/schemas/user.mjs');

// Mock implementations for the dependencies
checkSchema.mockImplementation(() => (req, res, next) => next());
validationResult.mockImplementation((req) => {
    return {
        isEmpty: jest.fn().mockReturnValue(true),
        array: jest.fn().mockReturnValue([]),
    };
});
matchedData.mockImplementation((req) => req.body);
hashPassword.mockImplementation((password) => `hashed_${password}`);
User.mockImplementation((data) => {
    return {
        save: jest.fn().mockResolvedValue({
            ...data,
            id: 1,
        }),
    };
});

// Test the route handler
describe("POST /api/users", () => {
    it("should create a new user and return 201", async () => {
        const req = {
            body: {
                username: "testuser",
                password: "password123",
                email: "testuser@example.com",
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
        };
        const next = jest.fn();

        // Define the route handler
        const createUserHandler = async (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).send(errors.array());
            }

            const data = matchedData(req);
            data.password = hashPassword(data.password);
            const newUser = new User(data);
            try {
                const savedUser = await newUser.save();
                return res.status(201).send(savedUser);
            } catch (err) {
                return res.status(500).send();
            }
        };

        await createUserHandler(req, res, next);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.send).toHaveBeenCalledWith({
            username: "testuser",
            password: "hashed_password123",
            email: "testuser@example.com",
            id: 1,
        });
    });

    it("should return 400 if validation errors exist", async () => {
        // Mock validationResult to return errors
        validationResult.mockImplementationOnce((req) => {
            return {
                isEmpty: jest.fn().mockReturnValue(false),
                array: jest.fn().mockReturnValue([{ msg: 'Error' }]),
            };
        });

        const req = {
            body: {
                username: "testuser",
                password: "password123",
                email: "testuser@example.com",
            },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
        };
        const next = jest.fn();

        // Define the route handler
        const createUserHandler = async (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).send(errors.array());
            }

            const data = matchedData(req);
            data.password = hashPassword(data.password);
            const newUser = new User(data);
            try {
                const savedUser = await newUser.save();
                return res.status(201).send(savedUser);
            } catch (err) {
                return res.status(500).send();
            }
        };

        await createUserHandler(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith([{ msg: 'Error' }]);
    });
});
