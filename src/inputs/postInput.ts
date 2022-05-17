import { InputType, Field } from 'type-graphql';

@InputType()
export class PostInput {
    @Field()
    description: string = '';

    @Field()
    url_image: string = '';
}

@InputType()
export class PutPostInput {
    @Field()
    id!: string;

    @Field({ nullable: true })
    description!: string;

    @Field({ nullable: true })
    url_image!: string;
}

@InputType()
export class LikeDislikePostInput {
    @Field()
    id!: string;

    @Field()
    likes!: boolean;

    @Field()
    dislike!: boolean;
}
