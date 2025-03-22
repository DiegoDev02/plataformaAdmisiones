/*
  # Add function to get bootcamp interactions count

  1. New Function
    - Creates a stored procedure to count bootcamp interactions
    - Groups by bootcamp_id and returns counts
    - Filters by interaction_type

  2. Security
    - Function is accessible to authenticated users
    - Returns only aggregated data
*/

CREATE OR REPLACE FUNCTION get_bootcamp_interactions(interaction_type text)
RETURNS TABLE (
  bootcamp_id uuid,
  count bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    bi.bootcamp_id,
    COUNT(*)::bigint
  FROM bootcamp_interactions bi
  WHERE bi.interaction_type = $1
  GROUP BY bi.bootcamp_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;