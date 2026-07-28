function errorHandler(err, req, res, next) {
    console.error(err);

    if (err.code === "P2025") {
        return res.status(404).json({ errors: ["testimonial not found"] });
    }

    res.status(500).json({ errors: ["internal server error"] });
}

module.exports = { errorHandler };