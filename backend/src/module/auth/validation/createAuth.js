import zod from "zod";

const validation = zod.object({
    user_name : zod.string().min(3).max(30, {message : "El usuario tiene que ser un string entre 3 y 30 caracteres"})
        .regex(/^[a-zA-Z0-9_]+$/, { message : "Solo se permiten letras, números y guiones bajos"}),
    email : zod.string().email({message : "El email tiene que ser un string"}),
    password : zod.string().min(8, {message : "El password tiene que ser un string y como minimo 8 caracteres"})
        .regex(/[A-Z]/, { message : "Debe contener al menos una mayúscula"})
        .regex(/[0-9]/, { message : "Debe contener al menos un número"})
        .regex(/[^A-Za-z0-9]/, { message : "Debe contener al menos un carácter especial"}),
});

export function validationCreate(data) {
    return validation.safeParse(data);
}