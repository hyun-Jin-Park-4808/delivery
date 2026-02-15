FROM node:alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

# pnpm 설치
RUN npm install -g pnpm

# Dependencies 설치
RUN pnpm install

# app/gateway, libs 복사
COPY apps/gateway apps/gateway
COPY libs libs

# dist 폴더 안에 gateway 관련 폴더 생성
RUN pnpm build gateway

# 개발 모드로 실행
CMD ["pnpm", "start:dev", "gateway"]

FROM node:alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./

# pnpm 설치, devDependencies 설치 제외
RUN npm install -g pnpm
RUN pnpm install --prod 

# 위에서 빌드한 dist 폴더 복사
COPY --from=development /usr/src/app/dist ./dist
COPY proto proto

# 개발 모드로 실행
CMD ["node", "dist/apps/gateway/main"]