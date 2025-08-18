import { auth } from '@/auth';
import { StartupCardSkeleton } from '@/components/StartupCard';
import { Skeleton } from '@/components/ui/skeleton';
import UserStartups from '@/components/UserStartups';
import { client } from '@/sanity/lib/client';
import { AUTHOR_BY_ID } from '@/sanity/lib/queries';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import React, { Suspense } from 'react'

export const experimental_ppr = true;

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params; 

  const session = await auth();
  const user = await client.fetch(AUTHOR_BY_ID, { id });

  if (!user) return notFound();

  return ( 
    <> 
    <section className='profile_container'>
        <div className="flex-1 flex flex-col gap-5 lg:-mt-5">
            <p className="text-30-bold">
                     {session?.id === id ? "your" : "all"} Startups 

            </p>
            <ul className="card_grid-sm">
                 <Suspense fallback={<StartupCardSkeleton />}>
        <UserStartups id={id} />   
      </Suspense>
            </ul>
        </div>
     

           
     
      </section>
    </> 
  ) 
} 

export default page;
