import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tkulxdzoqdtzevqnhoau.supabase.co';

const supabasePublishableKey =
  'sb_publishable_8PKHY6U53QvA-OiEFkrLbg_ziMiAlGZ';

export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey
);
