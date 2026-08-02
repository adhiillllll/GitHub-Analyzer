type TopicListProps = {
    topics : string[];
}


export default function TopicList({
    topics
} : TopicListProps) {

    if (topics.length === 0) {
        return(
            <div className="mt-8">

                <h3 className="text-lg font-semibold">
                    Topics
                </h3>

                <p className="mt-3 text-slate-400">
                    No topics available.
                </p>

            </div>
        )
    }

    return(
        <div className="mt-8">

            <h3 className="text-lg font-semibold">
                Topics
            </h3>

            <div className="mt-4 flex flex-wrap gap-2">

                {topics.map((topic) => (
                    <span key={topic}  className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-sm text-slate-200 transition hover:bg-slate-700">
                        {topic}
                    </span>
                ))}

            </div>

        </div>
    )
}