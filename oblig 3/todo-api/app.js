import express from "express";
import taskRouter from "./router/task-router.js";
import listRouter from "./router/list-router.js";

const app = express();
app.use(express.json());

const PORT = 3000;

app.use("/api/v1/tasks", taskRouter);
app.use("/api/v1/lists", listRouter);

app.listen(PORT, () => {
  console.info(`Server running on port ${PORT}`);
});
