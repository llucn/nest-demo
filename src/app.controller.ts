import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/hello')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/')
  index(): string {
    return `<html>
    <head><title>Welcome</title></head>
    <body>
      <h1>Welcome to the AppController</h1>
      <p><a href="/hello">Say Hello</a></p>
      <p><a href="/upload">Go to Upload Page</a></p>
    </body>
    </html>
    `;
  }
}
