import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { Request, Response } from 'express';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should say hello with query params', () => {
    const response = controller.sayHello('Rafly', 'Aziz');
    expect(response).toBe('Hello Rafly Aziz');
  });

  it('should get user by id 1', () => {
    expect(controller.getUser('1')).toBe(
      'User with ID: 1 is Rafly Aziz Abdillah',
    );
  });

  it('should get user by other id', () => {
    expect(controller.getUser('2')).toBe('User with ID: 2');
  });

  it('should require id', () => {
    expect(controller.getUser('')).toBe('ID is required');
  });

  it('should return post message', () => {
    expect(controller.post()).toBe('User created');
  });

  it('should return get message', () => {
    expect(controller.get()).toBe('User retrieved');
  });

  it('should return sample response', () => {
    expect(controller.getSampleResponse()).toEqual({
      message: 'Hello World',
      status: 'success',
    });
  });

  it('should return redirect response', () => {
    expect(controller.redirect()).toEqual({
      url: '/api/users/sample-response',
      statusCode: 301,
    });
  });

  it('should set cookie when name is provided', () => {
    const cookieFn = jest.fn();
    const statusFn = jest.fn().mockReturnThis();
    const sendFn = jest.fn();

    const mockResponse = {
      cookie: cookieFn,
      status: statusFn,
      send: sendFn,
    } as unknown as Response;

    controller.setCookie('Rafly', mockResponse);

    expect(cookieFn).toHaveBeenCalledWith('name', 'Rafly');
    expect(statusFn).toHaveBeenCalledWith(200);
    expect(sendFn).toHaveBeenCalledWith('Cookie set with name: Rafly');
  });

  it('should return 400 when name is not provided for setCookie', () => {
    const statusFn = jest.fn().mockReturnThis();
    const sendFn = jest.fn();

    const mockResponse = {
      status: statusFn,
      send: sendFn,
    } as unknown as Response;

    controller.setCookie('', mockResponse);

    expect(statusFn).toHaveBeenCalledWith(400);
    expect(sendFn).toHaveBeenCalledWith('Name is required');
  });

  it('should get cookies from request', () => {
    const mockRequest = {
      cookies: { name: 'Rafly' },
    } as unknown as Request;

    expect(controller.getCookies(mockRequest)).toBe('Cookies: "Rafly"');
  });

  it('should render view when name is provided', () => {
    const renderFn = jest.fn();
    const statusFn = jest.fn().mockReturnThis();
    const sendFn = jest.fn();

    const mockResponse = {
      render: renderFn,
      status: statusFn,
      send: sendFn,
    } as unknown as Response;

    controller.getHelloView('Rafly', mockResponse);

    expect(renderFn).toHaveBeenCalledWith('index.html', {
      title: 'Template Example',
      name: 'Rafly',
    });
  });

  it('should return 400 when name is not provided for getHelloView', () => {
    const statusFn = jest.fn().mockReturnThis();
    const sendFn = jest.fn();

    const mockResponse = {
      status: statusFn,
      send: sendFn,
    } as unknown as Response;

    controller.getHelloView('', mockResponse);

    expect(statusFn).toHaveBeenCalledWith(400);
    expect(sendFn).toHaveBeenCalledWith('Name is required');
  });
});
