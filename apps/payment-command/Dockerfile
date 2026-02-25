# 어떤 노드 이미지를 사용할지
FROM node:alpine AS development

# 도커 내 작업 디렉토리 설정(이미지 내에서 작업할 디렉토리)
WORKDIR /usr/src/app

COPY package*.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

# pnpm 설치
RUN npm install -g pnpm

# Dependencies 설치
RUN pnpm install

# 필요한 소스코드 복사
COPY apps/payment-command apps/payment-command
COPY libs libs

RUN pnpm build payment-command

# 개발 모드로 실행
CMD ["pnpm", "start:dev", "payment-command"]

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

CMD ["node", "dist/apps/payment-command/main"]  