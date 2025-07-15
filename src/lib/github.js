export function parseGithubUrl(url) {
  const regex = /github\.com\/([^\/]+)\/([^\/]+)/;
  const match = url.match(regex);
  
  if (!match) {
    return null;
  }
  
  return {
    owner: match[1],
    repo: match[2].replace(/\.git$/, '')
  };
}

export async function fetchGithubRepo(owner, repo) {
  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        'User-Agent': 'MCP-Directory/1.0',
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      name: data.name,
      description: data.description,
      website_url: data.homepage,
      stars: data.stargazers_count,
      forks: data.forks_count,
      topics: data.topics || [],
      owner_avatar: data.owner.avatar_url,
      owner_name: data.owner.login
    };
  } catch (error) {
    console.error('Error fetching GitHub repo:', error);
    return null;
  }
}

export async function fetchGithubReadme(owner, repo) {
  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
      headers: {
        'User-Agent': 'MCP-Directory/1.0',
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    const content = atob(data.content);
    return content;
  } catch (error) {
    console.error('Error fetching GitHub README:', error);
    return null;
  }
}

export function createSlugFromName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function enrichServerWithGithubData(serverData) {
  if (!serverData.github_repo_url) {
    return serverData;
  }
  
  const parsed = parseGithubUrl(serverData.github_repo_url);
  if (!parsed) {
    return serverData;
  }
  
  const [repoData, readme] = await Promise.all([
    fetchGithubRepo(parsed.owner, parsed.repo),
    fetchGithubReadme(parsed.owner, parsed.repo)
  ]);
  
  if (!repoData) {
    return serverData;
  }
  
  return {
    ...serverData,
    name: serverData.name || repoData.name,
    description: serverData.description || repoData.description,
    website_url: serverData.website_url || repoData.website_url,
    stars: repoData.stars,
    forks: repoData.forks,
    tags: serverData.tags || repoData.topics,
    readme_markdown: readme,
    slug: serverData.slug || createSlugFromName(repoData.name)
  };
} 