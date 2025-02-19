import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/api/v2';

export type Task = {
  id: number;
  title: string;
  done: boolean;
  description: string;
};

class TaskService {
  /**
   * Get task with given id.
   */
  get(id: number) {
    return axios.get<Task>('/tasks/' + id).then((response) => response.data);
  }

  /**
   * Get all tasks.
   */
  getAll() {
    return axios.get<Task[]>('/tasks').then((response) => response.data);
  }

  /**
   * Create new task having the given title.
   *
   * Resolves the newly created task id.
   */
  create(title: string, description: string) {
    return axios
      .post<{ id: number }>('/tasks', { title: title, description: description })
      .then((response) => response.data.id);
  }

  async update(id: number, task: Task) {
    try {
      await axios.put('/tasks/' + id, task);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  }

  async delete(id: number) {
    try {
      await axios.delete('/tasks/' + id);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }
}

const taskService = new TaskService();
export default taskService;
