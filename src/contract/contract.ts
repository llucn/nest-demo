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
  createSignedUrl: {
    method: 'POST',
    path: '/api/s3/signedUrl',
    body: z.object({
      s3Object: z.object({
        bucket: z.string(),
        key: z.string(),
        contentDisposition: z.enum(['attachment', 'inline']).default('inline')
      }),
      options: z.object({
        expiresIn: z.number().max(43200, { 
          message: "expiresIn must be less than or equal to 43200 seconds"
        }).default(3600).optional().openapi({
          description: "Expires in seconds"
        }),
        unhoistableHeaders: z.array(z.string()).optional(),
        hoistableHeaders: z.array(z.string()).optional(),
      }).optional()
    }),
    responses: {
      200: z.object({
        url: z.string().url()
      })
    },
    summary: 'Create signed URL for S3 obejct'
  }
});