export async function fetchGitHubRepoFiles(repoUrl: string): Promise<{ name: string; content: string }[]> {
  try {
    // Extract owner and repo from GitHub URL
    const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/)
    if (!match) {
      throw new Error('Invalid GitHub URL')
    }

    const [, owner, repo] = match
    const cleanRepo = repo.replace(/\.git$/, '')

    // Fetch repository contents
    const contentsUrl = `https://api.github.com/repos/${owner}/${cleanRepo}/contents`
    const response = await fetch(contentsUrl, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch repository contents')
    }

    const contents = await response.json()

    // Filter for common code files
    const codeFiles = contents.filter((file: any) =>
      file.type === 'file' &&
      /\.(js|jsx|ts|tsx|py|html|css|json|md)$/i.test(file.name)
    )

    // Fetch content for each file
    const files = await Promise.all(
      codeFiles.slice(0, 10).map(async (file: any) => {
        const fileResponse = await fetch(file.download_url)
        const content = await fileResponse.text()
        return {
          name: file.name,
          content,
        }
      })
    )

    return files
  } catch (error) {
    console.error('Error fetching GitHub files:', error)
    return []
  }
}
