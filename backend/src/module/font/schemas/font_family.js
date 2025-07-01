export function defineFontFamily(sequelize, DataTypes) {

    const FontFamily = sequelize.define('FontFamily', {
        fontFamily_id : {
            type : DataTypes.INTEGER,
            autoIncrement : true,
            primaryKey : true,
        },
        name_principal : {
            type : DataTypes.STRING,
            allowNull : false,
        },
        url_principal : {
            type : DataTypes.TEXT,
            allowNull : false,
        },
        name_secundary : {
            type : DataTypes.STRING,
            allowNull : false,
        },
        url_secundary : {
            type : DataTypes.TEXT,
            allowNull : false,
        },

    }, {
        tableName : "FontFamily",
    })

    return FontFamily;
}