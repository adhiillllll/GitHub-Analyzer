import ReactMarkdown from "react-markdown"

type ReadmeCardProps = {
    readme : string;
} 


export default function ReadmeCard({
    readme,
} : ReadmeCardProps) {

    if(!readme) {
        return(

            <div className="mt-8 rounded-lg border border-slate-700 p-6">

                <h3 className="text-lg font-semibold">
                    README
                </h3>

                <p className="mt-3 text-slate-400"> 
                    No README found for this repository.
                </p>

            </div>
        )
    }
    

    return(
        
        <div className="mt-8">

            <h3 className="text-lg font-semibold">
                README Preview
            </h3>
            
            <div className="mt-4 max-h-96 overflow-auto rounded-lg bg-slate-800 p-4">
                <div className="prose prose-invert max-w-none">
                    <ReactMarkdown>
                      {readme}
                    </ReactMarkdown>
                </div>
            </div>

        </div>
    )

}