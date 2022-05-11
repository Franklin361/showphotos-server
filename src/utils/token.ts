import { Request } from 'express';
import jwt from 'jsonwebtoken'

export const createToken = (id: string | number) => {

    return jwt.sign({ id }, process.env.SECRET_SEED!, {
        expiresIn: '10h'
    })
}

export const getDecodedToken = (req: Request) => {
    try {
        const token = req.headers.authorization ?? null as string | null;

        let id = null;

        if (token !== null) {
            const decodedToken = jwt.verify(token, process.env.SECRET_SEED!) as { id: string };
            id = decodedToken.id
        }
        return id
    } catch (error) {
        return null
    }
}
