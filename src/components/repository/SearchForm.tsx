'use client'

import Input from "../ui/Input"
import Button from "../ui/Button"
import { useState } from "react"
import validateGithubUrl from "@/validators/github.validator"
import { GitHubRepository } from "@/types/github"
import { getRepository } from "@/services/github.service"

export default function SearchForm() {

    const [ url , setUrl ] = useState("")
    const [ repository , setRepository ] = useState<GitHubRepository | null>(null);
    const [ error , setError ] = useState("")

    const handleSubmit = async () => {
      setError("")

      const result = validateGithubUrl(url)
      
      if (!result.valid){
        setRepository(null);
        setError(result.error ?? "Invalid URL");
        return;
      }

      try {
        const data = await getRepository(
          result.owner!,
          result.repo!
        );

        setRepository(data);
      } catch (err) {
        setRepository(null);
        setError("Repository not found.");
        console.error(err);
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
               
                <Input placeholder="GitHub URL"  value={url}  onChange={(e) => setUrl(e.target.value)}/>

                    {error && (
                      <p className="text-sm text-red-500">
                         {error}
                      </p>
                    )}
               
                <Button onClick={handleSubmit}>
                    Analyze
                </Button>

                 {repository && (
                    <div className="mt-8 rounded-lg border border-slate-700 p-6">
                        <h2 className="text-2xl font-bold">
                            {repository.full_name}
                        </h2>
                        <p className="mt-2">
                            {repository.description}
                        </p>
                        <div className="mt-4 space-y-2">
                            <p>
                                Stars : {repository.stargazers_count}
                            </p>
                            <p>
                                Forks : {repository.forks_count}
                            </p>
                            <p>
                                Language : {repository.language}
                            </p>
                            <p>
                                Open issues : {repository.open_issues_count}
                            </p>
                        </div>
                    </div>
                 )}
               
            </div>

        </section>
    )
}