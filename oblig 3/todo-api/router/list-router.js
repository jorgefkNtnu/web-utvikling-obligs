import express from "express";
import { lists, tasks } from "../data/data.js";
const listRouter = express.Router();

listRouter.get("/", (request, response) => {
  response.json(lists);
});

listRouter.get("/:listId", (request, response) => {
  const id = request.params.listId;
  const list = lists.find((l) => l.listId == id);

  if (list) {
    response.json(list);
  } else {
    response.status(404).send(`List with id '${id}' not found.`);
  }
});

listRouter.post("/", (request, response) => {
  const list = request.body;

  if (!list.hasOwnProperty("listId") || !list.hasOwnProperty("title")) {
    return response
      .status(400)
      .send("A list needs the following properties: listId and title.");
  }

  if (lists.find((t) => t.listId == list.id)) {
    response
      .status(400)
      .send(`A task with id '${list.listId}' already exists.`);
  } else {
    lists.push(list);
    response.status(201);
    response.location("lists/" + list.id);
    response.send();
  }
});

listRouter.delete("/:listId", (request, response) => {
  const id = request.params.listId;
  const index = lists.findIndex((l) => l.listId == id);
  if (index != -1) {
    lists.splice(index, 1);
    tasks = tasks.filter((t) => t.listId !== id); // funker ikke på statisk data
    response.json({ lists, tasks });
  } else {
    response
      .status(404)
      .send(`Failed to delete list with id '${id}'. List not found.`);
  }
});

listRouter.get("/:listId/tasks", (request, response) => {
  const id = request.params.listId;
  const tasksInList = tasks.filter((t) => t.listId == id);

  if (tasksInList) {
    response.json(tasksInList);
  } else {
    response
      .status(404)
      .send(`Failed to get tasks with listId' ${id}'. Tasks not found.`);
  }
});

listRouter.get("/:listId/tasks/:taskId", (request, response) => {
  const listId = request.params.listId;
  const taskId = request.params.taskId;
  const taskInList = tasks.find((t) => t.listId == listId && t.id == taskId);

  if (taskInList) {
    response.json(taskInList);
  } else {
    response
      .status(404)
      .send(
        `Failed to get task with listId' ${listId}' and taskId '${taskId}'. Task not found.`
      );
  }
});

listRouter.post("/:listId/tasks", (request, response) => {
  const task = request.body;
  const listId = request.params.listId;

  if (!lists.find((l) => l.listId == listId))
    return response
      .status(400)
      .send(`List with listId '${listId}' does not exist`);

  if (
    !task.hasOwnProperty("id") ||
    !task.hasOwnProperty("title") ||
    !task.hasOwnProperty("done")
  ) {
    return response
      .status(400)
      .send("A task needs the following properties: id, title and done.");
  }

  if (tasks.find((t) => t.id == task.id)) {
    response.status(400).send(`A task with id '${task.id}' already exists.`);
  } else {
    task.listId = listId;
    tasks.push(task);
    response.status(201);
    response.location("tasks/" + task.id); // skjønne ikke 100%
    response.send(); // litt samme her
  }
});

listRouter.delete("/:listId/tasks/:taskId", (request, response) => {
  const taskId = request.params.taskId;
  const index = tasks.findIndex((t) => t.id == taskId);

  if (index != -1) {
    tasks.splice(index, 1);
    response.json(tasks);
  } else {
    response
      .status(404)
      .send(`Failed to delete task with id '${id}'. Task not found.`);
  }
});

export default listRouter;
