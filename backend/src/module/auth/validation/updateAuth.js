import z from "zod";

const validateUpdateAuth = z.object({
    status: z.boolean({
        required_error: 'El campo status es obligatorio',
        invalid_type_error: 'El campo status debe ser booleano',
    }).default(true),

    firstName: z.string({ invalid_type_error: 'El nombre debe ser una cadena' }).optional(),
    lastName: z.string({ invalid_type_error: 'El apellido debe ser una cadena' }).optional(),
    maidenName: z.string({ invalid_type_error: 'El apellido de soltera debe ser una cadena' }).optional(),

    age: z.number({
        invalid_type_error: 'La edad debe ser un número',
    }).int('La edad debe ser un número entero')
        .nonnegative('La edad no puede ser negativa')
        .optional(),

    gender: z.string({ invalid_type_error: 'El género debe ser una cadena' }).optional(),

    email: z.string({
        required_error: 'El correo electrónico es obligatorio',
        invalid_type_error: 'Debe ser una cadena de texto',
    }).email('Debe ser un correo válido').optional(),

    phone: z.string({ invalid_type_error: 'El teléfono debe ser una cadena' }).optional(),

    user_name: z.string({
        required_error: 'El nombre de usuario es obligatorio',
        invalid_type_error: 'Debe ser una cadena de texto',
    }).optional(),

    password: z.string({
        required_error: 'La contraseña es obligatoria',
        invalid_type_error: 'Debe ser una cadena de texto',
    }).min(6, { message: 'Debe tener al menos 6 caracteres' }).optional(),

    birthDate: z.string({ invalid_type_error: 'La fecha de nacimiento debe ser una cadena' }).optional(),

    image: z.string({ invalid_type_error: 'La URL de imagen debe ser texto' })
        .url('La imagen debe tener un formato de URL válida')
        .optional(),

    bloodGroup: z.string({ invalid_type_error: 'Debe ser una cadena' }).optional(),

    height: z.number({ invalid_type_error: 'La altura debe ser un número' }).optional(),
    weight: z.number({ invalid_type_error: 'El peso debe ser un número' }).optional(),

    eyeColor: z.string({ invalid_type_error: 'El color de ojos debe ser una cadena' }).optional(),

    // Hair planos
    hair_color: z.string({ invalid_type_error: 'El color del cabello debe ser texto' }).optional(),
    hair_type: z.string({ invalid_type_error: 'El tipo de cabello debe ser texto' }).optional(),

    ip: z.string({ invalid_type_error: 'La IP debe ser una cadena de texto' }).optional(),

    // Address planos
    address_address: z.string({ invalid_type_error: 'La dirección debe ser una cadena' }).optional(),
    address_city: z.string({ invalid_type_error: 'La ciudad debe ser una cadena' }).optional(),
    address_state: z.string({ invalid_type_error: 'El estado debe ser una cadena' }).optional(),
    address_stateCode: z.string({ invalid_type_error: 'El código del estado debe ser una cadena' }).optional(),
    address_postalCode: z.string({ invalid_type_error: 'El código postal debe ser una cadena' }).optional(),
    address_coordinates_lat: z.number({ invalid_type_error: 'La latitud debe ser numérica' }).optional(),
    address_coordinates_lng: z.number({ invalid_type_error: 'La longitud debe ser numérica' }).optional(),
    address_country: z.string({ invalid_type_error: 'El país debe ser una cadena' }).optional(),

    macAddress: z.string({ invalid_type_error: 'La MAC Address debe ser una cadena' }).optional(),
    university: z.string({ invalid_type_error: 'La universidad debe ser una cadena' }).optional(),

    // Bank planos
    bank_cardExpire: z.string({ invalid_type_error: 'La fecha de expiración debe ser una cadena' }).optional(),
    bank_cardNumber: z.string({ invalid_type_error: 'El número de tarjeta debe ser una cadena' }).optional(),
    bank_cardType: z.string({ invalid_type_error: 'El tipo de tarjeta debe ser una cadena' }).optional(),
    bank_currency: z.string({ invalid_type_error: 'La moneda debe ser una cadena' }).optional(),
    bank_iban: z.string({ invalid_type_error: 'El IBAN debe ser una cadena' }).optional(),

    // Company planos
    company_department: z.string({ invalid_type_error: 'El departamento debe ser una cadena' }).optional(),
    company_name: z.string({ invalid_type_error: 'El nombre de la empresa debe ser una cadena' }).optional(),
    company_title: z.string({ invalid_type_error: 'El título del cargo debe ser una cadena' }).optional(),

    company_address_address: z.string({ invalid_type_error: 'La dirección debe ser una cadena' }).optional(),
    company_address_city: z.string({ invalid_type_error: 'La ciudad debe ser una cadena' }).optional(),
    company_address_state: z.string({ invalid_type_error: 'El estado debe ser una cadena' }).optional(),
    company_address_stateCode: z.string({ invalid_type_error: 'El código del estado debe ser una cadena' }).optional(),
    company_address_postalCode: z.string({ invalid_type_error: 'El código postal debe ser una cadena' }).optional(),
    company_address_coordinates_lat: z.number({ invalid_type_error: 'La latitud debe ser numérica' }).optional(),
    company_address_coordinates_lng: z.number({ invalid_type_error: 'La longitud debe ser numérica' }).optional(),
    company_address_country: z.string({ invalid_type_error: 'El país debe ser una cadena' }).optional(),

    ein: z.string({ invalid_type_error: 'El EIN debe ser una cadena' }).optional(),
    ssn: z.string({ invalid_type_error: 'El SSN debe ser una cadena' }).optional(),
    userAgent: z.string({ invalid_type_error: 'El userAgent debe ser una cadena' }).optional(),

    // Crypto planos
    crypto_coin: z.string({ invalid_type_error: 'La moneda debe ser una cadena' }).optional(),
    crypto_wallet: z.string({ invalid_type_error: 'La wallet debe ser una cadena' }).optional(),
    crypto_network: z.string({ invalid_type_error: 'La red debe ser una cadena' }).optional(),

}).partial().refine((data) => Object.keys(data).length > 0, {
    message: 'Al menos un campo debe ser actualizado',
});


export function updateValidation(data) {
  return validateUpdateAuth.safeParse(data);
}
