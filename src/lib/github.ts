export async function fetchGitHubFiles(repoUrl: string) {
  try {
    // Parse GitHub URL
    const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/)
    if (!match) {
      throw new Error('Invalid GitHub URL')
    }

    const [, owner, repo] = match
    const cleanRepo = repo.replace('.git', '')

    // Fetch common files
    const files = ['index.html', 'index.js', 'script.js', 'style.css', 'README.md', 'app.js', 'main.js']
    const fetchedFiles = []

    for (const file of files) {
      try {
        const url = `https://raw.githubusercontent.com/${owner}/${cleanRepo}/main/${file}`
        const response = await fetch(url)
        
        if (response.ok) {
          const content = await response.text()
          fetchedFiles.push({ name: file, content })
        }
      } catch (error) {
        // Skip files that don't exist
        continue
      }
    }

    return fetchedFiles
  } catch (error) {
    console.error('Error fetching GitHub files:', error)
    return []
  }
}