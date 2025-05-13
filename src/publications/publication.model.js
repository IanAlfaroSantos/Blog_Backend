import dayjs from "dayjs";
import { Schema, model } from "mongoose";

const PublicationSchema = Schema({
    title: {
        type: String,
        required: [true, "El título de la publicación es obligatorio"],
        trim: true
    },
    content: {
        type: String,
        required: [true, "El contenido de la publicación es obligatorio"],
        trim: true
    },
    DateAndTime: {
        type: String,
        default: () => dayjs().format("DD-MM-YYYY HH:mm:ss")
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "El usuario de la publicacion es obligatorio"]
    },
    course: {
        type: Schema.Types.ObjectId,
        ref: "Course",
        required: [true, "El curso de la publicacion es obligatorio"]
    },
    comment: [{
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }],
    image: {
        type: String,
        default: null
    },
    estado: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
});

export default model("Publication", PublicationSchema);