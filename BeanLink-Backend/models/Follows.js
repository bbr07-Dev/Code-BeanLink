//Importamos mongoose
const { Schema, model } = require("mongoose");
//Importamos mongoose paginate
const mongoosePagination = require("mongoose-paginate-v2");
//Definición del esquema Follows
const FollowSchema = Schema ({

    user: {
        type: Schema.ObjectId,
        ref: "User"
    },
    followed: {
        type: Schema.ObjectId,
        ref: "User"
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});
//Aplicamos el plugin para la paginación
FollowSchema.plugin(mongoosePagination);
//Exportamos
module.exports = model("Follow", FollowSchema, "follows");