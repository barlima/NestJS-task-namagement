import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TaskRepository } from './task.repository';
import { GetTasksFilterDto } from './dto/get-tasks-filter-dto';
import { TaskStatus } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';

const mockUser = {
  id: 12,
  username: 'Test user'
};

const mockTaskRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
  delete: jest.fn(),
  save: jest.fn(),
});

describe('TasksService', () => {
  let tasksService;
  let taskRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TaskRepository, useFactory: mockTaskRepository }
      ],
    }).compile();

    tasksService = await module.get<TasksService>(TasksService);
    taskRepository = await module.get<TaskRepository>(TaskRepository);
  });

  describe('getTasks', () => {
    it('gets all tasks from the repository', async () => {
      taskRepository.getTasks.mockResolvedValue('somevalue');
      
      expect(taskRepository.getTasks).not.toHaveBeenCalled();
      
      const filters: GetTasksFilterDto = {
        status: TaskStatus.IN_PROGRESS,
        search: 'some search'
      }
      const result = await tasksService.getTasks(filters, mockUser);

      expect(taskRepository.getTasks).toHaveBeenCalled();
      expect(result).toEqual('somevalue');
    });
  });

  describe('getTaskById', () => {
    it('calls TaskRepository.findOne() and successfully retreive and return the task', async () => {
      const mockTask = { title: 'Test task', description: 'Test description'};
      taskRepository.findOne.mockResolvedValue(mockTask);

      const result = await tasksService.getTaskById(1, mockUser);

      expect(result).toEqual(mockTask);
      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: 1,
          userId: mockUser.id
        }
      });
    });

    it('throws an error when the task is not found', () => {
      taskRepository.findOne.mockResolvedValue(null);
      expect(tasksService.getTaskById(1, mockUser)).rejects.toThrow(NotFoundException);

    });
  });

  describe('createTask', () => {
    it('creates a new task', async () => {
      const mockTask: CreateTaskDto = { title: 'Test task', description: 'Test description'};

      taskRepository.createTask.mockResolvedValue({ ...mockTask, status: TaskStatus.OPEN, id: 1 });

      const result = await tasksService.createTask(mockTask, mockUser);

      expect(result).toEqual({ ...mockTask, id: 1, status: TaskStatus.OPEN });
      expect(taskRepository.createTask).toHaveBeenCalledWith(mockTask, mockUser);
    });
  });

  describe('deleteTask', () => {
    it('call taskRepository.deleteTask() to delete task', async () => {
      taskRepository.delete.mockResolvedValue({ affected: 1 });
      expect(taskRepository.delete).not.toHaveBeenCalled();
      await tasksService.deleteTask(1, mockUser);
      expect(taskRepository.delete).toHaveBeenCalledWith({ id: 1, userId: mockUser.id });
    });

    it('throws an error when the task cannot be found', () => {
      taskRepository.delete.mockResolvedValue({ affected: 0 });
      expect(tasksService.deleteTask(1, mockUser)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateTaskStatus', () => {
    it('call taskRepository.updateTaskStatus() to update task', async () => {
      const save = jest.fn().mockResolvedValue(true);

      tasksService.findTaskById = jest.fn().mockResolvedValue({
        status: TaskStatus.OPEN,
        save,
      });

      const mockTask = { id: 1, title: 'Test task', description: 'Test description'};

      expect(tasksService.findTaskById).not.toHaveBeenCalled();
      expect(save).not.toHaveBeenCalled();
      const result = await tasksService.updateTaskStatus(mockTask.id, TaskStatus.DONE, mockUser);
      expect(tasksService.findTaskById).toHaveBeenCalled();
      expect(save).toHaveBeenCalled();
      expect(result.status).toEqual(TaskStatus.DONE);
    });
  });
});
