import DashboardClient from '@/src/components/DashboardClient';
import { getSession } from '@/src/lib/getSessions'
import user from '@scalekit-sdk/node/lib/user';
import React from 'react'

async function page() {
  const session = await getSession();

  return (
    <>
      <DashboardClient ownerId={session?.user?.user?.id} />
    </>
  )
}

export default page
