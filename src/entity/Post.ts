import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, CreateDateColumn, OneToMany } from 'typeorm';
import { Field, ObjectType } from "type-graphql";
import { User, Comment, Favorite } from './';

@ObjectType()
@Entity("post")
export class Post extends BaseEntity {

    @Field()
    @PrimaryGeneratedColumn()
    id!: number

    @Field(() => String)
    @Column()
    description!: string;

    @Field(() => String)
    @Column()
    url_image!: string;

    @Field(() => Number,{ defaultValue: 0 })
    @Column({ default: 0 })
    likes!: number;

    @Field(() => Number,{ defaultValue: 0 })
    @Column({ default: 0 })
    dislike!: number;

    @Field(() => String)
    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: string;
    

    @Field(() => User)
    @ManyToOne(() => User, user => user.posts, {
        cascade: true,
        onDelete: 'CASCADE'
    })
    user!: User;

    @Field(() => [Comment], { nullable: true })
    @OneToMany(() => Comment, comment => comment.post)
    comments!: [Comment];

    @Field(() => Favorite, { nullable: true })
    @OneToMany(() => Favorite, fav => fav.post)
    fav!: Favorite;
}

@ObjectType()
export class PostResponse {
    @Field(() => Post)
    post!: Post;

    @Field(() => String)
    message!: string;
}
