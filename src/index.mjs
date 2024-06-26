import 'dotenv/config'
import express from 'express';
import routes from "./routes/index.mjs";
import cookieParser from 'cookie-parser';
import session from 'express-session';
import mongoose from 'mongoose';
import passport from 'passport';
// import "./strategies/local-strategy.mjs";
import MongoStore from 'connect-mongo';
import "./strategies/discord-strategy.mjs"

console.log(process.env)

const app = express();

mongoose.connect("mongodb://localhost/express_tutorial").then(
    () => {
        console.log("Connected to MongoDB");
    },
    (err) => {
        console.log("Error connecting to MongoDB", err);
    }
);

app.use(express.json());
app.use(cookieParser("helloworld"));
app.use(session({
    secret: "nmcalister the dev",
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 60000 * 60,
    },
    store: MongoStore.create({ 
        client: mongoose.connection.getClient(),
     }),
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(routes);

app.get("/", (req, res) => {
    req.session.visited = true
    res.cookie("hello", "world", { maxAge: 60000 * 60 * 2, signed: true });
    res.status(200).send({ message: "Hello, world!" });
});

app.post("/api/auth", passport.authenticate('local'), (req, res) => {
   res.sendStatus(200);
});

app.get("/api/auth/status", (req, res) => {
    return req.user ? res.status(200).send(req.user) : res.status(401).send({ message: "You are not logged in." });
});

app.get("/api/auth/logout", (req, res) => {
    if (!req.user) {
        return res.sendStatus(401);
    }
    req.logout((err) => {
        if (err) {
            return res.sendStatus(500);
        }
        return res.sendStatus(200);
    })

});

app.get("/api/auth/discord", passport.authenticate("discord"));
app.get("/api/auth/discord/redirect", passport.authenticate("discord"), (req, res) => {
    res.sendStatus(200);
});

app.post("/api/cart", (req, res) => {
    if (!req.session.user) {
        return res.status(401).send({ message: "Unauthorized" });
    }
    const { body: item } = req;

    const { cart } = req.session;
    if (cart) {
        cart.push(item);
    } else {
        req.session.cart = [item];
    }

    return res.status(201).send(item)
})

app.get("/api/cart", (req, res) => {
    if (!req.session.user) {
        return res.status(401).send({ message: "Unauthorized" });
    }

    const { cart } = req.session;
    if (!cart) {
        return res.status(200).send([]);
    }
    return res.status(200).send(cart);
});



const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


// client_secret = nyGqfe2vKWKIcqX9OjBt5HIH4VezpXQA
// client_id = 1255173970743791657