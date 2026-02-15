#!/bin/bash

docker buildx build --platform linux/amd64,linux/arm64 -t guswlsdl4808/fc-nestjs-gateway:latest -f ./apps/gateway/Dockerfile --target production --push .
docker buildx build --platform linux/amd64,linux/arm64 -t guswlsdl4808/fc-nestjs-notification:latest -f ./apps/notification/Dockerfile --target production --push .
docker buildx build --platform linux/amd64,linux/arm64 -t guswlsdl4808/fc-nestjs-order:latest -f ./apps/order/Dockerfile --target production --push .
docker buildx build --platform linux/amd64,linux/arm64 -t guswlsdl4808/fc-nestjs-payment:latest -f ./apps/payment/Dockerfile --target production --push .
docker buildx build --platform linux/amd64,linux/arm64 -t guswlsdl4808/fc-nestjs-product:latest -f ./apps/product/Dockerfile --target production --push .
docker buildx build --platform linux/amd64,linux/arm64 -t guswlsdl4808/fc-nestjs-user:latest -f ./apps/user/Dockerfile --target production --push .