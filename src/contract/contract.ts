import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { RequestPresigningArguments } from "@smithy/types";

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

export interface CreateSignedUrlInput {
  s3Object: {
    bucket: string,
    key: string,
    contentDisposition?: 'attachment' | 'inline' 
  },
  options?: RequestPresigningArguments,
}

export const contract = c.router({
  login: {
    method: 'GET',
    path: '/api/1/auth/login',
    query: z.object({
      returnTo: z.string().default('/')
    }),
    responses: {
      302: z.object({ url: z.string() })
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
      refresh_token: z.string()
    }),
    responses: {
      200: z.object({
        token: z.string(),
        refresh: z.string()
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
    body: c.type<CreateSignedUrlInput>(),
    responses: {
      200: z.object({
        url: z.string()
      })
    },
    summary: 'Create signed url for s3 obejct'
  }
});