// This might prove to be redundant. If it does, I'll delete it.
import express from 'express';

const router = express.Router();

router.get("/", (req, res) => {
    res.status(200).send("In the future, this is where the stats that are sent to the home page will be.")
})

export default router;