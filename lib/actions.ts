"use server"
import { AUTHOR_BY_GITHUB_ID_QUERY } from "@/sanity/lib/queries";

import { auth } from "@/auth"
import { parseServerActionResponse } from "./utils";
import slugify from "slugify";
import { writeClient } from "@/sanity/lib/write-client";
export const createPitch = async(state:any,form:FormData,pitch:string)=>{
  const session = await auth();
  if(!session) return parseServerActionResponse({error:"Not signed in", status:"ERROR"});
  const {title ,description , category,link}=Object.fromEntries(
    Array.from(form).filter(([key])=>key !=="pitch"),
  )
  const slug = slugify(title as string,{lower:true,strict:true});
//   try {
//     const startup = {
//         title,description , category , image:link,slug: {
//   _type: "slug",
//   current: slug,   
// },

//         author:{
//             _type:"reference",
//             _ref:session?.id,
//         },
//         pitch,
//     };
//     const result = await writeClient.create({_type:"startup",...startup});
//     return parseServerActionResponse({
//         ...result,error:'',status:"SUCCESS",
//     })
//   } catch (error) {
//     console.log(error);
//     return parseServerActionResponse({error:JSON.stringify(error)});
//   }
try {
  //Try to fetch author
  let author = await writeClient.fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
    id: session?.user?.id,
  });

  // If not found, create author doc
  if (!author) {
    author = await writeClient.create({
      _type: "author",
      id: session?.user?.id,
      name: session?.user?.name || "Unnamed",
      username:
        session?.user?.name?.toLowerCase().replace(/\s+/g, "") || "user",
      email: session?.user?.email || "",
      image: session?.user?.image || "",
      bio: "",
    });
  }

  //  startup with guaranteed author._id
  const startup = {
    title,
    description,
    category,
    image: link,
    slug: {
      _type: "slug",
      current: slug,
    },
    author: {
      _type: "reference",
      _ref: author._id,
    },
    pitch,
  };

  const result = await writeClient.create({ _type: "startup", ...startup });

  return parseServerActionResponse({
    ...result,
    error: "",
    status: "SUCCESS",
  });
} catch (error) {
  console.log(error);
  return parseServerActionResponse({ error: JSON.stringify(error) });
}


};