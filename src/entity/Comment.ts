import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, CreateDateColumn } from 'typeorm';
import { Field, ObjectType } from "type-graphql";
import { User,Post } from './';

@ObjectType()
@Entity("comment")
export class Comment extends BaseEntity {

    @Field()
    @PrimaryGeneratedColumn()
    id!: number

    @Field(() => String)
    @Column()
    description!: string;

    @Field(() => String)
    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: string;

    @Field(() => User, { nullable: true })
    @ManyToOne(() => User, user => user.comments,{
        cascade: true,
        onDelete: 'CASCADE'
    })
    user!: User;

    @Field(() => Post, { nullable:true })
    @ManyToOne(() => Post, post => post.comments,{
        cascade: true,
        onDelete: 'CASCADE'
    })
    post!: Post;
}

@ObjectType()
export class CommentResponse {
    @Field(() => Comment)
    comment!: Comment;

    @Field(() => String)
    message!: string;
}
