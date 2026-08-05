-- Convert only the known development seed password from scrypt to bcrypt.
UPDATE "User"
SET "password" = '$2b$10$z4RXeZiG7kLiZFOYoPx/B.7a5HEkQsPoyV81kLauuq32U03ZvjC3i'
WHERE "id" = '123e4567-e89b-12d3-a456-426614174000'
  AND "password" = 'scrypt:ade989e3aa6aae0ed69e4ff6d70e8867:a401d61e82a5f949dc36bcf81c333d49d35b2e402ddf0e4798f8401f1056b438fa7deabe49f7a26479ed3494fcb0e2fedaf5055f427cc87e86fd6e95a5cb781d';
