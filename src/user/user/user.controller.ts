import {
  Controller,
  Get,
  Header,
  HttpCode,
  HttpRedirectResponse,
  Param,
  Post,
  Query,
  Redirect,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('/api/users')
export class UserController {
  @Get('/set-cookie')
  setCookie(@Query('name') name: string, @Res() response: Response) {
    if (!name) {
      return response.status(400).send('Name is required');
    }

    response.cookie('name', name);
    return response.status(200).send(`Cookie set with name: ${name}`);
  }

  @Get('/get-cookies')
  getCookies(@Req() request: Request): string {
    const cookies = request.cookies['name'] as string;
    return `Cookies: ${JSON.stringify(cookies)}`;
  }

  @Get('/sample-response')
  @Header('Content-Type', 'application/json')
  @HttpCode(200)
  getSampleResponse(): Record<string, string> {
    return {
      message: 'Hello World',
      status: 'success',
    };
  }

  @Get('/redirect')
  @Redirect()
  redirect(): HttpRedirectResponse {
    return {
      url: '/api/users/sample-response',
      statusCode: 301,
    };
  }

  @Get('/hello')
  sayHello(
    @Query('first_name') firstName: string,
    @Query('last_name') lastName: string,
  ): string {
    return `Hello ${firstName} ${lastName}`;
  }

  @Get('/:id')
  getUser(@Param('id') id: string) {
    if (!id) {
      return 'ID is required';
    }

    if (id === '1') {
      return 'User with ID: 1 is Rafly Aziz Abdillah';
    }

    return `User with ID: ${id}`;
  }

  @Post()
  post() {
    return 'User created';
  }

  @Get('/sample')
  get() {
    return 'User retrieved';
  }
}
