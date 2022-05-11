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
exports.Favorite = void 0;
const typeorm_1 = require("typeorm");
const type_graphql_1 = require("type-graphql");
const _1 = require("./");
let Favorite = class Favorite extends typeorm_1.BaseEntity {
    id;
    type;
    user;
    post;
};
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Favorite.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Favorite.prototype, "type", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => _1.User, { nullable: true }),
    (0, typeorm_1.ManyToOne)(() => _1.User, user => user.comments, {
        cascade: true,
        onDelete: 'CASCADE'
    }),
    __metadata("design:type", _1.User)
], Favorite.prototype, "user", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => _1.Post, { nullable: true }),
    (0, typeorm_1.ManyToOne)(() => _1.Post, post => post.comments, {
        cascade: true,
        onDelete: 'CASCADE'
    }),
    __metadata("design:type", _1.Post)
], Favorite.prototype, "post", void 0);
Favorite = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)("favorite")
], Favorite);
exports.Favorite = Favorite;
//# sourceMappingURL=Favorite.js.map