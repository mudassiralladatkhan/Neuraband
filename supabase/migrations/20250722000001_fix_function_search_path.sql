/*
# [Fix Function Search Path]
This migration hardens the security of the `handle_new_user` function by explicitly setting its `search_path`. This prevents potential hijacking attacks by ensuring the function only searches for tables within the `public` schema, addressing the security advisory warning.

## Query Description:
This operation alters an existing database function. It is a non-destructive security enhancement and has no impact on existing data or application functionality.

## Metadata:
- Schema-Category: "Safe"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true

## Structure Details:
- Function being affected: `public.handle_new_user()`

## Security Implications:
- RLS Status: Not changed
- Policy Changes: No
- Auth Requirements: None
- Mitigates: Search path hijacking vulnerability.

## Performance Impact:
- Indexes: None
- Triggers: None
e- Estimated Impact: Negligible.
*/

ALTER FUNCTION public.handle_new_user()
SET search_path = 'public';
