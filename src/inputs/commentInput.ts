import { InputType, Field } from 'type-graphql';
@InputType()
export class CommentInput {
    @Field()
    description: string = '';
    
    @Field()
    id_post: string = '';
}