import express from 'express';
import { categories } from '../categories';

const router = express.Router();

router.get("/", (req, res) => {
    return res.send("Nothing is here.")
})

router.get("/seed/:season", (req, res) => {
    // might keep this as current seed or delete it entirely
    // considering tracking stats from previous seasons
    return res.send("No seed. Chosen season: " + JSON.stringify(req.params))
})

router.get("/stats/:category", (req, res) => {
    const category = req.params.category;
    return res.send("No stats. Chosen category: " + JSON.stringify(req.params))
})


export default router;