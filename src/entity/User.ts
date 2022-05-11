import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToMany } from 'typeorm';
import { Field, ObjectType } from "type-graphql";
import { Post, Comment, Favorite } from './';


@ObjectType()
@Entity("user")
export class User extends BaseEntity {

    @Field()
    @PrimaryGeneratedColumn()
    id!: number

    @Field(() => String)
    @Column()
    name!: string;

    @Field(() => String)
    @Column()
    email!: string;

    @Field(() => String,{ nullable: true })
    @Column({ nullable: true })
    password!: string;

    @Field(() => Post)
    @OneToMany(() => Post, post => post.user)
    posts!: Post;

    @Field(() => Comment, { nullable: true })
    @OneToMany(() => Comment, comment => comment.user)
    comments!: Comment;

    @Field(() => [Favorite], { nullable: true })
    @OneToMany(() => Favorite, fav => fav.user)
    fav!: [Favorite];
}


@ObjectType()
export class UserResponse {
    @Field(() => User)
    user!: User;

    @Field(() => String)
    token!: string;

    @Field(() => String)
    message!: string;

}

@ObjectType()
export class UserMessage {
    @Field(() => String)
    message!: string;
}


@ObjectType()
export class TokenResponse {
    @Field(() => User)
    user!: User;

    @Field(() => String)
    token!: string; 
}