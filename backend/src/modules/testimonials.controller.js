const service = require("./testimonials.service");
const { validateCreateTestimonial, isValidStatus } = require("./testimonials.validation");

async function create(req, res, next) {
    try {
        const result = validateCreateTestimonial(req.body);
        if (!result.valid) {
            return res.status(400).json({ errors: result.errors });
        }

        const testimonial = await service.createTestimonial(result.data);
        res.status(201).json(testimonial);
    } catch (err) {
        next(err);
    }
}

async function list(req, res, next) {
    try {
        const { status } = req.query;

        if (status !== undefined && !isValidStatus(status)) {
            return res.status(400).json({ errors: [`status must be one of PENDING, APPROVED, REJECTED`] });
        }

        const testimonials = await service.listTestimonials(status);
        res.json(testimonials);
    } catch (err) {
        next(err);
    }
}

async function listApproved(req, res, next) {
    try {
        const testimonials = await service.listApprovedTestimonials();
        res.json(testimonials);
    } catch (err) {
        next(err);
    }
}

async function approve(req, res, next) {
    try {
        const testimonial = await service.approveTestimonial(req.params.id);
        res.json(testimonial);
    } catch (err) {
        next(err);
    }
}

async function reject(req, res, next) {
    try {
        const testimonial = await service.rejectTestimonial(req.params.id);
        res.json(testimonial);
    } catch (err) {
        next(err);
    }
}

module.exports = { create, list, listApproved, approve, reject };