const { prisma } = require("../lib/prisma");

function createTestimonial(data) {
    return prisma.testimonial.create({ data });
}

function listTestimonials(status) {
    return prisma.testimonial.findMany({
        where: status ? { status } : undefined,
        orderBy: { createdAt: "desc" },
    });
}

function listApprovedTestimonials() {
    return prisma.testimonial.findMany({
        where: { status: "APPROVED" },
        orderBy: { createdAt: "desc" },
    });
}

function approveTestimonial(id) {
    return prisma.testimonial.update({
        where: { id },
        data: { status: "APPROVED" },
    });
}

function rejectTestimonial(id) {
    return prisma.testimonial.update({
        where: { id },
        data: { status: "REJECTED" },
    });
}

module.exports = {
    createTestimonial,
    listTestimonials,
    listApprovedTestimonials,
    approveTestimonial,
    rejectTestimonial,
};