
type validationResult = {
    valid: boolean;
    owner: string | null;
    repo: string | null;
    error?: string;
}

export default function validateGithubUrl(url : string):validationResult {
    try {
        const parsedUrl = new URL(url);

        if ( parsedUrl.hostname !== "github.com") {
            return {
            valid: false,
            owner: null,
            repo: null,
            error: "Invalid GitHub URL",
            }
        }

        const paths = parsedUrl.pathname
        .split("/")
        .filter(Boolean)
        
        if ( paths.length < 2) {
            return {
             valid: false,
             owner: null,
             repo: null,
             error: "Repository not found in URL",
            }
        }

        return {
          valid: true,
          owner: paths[0],
          repo: paths[1],
        } 
      }catch {
       return {
         valid: false,
         owner: null,
         repo: null,
         error: "Invalid URL format",
        }

    }

}
    
