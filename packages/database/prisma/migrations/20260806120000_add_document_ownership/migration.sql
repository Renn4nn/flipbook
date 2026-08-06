ALTER TABLE "Document" ADD COLUMN "ownerId" TEXT;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM "Document")
       AND NOT EXISTS (SELECT 1 FROM "User") THEN
        RAISE EXCEPTION 'Cannot assign existing documents: no user exists';
    END IF;
END $$;

UPDATE "Document"
SET "ownerId" = (
    SELECT "id"
    FROM "User"
    ORDER BY "createdAt" ASC, "id" ASC
    LIMIT 1
)
WHERE "ownerId" IS NULL;

INSERT INTO "_DocumentToUser" ("A", "B")
SELECT "id", "ownerId"
FROM "Document"
WHERE "ownerId" IS NOT NULL
ON CONFLICT ("A", "B") DO NOTHING;

ALTER TABLE "Document" ALTER COLUMN "ownerId" SET NOT NULL;

DROP INDEX IF EXISTS "Document_accessToken_key";
ALTER TABLE "Document"
    DROP COLUMN "accessToken",
    DROP COLUMN "expiresAt";

CREATE INDEX "Document_ownerId_idx" ON "Document"("ownerId");

ALTER TABLE "Document"
ADD CONSTRAINT "Document_ownerId_fkey"
FOREIGN KEY ("ownerId") REFERENCES "User"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;
