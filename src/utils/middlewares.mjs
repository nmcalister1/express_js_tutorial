import { mockUsers } from "./constants.mjs";

export const resolveIndexByUserId = (req, res, next) => {
    const { params: { id } } = req;

    const userId = parseInt(id);
    if (isNaN(userId)) {
        res.status(400).send({ message: "Invalid ID supplied" });
        return;
    }

    const userIndex = mockUsers.findIndex(user => user.id === userId);

    if (!userIndex || userIndex === -1) {
        res.status(404).send({ message: "User not found" });
        return;
    }
    req.userIndex = userIndex;
    next();
}