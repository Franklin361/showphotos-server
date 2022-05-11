import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne } from 'typeorm';
import { Field, ObjectType } from "type-graphql";
import { User,Post } from './';

@ObjectType()
@Entity("favorite")
export class Favorite extends BaseEntity {

    @Field()
    @PrimaryGeneratedColumn()
    id!: number

    @Field(() => String, { nullable: true })
    @Column()
    type!: boolean;

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