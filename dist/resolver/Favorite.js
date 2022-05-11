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
exports.FavoriteResolver = void 0;
const type_graphql_1 = require("type-graphql");
const apollo_server_express_1 = require("apollo-server-express");
const entity_1 = require("../entity");
let FavoriteResolver = class FavoriteResolver {
    async getFavoritesByUser({ id_user_token: id }) {
        if (!id)
            throw new apollo_server_express_1.AuthenticationError("Autenticación no valida, vuelva a iniciar sesión");
        const favs = await entity_1.Favorite.find({
            where: {
                user: {
                    id: +id
                },
                type: true
            },
            relations: { post: true }
        });
        return favs.map(fav => fav.post);
    }
    async getIsFavorite({ id_user_token: id }, id_post) {
        if (!id)
            throw new apollo_server_express_1.AuthenticationError("Autenticación no valida, vuelva a iniciar sesión");
        const post = await entity_1.Post.findOne({ where: { id: +id_post } });
        if (!post)
            throw new apollo_server_express_1.ValidationError("Post no exists");
        const favs = await entity_1.Favorite.findOne({
            where: {
                user: {
                    id: +id
                },
                post: {
                    id: +id_post
                }
            },
            relations: { post: true }
        });
        return favs;
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [entity_1.Post]),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FavoriteResolver.prototype, "getFavoritesByUser", null);
__decorate([
    (0, type_graphql_1.Query)(() => entity_1.Favorite, { nullable: true }),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FavoriteResolver.prototype, "getIsFavorite", null);
FavoriteResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], FavoriteResolver);
exports.FavoriteResolver = FavoriteResolver;
//# sourceMappingURL=Favorite.js.map