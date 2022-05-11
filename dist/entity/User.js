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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenResponse = exports.UserMessage = exports.UserResponse = exports.User = void 0;
const typeorm_1 = require("typeorm");
const type_graphql_1 = require("type-graphql");
const _1 = require("./");
let User = class User extends typeorm_1.BaseEntity {
    id;
    name;
    email;
    password;
    posts;
    comments;
    fav;
};
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => _1.Post),
    (0, typeorm_1.OneToMany)(() => _1.Post, post => post.user),
    __metadata("design:type", _1.Post)
], User.prototype, "posts", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => _1.Comment, { nullable: true }),
    (0, typeorm_1.OneToMany)(() => _1.Comment, comment => comment.user),
    __metadata("design:type", _1.Comment)
], User.prototype, "comments", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [_1.Favorite], { nullable: true }),
    (0, typeorm_1.OneToMany)(() => _1.Favorite, fav => fav.user),
    __metadata("design:type", Array)
], User.prototype, "fav", void 0);
User = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)("user")
], User);
exports.User = User;
let UserResponse = class UserResponse {
    user;
    token;
    message;
};
__decorate([
    (0, type_graphql_1.Field)(() => User),
    __metadata("design:type", User)
], UserResponse.prototype, "user", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], UserResponse.prototype, "token", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], UserResponse.prototype, "message", void 0);
UserResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], UserResponse);
exports.UserResponse = UserResponse;
let UserMessage = class UserMessage {
    message;
};
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], UserMessage.prototype, "message", void 0);
UserMessage = __decorate([
    (0, type_graphql_1.ObjectType)()
], UserMessage);
exports.UserMessage = UserMessage;
let TokenResponse = class TokenResponse {
    user;
    token;
};
__decorate([
    (0, type_graphql_1.Field)(() => User),
    __metadata("design:type", User)
], TokenResponse.prototype, "user", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], TokenResponse.prototype, "token", void 0);
TokenResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], TokenResponse);
exports.TokenResponse = TokenResponse;
//# sourceMappingURL=User.js.map