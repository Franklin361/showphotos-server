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
exports.PostResponse = exports.Post = void 0;
const typeorm_1 = require("typeorm");
const type_graphql_1 = require("type-graphql");
const _1 = require("./");
let Post = class Post extends typeorm_1.BaseEntity {
    id;
    description;
    url_image;
    likes;
    dislike;
    createdAt;
    user;
    comments;
    fav;
};
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Post.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Post.prototype, "description", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Post.prototype, "url_image", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Number, { defaultValue: 0 }),
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Post.prototype, "likes", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Number, { defaultValue: 0 }),
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Post.prototype, "dislike", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", String)
], Post.prototype, "createdAt", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => _1.User),
    (0, typeorm_1.ManyToOne)(() => _1.User, user => user.posts, {
        cascade: true,
        onDelete: 'CASCADE'
    }),
    __metadata("design:type", _1.User)
], Post.prototype, "user", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [_1.Comment], { nullable: true }),
    (0, typeorm_1.OneToMany)(() => _1.Comment, comment => comment.post),
    __metadata("design:type", Array)
], Post.prototype, "comments", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => _1.Favorite, { nullable: true }),
    (0, typeorm_1.OneToMany)(() => _1.Favorite, fav => fav.post),
    __metadata("design:type", _1.Favorite)
], Post.prototype, "fav", void 0);
Post = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)("post")
], Post);
exports.Post = Post;
let PostResponse = class PostResponse {
    post;
    message;
};
__decorate([
    (0, type_graphql_1.Field)(() => Post),
    __metadata("design:type", Post)
], PostResponse.prototype, "post", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], PostResponse.prototype, "message", void 0);
PostResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], PostResponse);
exports.PostResponse = PostResponse;
//# sourceMappingURL=Post.js.map