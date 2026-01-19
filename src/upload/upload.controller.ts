import {
  Controller,
  Get,
  Post,
  Req,
  Body,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { S3Client } from '@aws-sdk/client-s3';
import {
  createPresignedPost,
  PresignedPostOptions,
} from '@aws-sdk/s3-presigned-post';

@Controller('upload')
export class UploadController {
  @Get('')
  index(): string {
    return `<html>
    <head><title>Upload</title></head>
    <body>
      <h1>Upload file(s)</h1>
      <form action="/upload/full" method="POST" enctype="multipart/form-data">
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

  @Post('full')
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

  @Post('simple')
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

  @Post('policy')
  async createPolicy(
    @Body()
    {
      bucket,
      path,
      filename,
      success_action_status,
      success_action_redirect,
    }: {
      bucket: string;
      path: string;
      filename: string;
      success_action_status: string;
      success_action_redirect?: string;
    },
  ) {
    console.log(
      'Create policy input:',
      bucket,
      '/',
      path,
      '/',
      filename,
      success_action_status,
      success_action_redirect,
    );
    const expiresIn = 3600;

    const fields = {
      success_action_status,
    } as Record<string, string>;

    if (success_action_redirect) {
      fields['success_action_redirect'] = success_action_redirect;
    }

    // Remove last slash if any
    const normalizedPath = path.endsWith('/') ? path.slice(0, -1) : path;

    const client = new S3Client({});
    const options: PresignedPostOptions = {
      Expires: expiresIn,
      Bucket: bucket,
      Conditions: [
        ['starts-with', '$key', `${normalizedPath}/`],
        ['content-length-range', 17, 104857600],
        ['starts-with', '$Content-Type', ''],
      ],
      Fields: fields,
      Key: `${normalizedPath}/${filename}`,
    };
    console.log('PresignedPostOptions:', options);

    try {
      const policy = await createPresignedPost(client, options);
      console.log('Policy:', policy);
      return policy;
    } catch (caught: any) {
      console.error(`${caught.name}: ${caught.message}`);
      throw caught;
    }
  }
}
