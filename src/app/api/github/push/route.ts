import { NextRequest, NextResponse } from "next/server";
import simpleGit from "simple-git";
import { promises as fs } from "fs";
import path from "path";
import { tmpdir } from "os";

interface PushRequest {
  branchName: string;
  htmlContent?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as PushRequest;
    const { branchName, htmlContent } = body;

    if (!branchName) {
      return NextResponse.json(
        { error: "branchName is required" },
        { status: 400 }
      );
    }

    // Validate branch name (no spaces, special chars)
    if (!/^[a-zA-Z0-9_-]+$/.test(branchName)) {
      return NextResponse.json(
        { error: "Invalid branch name. Use only letters, numbers, hyphens and underscores" },
        { status: 400 }
      );
    }

    // Repository configuration
    const repoUrl = "git@github.com:marianocorvatta/socialweb-projects.git";
    const deployKeyPath = path.join(process.cwd(), "github_deploy_key");

    // Create a temporary directory for the clone
    const tempDir = path.join(tmpdir(), `repo-${Date.now()}`);
    await fs.mkdir(tempDir, { recursive: true });

    try {
      // Initialize git with SSH configuration
      const git = simpleGit({
        baseDir: tempDir,
        binary: "git",
        maxConcurrentProcesses: 1,
      });

      // Configure Git environment for SSH
      const gitSSHCommand = `ssh -i ${deployKeyPath} -o StrictHostKeyChecking=no`;

      // Clone the repository
      await git.env({
        ...process.env,
        GIT_SSH_COMMAND: gitSSHCommand,
      }).clone(repoUrl, tempDir);

      // Update git instance to use the cloned repo
      const repoGit = simpleGit({
        baseDir: tempDir,
        binary: "git",
        maxConcurrentProcesses: 1,
      }).env({
        ...process.env,
        GIT_SSH_COMMAND: gitSSHCommand,
      });

      // Create and checkout new branch
      await repoGit.checkoutLocalBranch(branchName);

      // Create HTML file content
      const content = htmlContent || `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hola Mundo</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: 'Arial', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .container {
            text-align: center;
            color: white;
            padding: 2rem;
        }
        h1 {
            font-size: 4rem;
            margin: 0;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        p {
            font-size: 1.5rem;
            margin-top: 1rem;
            opacity: 0.9;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>¡Hola Mundo!</h1>
        <p>Deployed from Next.js API</p>
    </div>
</body>
</html>`;

      // Write the HTML file
      const htmlFilePath = path.join(tempDir, "index.html");
      await fs.writeFile(htmlFilePath, content, "utf-8");

      // Add, commit and push
      await repoGit.add("index.html");
      await repoGit.commit(`Add index.html to ${branchName}`, {
        "--author": '"Warp Agent <agent@warp.dev>"'
      });
      await repoGit.push("origin", branchName);

      // Cleanup temp directory
      await fs.rm(tempDir, { recursive: true, force: true });

      return NextResponse.json({
        success: true,
        message: `Successfully pushed to branch: ${branchName}`,
        branch: branchName,
        repository: repoUrl,
        file: "index.html",
        timestamp: new Date().toISOString(),
      });

    } catch (gitError) {
      // Cleanup temp directory on error
      await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {});
      throw gitError;
    }

  } catch (err) {
    console.error("Error pushing to GitHub:", err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: errorMessage, details: err },
      { status: 500 }
    );
  }
}
