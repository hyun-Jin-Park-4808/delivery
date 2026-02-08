# 어떤 노드 이미지를 사용할지
FROM node:alpine AS development

# 도커 내 작업 디렉토리 설정(이미지 내에서 작업할 디렉토리)
WORKDIR /user/src/app

# package.json 복사해오기
COPY package*.json ./

# pnpm-lock.yaml 복사해오기
COPY pnpm-lock.yaml ./

# pnpm 설치
RUN npm install -g pnpm

# Dependencies 설치
RUN pnpm install

# 나머지 소스코드 복사
COPY . .

# 개발 모드로 실행
CMD ["pnpm", "start:dev", "product"]