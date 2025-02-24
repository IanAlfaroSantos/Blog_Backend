import { Schema, model } from "mongoose";

const CommentSchema = Schema({
    text: {
        type: String,
        required: [true, "El comentario es obligatorio"]
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "El usuario que realiza el comentario es obligatorio"]
    },
    publication: {
        type: Schema.Types.ObjectId,
        ref: "Publication",
        required: [true, "La publicación al que se realiza el comentario es obligatoria"]
    },
    estado: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
})

export default model("Comment", CommentSchema);