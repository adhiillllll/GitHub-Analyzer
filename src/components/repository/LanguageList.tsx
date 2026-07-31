import { GitHubLanguages } from "@/types/github";
import LanguageProgress from "./LanguageProgress";

type LanguageListProps = {
    languages : GitHubLanguages
}

export default function LanguageList({
    languages,}:LanguageListProps
){

    const totalBytes = Object.values(languages).reduce(
        (total, bytes) => total + bytes, 0
    );


    return(
        <div className="mt-6">
            <h3 className="text-lg font-semibold">
                Languages
            </h3>

            <div className="mt-4 space-y-4">

                {Object.entries(languages).map(([language, bytes]) => {

                   const percentage = Math.round(
                     (bytes / totalBytes) * 100 );

                     return (
                      <LanguageProgress
                      key={language}
                      language={language}
                      percentage={percentage} />
                    );

                }
                )}

            </div>
        </div>
    )
}