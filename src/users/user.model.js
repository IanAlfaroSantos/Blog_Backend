import { Schema, model } from "mongoose";

const UserSchema = Schema({
    name: {
        type: String,
        required: [ true, "El nombre es obligatorio" ],
    },
    surname: {
        type: String,
        required: [true, "El apellido es obligatorio"],
    },
    username: {
        type: String,
        unique: [ true, "El username ingresado ya existe en la base de datos" ],
        lowercase: true
    },
    email: {
        type: String,
        required: [true, "El email es obligatorio"],
        unique: [ true, "El email ingresado ya existe en la base de datos" ],
        lowercase: true
    },
    password: {
        type: String,
        required: [true, "La contraseña es obligatoria"]
    },
    phone: {
        type: String,
        required: [true, "El número de teléfono es obligatorio"]
    },
    role: {
        type: String,
        enum: ["ADMIN", "USER"],
        default: "USER"
    },
    estado: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
})

UserSchema.methods.toJSON = function () {
    const { __v, password, _id, ...user } = this.toObject();
    user.uid = _id;
    return user;
}

export default model('User', UserSchema);