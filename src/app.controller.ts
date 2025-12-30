import {
  Controller,
  Get,
  Req,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
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
      <h1>Welcome</h1>
      <form action="/upload" method="POST" enctype="multipart/form-data">
        <div>
          <label for="username1">Username:</label>
          <input type="text" id="username1" name="usernames">
          <label for="file1">Choose files:</label>
          <input type="file" id="file1" name="files">
        </div>
        <div>
          <label for="username2">Username:</label>
          <input type="text" id="username2" name="usernames">
          <label for="file2">Choose files:</label>
          <input type="file" id="file2" name="files">
        </div>
        <button type="submit">Upload</button>
      </form>
    </body>
    </html>
    `;
  }

  @Post('/upload')
  @UseInterceptors(AnyFilesInterceptor())
  uploadFiles(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() request: Request,
  ) {
    console.log({
      usernames: request.body.usernames,
      files,
    });
    return {
      usernames: request.body.usernames,
      files: files.map((file) => ({
        filename: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
      })),
    };
  }

  @Post('/upload-simple')
  @UseInterceptors(AnyFilesInterceptor())
  uploadFilesSimple(@UploadedFiles() files: Array<Express.Multer.File>) {
    console.log(files);
    return files.map((file) => {
      return {
        filename: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
      };
    });
  }
}
