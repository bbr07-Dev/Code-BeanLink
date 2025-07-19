//Servicio para conocer la relación entre seguidores
const Follow = require("../models/Follows");

//Que usuarios seguimos y nos siguen (al usuario logeado que sera identituUserId)
const followUserIds = async (identityUserId) => {
  try {
    //Sacamos información de seguimiento
    let following = await Follow.find({ user: identityUserId }).select({
      followed: 1,
      _id: 0,
    }); //A quienes seguimos
    let followers = await Follow.find({ followed: identityUserId }).select({
      user: 1,
      _id: 0,
    }); //Quienes nos siguen
    //Procesar array de identificadores
    let followingClean = []; //Array con la gente que seguimos
    following.forEach((follow) => {
      followingClean.push(follow.followed);
    });
    let followersClean = []; //Array con la gente que nos sigue
    followers.forEach((follow) => {
      followersClean.push(follow.user);
    });
    //Devolvemos resultado
    return {
      following: followingClean,
      followers: followersClean,
    };
  } catch (e) {
    console.log(e);
    return {};
  }
};

//Comprobamos de manera individual si un usuario (profileUserId) sigue a otro (identityUserId) o no
const followThisUser = async (identityUserId, profileUserId) => {
  try {
    //Sacamos información de seguimiento
    let following = await Follow.find({ user: identityUserId }).select({
      followed: profileUserId
    }); //Le seguimos?
    let follower = await Follow.find({ followed: profileUserId }).select({
      followed: identityUserId
    }); //Nos sigue>
    //Devolvemos respuesta
    return{
        following,
        follower
    }
  } catch (e) {
    console.log(e);
    return {};
  }
};

//Exportamos
module.exports = {
    followUserIds,
    followThisUser
}
