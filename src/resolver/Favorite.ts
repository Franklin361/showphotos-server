import {  Resolver, Ctx, Query, Arg } from 'type-graphql';

import { Context } from 'apollo-server-core';
import { AuthenticationError, ValidationError } from 'apollo-server-express';
import { Favorite, Post } from '../entity';
import { IContextServer } from '../interface';



@Resolver()
export class FavoriteResolver {
    @Query(() => [Post])
    async getFavoritesByUser(
        @Ctx() { id_user_token:id }: Context<IContextServer>
    ) {
        if (!id) throw new AuthenticationError("Authentication not valid, please log in again. 🤯");
        
        const favs = await Favorite.find({
            where:{
                user: {
                    id: +id
                },
                type: true
            },
            relations:{ post: true }
        });

        return favs.map( fav => fav.post);
    }

    @Query(() => Favorite, { nullable: true })
    async getIsFavorite(
        @Ctx() { id_user_token:id }: Context<IContextServer>,
        @Arg("id") id_post: string
    ) {
        if (!id) throw new AuthenticationError("Authentication not valid, please log in again. 🤯");

        const post = await Post.findOne({where:{ id: +id_post }});

        if(!post) throw new ValidationError("Post no exists");
        
        const favs = await Favorite.findOne({
            where:{
                user: {
                    id: +id
                },
                post: {
                    id: +id_post
                }
            },
            relations:{ post: true }
        });

        return favs
    }

}