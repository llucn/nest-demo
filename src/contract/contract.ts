import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { extendZodWithOpenApi } from '@anatine/zod-openapi';

extendZodWithOpenApi(z);

const c = initContract();

const InfoSchema = z.object({
  version: z.string(),
  manifest: z.array(z.string()),
});

const UserSchema = z.object({
  id: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
  active: z.boolean(),
  client_id: z.number(),
  primary_email: z.string(),
  first_name: z.string(),
  last_name: z.string()
});

export const contract = c.router({
  login: {
    method: 'GET',
    path: '/api/1/auth/login',
    query: z.object({
      returnTo: z.string().default('/').openapi({
        description: "Return to URL after login successfully"
      })
    }),
    responses: {
      302: z.object({
        url: z.string().openapi({
          title: 'URL',
          description: 'Redirect URL',
        })
      })
    },
    summary: 'Login'
  },
  info: {
    method: 'GET',
    path: '/api/info',
    responses: {
      200: InfoSchema
    },
    summary: 'Get info'
  },
  getMe: {
    method: 'GET',
    path: '/api/auth/me',
    responses: {
      200: UserSchema
    },
    summary: 'Get current login user'
  },
  refreshToken: {
    method: 'POST',
    path: '/api/1/auth/refresh',
    body: z.object({
      refresh_token: z.string().openapi({
        description: 'Refresh token'
      })
    }),
    responses: {
      200: z.object({
        token: z.string().openapi({
          description: 'Access token'
        }),
        refresh: z.string().openapi({
          description: 'Refresh token'
        })
      })
    },
    summary: 'Refresh token'
  },
  logout: {
    method: 'POST',
    path: '/api/auth/logout',
    body: z.object({
      refresh_token: z.string()
    }),
    responses: {
      200: c.noBody()
    },
    summary: 'Logout'
  },
  getAsset: {
    method: 'GET',
    path: '/api/asset/*:id',
    query: z.object({
      format: z.enum(['json', 'redirect']).default('redirect'),
      expiresIn: z.coerce.number().max(43200, {
        message: "expiresIn must be less than or equal to 43200 seconds"
      }).default(3600).openapi({
        description: "Expires in seconds"
      }),
      contentDisposition: z.enum(['attachment', 'inline']).default('inline'),
    }),
    responses: {
      200: z.object({
        url: z.string().url()
      }),
      302: z.object({}),
    },
    summary: 'Download asset'
  }
});