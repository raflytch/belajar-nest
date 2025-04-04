/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/require-await */
import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpException,
  HttpRedirectResponse,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Redirect,
  Req,
  Res,
  UseFilters,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from './user.service';
import { Connection } from '../connection/connection';
import { MailService } from '../mail/mail.service';
import { UserRepository } from '../user-repository/user-repository';
import { MemberService } from '../member/member.service';
import { ValidationFilter } from 'src/validation/validation.filter';
import {
  LoginUserRequest,
  loginUserRequestValidation,
} from 'src/model/login.model';
import { ValidationPipe } from 'src/validation/validation.pipe';
import { TimeInterceptor } from 'src/time/time.interceptor';
import { Auth } from 'src/auth/auth.decorator';
import { User } from '@prisma/client';

interface UserResponse<T> {
  status: string;
  message: string;
  data?: T;
  error?: string;
}

@Controller('/api/users')
export class UserController {
  // rekomendasi pake constructor
  constructor(
    private userService: UserService,
    private connection: Connection,
    private mailService: MailService,
    private userRepository: UserRepository,
    @Inject('Email Service') private emailService: MailService,
    private memberService: MemberService,
  ) {}
  // @Inject()
  // @Optional()
  // private userService: UserService;

  @Get('/current')
  getCurrentUser(@Auth() user: User): Record<string, any> {
    return {
      status: 'success',
      message: 'User retrieved successfully',
      data: {
        id: user.id,
        name: user.first_name,
        email: user.last_name,
      },
    };
  }

  @UseFilters(ValidationFilter)
  @Post('/login')
  @UsePipes(new ValidationPipe(loginUserRequestValidation))
  @Header('Content-Type', 'application/json')
  @UseInterceptors(TimeInterceptor)
  login(
    @Query('name') name: string,
    @Body()
    request: LoginUserRequest,
  ) {
    return {
      status: 'success',
      message: 'User logged in successfully',
      data: {
        name,
        email: request.username,
        password: request.password,
      },
    };
  }

  @Get('/connection')
  async getConnection(): Promise<string> {
    const connectionName = this.connection.getName();
    this.mailService.send();
    this.emailService.send();
    console.log(this.memberService.getConnectionName());
    this.memberService.sendEmail();
    return `Connection: ${connectionName}`;
  }

  @Post('/create-user')
  async createUser(
    @Body() body: { firstName: string; lastName?: string },
  ): Promise<UserResponse<{ firstName: string; lastName?: string }>> {
    try {
      if (!body.firstName) {
        throw new HttpException(
          {
            status: 'error',
            message: 'First name is required',
          },
          400,
        );
      }

      if (body.firstName.length < 3) {
        throw new HttpException(
          {
            status: 'error',
            message: 'First name must be at least 3 characters long',
          },
          400,
        );
      }

      await this.userRepository.save(body.firstName, body.lastName);
      return {
        status: 'success',
        message: 'User created successfully',
        data: {
          firstName: body.firstName,
          lastName: body.lastName,
        },
      };
    } catch (error: any) {
      throw new HttpException(
        {
          status: 'error',
          message: error.message,
        },
        error.status || 500,
      );
    }
  }
  @Get('/hello')
  sayHello(@Query('name') name: string): string {
    return this.userService.sayHello(name);
  }

  @Get('/view/hello')
  getHelloView(@Query('name') name: string, @Res() response: Response) {
    if (!name) {
      return response.status(400).send('Name is required');
    }

    response.render('index.html', {
      title: 'Template Example',
      name: name,
    });
  }
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

  @Get('/:id')
  getUser(@Param('id', ParseIntPipe) id: string): string {
    if (isNaN(Number(id))) {
      throw new HttpException('Invalid ID', 400);
    }

    if (id === '0') {
      throw new HttpException('User not found', 404);
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
