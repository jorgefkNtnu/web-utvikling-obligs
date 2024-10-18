import * as React from 'react';
import { TaskList, TaskNew, TaskDetails, TaskEdit } from '../src/task-components';
import { shallow } from 'enzyme';
import { Form, Button, Column } from '../src/widgets';
import { NavLink } from 'react-router-dom';

jest.mock('../src/task-service', () => {
  class TaskService {
    getAll() {
      return Promise.resolve([
        { id: 1, title: 'Les leksjon', description: 'lese', done: false },
        { id: 2, title: 'Møt opp på forelesning', description: 'møte opp', done: false },
        { id: 3, title: 'Gjør øving', description: 'gjøre', done: false },
      ]);
    }

    get() {
      return Promise.resolve({ id: 1, title: 'Les leksjon', description: 'lese', done: false });
    }

    create() {
      return Promise.resolve(4);
    }

    update() {
      return Promise.resolve();
    }

    delete() {
      return Promise.resolve();
    }
  }
  return new TaskService();
});

describe('Task component tests', () => {
  test('TaskList draws correctly', (done) => {
    const wrapper = shallow(<TaskList />);

    setTimeout(() => {
      expect(
        wrapper.containsAllMatchingElements([
          <NavLink to="/tasks/1">Les leksjon</NavLink>,
          <NavLink to="/tasks/2">Møt opp på forelesning</NavLink>,
          <NavLink to="/tasks/3">Gjør øving</NavLink>,
        ]),
      ).toEqual(true);
      done();
    });
  });

  test('TaskNew correctly sets location on create', (done) => {
    const wrapper = shallow(<TaskNew />);

    wrapper.find(Form.Input).simulate('change', { currentTarget: { value: 'Kaffepause' } });
    // @ts-ignore
    expect(wrapper.containsMatchingElement(<Form.Input value="Kaffepause" />)).toEqual(true);

    wrapper.find(Button.Success).simulate('click');

    setTimeout(() => {
      expect(location.hash).toEqual('#/tasks/4');
      done();
    });
  });

  test('Draws correctly', (done) => {
    const wrapper = shallow(<TaskDetails match={{ params: { id: 1 } }} />);

    setTimeout(() => {
      expect(
        wrapper.containsAllMatchingElements([
          <Column>Les leksjon</Column>,
          <Column>lese</Column>,
          // @ts-ignore
          <Form.Checkbox checked={false} />,
        ]),
      ).toEqual(true);
      done();
    });
  });

  test('TaskDetails draws correctly (using snapshot)', (done) => {
    const wrapper = shallow(<TaskDetails match={{ params: { id: 1 } }} />);

    setTimeout(() => {
      expect(wrapper).toMatchSnapshot();
      done();
    });
  });

  test('TaskEdit updates correctly', (done) => {
    const wrapper = shallow(<TaskEdit match={{ params: { id: 1 } }} />);

    setTimeout(() => {
      wrapper
        .find(Form.Input)
        .simulate('change', { currentTarget: { value: 'Oppdatert leksjon' } });
      expect(wrapper.find(Form.Input).prop('value')).toEqual('Oppdatert leksjon');

      wrapper.find(Button.Success).simulate('click');

      setTimeout(() => {
        expect(location.hash).toEqual('#/tasks/1');
        done();
      });
    });
  });

  test('TaskEdit delete task', (done) => {
    const wrapper = shallow(<TaskEdit match={{ params: { id: 1 } }} />);

    setTimeout(() => {
      wrapper.find(Button.Danger).simulate('click');

      setTimeout(() => {
        expect(location.hash).toEqual('#/tasks');
        done();
      });
    });
  });
});
