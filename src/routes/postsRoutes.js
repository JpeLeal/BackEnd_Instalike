import express from "express";
import multer from "multer";
import cors from "cors";
import { atualizarNovoPost, listarPosts, postarNovoPost, uploadImagem } from "../controllers/postsController.js";

const corsOptions = {
    origin: "http://localhost:8000",
    optionsSuccessStatus: 200
};

//Middlewhere Fuction do MULTER
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ dest: "./uploads" , storage});
//Linux ou no max pode ser sem a parte "storage" /\

// ROTAS CRIADADAS
const routes = (app) => {
    // Permite que o servidor interprete requisições .json
    app.use(express.json());
    app.use(cors(corsOptions));
    // Rota para buscar todos os posts
    app.get("/posts", listarPosts);
    // Rota para criar um post 
    app.post("/posts", postarNovoPost);
    // Rota para fazer o Upload
    app.post("/upload", upload.single("imagem"), uploadImagem) //imagem é a key do postman

    app.put("/upload/:id", atualizarNovoPost)
};

export default routes;