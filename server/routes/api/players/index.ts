import express from 'express';

const router = express.Router();

router.get("/:username", (req, res) => {
    res.send(`${req.params.username} is not a player`);
})

export default router;