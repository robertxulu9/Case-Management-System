import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

console.log('Supabase Configuration:');
console.log('URL defined:', !!supabaseUrl);
console.log('Key defined:', !!supabaseAnonKey);

let supabase;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(`
    Error: Missing Supabase environment variables

    Please create a .env.local file in your project root with the following variables:
    REACT_APP_SUPABASE_URL=your_project_url
    REACT_APP_SUPABASE_ANON_KEY=your_anon_key

    You can find these values in your Supabase project:
    1. Go to https://supabase.com
    2. Sign in and open your project
    3. Go to Project Settings (gear icon)
    4. Click on API in the sidebar
    5. Copy the URL and anon key
  `);
  
  // Provide dummy values for development to prevent crashes
  if (process.env.NODE_ENV === 'development') {
    console.warn('Using dummy Supabase client for development');
    supabase = {
      from: () => ({
        select: (columns) => ({
          order: (column, { ascending } = {}) => ({
            data: [],
            error: null
          }),
          eq: (column, value) => ({
            data: [],
            error: null
          }),
          single: () => ({
            data: null,
            error: null
          })
        }),
        insert: (data) => ({
          select: () => ({
            single: () => ({
              data: { id: 'dummy-id', ...data[0] },
              error: null
            })
          })
        }),
        update: (data) => ({
          eq: (column, value) => ({
            select: () => ({
              single: () => ({
                data: { id: value, ...data },
                error: null
              })
            })
          })
        }),
        delete: () => ({
          eq: (column, value) => ({
            error: null
          })
        })
      })
    };
  } else {
    throw new Error('Missing Supabase environment variables');
  }
} else {
  console.log('Creating Supabase client with URL:', supabaseUrl.substring(0, 20) + '...');
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}
console.log('ENV Vars:', process.env);

export { supabase }; 