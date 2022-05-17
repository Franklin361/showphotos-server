import { InputType, Field } from 'type-graphql';

@InputType()
export class UserInput {
    @Field()
    name: string = '';

    @Field()
    email: string = '';

    @Field(() => String, { nullable: true })
    password: string = '';
}

@InputType()
export class UserLoginInput {
    @Field()
    email: string = '';

    @Field(() => String, { nullable: true })
    password: string = '';
}
