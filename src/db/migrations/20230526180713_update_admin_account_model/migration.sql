-- AlterTable
CREATE SEQUENCE adminaccount_adminaccountid_seq;
ALTER TABLE "AdminAccount" ALTER COLUMN "adminAccountId" SET DEFAULT nextval('adminaccount_adminaccountid_seq');
ALTER SEQUENCE adminaccount_adminaccountid_seq OWNED BY "AdminAccount"."adminAccountId";
