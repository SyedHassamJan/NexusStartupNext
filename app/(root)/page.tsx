import StartupCard, {StartupTypeCard} from "@/components/StartupCard";
import SearchForm from "../../components/SearchForm";

import {STARTUPS_QUERY} from "@/sanity/lib/queries";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
import { auth } from "@/auth";
 
export default async function Home({searchParams}:{
  searchParams:Promise<{query?:string}>
}) {

  const query = (await searchParams).query;
  // const posts = await client.fetch(STARTUPS_QUERY);
  const params = {search:query || null};
  const session = await auth();
  const {data :posts} = await sanityFetch({query:STARTUPS_QUERY , params});
  console.log( session?.id);
  // console.log(JSON.stringify(posts , null , 2));
  
  // const posts=[{_createdAt:"2024-12-15T10:30:00Z",views:55,author:{_id:1 , name:"Syed Hassam Jan"}, _id:1, description:"This is a descripction", image:"https://unsplash.com/photos/a-red-porsche-parks-in-a-sunny-spot-CjIqeaPMiJg", category:"Roots", title:"We Robots",}];
  return (
    <>
    <section className="pink_container">

       <h1 className="heading">Deploy your Startup <br></br>Connect with people</h1>

       <p className="sub-heading !max-w-3xl">
        Submit Ideas, vote on Pitches and get Noticed in Virtual Competition
       </p>
       <SearchForm query={query}></SearchForm>
    </section>

    <section className="section_container">
      <p className="text-30-semibold">
        {query?`Search results for"${query}"`:"All startups"}
      </p>
       <ul className="mt-7 card_grid">
        {posts?.length>0?(
          posts.map((post:StartupTypeCard , index:number)=>(
            <StartupCard key={post?._id} post={post}/>
          ))
        ):(
          <p className="no-results">No Startups Found</p>
        )} 
       </ul>

    </section>
      <SanityLive></SanityLive>
    </>
  );
}
