"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDecodedToken = exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.SECRET_SEED, {
        expiresIn: '10h'
    });
};
exports.createToken = createToken;
const getDecodedToken = (req) => {
    try {
        const token = req.headers.authorization ?? null;
        let id = null;
        if (token !== null) {
            const decodedToken = jsonwebtoken_1.default.verify(token, process.env.SECRET_SEED);
            id = decodedToken.id;
        }
        return id;
    }
    catch (error) {
        return null;
    }
};
exports.getDecodedToken = getDecodedToken;
//# sourceMappingURL=token.js.map