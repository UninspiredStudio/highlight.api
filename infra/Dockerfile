FROM imbios/bun-node:21-slim as base

FROM base as builder
WORKDIR /opt/install
COPY package.json bun.lockb ./
COPY prisma ./prisma
RUN bun install --frozen-lockfile --production
RUN bun run prisma:generate
COPY src ./src
RUN bun run build

FROM base as runtime
WORKDIR /opt/app
COPY --from=builder /opt/install/node_modules ./node_modules
COPY --from=builder /opt/install/prisma ./prisma
COPY --from=builder /opt/install/bun.lockb ./
COPY --from=builder /opt/install/package.json ./
COPY --from=builder /opt/install/build ./build
COPY ./infra/entrypoint.sh ./
RUN chmod +x ./entrypoint.sh

ENV NODE_ENV=production
ENV DATABASE_URL=postgres://postgres:postgres@localhost:5432/database
ENV PORT=3000
ENV REDIS_HOST=
ENV REDIS_PORT=
ENV REDIS_PASSWORD=

EXPOSE ${PORT}/tcp

ENTRYPOINT ["/bin/bash", "entrypoint.sh"]