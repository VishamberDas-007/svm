FROM node:lts
ARG DATABASE_URL
# Set the working directory
WORKDIR /app
# COPY package.json .
# COPY tsconfig.json .
# COPY src ./src
COPY . .

RUN echo "file copying completed..."

RUN echo "$mode" "mode"
RUN if [ "$mode" = "production" ] ; then yarn install --production ; else yarn install ; fi

RUN yarn build

RUN echo "build completed..."
RUN npx prisma generate


CMD ["yarn","serve"]