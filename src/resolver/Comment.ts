import { Mutation, Resolver, InputType, Field, Arg, Ctx, Subscription, PubSub } from 'type-graphql';
import { CommentResponse } from '../entity';
import { Context } from 'apollo-server-core';
import { PubSubEngine } from "graphql-subscriptions";
import { AuthenticationError } from 'apollo-server-express';
import { User, Post, Comment } from '../entity';
import { trigger } from '../utils';

export interface IContextServer {
    id_user_token: string;
}

@InputType()
class CommentInput {
    @Field()
    description: string = '';
    
    @Field()
    id_post: string = '';
}

@Resolver()
export class CommentResolver {
    @Mutation(() => CommentResponse)
    async createComment(
        @Arg("variables", () => CommentInput) { description, id_post }: CommentInput,
        @Ctx() { id_user_token:id }: Context<IContextServer>,
        @PubSub() pubSub: PubSubEngine
    ) {
        if (!id) throw new AuthenticationError("Autenticación no valida, vuelva a iniciar sesión");
        
        const [ user, post ] = await Promise.all([ 
            User.findOne({ where: { id: +id } }),
            Post.findOne({ where: { id: +id_post } })
         ])

        if (!user) throw new AuthenticationError("User no exists");
        
        if (!post) throw new AuthenticationError("Post no exists");

        const newComment = await Comment.create({
            description,
            user,
            post 
        }).save();

        await pubSub.publish(trigger.COMMENT_ADDED, null);

        return {
            comment: newComment,
            message: "Comentario agregado correctamente",
        };

    }

    @Subscription(() => Post,{ topics: trigger.COMMENT_ADDED , nullable: true})
    async newCommentAdded(
         @Arg("id_post") id_post: string
    ): Promise<Post|null> {
        const post = await Post.findOne({ 
            where: { id: +id_post }, 
            relations:{ comments: { user: true }, user: true },
            order: { comments: { createdAt: 'DESC' } }
        });
        return post;
    }
}