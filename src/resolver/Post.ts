import { AuthenticationError, ValidationError, UserInputError } from 'apollo-server-express';
import { Context } from "apollo-server-core";
import { Like } from "typeorm";
import { PubSubEngine } from "graphql-subscriptions";
import { Arg, Ctx,  Mutation, Resolver, Query, Subscription, PubSub } from "type-graphql";
import { PostResponse, Post, User, Favorite } from "../entity";

import { LikeDislikePostInput, PostInput, PutPostInput } from "../inputs";
import { isCorrectInputs, trigger } from "../utils";
import { IContextServer } from '../interface'

@Resolver()
export class PostResolver {

    @Mutation(() => PostResponse)
    async createPostImage(
        @Arg("variables", () => PostInput) variables: PostInput,
        @Ctx() { id_user_token: id }: Context<IContextServer>,
        @PubSub() pubSub: PubSubEngine
    ) {

        if (!id) throw new AuthenticationError("Authentication not valid, please log in again. 🤯");

        const value = isCorrectInputs(variables);
        if (value) throw new UserInputError(`The field ${value} is required`);

        const user = await User.findOne({ where: { id: +id }, relations: { posts: true } });
        if (!user) throw new AuthenticationError("User doesn't exist 🤨");

        if(+user.posts.length >= 4) throw new UserInputError('You can only create a maximum of 4 photo posts 🧐')

        const post = await Post.create({
            ...variables,
            user,
        }).save();
        
        await pubSub.publish(trigger.POST_ADDED, null);
        
        return {
            post,
            message: "The Post was created successfully ✅",
        };
    }

    @Subscription(() => [Post],{ topics: trigger.POST_ADDED})
    async newPostAdded(
         @Arg("type_sort") type_sort: 'likes' | 'dislike' | 'createdAt'
    ): Promise<Post[]> {
        
        if (!(['likes', 'dislike', 'createdAt'].includes(type_sort))) throw new ValidationError('Type sort invalid')
        const posts = await Post.find({ order: { [type_sort]: "DESC" }, take: 15, relations: { user: true } });
        return posts
    }

    @Mutation(() => PostResponse)
    async updatePostImage(
        @Arg("variables", () => PutPostInput) variables: PutPostInput,
        @Ctx() { id_user_token: id }: Context<IContextServer>,
        @PubSub() pubSub: PubSubEngine
    ) {
        if (!id) throw new AuthenticationError("Authentication not valid, please log in again. 🤯");
        // TODO: actualizar todo menos los likes y dislikes
        const { id: id_post, ...rest } = variables;

        const post = await Post.findOne({ where: { id: +id_post }, relations: { user: true } });

        if (!post) throw new ValidationError("Post no exists");

        if (+post.user.id !== +id) throw new AuthenticationError("You don't have privileges to edit this Post 😡 ");


        post.description = rest.description ?? post.description;
        post.url_image = rest.url_image ?? post.url_image;

        const newPost = await post.save();

        await pubSub.publish(trigger.POST_ADDED, null);

        return {
            message: "Post was  updated successfully ✅",
            post: newPost,
        };
    }

    // TODO: crear una mutation solo para actualizar likes / dislikes
    @Mutation(() => Post)
    async updateLikeDislikePostImage(
        @Arg("variables", () => LikeDislikePostInput) variables: LikeDislikePostInput,
        @Ctx() { id_user_token: id }: Context<IContextServer>,
        @PubSub() pubSub: PubSubEngine
    ) {
        if (!id) throw new AuthenticationError("Authentication not valid, please log in again. 🤯");

        const { id: id_post, ...rest } = variables;
        // PromiseAll.
        const user = await User.findOne({ where: { id: +id } });
        const post = await Post.findOne({ where: { id: +id_post }, relations: { user: true } });

        if (!post) throw new ValidationError("Post no exists");


        const existFavorite = await Favorite.findOne({
            where: {
                post: { id: post.id },
                user: { id: +id }
            }
        })


        if (!existFavorite) {

            if (rest.likes || rest.dislike) {
                const type = rest.likes;

                (type) ? post.likes += 1 : post.dislike += 1;

                if (user) await Favorite.create({ post, user, type }).save();
            }

        } else {

            if (!rest.likes && !rest.dislike) {
                const type = existFavorite.type ? 'likes' : 'dislike';
                post[type] = post[type] - 1;
                await Favorite.delete(existFavorite.id);
            } else {

                const typePlus = rest.likes ? 'likes' : 'dislike';
                const typeLess = !rest.likes ? 'likes' : 'dislike';

                post[typePlus] += 1
                post[typeLess] -= 1
                existFavorite.type = rest.likes;

                await existFavorite.save();
            }
        }

        const newPost = await post.save();
        await pubSub.publish(trigger.POST_ADDED, null);
        return newPost
    }

    @Mutation(() => PostResponse)
    async deletePostImage(
        @Ctx() { id_user_token }: Context<IContextServer>,
        @Arg("id") id: string,
        @PubSub() pubSub: PubSubEngine
    ) {
        if (!id_user_token) throw new AuthenticationError("Authentication not valid, please log in again. 🤯");

        const post = await Post.findOne({ where: { id: +id }, relations: { user: true } });

        if (!post) throw new ValidationError("Post no exists");

        if (+post.user.id !== +id_user_token)
            throw new AuthenticationError("You don't have privileges to delete this Post 😡");

        try {
            await Post.delete(+id);
            await pubSub.publish(trigger.POST_ADDED, null);
            return {
                post,
                message: "The Post  deleted successfully ✅",
            };
        } catch (error) {
            const { message } = error as Error;
            throw new ValidationError("Failed to delete the post 😞, " + message);
        }
    }
    // getPostByUser - when user logs in to his or her perfil page
    @Query(() => [Post])
    async getPostByUser(@Ctx() { id_user_token }: Context<IContextServer>) {
        if (!id_user_token) throw new AuthenticationError("Authentication not valid, please log in again. 🤯");

        const posts = await Post.find({ where: { user: { id: +id_user_token } }, relations: { user: true }, order: { createdAt: 'DESC' } });

        return posts;
    }

    @Query(() => Post)
    async getPostById(@Ctx() { id_user_token }: Context<IContextServer>, @Arg("id") id: string) {
        if (!id_user_token) throw new AuthenticationError("Authentication not valid, please log in again. 🤯");

        const post = await Post.findOne({
            where: { id: +id },
            relations: { comments: { user: true }, user: true },
            order: { comments: { createdAt: 'DESC' } }
        });
        if (!post) throw new ValidationError("This post no exists");

        return post
    }

    @Query(() => [Post])
    async getPostSort(
        @Ctx() { id_user_token }: Context<IContextServer>,
        @Arg("type_sort") type_sort: 'likes' | 'dislike' | 'createdAt'
    ) {
        if (!id_user_token) throw new AuthenticationError("Authentication not valid, please log in again. 🤯");

        if (!(['likes', 'dislike', 'createdAt'].includes(type_sort))) throw new ValidationError('Type sort invalid')

        const post = await Post.find({ order: { [type_sort]: "DESC" }, take: 15, relations: { user: true } });
        return post;
    }

    @Query(() => [Post])
    async getPostByDesc(
        @Ctx() { id_user_token }: Context<IContextServer>,
        @Arg("description") description: string
    ) {
        if (!id_user_token) throw new AuthenticationError("Authentication not valid, please log in again. 🤯");

        const posts = await Post.find({ where: { description: Like(`%${description}%`) }, relations: { user: true } });

        return posts;
    }

}
