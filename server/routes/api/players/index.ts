import express from 'express';

const router = express.Router();

router.get("/", (req, res) => {
    res.send(`You find nothing here`);
})

router.get("/:player", (req, res) => {
    res.send("the cum sexer...");
})

router.get("/:player/stats", (req, res) => {
    res.send("Basic stat overview");
})

router.get("/:player/stats/:category", (req, res) => {
    res.send(`${JSON.stringify(req.params.player)} & ${JSON.stringify(req.params.category)}`);
})

export default router;