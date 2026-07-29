const getPagination = (req, defaultTake = 10) => {
    const skip = Math.max(0, parseInt(req.query.skip, 10) || 0);
    const take = req.query.take ? Math.max(1, parseInt(req.query.take, 10) || defaultTake) : undefined;
    return { skip, take };
};

module.exports = { getPagination };
