
# # any future command that fails will exit the script
# set -e

# ENV=$1
# SERVER=$2
# REPOSITORY=$3
# VERSION=$4
# DB_USERNAME=$5
# DB_PASS=$6
# DB_URL=$7
# DB_NAME=$8
# LINKEDIN_CLIENT_ID=$9
# LINKEDIN_CLIENT_SECRET=${10}
# LINKEDIN_REDIRECT_URI=${11}

# if [ "$ENV" = "QA" ]; then
# 	PORT=3001
# elif [ "$ENV" = "DEV" ]; then
# 	PORT=3000
# elif [ "$ENV" = "PRODUCTION" ]; then
# 	PORT=4000
# fi

# echo "update and restart $ENV"

# # pull docker image
# echo "Pulling docker image for version - $VERSION"

# echo "registry.gitlab.com/$REPOSITORY/$VERSION:$ENV"

# docker pull registry.gitlab.com/"$REPOSITORY"/"$VERSION":"$ENV"

# echo "Pulling completed"

# echo "remove exisiting container"
# docker rm -f "valuenaire-backend-${ENV}" || true

# #run docker image

# echo "running docker image"

# DATABASE_URL="postgresql://${DB_USERNAME}:${DB_PASS}@${DB_URL}/${DB_NAME}"

# echo "LINKEDIN_CLIENT_ID=${LINKEDIN_CLIENT_ID}"
# echo "LINKEDIN_CLIENT_SECRET=${LINKEDIN_CLIENT_SECRET}"
# echo "LINKEDIN_REDIRECT_URI=${LINKEDIN_REDIRECT_URI}"



# docker run --name "valuenaire-backend-${ENV}" \
# 	-e APP_ENV=${ENV} \
# 	-e PORT=${PORT} \
# 	-e DATABASE_URL=$DATABASE_URL \
# 	-e JWT_SECRET=JWT_SECRET_QA \
# 	-e JWT_EXP=1d \
# 	-e REFRESH_TOKEN_SECRET=REFRESH_TOKEN_SECRET_QA \
# 	-e REFRESH_TOKEN_EXP=7d \
# 	-e SALT_ROUND=10 \
# 	-e USER_NAME=no-reply@valuenaire.ai \
# 	-e APP_PASSWORD=kordsfbkfietwzxf \
# 	-e LINKEDIN_CLIENT_ID=${LINKEDIN_CLIENT_ID} \
# 	-e LINKEDIN_CLIENT_SECRET=${LINKEDIN_CLIENT_SECRET} \
# 	-e LINKEDIN_REDIRECT_URI=${LINKEDIN_REDIRECT_URI} \
# 	--memory 1g \
# 	--cpus 0.7 \
# 	--memory-swap -1 \
# 	--restart unless-stopped \
# 	-p ${PORT}:${PORT} \
# 	-d \
# 	registry.gitlab.com/"$REPOSITORY"/"$VERSION":"$ENV"





# echo "database migration : DEPLOY"

# docker exec "valuenaire-backend-${ENV}" yarn prisma migrate deploy

# echo "--------Deployed------------"
