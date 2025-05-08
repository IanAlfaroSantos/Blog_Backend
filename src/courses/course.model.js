import { Schema, model } from "mongoose";

const CourseSchema = Schema({
    name: {
        type: String,
        required: [ true, "El nombre es requerido" ],
        unique: [ true, "El nombre ingresado ya existe en la base de datos" ],
        lowercase: true
    },
    description: {
        type: String,
        required: [ true, "La descripción es requerida" ]
    },
    estado: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
})

export default model("Course", CourseSchema);