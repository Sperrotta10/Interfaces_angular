
export function defineUser(sequelize, DataTypes) {
 
    const User = sequelize.define('User', {
        user_id : {
            type : DataTypes.INTEGER,
            autoIncrement : true,
            primaryKey : true,
        },
        role_id : {
            type : DataTypes.INTEGER,
            allowNull : false,
            references : {
                model : 'Role',
                key : 'role_id',
            }
        },
        user_name : {
            type : DataTypes.STRING,
            allowNull : false,
            unique : false,
        },
        email : {
            type : DataTypes.STRING,
            allowNull : false,
            unique : false
        },
        password : {
            type : DataTypes.STRING,
            allowNull : false,
        },
    }, {
        tableName : 'User',
        hooks: {
            afterCreate: (user, options) => {
                user.password = undefined;
                user.role_id = undefined;
            }
        },
        indexes: [
            {
                fields: ['user_name']
            },
            {
                fields: ['email']
            }
        ]

    })

    return User;
}