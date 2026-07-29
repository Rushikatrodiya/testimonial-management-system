const ApiError = require("../utils/ApiError");

function errorHandler(err, req, res, next) {
    console.error(err);

    let statusCode = 500;
    let message = "Internal server error";

    if (err instanceof ApiError) {
        statusCode = err.statusCode;
        message = err.message;
    } else if (err.code === "P2025") {
        statusCode = 404;
        message = "Testimonial not found";
    } else if (err.name === "ZodError") {
        statusCode = 400;
        message = err.errors.map(e => e.message).join(", ");
    }

    res.status(statusCode).json({
        error: {
            code: statusCode,
            message: message
        }
    });
}

module.exports = { errorHandler };