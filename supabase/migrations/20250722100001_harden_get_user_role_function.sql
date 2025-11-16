/*
  # [SECURITY] Harden get_user_role function
  [This migration hardens the `get_user_role` function by setting a fixed `search_path`. 
  This prevents potential hijacking attacks where a user could manipulate the search path 
  to execute malicious code.]

  ## Query Description: [This operation modifies an existing database function to improve security. It is a non-destructive change and has no impact on existing data. It ensures that the function only searches in trusted schemas (`public`, `auth`), mitigating a potential security vulnerability.]
  
  ## Metadata:
  - Schema-Category: ["Safe"]
  - Impact-Level: ["Low"]
  - Requires-Backup: [false]
  - Reversible: [true]
  
  ## Structure Details:
  - Function: `public.get_user_role(p_user_id uuid)`
  
  ## Security Implications:
  - RLS Status: [N/A]
  - Policy Changes: [No]
  - Auth Requirements: [N/A]
  - Mitigates: Search Path Hijacking (resolves "Function Search Path Mutable" advisory)
  
  ## Performance Impact:
  - Indexes: [N/A]
  - Triggers: [N/A]
  - Estimated Impact: [Negligible performance impact.]
*/
ALTER FUNCTION public.get_user_role(p_user_id uuid) SET search_path = public, auth;
