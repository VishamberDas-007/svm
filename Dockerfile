FROM node:lts
ARG DATABASE_URL
# Set the working directory
WORKDIR /app

# COPY package.json .
# COPY yarn.lock .
COPY . .
RUN yarn install
RUN echo "file copying completed..."

EXPOSE 3030

RUN yarn install --verbose

RUN yarn build

RUN echo "build completed..."
RUN npx prisma generate


CMD ["yarn","serve"]