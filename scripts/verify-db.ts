import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL || '';
const key = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!url || !key) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in environment.');
  process.exit(1);
}

const client = createClient(url, key);

async function verifyDatabase() {
  console.log('Testing connection to Supabase Project:', url);

  const tables = ['products', 'product_variants', 'profiles', 'orders', 'order_items', 'carts', 'cart_items'];
  let allExist = true;

  for (const table of tables) {
    const { data, error, count } = await client.from(table).select('*', { count: 'exact' }).limit(1);
    if (error) {
      console.log(`❌ Table 'public.${table}': NOT FOUND (${error.message})`);
      allExist = false;
    } else {
      console.log(`✅ Table 'public.${table}': EXISTS (Record count: ${count ?? 0})`);
    }
  }

  if (allExist) {
    console.log('\n🎉 All Supabase tables exist and are accessible!');
  } else {
    console.log('\n⚠️ Tables are missing in Supabase. Please copy /supabase/schema.sql and run it in the Supabase SQL Editor.');
  }
}

verifyDatabase();
