
set -e

ENV=$1
SERVER=$2
REPOSITORY=$3
VERSION=$4
DB_USERNAME=$5
DB_PASS=$6
DB_URL=$7
DB_NAME=$8


echo "ENV = $ENV"
echo "version = $VERSION"
echo "deploying to $SERVER 🚀🚀🚀" 

echo DB_USERNAME
echo DB_PASS
echo DB_URL
echo DB_NAME

ssh ubuntu@${SERVER} 'bash -s' < ./deploy/updateAndRestart.sh $ENV $SERVER $REPOSITORY $VERSION $DB_USERNAME $DB_PASS $DB_URL $DB_NAME $LINKEDIN_CLIENT_ID $LINKEDIN_CLIENT_SECRET


