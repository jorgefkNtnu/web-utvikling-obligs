import express from 'express';
import { tasks } from '../data/data.js';
const taskRouter = express.Router();


taskRouter.get('/', (request, response) => {
    response.json(tasks);
});

taskRouter.get('/:id', (request, response) => {
    const id = request.params.id;
    const task = tasks.find(t => t.id == id);

    if (task) {
        response.json(task);
    } else {
        response.status(404).send(`Task with id '${id}' not found.`);
    }
});

taskRouter.post('/', (request, response) => {
    const task = request.body;

    if (!task.hasOwnProperty('id') ||
        !task.hasOwnProperty('title') || 
        !task.hasOwnProperty('done')) {
            return response.status(400).send('A task needs the following properties: id, title and done.');
    }

    if (tasks.find(t => t.id == task.id)) {
            response.status(400).send(`A task with id '${task.id}' already exists.`);
    } else {
        tasks.push(task);
      	response.status(201);
        response.location('tasks/' + task.id);
        response.send();
    }
});

taskRouter.delete('/:id', (request, response) => {
    const id = request.params.id;
    const index = tasks.findIndex(t => t.id == id); 
    if (index != -1) {
        tasks.splice(index, 1);
        response.json(tasks);
    } else {
        response.status(404).send(`Failed to delete task with id '${id}'. Task not found.`);
    }
});
 
export default taskRouter;