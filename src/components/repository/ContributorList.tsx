import { GitHubContributor } from "@/types/github";
import ContributorCard from "./ContributorCard";

type ContributorListProps = {
    contributors : GitHubContributor[];
}

export default function ContributorList({
    contributors
} : ContributorListProps ) {

    return(

        <div className="mt-8">

            <h3 className="text-lg font-semibold">
                Top Contributors
            </h3>

            <div className="mt-4 space-y-3">
                {contributors.slice(0, 5)
                    .map((contributor) => (

                        <ContributorCard  key={contributor.id}  contributor={contributor} />

                    ))}
            </div>

        </div>
    )
}