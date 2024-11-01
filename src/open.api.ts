import { generateOpenApi } from '@ts-rest/open-api';
import { contract } from "src/contract/contract";

export const openApiDocument = generateOpenApi(contract, {
  info: {
    title: 'Web API',
    version: '1.0.0',
  },
});