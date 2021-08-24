import express from 'express';

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
    return res.send("No stats. Chosen category: " + req.params.season)
})


export default router;