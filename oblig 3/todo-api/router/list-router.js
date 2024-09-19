import express from "express";
import { lists } from "../data/data.js";
const listRouter = express.Router();

listRouter.get("/:id", (request, response) => {
  const id = request.params.id;
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

export default listRouter;
