const express = require('express');
const cors = require('cors');
const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get('/repositories', (request, response) => {
  return response.send(repositories);
});

app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body;

  const repository = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repository);
  return response.json(repository);
});

app.put('/repositories/:id', (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  const repository = repositories.find(repository => repository.id === id);
  if (!repository) {
    return response.status(400).json({ error: 'Repository not found' });
  }
  repository.title = title;
  repository.url = url;
  repository.techs = techs;

  return response.json(repository);
});

app.delete('/repositories/:id', (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    repository => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'project not found' });
  }

  repositories.splice(repositoryIndex, 1);
  return response.status(204).send();
});

//  like em um repositório
app.post('/repositories/:id/like', (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.find(repository => repository.id === id);
  if (!repositoryIndex) {
    return response.status(400).json({ error: 'Repository not found' });
  }
  repositoryIndex.likes++;

  return response.json(repositoryIndex);
});

module.exports = app;
