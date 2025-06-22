import zod from "zod";

const validation = zod.object({
    email : zod.string().email({message : "El email tiene que ser un string"}),
        password : zod.string().min(8, {message : "El password tiene que ser un string y como minimo 8 caracteres"})
            .regex(/[A-Z]/, { message : "Debe contener al menos una mayúscula"})
            .regex(/[0-9]/, { message : "Debe contener al menos un número"})
            .regex(/[^A-Za-z0-9]/, { message : "Debe contener al menos un carácter especial"}),
})

export function validationLogin(data) {
    return validation.safeParse(data);
}