import { Context } from "apollo-server-core";
import { Resolver, Mutation, Arg, Query, Ctx } from "type-graphql";
import { ValidationError, UserInputError, AuthenticationError } from "apollo-server-express";
import { encryptPassword, comparePassword, createToken, isCorrectInputs } from "../utils";
import { TokenResponse, User, UserMessage, UserResponse } from "../entity";
import { UserInput, UserLoginInput } from '../inputs'
import { IContextServer } from '../interface'

@Resolver()
export class UserResolver {
    @Mutation(() => UserResponse)
    async createUser(@Arg("variables", () => UserInput) variables: UserInput) {
        const value = isCorrectInputs(variables);
        if(value) throw new UserInputError(`The field ${value} is required`);

        const { email, password, ...rest } = variables;

        const existEmail = await User.findOne({ where: { email } });

        if (existEmail) throw new ValidationError("The email address is already registered ๐ง");

        const encryptedPass = await encryptPassword(password!);

        const user = await User.create({
            email,
            password: encryptedPass,
            ...rest,
        }).save();

        return {
            user,
            token: createToken(user.id),
            message: "User created successfully โ",
        };
    }

    @Mutation(() => UserResponse)
    async login(@Arg("variables", () => UserLoginInput) variables: UserLoginInput) {
        const value = isCorrectInputs(variables);
        if(value) throw new UserInputError(`The field ${value} is required`);
        
        const { password, email } = variables;

        const user = await User.findOne({ where: { email } });

        if (!user) throw new UserInputError("User doesn't exist ๐คจ");

        if (!password) throw new UserInputError("The password is incorrect โ");

        const isSamePass = await comparePassword(password, user.password!);
        if (!isSamePass) throw new UserInputError("The password is incorrect โ");

        return {
            user,
            token: createToken(user.id),
            message: "Successful login โโ",
        };
    }

    @Mutation(() => UserMessage)
    async deleteUser(@Ctx() { id_user_token }: Context<IContextServer>) {
        if (!id_user_token) throw new AuthenticationError("Authentication not valid, please log in again. ๐คฏ");
        
        try {
            await User.delete(+id_user_token);
            return {
                message: "User deleted successfully โ ",
            };
        } catch (error) {
            const { message } = error as Error;
            throw new ValidationError("Failed to delete the user ๐, " + message);
        }
    }

    @Query(() => TokenResponse, { nullable: true })
    async retoken(@Ctx() ctx: Context<IContextServer>) {
        const id = +ctx.id_user_token;
        if (!id) return null
        return {
            token: createToken(id),
            user: User.findOne({ where: { id } }),
        };
    }
}


