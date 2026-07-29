const { z } = require("zod");

const VALID_STATUSES = ["PENDING", "APPROVED", "REJECTED"];

const createTestimonialSchema = z.object({
    name: z.string().trim().min(1, "name is required"),
    email: z.string().trim().email("a valid email is required"),
    company: z.string().trim().optional(),
    message: z.string().trim().min(1, "message is required"),
    rating: z.coerce.number().int().min(1).max(5, "rating must be an integer between 1 and 5"),
    photoUrl: z.string().trim().optional()
});

function isValidStatus(value) {
    return typeof value === "string" && VALID_STATUSES.includes(value);
}

module.exports = { createTestimonialSchema, isValidStatus, VALID_STATUSES };