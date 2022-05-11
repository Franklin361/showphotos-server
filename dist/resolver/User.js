"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = void 0;
const type_graphql_1 = require("type-graphql");
const apollo_server_express_1 = require("apollo-server-express");
const utils_1 = require("../utils");
const entity_1 = require("../entity");
let UserInput = class UserInput {
    name = '';
    email = '';
    password = '';
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UserInput.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UserInput.prototype, "email", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], UserInput.prototype, "password", void 0);
UserInput = __decorate([
    (0, type_graphql_1.InputType)()
], UserInput);
let UserLoginInput = class UserLoginInput {
    email = '';
    password = '';
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UserLoginInput.prototype, "email", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], UserLoginInput.prototype, "password", void 0);
UserLoginInput = __decorate([
    (0, type_graphql_1.InputType)()
], UserLoginInput);
let UserResolver = class UserResolver {
    async createUser(variables) {
        const value = (0, utils_1.isCorrectInputs)(variables);
        if (value)
            throw new apollo_server_express_1.UserInputError(`El campo ${value} es obligatorio`);
        const { email, password, ...rest } = variables;
        const existEmail = await entity_1.User.findOne({ where: { email } });
        if (existEmail)
            throw new apollo_server_express_1.ValidationError("El email ya esta registrado");
        const encryptedPass = await (0, utils_1.encryptPassword)(password);
        const user = await entity_1.User.create({
            email,
            password: encryptedPass,
            ...rest,
        }).save();
        return {
            user,
            token: (0, utils_1.createToken)(user.id),
            message: "Creación de usuario correcto",
        };
    }
    async login(variables) {
        const value = (0, utils_1.isCorrectInputs)(variables);
        if (value)
            throw new apollo_server_express_1.UserInputError(`El campo ${value} es obligatorio`);
        const { password, email } = variables;
        const user = await entity_1.User.findOne({ where: { email } });
        if (!user)
            throw new apollo_server_express_1.UserInputError("El usuario no existe");
        if (!password)
            throw new apollo_server_express_1.UserInputError("La contraseña es incorrecta");
        const isSamePass = await (0, utils_1.comparePassword)(password, user.password);
        if (!isSamePass)
            throw new apollo_server_express_1.UserInputError("La contraseña es incorrecta");
        return {
            user,
            token: (0, utils_1.createToken)(user.id),
            message: "Inicio de sesión exitoso",
        };
    }
    async deleteUser({ id_user_token }) {
        if (!id_user_token)
            throw new apollo_server_express_1.AuthenticationError("Autenticación no valida (token)");
        try {
            await entity_1.User.delete(+id_user_token);
            return {
                message: "Usuario eliminado correctamente",
            };
        }
        catch (error) {
            const { message } = error;
            throw new apollo_server_express_1.ValidationError("No se logro eliminar el usuario, " + message);
        }
    }
    async retoken(ctx) {
        const id = +ctx.id_user_token;
        if (!id)
            throw new apollo_server_express_1.AuthenticationError("vuelva a iniciar sesión por favor 😞");
        return {
            token: (0, utils_1.createToken)(id),
            user: entity_1.User.findOne({ where: { id } }),
        };
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => entity_1.UserResponse),
    __param(0, (0, type_graphql_1.Arg)("variables", () => UserInput)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserInput]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "createUser", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => entity_1.UserResponse),
    __param(0, (0, type_graphql_1.Arg)("variables", () => UserLoginInput)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserLoginInput]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => entity_1.UserMessage),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "deleteUser", null);
__decorate([
    (0, type_graphql_1.Query)(() => entity_1.TokenResponse),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "retoken", null);
UserResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=User.js.map