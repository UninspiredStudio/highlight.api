#!/bin/bash
bun run prisma:migrate:deploy
bun run build/index.js