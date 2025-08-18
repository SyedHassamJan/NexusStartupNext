
"use client";
import React, { useActionState, useState } from 'react'
import { Textarea } from './ui/textarea';
import MDEditor from "@uiw/react-md-editor";
import { Button } from './ui/button';
import { Router, Send } from 'lucide-react';
// import { title } from 'process';
import { formSchema } from '@/lib/validation';
import {z} from "zod";
import { toast } from "sonner";
import { useRouter } from 'next/navigation';
import { createPitch } from '@/lib/actions';
const StartupForm = () => {
    const [errors , setErrors] = useState<Record<string,string>>({});
    const [pitch,setPitch] = useState("");
    // const {toast} = useToast();
    const router=useRouter();
    const handelFormSubmit =async (prevState:any , formData:FormData)=>{
        try{
            const formValues={
                title:formData.get("title")as string,
                description: formData.get("description") as string,
                category: formData.get("category") as string,
                link: formData.get("link") as string,
                pitch,
            }
            await formSchema.parseAsync(formValues);
            // const result = await createIdea(prevState , formData,pitch);
          // console.log(formValues);
          const result = await createPitch(prevState,formData,pitch );
          if(result.status=="SUCCESS"){
            toast.success("Your Startup pitch has been created successfully!");
            router.push(`/startup/${result._id}`)
          }
          return result;
        }catch(error){
          if(error instanceof z.ZodError ){
            const fieldErrors = error.flatten().fieldErrors;
            setErrors(fieldErrors as unknown as Record<string,string>);
              toast.error("Please check your inputs and try again");

            return{...prevState,error:"Validation Failed",status:"ERROR"}
          }
           toast.error("An unexpected error has occurred");
          return {
            
            ...prevState,error:"Unexpected Error has occured",
            status:"ERROR",
          }
        }
    };
    // const isPending = false;
    const [state, formAction, isPending] = useActionState(handelFormSubmit,{error:"", status:"INITIAL",});
    

    
  return (
    <form action={formAction} className='startup-form'>
        <div >
            <label htmlFor="title" className="startup-form_label">Title</label>
            <input id="title" name='title' className='startup-form_input' required placeholder='Your Startup Title'/>
            {errors.title && <p className='startup-form_error'>{errors.title}</p>}
        </div>
        <div >
            <label htmlFor="description" className="startup-form_label">description</label>
            <Textarea id="description" name='description' className='startup-form_textarea' required placeholder='Your Startup description'/>
            {errors.description && <p className='startup-form_error'>{errors.description}</p>}
        </div>
        <div >
            <label htmlFor="category" className="startup-form_label">category</label>
            <input id="category" name='category' className='startup-form_input' required placeholder='Your Startup category'/>
            {errors.category && <p className='startup-form_error'>{errors.category}</p>}
        </div>
        <div >
            <label htmlFor="link" className="startup-form_label">Image URL</label>
            <input id="link" name='link' className='startup-form_input' required placeholder='Your Startup Image URL link'/>
            {errors.link && <p className='startup-form_error'>{errors.link}</p>}
        </div>
        <div data-color-mode="light">
            <label htmlFor="pitch" className="startup-form_label">pitch</label>
            <MDEditor value={pitch} onChange={(e)=>setPitch(e as string)} id="pitch" preview='edit' height={300} style={{borderRadius:20,overflow:"hidden"}} textareaProps={{placeholder:"Briefly describe your idea and what problem it solves"}} previewOptions={{
                disallowedElements:["style"],
            }}></MDEditor>
            {errors.pitch && <p className='startup-form_error'>{errors.pitch}</p>}
        </div>
        <Button type='submit' className='startup-form_btn text-white' disabled={isPending}>{isPending ? "Submit" : "Submit your Pitch"}
            <Send className='size-6 ml-2'></Send>
        </Button>
    </form>
  )
}

export default StartupForm
