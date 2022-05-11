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
exports.PostResolver = void 0;
const graphql_subscriptions_1 = require("graphql-subscriptions");
const type_graphql_1 = require("type-graphql");
const entity_1 = require("../entity");
const apollo_server_express_1 = require("apollo-server-express");
const utils_1 = require("../utils");
const Favorite_1 = require("../entity/Favorite");
const typeorm_1 = require("typeorm");
let PostInput = class PostInput {
    description = '';
    url_image = '';
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], PostInput.prototype, "description", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], PostInput.prototype, "url_image", void 0);
PostInput = __decorate([
    (0, type_graphql_1.InputType)()
], PostInput);
let PutPostInput = class PutPostInput {
    id;
    description;
    url_image;
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], PutPostInput.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], PutPostInput.prototype, "description", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], PutPostInput.prototype, "url_image", void 0);
PutPostInput = __decorate([
    (0, type_graphql_1.InputType)()
], PutPostInput);
let LikeDislikePostInput = class LikeDislikePostInput {
    id;
    likes;
    dislike;
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], LikeDislikePostInput.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Boolean)
], LikeDislikePostInput.prototype, "likes", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Boolean)
], LikeDislikePostInput.prototype, "dislike", void 0);
LikeDislikePostInput = __decorate([
    (0, type_graphql_1.InputType)()
], LikeDislikePostInput);
let PostResolver = class PostResolver {
    async createPostImage(variables, { id_user_token: id }, pubSub) {
        if (!id)
            throw new apollo_server_express_1.AuthenticationError("Autenticación no valida, vuelva a iniciar sesión");
        const value = (0, utils_1.isCorrectInputs)(variables);
        if (value)
            throw new apollo_server_express_1.UserInputError(`El campo ${value} es obligatorio`);
        const user = await entity_1.User.findOne({ where: { id: +id } });
        if (!user)
            throw new apollo_server_express_1.AuthenticationError("User no exists");
        const post = await entity_1.Post.create({
            ...variables,
            user,
        }).save();
        await pubSub.publish(utils_1.trigger.POST_ADDED, null);
        return {
            post,
            message: "Creación de POST correcto",
        };
    }
    async newPostAdded(type_sort) {
        if (!(['likes', 'dislike', 'createdAt'].includes(type_sort)))
            throw new apollo_server_express_1.ValidationError('Type sort invalid');
        const posts = await entity_1.Post.find({ order: { [type_sort]: "DESC" }, take: 15, relations: { user: true } });
        return posts;
    }
    async updatePostImage(variables, { id_user_token: id }, pubSub) {
        if (!id)
            throw new apollo_server_express_1.AuthenticationError("Autenticación no valida, vuelva a iniciar sesión");
        const { id: id_post, ...rest } = variables;
        const post = await entity_1.Post.findOne({ where: { id: +id_post }, relations: { user: true } });
        if (!post)
            throw new apollo_server_express_1.ValidationError("Post no exists");
        if (+post.user.id !== +id)
            throw new apollo_server_express_1.AuthenticationError("Tú no tienes privilegios para editar este Post");
        post.description = rest.description ?? post.description;
        post.url_image = rest.url_image ?? post.url_image;
        const newPost = await post.save();
        await pubSub.publish(utils_1.trigger.POST_ADDED, null);
        return {
            message: "POST acutalizado",
            post: newPost,
        };
    }
    async updateLikeDislikePostImage(variables, { id_user_token: id }, pubSub) {
        if (!id)
            throw new apollo_server_express_1.AuthenticationError("Autenticación no valida, vuelva a iniciar sesión");
        const { id: id_post, ...rest } = variables;
        const user = await entity_1.User.findOne({ where: { id: +id } });
        const post = await entity_1.Post.findOne({ where: { id: +id_post }, relations: { user: true } });
        if (!post)
            throw new apollo_server_express_1.ValidationError("Post no exists");
        const existFavorite = await Favorite_1.Favorite.findOne({
            where: {
                post: { id: post.id },
                user: { id: +id }
            }
        });
        if (!existFavorite) {
            if (rest.likes || rest.dislike) {
                const type = rest.likes;
                (type) ? post.likes += 1 : post.dislike += 1;
                if (user)
                    await Favorite_1.Favorite.create({ post, user, type }).save();
            }
        }
        else {
            if (!rest.likes && !rest.dislike) {
                const type = existFavorite.type ? 'likes' : 'dislike';
                post[type] = post[type] - 1;
                await Favorite_1.Favorite.delete(existFavorite.id);
            }
            else {
                const typePlus = rest.likes ? 'likes' : 'dislike';
                const typeLess = !rest.likes ? 'likes' : 'dislike';
                post[typePlus] += 1;
                post[typeLess] -= 1;
                existFavorite.type = rest.likes;
                await existFavorite.save();
            }
        }
        const newPost = await post.save();
        await pubSub.publish(utils_1.trigger.POST_ADDED, null);
        return newPost;
    }
    async deletePostImage({ id_user_token }, id, pubSub) {
        if (!id_user_token)
            throw new apollo_server_express_1.AuthenticationError("Autenticación no valida, vuelva a iniciar sesión");
        const post = await entity_1.Post.findOne({ where: { id: +id }, relations: { user: true } });
        if (!post)
            throw new apollo_server_express_1.ValidationError("Post no exists");
        if (+post.user.id !== +id_user_token)
            throw new apollo_server_express_1.AuthenticationError("Tú no tienes privilegios para eliminar este Post");
        try {
            await entity_1.Post.delete(+id);
            await pubSub.publish(utils_1.trigger.POST_ADDED, null);
            return {
                post,
                message: "Post eliminado correctamente",
            };
        }
        catch (error) {
            const { message } = error;
            throw new apollo_server_express_1.ValidationError("No se logro eliminar el post, " + message);
        }
    }
    async getPostByUser({ id_user_token }) {
        if (!id_user_token)
            throw new apollo_server_express_1.AuthenticationError("Autenticación no valida, vuelva a iniciar sesión");
        const posts = await entity_1.Post.find({ where: { user: { id: +id_user_token } }, relations: { user: true }, order: { createdAt: 'DESC' } });
        return posts;
    }
    async getPostById({ id_user_token }, id) {
        if (!id_user_token)
            throw new apollo_server_express_1.AuthenticationError("Autenticación no valida, vuelva a iniciar sesión");
        const post = await entity_1.Post.findOne({
            where: { id: +id },
            relations: { comments: { user: true }, user: true },
            order: { comments: { createdAt: 'DESC' } }
        });
        if (!post)
            throw new apollo_server_express_1.ValidationError("This post no exists");
        return post;
    }
    async getPostSort({ id_user_token }, type_sort) {
        if (!id_user_token)
            throw new apollo_server_express_1.AuthenticationError("Autenticación no valida, vuelva a iniciar sesión");
        if (!(['likes', 'dislike', 'createdAt'].includes(type_sort)))
            throw new apollo_server_express_1.ValidationError('Type sort invalid');
        const post = await entity_1.Post.find({ order: { [type_sort]: "DESC" }, take: 15, relations: { user: true } });
        return post;
    }
    async getPostByDesc({ id_user_token }, description) {
        if (!id_user_token)
            throw new apollo_server_express_1.AuthenticationError("Autenticación no valida, vuelva a iniciar sesión");
        const posts = await entity_1.Post.find({ where: { description: (0, typeorm_1.Like)(`%${description}%`) }, relations: { user: true } });
        return posts;
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => entity_1.PostResponse),
    __param(0, (0, type_graphql_1.Arg)("variables", () => PostInput)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __param(2, (0, type_graphql_1.PubSub)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PostInput, Object, graphql_subscriptions_1.PubSubEngine]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "createPostImage", null);
__decorate([
    (0, type_graphql_1.Subscription)(() => [entity_1.Post], { topics: utils_1.trigger.POST_ADDED }),
    __param(0, (0, type_graphql_1.Arg)("type_sort")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "newPostAdded", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => entity_1.PostResponse),
    __param(0, (0, type_graphql_1.Arg)("variables", () => PutPostInput)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __param(2, (0, type_graphql_1.PubSub)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PutPostInput, Object, graphql_subscriptions_1.PubSubEngine]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "updatePostImage", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => entity_1.Post),
    __param(0, (0, type_graphql_1.Arg)("variables", () => LikeDislikePostInput)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __param(2, (0, type_graphql_1.PubSub)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LikeDislikePostInput, Object, graphql_subscriptions_1.PubSubEngine]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "updateLikeDislikePostImage", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => entity_1.PostResponse),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("id")),
    __param(2, (0, type_graphql_1.PubSub)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, graphql_subscriptions_1.PubSubEngine]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "deletePostImage", null);
__decorate([
    (0, type_graphql_1.Query)(() => [entity_1.Post]),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "getPostByUser", null);
__decorate([
    (0, type_graphql_1.Query)(() => entity_1.Post),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "getPostById", null);
__decorate([
    (0, type_graphql_1.Query)(() => [entity_1.Post]),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("type_sort")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "getPostSort", null);
__decorate([
    (0, type_graphql_1.Query)(() => [entity_1.Post]),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("description")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "getPostByDesc", null);
PostResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], PostResolver);
exports.PostResolver = PostResolver;
//# sourceMappingURL=Post.js.map