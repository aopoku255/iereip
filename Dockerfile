FROM node:20-alpine AS builder

WORKDIR /app

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY package.json yarn.lock* ./

RUN yarn install --ignore-engines

COPY . .

RUN yarn build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]