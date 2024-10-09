import { Body, Controller, Get, Post, Query, Redirect } from "@nestjs/common";

const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJsbHUiLCJuYW1lIjoiTGFuZSBMdSIsImlhdCI6MTUxNjIzOTAyMn0.C7QX82fv-7HhUnJx_OFChP8u5nSbyROiBzycF13y_Qc';
const REFRESH_TOKEN = 'b613679a0814d9ec772f95d778c35fc5ff1697c493715653c6c712144292c5ad';
const API_VERSION = '1';

@Controller('api')
export class ApiController {
  
  @Get('1/auth/login')
  @Redirect('/', 302)
  login(@Query('returnTo') returnTo: string) {
    console.log('returnTo: ', returnTo);
    let url = returnTo || '/';
    if (url.indexOf('?') >= 0) {
      url += '&';
    } else {
      url += '?';
    }

    url += `token=${ACCESS_TOKEN}&refresh=${REFRESH_TOKEN}`;
    console.log('url: ', url);
    return { url };
  }

  @Get('info')
  info() {
    return {
      version: API_VERSION,
      manifest: [],
    };
  }

  @Get('auth/me')
  me() {
    return {
      id: 100,
      created_at: "Wed, 09 Oct 2024 08:42:21 GMT",
      updated_at: "Wed, 09 Oct 2024 08:42:21 GMT",
      active: true,
      client_id: 100,
      primary_email: "loremipsum@dolorsit.com",
      first_name: "Lorem",
      last_name: "Ipsum",
    };
  }

  @Post('1/auth/refresh')
  refresh(@Body() { refresh_token }: { refresh_token: string }) {
    console.log('refresh token: ', refresh_token);
    const token = ACCESS_TOKEN;
    const refresh = REFRESH_TOKEN;
    return {
      token,
      refresh,
    }
  }

  @Post('auth/logout')
  logout(@Body() { refresh_token }: { refresh_token: string }) {
    console.log('logout token: ', refresh_token);
    return {};
  }
}