import dayjs from "dayjs";
import { Schema, model } from "mongoose";

const CommentSchema = Schema({
    text: {
        type: String,
        required: [true, "El contenido es requerido"]
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    publication: {
        type: Schema.Types.ObjectId,
        ref: "Publication",
        required: [true, "La publicación al que se realiza el comentario es requerido"]
    },
    Date: {
        type: String,
        default: () => dayjs().format("DD-MM-YYYY")
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