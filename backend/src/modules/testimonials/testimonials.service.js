const { prisma } = require("../../lib/prisma");

// ── Spam / Duplicate detection ──────────────────────────────────────

const SPAM_KEYWORDS = [
    "buy now", "click here", "free money", "crypto", "bitcoin",
    "viagra", "casino", "lottery", "winner", "subscribe now",
];

/**
 * Analyse a message for suspicious patterns.
 * Returns a flagReason string or null.
 */
function detectSuspiciousContent(message) {
    const trimmed = message.trim();

    if (trimmed.length < 10) return "SUSPICIOUS: Message too short";

    if (trimmed === trimmed.toUpperCase() && trimmed.length > 5) {
        return "SUSPICIOUS: Entire message is ALL CAPS";
    }

    const lower = trimmed.toLowerCase();
    for (const keyword of SPAM_KEYWORDS) {
        if (lower.includes(keyword)) {
            return `SUSPICIOUS: Contains spam keyword "${keyword}"`;
        }
    }

    return null;
}

/**
 * Check whether this email already submitted a testimonial
 * within the last 30 days.
 */
async function checkDuplicate(email) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const existing = await prisma.testimonial.findFirst({
        where: {
            email,
            createdAt: { gte: thirtyDaysAgo },
        },
        orderBy: { createdAt: "desc" },
    });

    return !!existing;
}

// ── CRUD ─────────────────────────────────────────────────────────────

async function createTestimonial(data) {
    const isDuplicate = await checkDuplicate(data.email);
    let flagReason = detectSuspiciousContent(data.message);

    if (isDuplicate) {
        flagReason = flagReason
            ? `DUPLICATE | ${flagReason}`
            : "DUPLICATE: Email submitted within last 30 days";
    }

    return prisma.testimonial.create({
        data: {
            ...data,
            isDuplicate,
            flagReason: flagReason || undefined,
        },
    });
}

function listTestimonials(status, { skip = 0, take } = {}) {
    return prisma.testimonial.findMany({
        where: status ? { status } : undefined,
        orderBy: { createdAt: "desc" },
        skip,
        ...(take !== undefined && { take }),
    });
}

function countTestimonials(status) {
    return prisma.testimonial.count({
        where: status ? { status } : undefined,
    });
}

function listApprovedTestimonials({ skip = 0, take } = {}) {
    return prisma.testimonial.findMany({
        where: { status: "APPROVED" },
        orderBy: { createdAt: "desc" },
        skip,
        ...(take !== undefined && { take }),
    });
}

function countApprovedTestimonials() {
    return prisma.testimonial.count({
        where: { status: "APPROVED" },
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
    countTestimonials,
    listApprovedTestimonials,
    countApprovedTestimonials,
    approveTestimonial,
    rejectTestimonial,
};