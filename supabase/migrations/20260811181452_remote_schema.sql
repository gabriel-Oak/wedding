drop extension if exists "pg_net";

-- Remove rsvp_status from guests (only stored in confirmations)
alter table "public"."guests" drop column if exists "rsvp_status";

set check_function_bodies = off;

grant delete on table "public"."confirmations" to "anon";

grant insert on table "public"."confirmations" to "anon";

grant select on table "public"."confirmations" to "anon";

grant update on table "public"."confirmations" to "anon";

grant delete on table "public"."confirmations" to "authenticated";

grant insert on table "public"."confirmations" to "authenticated";

grant select on table "public"."confirmations" to "authenticated";

grant update on table "public"."confirmations" to "authenticated";

grant delete on table "public"."confirmations" to "service_role";

grant insert on table "public"."confirmations" to "service_role";

grant select on table "public"."confirmations" to "service_role";

grant update on table "public"."confirmations" to "service_role";

grant delete on table "public"."guests" to "anon";

grant insert on table "public"."guests" to "anon";

grant select on table "public"."guests" to "anon";

grant update on table "public"."guests" to "anon";

grant delete on table "public"."guests" to "authenticated";

grant insert on table "public"."guests" to "authenticated";

grant select on table "public"."guests" to "authenticated";

grant update on table "public"."guests" to "authenticated";

grant delete on table "public"."guests" to "service_role";

grant insert on table "public"."guests" to "service_role";

grant select on table "public"."guests" to "service_role";

grant update on table "public"."guests" to "service_role";

-- Triggers removed: RSVP status now only in confirmations table


