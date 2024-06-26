import { Router } from 'express';

const router = Router();

router.get("/api/products", (req, res) => {
    if (req.signedCookies.hello && req.signedCookies.hello === "world") {
        return res.send([{ id: 123, name: "chicken breast", price: 12.99 }]);
    }
    return res.send({ msg: "Sorry. You are not authorized to view this content."})
});


export default router;