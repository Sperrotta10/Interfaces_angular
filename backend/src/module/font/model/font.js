import { sequelize } from "../../../config/dataBase.js";
import { Font, FontFamily } from "../../../models/tables.js";

export class ModelFont {

    static async getAllFont() {

        try {

            const font = await Font.findAll({
                include : {
                    model : FontFamily,
                    as : 'fontFamily'
                }
            });

            return {message : "Fuentes obtenidas", data : font};
            
        } catch (error) {
            console.error("Error al obtener las fuentes");
            throw error;
        }
    
    }
    
    static async getIdFont(font_id) {
        
        try {

            const font = await Font.findByPk(font_id,{
                include : {
                    model : FontFamily,
                    as : 'fontFamily'
                }
            });

            if(font) {
                return {message : "fuente obtenida", data : font};
            } else {
                return {message : "La fuente no existe", data : font, status : 404};
            }
            
        } catch (error) {
            console.error("Error al obtener la fuente");
            throw error;
        }
    }

    static async createFont(data) {

        const t = await sequelize.transaction();

        try {

            const fontFamily = await FontFamily.create(data.fontFamily, { transaction: t });

            const newFont = {
                title : data.title, 
                sub_title : data.sub_title, 
                paragraph : data.paragraph, 
                fontFamily_id : fontFamily.fontFamily_id};

            const font = await Font.create(newFont, { transaction: t });
            
            await t.commit();

            return { message : "Fuente creada", data : {font, fontFamily}};

        } catch (error) {

            t.rollback();
            console.error("Error al crear la fuente", error);
            throw error;
        }
        
    }


    static async updateFont(font_id, data) {
        
        try {

            const exist = await Font.findByPk(font_id);
            if(!exist) return {message : "Fuente no encontrado", status : 404}

            await Font.update(data,{where : {font_id : font_id}});

            return {message : "fuente actualizada"}

        } catch (error) {
            console.error("Error al actualizar la fuente");
            throw error;
        }
    }

    static async updateFontFamily(fontFamily_id, data) {
        
        try {

            const exist = await FontFamily.findByPk(fontFamily_id);
            if(!exist) return {message : "Fuente-family no encontrado", status : 404}

            const fontFamily = await FontFamily.update(data,{where : {fontFamily_id : fontFamily_id}});

            if (fontFamily) {
                return { message: "Fuente actualizada" };
            } else {
                return { message: "No se realizaron cambios" };
            }

        } catch (error) {
            console.error("Error al actualizar la Fuente-family");
            throw error;
        }
    }

    static async deleteFontFamily(fontFamily_id) {
        
        try {

            const exist = await FontFamily.findByPk(fontFamily_id);
            if(!exist) return {message : "Fuente-family no encontrado", status : 404}

            await FontFamily.destroy({where : {fontFamily_id : fontFamily_id}});

            return {message : "Fuente eliminada"}

        } catch (error) {
            console.error("Error al eliminar la Fuente");
            throw error;
        }
    }
}