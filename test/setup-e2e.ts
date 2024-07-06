import { member, profile } from '@prisma/client';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { execSync } from 'child_process';
import { Client } from 'pg';
import { PrismaService } from 'src/services/prisma.service';

let postgresClient: Client;
let postgresContainer: StartedPostgreSqlContainer;
let prismaService: PrismaService;

beforeAll(async () => {
  postgresContainer = await new PostgreSqlContainer().start();

  // Postgres setup
  postgresClient = new Client({
    user: postgresContainer.getUsername(),
    host: postgresContainer.getHost(),
    database: postgresContainer.getDatabase(),
    password: postgresContainer.getPassword(),
    port: postgresContainer.getMappedPort(5432),
  });
  await postgresClient.connect();
  const databaseUrl = postgresContainer.getConnectionUri();

  execSync(`npx prisma migrate dev --name 0_init`, {
    env: { ...process.env, DATABASE_URL: databaseUrl },
  });

  prismaService = new PrismaService({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  });
});

afterAll(async () => {
  await prismaService.$disconnect();
  await postgresClient.end();
  await postgresContainer.stop();
});

afterEach(async () => {
  await postgresClient.query('DELETE FROM "member"."member"');
  await postgresClient.query('DELETE FROM "member"."profile"');
});

jest.setTimeout(10000);

export { postgresClient, prismaService };

const createTestMember = async (email: string): Promise<member> => {
  const member = await postgresClient.query<member>(
    `INSERT INTO "member"."member" (email) VALUES ('${email}') RETURNING *`,
  );
  await postgresClient.query<profile>(
    `INSERT INTO "member"."profile" (user_id, nickname, image_url) VALUES (${member.rows[0].id} , 'test', 'test')`,
  );
  return member.rows[0];
};

export { createTestMember };
