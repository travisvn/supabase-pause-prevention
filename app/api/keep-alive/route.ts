import { createClient } from '@/utils/supabase/server'
import { SupabaseClient } from '@supabase/supabase-js'

import { keepAliveConfig as config } from '@/config/keep-alive-config'

type QueryResponse = {
  successful: boolean
  message: string
}

export const dynamic = 'force-dynamic' // defaults to auto

const alphabetOffset: number = 'a'.charCodeAt(0)

const generateRandomString = (length: number) => {
  let newString = ''

  for (let i = 0; i < length; i++) {
    newString += String.fromCharCode(alphabetOffset + Math.floor(Math.random() * 26))
  }

  return newString
}

const querySupabase = async (supabase: SupabaseClient, randomStringLength: number = 12): Promise<QueryResponse> => {
  const currentRandomString = generateRandomString(randomStringLength)

  const { data, error } = await supabase
    .from(config.table)
    .select('*')
    .eq(config.column, currentRandomString)

  const messageInfo: string = `Results for retrieving\n'${currentRandomString}' from '${config.table}' at column '${config.column}'`

  if (error) {
    const errorInfo = `${messageInfo}: ${error.message}`
    if (config.consoleLogOnError) console.log(errorInfo)
    return {
      successful: false,
      message: errorInfo
    }
  }

  return {
    successful: true,
    message: `${messageInfo}: ${JSON.stringify(data)}`
  }
}

const fetchOtherEndpoints = async (): Promise<string[]> => {
  if (config?.otherEndpoints != null && config?.otherEndpoints.length > 0) {

    const fetchPromises = config.otherEndpoints.map(async (endpoint) => {
      const endpointResults = await fetch(endpoint, { cache: 'no-store' })
      const passOrFail = (endpointResults?.status == 200) ? 'Passed' : 'Failed'
      return `${endpoint} - ${passOrFail}`
    })

    const fetchResults = await Promise.all(fetchPromises)
    return fetchResults
  }

  return []
}

export async function GET() {
  const supabase = createClient()  // maybe switch to ClientSide Client
  const querySupabaseResponse = await querySupabase(supabase)

  const responseStatus: number = (querySupabaseResponse?.successful == true) ? 200 : 400
  let responseMessage = querySupabaseResponse.message

  if (config?.otherEndpoints != null && config?.otherEndpoints.length > 0) {
    const fetchResults: string[] = await fetchOtherEndpoints()
    responseMessage += `\n\nOther Endpoint Results:\n${fetchResults.join('\n')}`
  }

  return new Response(responseMessage, {
    status: responseStatus
  })
}