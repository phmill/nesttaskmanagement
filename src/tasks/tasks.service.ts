import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import * as uuid from 'uuid/v1';
import { CreateTaskDto } from './dto/create.task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilters(filterDto: GetTaskFilterDto): Task[] {
    const { status, search } = filterDto;

    let filteredTasks: Task[] = this.getAllTasks();

    if (status) {
      filteredTasks = filteredTasks.filter(task => task.status === status);
    }

    if (search) {
      filteredTasks = filteredTasks.filter(
        task =>
          task.title.includes(search) || task.description.includes(search),
      );
    }

    return filteredTasks;
  }

  getTaskById(id: string): Task {
    const found = this.tasks.find(task => task.id === id);

    if (!found) {
      // console.log('found: ', found);

      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return found;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;

    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);

    return task;
  }

  deleteTask(id: string): Task {
    const taskToDelete = this.getTaskById(id);

    this.tasks = this.tasks.filter(task => task.id !== taskToDelete.id);

    return taskToDelete;
  }

  updateTaskStatus(id: string, status: TaskStatus): Task {
    const taskToUpdate = this.getTaskById(id);

    if (taskToUpdate) {
      taskToUpdate.status = status;
    }
    return taskToUpdate;
  }
}
