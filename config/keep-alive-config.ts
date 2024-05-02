export type KeepAliveConfig = typeof keepAliveConfig


export const keepAliveConfig = {

  // Select a table in your Supabase database to make a call to
  table: 'keep-alive',

  // Column that will be queried with a random string
  column: 'name',

  consoleLogOnError: true,

  otherEndpoints: [
    'https://your-other-vercel-project-urls.vercel.app/api/keep-alive',
    'https://your-other-supabase-app.com/api/keep-alive',
  ]
}