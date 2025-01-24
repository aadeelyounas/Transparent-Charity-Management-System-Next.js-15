-- Set default password for existing users
UPDATE "User" SET "password" = 'temp_password' WHERE "password" IS NULL;

-- Alter column to be NOT NULL
ALTER TABLE "User" ALTER COLUMN "password" SET NOT NULL;