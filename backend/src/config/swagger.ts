import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MELYtodo API',
      version: '1.0.0',
      description: 'MELYtodo API Documentation',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Story: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'The auto-generated ID of the story',
            },
            topic: {
              type: 'string',
              description: 'The topic of the story',
            },
            originalStory: {
              type: 'string',
              description: 'The original story text',
            },
            translatedStory: {
              type: 'string',
              description: 'The translated story text',
            },
            language: {
              type: 'string',
              description: 'The language of the translated story',
            },
            user: {
              type: 'string',
              description: 'The ID of the user who created the story',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'The date and time the story was created',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'The date and time the story was last updated',
            },
          },
          example: {
            _id: '60d5ec49f8c7a40015a7b0a1',
            topic: 'Friendship',
            originalStory: 'Bir zamanlar...',
            translatedStory: 'Once upon a time...',
            language: 'english',
            user: '60d5ec49f8c7a40015a7b0a0',
            createdAt: '2023-10-26T10:00:00.000Z',
            updatedAt: '2023-10-26T10:00:00.000Z',
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
