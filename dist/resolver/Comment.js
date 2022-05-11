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
exports.CommentResolver = void 0;
const type_graphql_1 = require("type-graphql");
const entity_1 = require("../entity");
const graphql_subscriptions_1 = require("graphql-subscriptions");
const apollo_server_express_1 = require("apollo-server-express");
const entity_2 = require("../entity");
const utils_1 = require("../utils");
let CommentInput = class CommentInput {
    description = '';
    id_post = '';
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], CommentInput.prototype, "description", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], CommentInput.prototype, "id_post", void 0);
CommentInput = __decorate([
    (0, type_graphql_1.InputType)()
], CommentInput);
let CommentResolver = class CommentResolver {
    async createComment({ description, id_post }, { id_user_token: id }, pubSub) {
        if (!id)
            throw new apollo_server_express_1.AuthenticationError("Autenticación no valida, vuelva a iniciar sesión");
        const [user, post] = await Promise.all([
            entity_2.User.findOne({ where: { id: +id } }),
            entity_2.Post.findOne({ where: { id: +id_post } })
        ]);
        if (!user)
            throw new apollo_server_express_1.AuthenticationError("User no exists");
        if (!post)
            throw new apollo_server_express_1.AuthenticationError("Post no exists");
        const newComment = await entity_2.Comment.create({
            description,
            user,
            post
        }).save();
        await pubSub.publish(utils_1.trigger.COMMENT_ADDED, null);
        return {
            comment: newComment,
            message: "Comentario agregado correctamente",
        };
    }
    async newCommentAdded(id_post) {
        const post = await entity_2.Post.findOne({
            where: { id: +id_post },
            relations: { comments: { user: true }, user: true },
            order: { comments: { createdAt: 'DESC' } }
        });
        return post;
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => entity_1.CommentResponse),
    __param(0, (0, type_graphql_1.Arg)("variables", () => CommentInput)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __param(2, (0, type_graphql_1.PubSub)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CommentInput, Object, graphql_subscriptions_1.PubSubEngine]),
    __metadata("design:returntype", Promise)
], CommentResolver.prototype, "createComment", null);
__decorate([
    (0, type_graphql_1.Subscription)(() => entity_2.Post, { topics: utils_1.trigger.COMMENT_ADDED, nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("id_post")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CommentResolver.prototype, "newCommentAdded", null);
CommentResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], CommentResolver);
exports.CommentResolver = CommentResolver;
//# sourceMappingURL=Comment.js.map