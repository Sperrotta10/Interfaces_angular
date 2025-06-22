
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
        status : {
            type : DataTypes.BOOLEAN,
            allowNull : false,
            defaultValue : true,
        },
        firstName : {
            type : DataTypes.STRING,
            allowNull : true,
        },
        lastName : {
            type : DataTypes.STRING,
            allowNull : true,
        },
        maidenName : {
            type : DataTypes.STRING,
            allowNull : true,
        },
        age : {
            type : DataTypes.INTEGER,
            allowNull : true,
        },
        gender : {
            type : DataTypes.STRING,
            allowNull : true,
        },
        email : {
            type : DataTypes.STRING,
            allowNull : false,
            unique : false
        },
        phone : {
            type : DataTypes.STRING,
            allowNull : true,
            unique : false,
        },
        user_name : {
            type : DataTypes.STRING,
            allowNull : false,
            unique : false,
        },
        password : {
            type : DataTypes.STRING,
            allowNull : false,
        },
        birthDate : {
            type : DataTypes.STRING,
            allowNull : true,
        },
        image : {
            type : DataTypes.STRING,
            allowNull : true,
        },
        bloodGroup : {
            type : DataTypes.STRING,
            allowNull : true,
        },
        height : {
            type : DataTypes.FLOAT,
            allowNull : true,
        },
        weight : {
            type : DataTypes.FLOAT,
            allowNull : true,
        },
        eyeColor : {
            type : DataTypes.STRING,
            allowNull : true,
        },
        hair : {
            color : {
                type : DataTypes.STRING,
                allowNull : true,
            },
            type : {
                type : DataTypes.STRING,
                allowNull : true,
            }
        },
        ip : {
            type : DataTypes.STRING,
            allowNull : true,
        },
        address : {
            address : {
                type : DataTypes.STRING,
                allowNull : true,
            },
            city : {
                type : DataTypes.STRING,
                allowNull : true,
            },
            state : {
                type : DataTypes.STRING,
                allowNull : true,
            },
            stateCode : {
                type : DataTypes.STRING,
                allowNull : true,
            },
            postalCode : {
                type : DataTypes.STRING,
                allowNull : true,
            },
            coordinates : {
                lat : {
                    type : DataTypes.FLOAT,
                    allowNull : true,
                },
                lng : {
                    type : DataTypes.FLOAT,
                    allowNull : true,
                }
            },
            country : {
                type : DataTypes.STRING,
                allowNull : true,
            },
        },
        macAddress : {
            type : DataTypes.STRING,
            allowNull : true,
        },
        university : {
            type : DataTypes.STRING,
            allowNull : true,
        },
        bank : {
            cardExpire : {
                type : DataTypes.STRING,
                allowNull : true,
            },
            cardNumber : {
                type : DataTypes.STRING,
                allowNull : true,
            },
            cardType : {
                type : DataTypes.STRING,
                allowNull : true,
            },
            currency : {
                type : DataTypes.STRING,
                allowNull : true,
            },
            iban : {
                type : DataTypes.STRING,
                allowNull : true,
            },
        },
        company : {
            department : {
                type : DataTypes.STRING,
                allowNull : true,
            },
            name : {
                type : DataTypes.STRING,
                allowNull : true,
            },
            title : {
                type : DataTypes.STRING,
                allowNull : true,
            },
            address : {
                address : {
                    type : DataTypes.STRING,
                    allowNull : true,
                },
                city : {
                    type : DataTypes.STRING,
                    allowNull : true,
                },
                state : {
                    type : DataTypes.STRING,
                    allowNull : true,
                },
                stateCode : {
                    type : DataTypes.STRING,
                    allowNull : true,
                },
                postalCode : {
                    type : DataTypes.STRING,
                    allowNull : true,
                },
                coordinates : {
                    lat : {
                        type : DataTypes.FLOAT,
                        allowNull : true,
                    },
                    lng : {
                        type : DataTypes.FLOAT,
                        allowNull : true,
                    }
                },
                country : {
                    type : DataTypes.STRING,
                    allowNull : true,
                },
            }
        },
        ein : {
            type : DataTypes.STRING,
            allowNull : true,
        },
        ssn : {
            type : DataTypes.STRING,
            allowNull : true,
        },
        userAgent : {
            type : DataTypes.STRING,
            allowNull : true,
        },
        crypto : {
            coin : {
                type : DataTypes.STRING,
                allowNull : true,
            },
            wallet : {
                type : DataTypes.STRING,
                allowNull : true,
            },
            network : {
                type : DataTypes.STRING,
                allowNull : true,
            }
        }

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