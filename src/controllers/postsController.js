import { url } from "inspector";
import {getTodosPosts, criarPost, atualizarPost} from "../models/postsModel.js";
import fs from "fs";
import gerarDescricaoComGemini from "../services/geminiService.js";

//Função de listar Posts, todos
export async function listarPosts(req, res) {
    const posts = await getTodosPosts();
    res.status(200).json(posts);
};

//Função de novo post
export async function postarNovoPost(req, res) {
    const novoPost = req.body;
    try { //Criar novo post
        const postCriado = await criarPost(novoPost);
        res.status(200).json(postCriado);
    } catch(erro) { //Se der erro será armazenado nessa variável
        console.error(erro.message);
        res.status(500).json({"Erro":"Falha na requisição"})
    };
};

//Função para fazer o UPLOAD do post
export async function uploadImagem(req, res) {
    const novoPost = {
        descricao:"",
        imgUrl: req.file.originalname,
        alt:""
    };

    try { //Criar novo post
        const postCriado = await criarPost(novoPost);
        const imagemAtualizada = `uploads/${postCriado.insertedId}.png`;
        fs.renameSync(req.file.path, imagemAtualizada);
        res.status(200).json(postCriado);
    } catch(erro) { //Se der erro será armazenado nessa variável
        console.error(erro.message);
        res.status(500).json({"Erro":"Falha na requisição"})
    };
};

// Função para atualizar um novo post
export async function atualizarNovoPost(req, res) {
    const id = req.params.id;
    const urlImagem = `Http://localhost:3000/${id}.png`;
    try {
        const imgBuffer = fs.readFileSync(`uploads/${id}.png`);
        const descricao = await gerarDescricaoComGemini(imgBuffer);

        const post = {
            imgUrl: urlImagem,
            descricao: descricao,
            alt: req.body.alt
        };

        const postCriado = await atualizarPost(id, post);
        res.status(200).json(postCriado);
    } catch(erro) { //Se der erro será armazenado nessa variável
        console.error(erro.message);
        res.status(500).json({"Erro":"Falha na requisição"})
    };
};

