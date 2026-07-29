const express = require("express");
const cors = require("cors");
const testimonialsRoute = require("./modules/testimonials/testimonials.route");
const widgetRoute = require("./modules/widget/widget.route");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/testimonials", testimonialsRoute);
app.use("/api/widget", widgetRoute);

app.get("/health", (req, res) => res.json({ ok: true }));

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Backend listening on port ${PORT}`);
});