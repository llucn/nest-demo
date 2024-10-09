import { Controller, Get, Req, Redirect, Param, Body, Post } from "@nestjs/common";
import { Request } from "express";
import { CatsService } from './cats.service';
import { Cat } from "./interfaces/cat.interface";

type Message = {
  message: string,
};

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Get('test/redir')
  @Redirect('/', 302)
  testRedirect() {
    const url = '/hello';
    return { url };
  }

  @Get('test/:id')
  testId(@Param('id') id: string, @Req() request: Request): Message {
    console.log('id:', id);
    console.log('request params:', request.params);
    console.log('request query:', request.query);

    return {
      message: `Test ${id}`,
    };
  }

  @Get()
  findAll() {
    return this.catsService.findAll();
  }

  @Post()
  create(@Body() cat: Cat) {
    console.table(cat);
    this.catsService.create(cat);
  }
}