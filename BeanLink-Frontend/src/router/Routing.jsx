import React from "react";
import { Routes, Route, BrowserRouter, Navigate, Link } from "react-router-dom";
import { PublicLayout } from "../components/public/PublicLayout";
import { Login } from "../components/user/Login";
import { Register } from "../components/user/Register";
import { Landing } from "../components/public/Landing";
import { ResetPassword } from "../components/user/ResetPassword";
import { PrivateLayout } from "../components/private/PrivateLayout";
import { Feed } from "../components/private/Feed";
import { AuthProvider } from "../context/authProvider";
import { Profile } from "../components/private/Profile";
import { Logout } from "../components/user/Logout";
import { Map } from "../components/private/utils/Map/Map";
import { Search } from "../components/private/utils/User/Search";
import { CoffeLog } from "../components/private/utils/CoffeLog/CoffeLog";
import { ForgotPassword } from "../components/user/ForgotPassword";
import { Privacity } from "../components/public/Privacity";

export const Routing = () => {
  return (
    <BrowserRouter>
    {/* Envolvemos todas las rutas dentro del provider para compartir el contexto  */}
      <AuthProvider>
        <Routes>
          {/* Aqui vamos a cargar o rutear la layout publica  */}
          <Route path="/" element={<PublicLayout />}>
            {/* Componentes Landing, login y register  */}
            <Route index element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/privacity-policy" element={<Privacity />} />
          </Route>
          {/* Aqui vamos a cargar la estructura privada  */}
          <Route path="/private" element={<PrivateLayout />}>
            {/* Componentes privados */}
            <Route index element={<Feed />} />
            <Route path="feed" element={<Feed />} />
            <Route path="profile" element={<Profile />} />
            <Route path="coffeelog" element={<CoffeLog />} />
            <Route path="logout" element={<Logout />} />
            <Route path="search" element={<Search />} />
            <Route path="map" element={<Map />} />

          </Route>
          {/* Ruta 404  */}
          <Route
            path="*"
            element={
              <>
                <h1>Error 404</h1>
                <Link to="/">Volver al Inicio</Link>
              </>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};
