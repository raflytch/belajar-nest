import {
  Controller,
  Get,
  Header,
  HttpCode,
  HttpRedirectResponse,
  Inject,
  Param,
  Post,
  Query,
  Redirect,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from './user.service';
import { Connection } from '../connection/connection';
import { MailService } from '../mail/mail.service';
import { UserRepository } from '../user-repository/user-repository';
import { MemberService } from '../member/member.service';

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

  @Get('/connection')
  async getConnection(): Promise<string> {
    const connectionName = this.connection.getName();
    this.userRepository.save();
    this.mailService.send();
    this.emailService.send();
    console.log(this.memberService.getConnectionName());
    this.memberService.sendEmail();
    return `Connection: ${connectionName}`;
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
