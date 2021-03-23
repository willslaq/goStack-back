const { request } = require('express');
const express = require('express');
const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(express.json());

/**
 * Métodos HTTP:
 * 
 * GET: Buscar informações do back-end
 * POST: Criar uma informação do back-end
 * PUT/PATCH: Alterar uma informação no back-end
 * DELETE: Deletar uma informação no back-end
 */

/**
 * Tipos de Parâmetros:
 * 
 * Query Params: Filtros e paginação. Ex: ?title=React&owner=Diego
 * Route Params: Identificar Recursos (Atualizar / Deletar)
 * Request Body: Conteúdo na hora de criar ou editar um recurso (JSON)
 */

/**
 * Middleware:
 * 
 * Interceptador de Requisições que pode interromper totalmente a requisição
 * ou alterar dados da mesma.
 */

const projects = [];

function logRequests(req, res, next) {
    const { method, url } = req;

    const logLabel = `[${method.toUpperCase()}] ${url}`;

    console.time(logLabel);

    next();

    console.timeEnd(logLabel);
}

function validateProjectId(req, res, next) {
    const { _id } = req.params;

    if (!isUuid(_id)) {
        return res.status(400).json({ error: 'Invalid project ID.' })
    }

    return next();
}

app.use(logRequests);
// app.use('/projects/:id', validateProjectId);

app.get('/projects', (req, res) => {

    const { title, owner } = req.query;

    const results = title
        ? projects.filter(project => project.title.includes(title))
        : projects;

    return res.json(results);
});

app.post('/projects', (req, res) => {
    const { title, owner } = req.body;

    const project = { _id: uuid(), title, owner };

    projects.push(project);

    return res.json({
        resposta: `cadastrado com sucesso`,
        data: { project }
    })
})

app.put('/projects/:_id', validateProjectId, (req, res) => {
    const { _id } = req.params;
    const { title, owner } = req.body;

    const projectIndex = projects.findIndex(project => project._id === _id)

    if (projectIndex < 0) {
        return res.status(400).json({ error: 'Project not found.' })
    }

    const project = {
        _id,
        title,
        owner,
    };

    projects[projectIndex] = project;


    return res.json({
        resposta: `alterado com sucesso`,
        data: { project }
    })
})

app.delete('/projects/:_id', validateProjectId, (req, res) => {
    const { _id } = req.params;

    const projectIndex = projects.findIndex(project => project._id === _id);

    if (projectIndex < 0) {
        return res.status(400).json({ error: 'Project not found' })
    }

    projects.splice(projectIndex, 1);

    return res.status(204).send();
})

app.listen(3333, () => {
    console.log('🚀 Back-end started!')
});