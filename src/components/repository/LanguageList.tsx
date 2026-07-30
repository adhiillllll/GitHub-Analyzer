import { GitHubLanguages } from "@/types/github";

type LanguageListProps = {
    languages : GitHubLanguages
}

export default function LanguageList({
    languages,}:LanguageListProps
){
    return(
        <div className="mt-6">
            <h3 className="text-lg font-semibold">
                Languages
            </h3>

            <ul className="mt-3 space-y-2">
                {Object.entries(languages).map(
                    ([language, bytes]) => (
                        <li key={language} className="flex justify-between">
                            <span>{language}</span>
                            <span>{bytes}</span>
                        </li>
                    )
                )}
            </ul>
        </div>
    )
}