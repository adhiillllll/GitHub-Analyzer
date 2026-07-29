'use client'

import Input from "../ui/Input"
import Button from "../ui/Button"
import { useState } from "react"
import validateGithubUrl from "@/validators/github.validator"
import { GitHubRepository } from "@/types/github"
import { getRepository } from "@/services/github.service"
import RepositoryCard from "./RepositoryCard";

export default function SearchForm() {

    const [ url , setUrl ] = useState("")
    const [ repository , setRepository ] = useState<GitHubRepository | null>(null);
    const [ error , setError ] = useState("")
    const [ loading , setLoading ] =useState(false);

    const handleSubmit = async ( e: React.FormEvent<HTMLFormElement> ) => {
      e.preventDefault()

      setError("");
      setRepository(null);

      const result = validateGithubUrl(url.trim())
      
      if (!result.valid){
        setError(result.error ?? "Invalid URL");
        return;
      }
      setLoading(true)

      try {
        const data = await getRepository(
          result.owner!,
          result.repo!
        );

        setRepository(data);
      } catch (error) {
        setRepository(null);
        setError("Repository not found.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    return(
        <section className="w-full max-w-2xl rounded-xl border border-slate-800 bg-slate-900 p-8 shadow-xl">

            <h1 className="text-3xl font-bold text-white">
                GitHub Project Reviewer
            </h1>

            <p className="mt-3 text-slate-400">
                Paste any public GitHub Repository URL to analyze it's structure,
                technologies and project health.
            </p>

            <div className="mt-8">

               <form onSubmit={handleSubmit}   className="space-y-4">
                <Input placeholder="GitHub URL"  value={url}  
                    onChange={(e) => {
                        const value = e.target.value;

                        setUrl(value);

                         if (!value.trim()) {
                           setRepository(null);
                           setError("");
                         }
                    }}/>
               
                <Button type="submit"  disabled={loading  || !url.trim()}>
                    {loading ? "Analyzing..." : "Analyze"}
                </Button>

                {error && (
                  <p className="text-red-500 text-sm">
                     {error}
                 </p>
                )}

                {repository && (
                  <RepositoryCard repository={repository}/>
                )}

              </form>

            </div>

        </section>
    )
}