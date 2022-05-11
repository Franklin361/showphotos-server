import { Context } from "apollo-server-core";
import { Resolver, Mutation, Arg, Query, InputType, Field, Ctx } from "type-graphql";
import { ValidationError, UserInputError, AuthenticationError } from "apollo-server-express";
import { encryptPassword, comparePassword, createToken, isCorrectInputs } from "../utils";
import { TokenResponse, User, UserMessage, UserResponse } from "../entity";

export interface IContextServer {
    id_user_token: string;
}

@InputType()
class UserInput {
    @Field()
    name: string = '';

    @Field()
    email: string = '';

    @Field(() => String, { nullable: true })
    password: string = '';
}

@InputType()
class UserLoginInput {
    @Field()
    email: string = '';

    @Field(() => String, { nullable: true })
    password: string = '';
}

@Resolver()
export class UserResolver {
    @Mutation(() => UserResponse)
    async createUser(@Arg("variables", () => UserInput) variables: UserInput) {
        const value = isCorrectInputs(variables);
        if(value) throw new UserInputError(`El campo ${value} es obligatorio`);

        const { email, password, ...rest } = variables;

        const existEmail = await User.findOne({ where: { email } });

        if (existEmail) throw new ValidationError("El email ya esta registrado");

        const encryptedPass = await encryptPassword(password!);

        const user = await User.create({
            email,
            password: encryptedPass,
            ...rest,
        }).save();

        return {
            user,
            token: createToken(user.id),
            message: "Creación de usuario correcto",
        };
    }

    @Mutation(() => UserResponse)
    async login(@Arg("variables", () => UserLoginInput) variables: UserLoginInput) {
        const value = isCorrectInputs(variables);
        if(value) throw new UserInputError(`El campo ${value} es obligatorio`);
        
        const { password, email } = variables;

        const user = await User.findOne({ where: { email } });

        if (!user) throw new UserInputError("El usuario no existe");

        if (!password) throw new UserInputError("La contraseña es incorrecta");

        const isSamePass = await comparePassword(password, user.password!);
        if (!isSamePass) throw new UserInputError("La contraseña es incorrecta");

        return {
            user,
            token: createToken(user.id),
            message: "Inicio de sesión exitoso",
        };
    }

    @Mutation(() => UserMessage)
    async deleteUser(@Ctx() { id_user_token }: Context<IContextServer>) {
        if (!id_user_token) throw new AuthenticationError("Autenticación no valida (token)");
        
        try {
            await User.delete(+id_user_token);
            return {
                message: "Usuario eliminado correctamente",
            };
        } catch (error) {
            const { message } = error as Error;
            throw new ValidationError("No se logro eliminar el usuario, " + message);
        }
    }

    @Query(() => TokenResponse)
    async retoken(@Ctx() ctx: Context<IContextServer>) {
        const id = +ctx.id_user_token;
        if (!id) throw new AuthenticationError("vuelva a iniciar sesión por favor 😞");
        return {
            token: createToken(id),
            user: User.findOne({ where: { id } }),
        };
    }
}


