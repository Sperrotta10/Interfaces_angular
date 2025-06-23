import { error } from "zod/v4/locales/ar.js";
import { ModelFont } from "../model/font.js";
import { createValidationFont } from "../validation/create.js";
import { updateValidationFont } from "../validation/updateFont.js";
import { updateValidationFontFamily } from "../validation/updateFontFamily.js";

export class ControllerFont {

    static async getAllFont(req, res) {

        try {

            const font = await ModelFont.getAllFont();

            return res.status(200).json({message : font.message, data : font.data});

        } catch (error) {
            return res.status(500).json({message : "Error interno del servidor", error : error.message});
        }
    }

    static async getIdFont(req, res) {
        
        const { font_id } = req.params; 

        try {

            const font = await ModelFont.getIdFont(font_id);

            if( font.status === 404) {
                return res.status(font.status).json({message : font.message});
            }

            return res.status(200).json({message : font.message, data : font.data});

        } catch (error) {
            return res.status(500).json({message : "Error interno del servidor", error : error.message});
        }
    }

    static async createFont(req, res) {
        
        const result = createValidationFont(req.body);

        if(!result.success) return res.status(400).json({message : "Error en la validacion de los datos", error : result.error.errors});

        try {

            const font = await ModelFont.createFont(result.data);

            return res.status(201).json({message : font.message, data : font.data});

        } catch (error) {
            return res.status(500).json({message : "Error interno del servidor", error : error.message});
        }
    }


    static async updateFont(req, res) {
        
        const result = updateValidationFont(req.body);
        const { font_id } = req.params;

        if(!result.success) return res.status(400).json({message : "Error en la validacion de los datos", error : result.error.errors});


        try {

            const font = await ModelFont.updateFont(font_id, result.data);

            if (font.status === 404) {
                return res.status(font.status).json({message : font.message});
            }

            return res.status(204).json({message : font.message});

        } catch (error) {
            return res.status(500).json({message : "Error interno del servidor", error : error.message});
        }
    }

    static async updateFontFamily(req, res) {
        
        const result = updateValidationFontFamily(req.body);
        const { fontFamily_id } = req.params;

        if(!result.success) return res.status(400).json({message : "Error en la validacion de los datos", error : result.error.errors});

        try {

            const fontFamily = await ModelFont.updateFontFamily(fontFamily_id, result.data);

            if(fontFamily.status === 404) {
                return res.status(fontFamily.status).json({message : fontFamily.message});
            }

            return res.status(204).json({message : fontFamily.message});

        } catch (error) {
            return res.status(500).json({message : "Error interno del servidor", error : error.message});
        }
    }

    static async deleteFontFamily(req, res) {
        
        const { fontFamily_id } = req.params;

        try {

            const fontFamily = await ModelFont.deleteFontFamily(fontFamily_id);

            if (fontFamily.status === 404) {
                return res.status(fontFamily.status).json({message : fontFamily.message});
            }

            return res.status(204).json({message : fontFamily.message});

        } catch (error) {
            return res.status(500).json({message : "Error interno del servidor", error : error.message});
        }
    }
}