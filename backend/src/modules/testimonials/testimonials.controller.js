const service = require("./testimonials.service");
const { createTestimonialSchema, isValidStatus } = require("./testimonials.validation");
const ApiError = require("../../utils/ApiError");
const asyncHandler = require("../../utils/asyncHandler");
const { getPagination } = require("../../utils/pagination");

const create = asyncHandler(async (req, res) => {
    const data = createTestimonialSchema.parse(req.body);

    const testimonial = await service.createTestimonial(data);
    res.status(201).json(testimonial);
});

const list = asyncHandler(async (req, res) => {
    const { status } = req.query;

    if (status !== undefined && !isValidStatus(status)) {
        throw new ApiError(400, "status must be one of PENDING, APPROVED, REJECTED");
    }

    const { skip, take } = getPagination(req, 10);

    const [testimonials, total] = await Promise.all([
        service.listTestimonials(status, { skip, take }),
        service.countTestimonials(status),
    ]);

    res.json({ data: testimonials, total, skip, take: take ?? null });
});

const listApproved = asyncHandler(async (req, res) => {
    const { skip, take } = getPagination(req, 9);

    const [testimonials, total] = await Promise.all([
        service.listApprovedTestimonials({ skip, take }),
        service.countApprovedTestimonials(),
    ]);

    res.json({ data: testimonials, total, skip, take: take ?? null });
});

const approve = asyncHandler(async (req, res) => {
    const testimonial = await service.approveTestimonial(req.params.id);
    res.json(testimonial);
});

const reject = asyncHandler(async (req, res) => {
    const testimonial = await service.rejectTestimonial(req.params.id);
    res.json(testimonial);
});

module.exports = { create, list, listApproved, approve, reject };