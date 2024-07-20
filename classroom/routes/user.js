const express = require("express");
const router = express.Router();

// Define routes directly
router.get("/", (req, res) => {
    res.send("GET for users");
});

router.get("/:id", (req, res) => {
    res.send(`GET for user id ${req.params.id}`);
});

router.post("/", (req, res) => {
    res.send("POST for users");
});

router.delete("/:id", (req, res) => {
    res.send(`DELETE for user id ${req.params.id}`);
});

module.exports = router;
