
//Importamos el modelo follow
const Follow = require("../models/Follows");
//Importamos el servicio de follows
const followService = require("../services/followers");

//Accion para seguir a un usuario, guardar un follow (relaciona dos tablas de la bd)
const follow = async (req, res) => {
    //Obtenemos los datos que nos llegan por el body (datos de usuario)
    const params = req.body;
    //Sacamos el id del usuario identificado
    const userLogged = req.user;
    //Creamos un objeto en el modelo follow
    let userToFollow = new Follow ({
        user: userLogged.id,
        followed: params.followed
    });
    try {
        //Comprobamos que el usuario no sigue ya al id que pasamos por parametro
        const followExists = await Follow.findOne({ user: userLogged.id , followed: params.followed });
        if(followExists){
            return res.status(200).send({
                status: "success",
                message: `El usuario ${userLogged.id} ya sigue a el usuario ${params.followed}`
            });
        }
        //Si no se siguen, hacemos que se sigan guardando el objeto en la bd
        const follow = await userToFollow.save();
        if(!follow){
            return res.status(404).send({
                status: "error",
                message: "Follow no guardado"
            });
        }
        //Si no entra en ningun if de los anteriores, devolvemos la respuesta
        return res.status(200).send({
            status: "success",
            identity: req.User,
            follow
        });
    } catch (e) {
        console.log(e);
        return res.status(400).send({
            status: "error",
            message: "No se ha podido seguir a ese usuario"
        })
    }
}

//Accion para dejar de seguir a un usuario
const unfollow = async (req, res) => {
    //Obtenemos el usuario al que queremos dejar de seguir
    const userFollowed = req.params.id;
    //Obtenemos el usuario identificado por token
    const userIdToken = req.user.id;
    try {
        //Borramos usuario de la base de datos
        const userDeleted = await Follow.deleteOne( { user: userIdToken, followed: userFollowed });
        if(userDeleted.deletedCount <= 0){
            return res.status(404).send({
                status: "error",
                message: "No se ha encontrado ese seguidor"
            });
        }
        //Si lo elimina correctamente devolvemos usuario eliminado
        return res.status(200).send({
            status: "success",
            message: "Unfollow completado",
            followed: userFollowed,
            user: userIdToken
        }) 

    } catch (e) {
        console.log(e);
        return res.status(500).send({
            status: "error",
            message: "No se ha podido dejar de seguir a ese usuario"
        })
    }

}

//Accion para listar los usuarios que el usuario loggeado sigue
const following = async (req, res) => {
    //Sacamos el id del usuario identificado por token
    let userLogged = req.user.id;
    //Comprobamos si nos llega el id por parametro en la url
    if (req.params.id) userLogged = req.params.id;
    //Comprobar si nos llega la page, por def = 1
    const page = req.params.page ? parseInt(req.params.page) : 1;
    //Cuantos usuarios por pagina mostramos
    const itemsPerPage = 6;
    //Configuramos las opciones de configuración de paginación 
    const options = {
        page: page,
        limit: itemsPerPage,
        populate: {
            path: "followed", //Hacemos que del ID nos saque los datos de usuario
            select: "-password -role -__v -email" //Retiramos para que no muestre estos datos
        },
        sort: { created_at: -1 } //Opcional, ordenar por fecha descendente        
    }
    try{
        //Realizamos la paginavión usando el plugin y la configuracion realizadas
        const result = await Follow.paginate({ user: userLogged }, options);
        if(!result.docs || result.docs.length === 0) {
            return res.status(404).send({
                status: "success",
                message: "No hay seguidores todavia",
                total: 0
            });
        }
        //Mostramos el resultado de los usuarios a los que sigue el usuario loggeado
        let followingUsersId = await followService.followUserIds(userLogged);
        return res.status(200).send({
            status: "success",
            message: "Listado de usuarios que sigues",
            follows: result.docs,
            total: result.totalDocs,
            pages: result.totalPages,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            users_folowing: followingUsersId.following
        })
        

    } catch (e) {
        console.log(e);
        return res.status(500).send({
            status: "error",
            message: "Error al obtener la lista de followers para ese usuario"
        })
    }
}

//Accion para listar los usuarios que siguen al usuario loggeado
const followers = async (req, res) => {
    //Sacamos el id del usuario identificado por token
    const userIdToken = req.user.id;
    //Comprobamos si nos llega el id por parametro en la url
    if (req.params.id) userLogged = req.params.id;
    //Comprobamos que el usuario identificado por token y por id es el mismo
    // if (userIdToken !== userLogged && req.user.role !== "admin") {
    //     return res.status(500).send({
    //         status: "error",
    //         message: "No tienes permisos para ver eso"
    //     });
    // }
    //Comprobamos si nos llega la pagina, por defecto pagina 1
    const page = req.params.page ? parseInt(req.params.page) : 1;
    //Cuantos usuarios por pagina mostramos
    const itemsPerPage = 2;
    //Configuramos las opciones de configuración de paginación
    const options = {
        page: page,
        limit: itemsPerPage,
        populate: {
            path: "user", //Hacemos que del ID nos saque los datos de usuario
            select: "-password -role -__v -email" //Retiramos para que no muestre estos datos
        },
        sort: { created_at: -1 } //Opcional, ordenar por fecha descendente
    }
    try {
        //Realizamos la paginavión usando el plugin y las opciones configuradas
        const result = await Follow.paginate({ followed: userLogged }, options);
        /*
         El resultado tiene la siguiente estructura:
         {
           docs: [ documentos de la página actual ],
           totalDocs: <número total>,
           limit: <items por página>,
           totalPages: <número total de páginas>,
           page: <página actual>,
           ...
        } 
        */
       if(!result.docs || result.docs.length === 0) {
        return res.status(404).send({
            status: "success",
            message: "No hay seguidores todavia",
            total: 0
        });
       }
        //Cuales de los usuarios que sigo, me siguen a mi tambien (listar todos y comprobar si nos seguimos mutuamente)
        let followUserIds = await followService.followUserIds(userLogged);
        return res.status(200).send({
            status: "success",
            message: "Lista de usuarios que me siguen",
            follows: result.docs,
            total: result.totalDocs,
            pages: result.totalPages, //Sacamos el numero de paginas necesarias
            users_follow_me: followUserIds.followers
        });
    } catch (e) {
        console.log(e);
        return res.status(500).send({
            status: "error",
            message: "Error al buscar los followers"
        })
    }
}

//Exportamos
module.exports = {
    follow,
    unfollow,
    following,
    followers
}
