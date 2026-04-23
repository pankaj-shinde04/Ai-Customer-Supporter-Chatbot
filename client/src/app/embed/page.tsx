import EmbedClient from '@/src/components/EmbedClient'
import { getSession } from '@/src/lib/getSessions'
import React from 'react'

 const page = async () => {
    const session =  await getSession()

  return (
    <>
      <EmbedClient ownerId={session?.user?.id!} />
    </>
  )
}

export default page
