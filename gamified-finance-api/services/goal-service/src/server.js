"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const goalRoutes_js_1 = __importDefault(require("./routes/goalRoutes.js")); // ✅ Correct name + extension
const logger_js_1 = require("./config/logger.js");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5002;
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
app.use('/api/goal', goalRoutes_js_1.default); // ✅ Proper path and variable
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});
app.listen(PORT, () => {
    logger_js_1.logger.info(`Goal service running on port ${PORT}`);
});
