'use client'

import { useState } from "react"
import validateGithubUrl from "@/validators/github.validator"
import { GitHubRepository, GitHubLanguages, GitHubContributor, RepositoryAnalysis } from "@/types/github"
import { getRepository, getRepositoryLanguages, getRepositoryContributors, getRepositoryReadme } from "@/services/github.service"
import RepositoryCard from "./RepositoryCard"
import Sidebar from "./Sidebar"
import Navbar from "../layout/Navbar"
import LogoSection from "../home/LogoSection"
import RepoUrlForm from "../home/RepoUrlForm"
import RecentAnalysis from "../home/RecentAnalysis"
import { decodeBase64 } from "@/utils/decodeBase64"
import analyzeRepository from "@/lib/repositoryAnalyzer"

export default function SearchForm() {
  const [url, setUrl] = useState("")
  const [repository, setRepository] = useState<GitHubRepository | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [languages, setLanguages] = useState<GitHubLanguages>({})
  const [contributors, setContributors] = useState<GitHubContributor[]>([])
  const [readme, setReadme] = useState("")
  const [analysis, setAnalysis] = useState<RepositoryAnalysis | null>(null)
  const [aiSummary, setAiSummary] = useState("")
  const [aiLoading, setAiLoading] = useState(false)
  const [sidebarTab, setSidebarTab] = useState("Summary")

  const handleGenerateSummary = async () => {
    if (!repository || !analysis) return

    try {
      setAiLoading(true)
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          repository,
          languages,
          contributors,
          readme,
          analysis,
        }),
      })

      const data = await response.json()
      setAiSummary(data.summary)
    } catch (err) {
      console.error(err)
    } finally {
      setAiLoading(false)
    }
  }

  const fetchRepoData = async (targetUrl: string) => {
    setError("")
    setRepository(null)
    setLanguages({})
    setContributors([])
    setReadme("")
    setAnalysis(null)
    setAiSummary("")

    const result = validateGithubUrl(targetUrl.trim())

    if (!result.valid) {
      setError(result.error ?? "Invalid URL")
      return
    }

    setLoading(true)

    try {
      const [repositoryData, languageData, contributorData] =
        await Promise.all([
          getRepository(result.owner!, result.repo!),
          getRepositoryLanguages(result.owner!, result.repo!),
          getRepositoryContributors(result.owner!, result.repo!),
        ])

      let decodedReadme = ""

      try {
        const readmeData = await getRepositoryReadme(
          result.owner!,
          result.repo!
        )
        decodedReadme = decodeBase64(readmeData.content)
      } catch {
        console.log("Repository has no README.")
      }

      const repositoryAnalysis = analyzeRepository(
        repositoryData,
        contributorData,
        decodedReadme
      )

      setRepository(repositoryData)
      setLanguages(languageData)
      setContributors(contributorData)
      setReadme(decodedReadme)
      setAnalysis(repositoryAnalysis)
    } catch (err) {
      setRepository(null)
      setLanguages({})
      setContributors([])
      setReadme("")
      setAnalysis(null)
      setError("Failed to analyze repository.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    fetchRepoData(url)
  }

  const handleSelectRecentRepo = (selectedUrl: string) => {
    setUrl(selectedUrl)
    fetchRepoData(selectedUrl)
  }

  const handleResetAnalysis = () => {
    setUrl("")
    setRepository(null)
    setLanguages({})
    setContributors([])
    setReadme("")
    setAnalysis(null)
    setAiSummary("")
    setError("")
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#0b0e14]">
      {/* Global Navbar */}
      <Navbar activeTab="Docs" />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {!repository ? (
          /* Landing / Hero State (Image 1) */
          <main className="flex-1 flex items-center justify-center p-6 sm:p-10">
            <div className="w-full max-w-3xl mx-auto space-y-8 my-auto">
              <LogoSection />

              <RepoUrlForm
                url={url}
                loading={loading}
                error={error}
                onChange={(value) => {
                  setUrl(value)
                  if (!value.trim()) {
                    handleResetAnalysis()
                  }
                }}
                onSubmit={handleSubmit}
              />

              <RecentAnalysis onSelectRepo={handleSelectRecentRepo} />
            </div>
          </main>
        ) : (
          /* Dashboard Analysis State with Left Sidebar (Image 2) */
          <div className="flex-1 flex flex-col lg:flex-row">
            <Sidebar
              activeTab={sidebarTab}
              onSelectTab={setSidebarTab}
              onNewAnalysis={handleResetAnalysis}
            />

            <main className="flex-1 p-6 sm:p-8 bg-[#0b0e14] overflow-y-auto">
              <div className="max-w-7xl mx-auto">
                <RepositoryCard
                  repository={repository}
                  languages={languages}
                  contributors={contributors}
                  readme={readme}
                  analysis={analysis}
                  aiSummary={aiSummary}
                  aiLoading={aiLoading}
                  onGenerateAiSummary={handleGenerateSummary}
                />
              </div>
            </main>
          </div>
        )}
      </div>

    </div>
  )
}