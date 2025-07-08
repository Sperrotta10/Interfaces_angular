import zod from "zod";

const validationFontFamily = zod.object({
    name_principal : zod.string().min(3, {message : "El nombre principal de la fuente es requerido"}).max(50, {message : "El nombre principal de la fuente no puede tener mas de 50 caracteres"}),
    url_principal: zod.string().min(1, {message : "La url principal de la fuente es requerida"}),
    name_secundary: zod.string().min(3, {message : "El nombre secundario de la fuente es requerido"}).max(50, {message : "El nombre secundario de la fuente no puede tener mas de 50 caracteres"}),
    url_secundary: zod.string().min(1, {message : "La url secundaria de la fuente es requerida"}),
})

const ValidationFont = zod.object({
    title : zod.number().nonnegative({message : "El tamaño de letra del titulo tiene que ser un numero positivo"}),
    sub_title: zod.number().nonnegative({message : "El tamaño de letra del subtitulo tiene que ser un numero positivo"}),
    paragraph: zod.number().nonnegative({message : "El tamaño de letra del parrafo tiene que ser un numero positivo"}),
    fontFamily : validationFontFamily,
})

export function createValidationFont(data) {
    return ValidationFont.safeParse(data);
}