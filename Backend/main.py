from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx
from fastapi.responses import PlainTextResponse

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)
GITHUB_API = "https://api.github.com"

@app.get("/")
async def root():
    return {"message": "GitHub Profile Finder API is live 🚀"}

@app.get("/search/{username}")
async def search_user(username: str):
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{GITHUB_API}/users/{username}")
        if response.status_code != 200:
            raise HTTPException(status_code=404, detail="User not found")

        data = response.json()
        return {
            "login": data["login"],
            "avatar_url": data["avatar_url"],
            "html_url": data["html_url"],
            "name": data.get("name"),
            "bio": data.get("bio"),
            "location": data.get("location")
        }

@app.get("/profile/{username}")
async def get_profile_and_repos(username: str):
    async with httpx.AsyncClient() as client:
        user_resp = await client.get(f"{GITHUB_API}/users/{username}")
        if user_resp.status_code != 200:
            raise HTTPException(status_code=404, detail="User not found")

        repo_resp = await client.get(f"{GITHUB_API}/users/{username}/repos")

        user = user_resp.json()
        repos = repo_resp.json()

        profile = {
            "login": user["login"],
            "name": user.get("name"),
            "bio": user.get("bio"),
            "avatar_url": user["avatar_url"],
            "location": user.get("location"),
            "followers": user["followers"],
            "following": user["following"],
            "public_repos": user["public_repos"],
            "html_url": user["html_url"],
            "created_at": user["created_at"]
        }

        repositories = [
            {
                "name": repo["name"],
                "html_url": repo["html_url"],
                "description": repo["description"],
                "language": repo["language"],
                "stars": repo["stargazers_count"],
                "forks": repo["forks_count"],
                "updated_at": repo["updated_at"]
            }
            for repo in repos
        ]

        return {
            "profile": profile,
            "repos": repositories
        }
    
@app.get("/files/{username}/{repo_name}")
async def get_repo_files(username: str, repo_name: str, branch: str = "main"):
    url = f"https://api.github.com/repos/{username}/{repo_name}/git/trees/{branch}?recursive=1"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        if response.status_code != 200:
            raise HTTPException(status_code=404, detail="Repository or branch not found")

        tree_data = response.json()

        files = [
            {
                "path": item["path"],
            }
            for item in tree_data.get("tree", [])
        ]

        return {
            "repo": repo_name,
            "branch": branch,
            "file_count": len(files),
            "files": files
        }

@app.get("/filecontent/{username}/{repo_name}/{sha}")
async def get_file_content(username: str, repo_name: str, sha: str):
    url = f"https://api.github.com/repos/{username}/{repo_name}/git/blobs/{sha}"
    headers = {"Accept": "application/vnd.github.v3.raw"}
    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=headers)
        if response.status_code != 200:
            raise HTTPException(status_code=404, detail="File not found")
        return response.text

from fastapi.responses import PlainTextResponse

@app.get("/rawfile/{username}/{repo}/{branch}/{file_path:path}", response_class=PlainTextResponse)
async def get_raw_file(username: str, repo: str, branch: str, file_path: str):
    url = f"https://raw.githubusercontent.com/{username}/{repo}/{branch}/{file_path}"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        if response.status_code != 200:
            raise HTTPException(status_code=404, detail="File not found")
        return response.text
