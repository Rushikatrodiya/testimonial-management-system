const VALID_STATUSES = ["PENDING", "APPROVED", "REJECTED"];

function validateCreateTestimonial(body) {
    const errors = [];

    if (typeof body.name !== "string" || body.name.trim().length === 0) {
        errors.push("name is required");
    }

    if (typeof body.email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
        errors.push("a valid email is required");
    }

    if (typeof body.message !== "string" || body.message.trim().length === 0) {
        errors.push("message is required");
    }

    const rating = Number(body.rating);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        errors.push("rating must be an integer between 1 and 5");
    }

    if (body.company !== undefined && typeof body.company !== "string") {
        errors.push("company must be a string");
    }

    if (body.photoUrl !== undefined && typeof body.photoUrl !== "string") {
        errors.push("photoUrl must be a string");
    }

    if (errors.length > 0) {
        return { valid: false, errors };
    }

    return {
        valid: true,
        data: {
            name: body.name.trim(),
            email: body.email.trim(),
            company: body.company?.trim() || undefined,
            message: body.message.trim(),
            rating,
            photoUrl: body.photoUrl?.trim() || undefined,
        },
    };
}

function isValidStatus(value) {
    return typeof value === "string" && VALID_STATUSES.includes(value);
}

module.exports = { validateCreateTestimonial, isValidStatus, VALID_STATUSES };