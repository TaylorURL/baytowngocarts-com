DELETE FROM purchases a
USING purchases b
WHERE a.stripe_session_id = b.stripe_session_id
  AND a.created_at > b.created_at;

ALTER TABLE purchases 
ADD CONSTRAINT purchases_stripe_session_id_unique UNIQUE (stripe_session_id);
