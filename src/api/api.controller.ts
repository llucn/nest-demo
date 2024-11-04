import { Controller, Redirect, Post, Body } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { nestControllerContract, NestRequestShapes, NestResponseShapes, TsRest, TsRestRequest } from "@ts-rest/nest";
import { contract } from "src/contract/contract";

const c = nestControllerContract(contract);
type RequestShapes = NestRequestShapes<typeof c>;
type ResponseShapes = NestResponseShapes<typeof c>;

@Controller()
export class ApiController {
  constructor(private configService: ConfigService) { }

  @TsRest(c.login)
  @Redirect('/', 302)
  async login(@TsRestRequest() { query: { returnTo } }: RequestShapes['login']) {
    console.log('returnTo: ', returnTo);
    let url = returnTo || '/';
    if (url.indexOf('?') >= 0) {
      url += '&';
    } else {
      url += '?';
    }

    url += `token=${this.configService.get<string>('DEFAULT_ACCESS_TOKEN')}&refresh=${this.configService.get<string>('DEFAULT_REFRESH_TOKEN')}`;
    console.log('url: ', url);
    return { url };
  }

  @TsRest(c.info)
  async getInfo() {
    return {
      status: 200,
      body: {
        version: this.configService.get<string>('API_VERSION'),
        manifest: [],
      }
    };
  }

  @TsRest(c.getMe)
  async getMe() {
    return {
      status: 200,
      body: {
        id: 100,
        created_at: "Wed, 09 Oct 2024 08:42:21 GMT",
        updated_at: "Wed, 09 Oct 2024 08:42:21 GMT",
        active: true,
        client_id: 100,
        primary_email: "loremipsum@dolorsit.com",
        first_name: "Lorem",
        last_name: "Ipsum",
      }
    };
  }

  @TsRest(c.refreshToken)
  async refresh(
    @TsRestRequest() { body: { refresh_token } }: RequestShapes['refreshToken'],
  ): Promise<ResponseShapes['refreshToken']> {
    console.log('refresh token: ', refresh_token);
    const token = this.configService.get<string>('DEFAULT_ACCESS_TOKEN');
    const refresh = this.configService.get<string>('DEFAULT_REFRESH_TOKEN');
    return {
      status: 200,
      body: {
        token,
        refresh,
      }
    }
  }

  @TsRest(c.logout)
  async logout(
    @TsRestRequest() { body: { refresh_token } }: RequestShapes['logout'],
  ) {
    console.log('logout token: ', refresh_token);
    return {
      status: 200
    };
  }

  @TsRest(c.createSignedUrl)
  async signedUrl(
    @TsRestRequest() { body: { s3Object, options } }: RequestShapes['createSignedUrl'],
  ) {
    const s3Client = new S3Client();
    const url = await getSignedUrl(
      s3Client,
      new GetObjectCommand({
        Bucket: s3Object.bucket,
        Key: s3Object.key,
        ResponseContentDisposition: s3Object.contentDisposition || 'attachment'
      }),
      {
        expiresIn: options?.expiresIn || 1800,
      }
    );
    return {
      status: 200,
      body: {
        url: url
      }
    };
  }
}