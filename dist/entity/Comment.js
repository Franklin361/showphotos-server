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
exports.CommentResponse = exports.Comment = void 0;
const typeorm_1 = require("typeorm");
const type_graphql_1 = require("type-graphql");
const _1 = require("./");
let Comment = class Comment extends typeorm_1.BaseEntity {
    id;
    description;
    createdAt;
    user;
    post;
};
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Comment.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Comment.prototype, "description", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", String)
], Comment.prototype, "createdAt", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => _1.User, { nullable: true }),
    (0, typeorm_1.ManyToOne)(() => _1.User, user => user.comments, {
        cascade: true,
        onDelete: 'CASCADE'
    }),
    __metadata("design:type", _1.User)
], Comment.prototype, "user", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => _1.Post, { nullable: true }),
    (0, typeorm_1.ManyToOne)(() => _1.Post, post => post.comments, {
        cascade: true,
        onDelete: 'CASCADE'
    }),
    __metadata("design:type", _1.Post)
], Comment.prototype, "post", void 0);
Comment = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)("comment")
], Comment);
exports.Comment = Comment;
let CommentResponse = class CommentResponse {
    comment;
    message;
};
__decorate([
    (0, type_graphql_1.Field)(() => Comment),
    __metadata("design:type", Comment)
], CommentResponse.prototype, "comment", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], CommentResponse.prototype, "message", void 0);
CommentResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], CommentResponse);
exports.CommentResponse = CommentResponse;
//# sourceMappingURL=Comment.js.map