const express = require("express");
const controller = require("./testimonials.controller");

const router = express.Router();

router.post("/", controller.create);
router.get("/", controller.list);
router.get("/approved", controller.listApproved);
router.patch("/:id/approve", controller.approve);
router.patch("/:id/reject", controller.reject);

module.exports = router;