"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.encryptPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const encryptPassword = async (password) => {
    const salt = await bcryptjs_1.default.genSalt(10);
    return bcryptjs_1.default.hash(password, salt);
};
exports.encryptPassword = encryptPassword;
const comparePassword = async (password, hash) => {
    return await bcryptjs_1.default.compare(password, hash);
};
exports.comparePassword = comparePassword;
//# sourceMappingURL=bcrypt.js.map