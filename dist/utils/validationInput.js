"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCorrectInputs = void 0;
function isCorrectInputs(variables) {
    let input = '';
    for (let value of Object.entries(variables)) {
        if (!value[1]) {
            input = value[0];
        }
        ;
    }
    return input;
}
exports.isCorrectInputs = isCorrectInputs;
;
//# sourceMappingURL=validationInput.js.map