import express from 'express';

const router = express.Router();

router.get("/", (req, res) => {
    res.send(`You find nothing here`);
})

export default router;