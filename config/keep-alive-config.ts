export type KeepAliveConfig = typeof keepAliveConfig


export const keepAliveConfig = {

  // Select a table in your Supabase database to make a call to
  table: 'keep-alive',

  // Column that will be queried with a random string
  column: 'name',

  // Configuration for actions taken on the database
  allowInsertionAndDeletion: true, // Set this to false unless you're using a 'keep-alive'-dedicated table
  disableRandomStringQuery: false, // Set this to true if allowInsertionAndDeletion is true. Otherwise, no db actions taken
  sizeBeforeDeletions: 10, // Max size of table before any deletions start (if allowInsertionAndDeletion is true)

  consoleLogOnError: true,

  otherEndpoints: [
    'https://your-other-vercel-project-urls.vercel.app/api/keep-alive',
    'https://your-other-supabase-app.com/api/keep-alive',
  ]
}