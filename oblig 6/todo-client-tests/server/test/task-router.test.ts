import axios from 'axios';
import pool from '../src/mysql-pool';
import app from '../src/app';
import taskService, { Task } from '../src/task-service';

const testTasks: Task[] = [
  { id: 1, title: 'Les leksjon', done: false, description: 'lese' },
  { id: 2, title: 'Møt opp på forelesning', done: false, description: 'møte opp' },
  { id: 3, title: 'Gjør øving', done: false, description: 'gjøre' },
];

// Since API is not compatible with v1, API version is increased to v2
axios.defaults.baseURL = 'http://localhost:3001/api/v2';

let webServer: any;
beforeAll((done) => {
  // Use separate port for testing
  webServer = app.listen(3001, () => done());
});

beforeEach((done) => {
  // Delete all tasks, and reset id auto-increment start value
  pool.query('TRUNCATE TABLE Tasks', (error) => {
    if (error) return done(error);

    // Create testTasks sequentially in order to set correct id, and call done() when finished
    taskService
      .create(testTasks[0].title, testTasks[0].description)
      .then(() => taskService.create(testTasks[1].title, testTasks[1].description)) // Create testTask[1] after testTask[0] has been created
      .then(() => taskService.create(testTasks[2].title, testTasks[2].description)) // Create testTask[2] after testTask[1] has been created
      .then(() => done()); // Call done() after testTask[2] has been created
  });
});

// Stop web server and close connection to MySQL server
afterAll((done) => {
  if (!webServer) return done(new Error());
  webServer.close(() => pool.end(() => done()));
});

describe('Fetch tasks (GET)', () => {
  test('Fetch all tasks (200 OK)', (done) => {
    axios.get('/tasks').then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(testTasks);
      done();
    });
  });

  test('Fetch task (200 OK)', (done) => {
    axios.get('/tasks/1').then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(testTasks[0]);
      done();
    });
  });

  test('Fetch task (404 Not Found)', (done) => {
    axios
      .get('/tasks/4')
      .then((_response) => done(new Error()))
      .catch((error) => {
        expect(error.message).toEqual('Request failed with status code 404');
        done();
      });
  });
});

describe('Create new task (POST)', () => {
  test('Create new task (200 OK)', (done) => {
    axios.post('/tasks', { title: 'Ny oppgave' }).then((response) => {
      expect(response.status).toEqual(200);
      expect(response.data).toEqual({ id: 4 });
      done();
    });
  });

  test('Create new task with missing title (400 Bad Request)', (done) => {
    axios
      .post('/tasks', { description: 'Mangler tittel' })
      .then((_response) => done(new Error('Expected 400, but got 200')))
      .catch((error) => {
        expect(error.response.status).toEqual(400);
        done();
      });
  });
});

describe('Delete task (DELETE)', () => {
  test('Delete task (200 OK)', (done) => {
    axios.delete('/tasks/2').then((response) => {
      expect(response.status).toEqual(200);
      done();
    });
  });
});

describe('Update task (PUT)', () => {
  test('Update existing task (200 OK)', (done) => {
    const updatedTask = { title: 'Oppdatert leksjon', done: true, description: 'lese oppdatert' };
    axios.put('/tasks/1', updatedTask).then((response) => {
      expect(response.status).toEqual(204);
      done();
    });
  });
});

describe('Create new task (POST)', () => {
  
});
