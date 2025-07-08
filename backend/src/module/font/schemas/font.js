export function defineFont(sequelize, DataTypes) {

    const Font = sequelize.define('Font', {
        font_id : {
            type : DataTypes.INTEGER,
            autoIncrement : true,
            primaryKey : true,
        },
        title : {
            type : DataTypes.INTEGER,
            allowNull : false,
        },
        sub_title : {
            type : DataTypes.INTEGER,
            allowNull : false,
        },
        paragraph : {
            type : DataTypes.INTEGER,
            allowNull : false,
        },
        fontFamily_id : {
            type : DataTypes.INTEGER,
            allowNull : false,
            references: {
                model: 'FontFamily',
                key: 'fontFamily_id'
            },
        }

    }, {
        tableName : "Font",
    })

    return Font;
}