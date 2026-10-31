-- Repair duplicate display_order / sort_order values within each ordered collection.
-- Uniqueness is enforced going forward by Admin API resequencing (two-phase writes).
-- No unique indexes here: they would block mid-reorder swaps without deferred constraints.
--
-- IMPORTANT: when using a two-phase (-n then n) repair, the second pass must order by
-- the temporary negative keys DESC (or use a stable CTE captured before phase 1).
-- Ordering ASC after phase 1 reverses the collection.

-- lookup_locations: capture order once, then apply
WITH ordered AS (
  SELECT
    id,
    ROW_NUMBER() OVER (ORDER BY display_order ASC, name ASC) AS rn
  FROM lookup_locations
),
parked AS (
  UPDATE lookup_locations ll
  SET display_order = -ordered.rn
  FROM ordered
  WHERE ll.id = ordered.id
  RETURNING ll.id, ordered.rn
)
UPDATE lookup_locations ll
SET display_order = parked.rn
FROM parked
WHERE ll.id = parked.id;

WITH ordered AS (
  SELECT
    id,
    ROW_NUMBER() OVER (ORDER BY display_order ASC, name ASC) AS rn
  FROM lookup_bhk
),
parked AS (
  UPDATE lookup_bhk lb
  SET display_order = -ordered.rn
  FROM ordered
  WHERE lb.id = ordered.id
  RETURNING lb.id, ordered.rn
)
UPDATE lookup_bhk lb
SET display_order = parked.rn
FROM parked
WHERE lb.id = parked.id;

WITH ordered AS (
  SELECT
    id,
    ROW_NUMBER() OVER (ORDER BY display_order ASC, name ASC) AS rn
  FROM lookup_amenities
),
parked AS (
  UPDATE lookup_amenities la
  SET display_order = -ordered.rn
  FROM ordered
  WHERE la.id = ordered.id
  RETURNING la.id, ordered.rn
)
UPDATE lookup_amenities la
SET display_order = parked.rn
FROM parked
WHERE la.id = parked.id;

WITH ordered AS (
  SELECT
    id,
    ROW_NUMBER() OVER (ORDER BY display_order ASC, created_at ASC) AS rn
  FROM hero_slides
),
parked AS (
  UPDATE hero_slides hs
  SET display_order = -ordered.rn
  FROM ordered
  WHERE hs.id = ordered.id
  RETURNING hs.id, ordered.rn
)
UPDATE hero_slides hs
SET display_order = parked.rn
FROM parked
WHERE hs.id = parked.id;

WITH ordered AS (
  SELECT
    id,
    ROW_NUMBER() OVER (ORDER BY sort_order ASC NULLS LAST, created_at ASC) AS rn
  FROM insights_articles
),
parked AS (
  UPDATE insights_articles ia
  SET sort_order = -ordered.rn
  FROM ordered
  WHERE ia.id = ordered.id
  RETURNING ia.id, ordered.rn
)
UPDATE insights_articles ia
SET sort_order = parked.rn
FROM parked
WHERE ia.id = parked.id;
