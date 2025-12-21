import { NextRequest, NextResponse } from "next/server";
import simpleGit from "simple-git";
import { promises as fs } from "fs";
import path from "path";
import { tmpdir } from "os";
import { Vercel } from "@vercel/sdk";

interface PushRequest {
  branchName: string;
  htmlContent?: string;
  instagramUsername?: string;
  templateCode?: string; // Template generado por IA
  overwrite?: boolean; // Si es true, sobrescribe el branch si ya existe
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as PushRequest;
    const { branchName, htmlContent, instagramUsername, templateCode, overwrite = true } = body;

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

    // Create a unique temporary directory for the clone
    const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const tempDir = path.join(tmpdir(), `repo-${uniqueId}`);
    const tempKeyDir = path.join(tmpdir(), `keys-${uniqueId}`);

    // Create directory for SSH key (separate from repo)
    await fs.mkdir(tempKeyDir, { recursive: true });

    // Setup SSH key - prioritize environment variable over file
    let deployKeyPath: string;
    let tempKeyFile = false;

    if (process.env.GITHUB_DEPLOY_KEY) {
      // Use SSH key from environment variable
      deployKeyPath = path.join(tempKeyDir, "deploy_key");
      await fs.writeFile(deployKeyPath, process.env.GITHUB_DEPLOY_KEY, { mode: 0o600 });
      tempKeyFile = true;
      console.log("🔑 Using GitHub deploy key from environment variable");
    } else {
      // Fallback to local file (for local development)
      deployKeyPath = path.join(process.cwd(), "github_deploy_key");
      console.log("🔑 Using GitHub deploy key from local file");
    }

    try {
      // Configure Git environment for SSH
      const gitSSHCommand = `ssh -i ${deployKeyPath} -o StrictHostKeyChecking=no`;

      // Initialize git for cloning (without baseDir since directory doesn't exist yet)
      const git = simpleGit({
        binary: "git",
        maxConcurrentProcesses: 1,
      });

      // Clone the repository - this creates tempDir
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

      // Use templateCode if provided, otherwise use htmlContent or default
      const content = templateCode || htmlContent || `<!DOCTYPE html>
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

      // Create package.json for Vercel static site
      const packageJson = {
        name: `site-${branchName}`,
        version: "1.0.0",
        description: `Static website for ${instagramUsername || branchName}`,
        scripts: {
          build: "echo 'No build needed for static site'"
        },
        keywords: ["static", "html"],
        author: instagramUsername || "Warp Agent",
        license: "MIT"
      };

      const packageJsonPath = path.join(tempDir, "package.json");
      await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2), "utf-8");

      // Create vercel.json for static site configuration
      const vercelConfig = {
        version: 2,
        buildCommand: "echo 'Static site - no build needed'",
        outputDirectory: ".",
        routes: [
          {
            src: "/(.*)",
            dest: "/index.html"
          }
        ]
      };

      const vercelConfigPath = path.join(tempDir, "vercel.json");
      await fs.writeFile(vercelConfigPath, JSON.stringify(vercelConfig, null, 2), "utf-8");

      // Add, commit and push
      await repoGit.add(["index.html", "package.json", "vercel.json"]);

      const commitMessage = templateCode
        ? `Add website generated by AI for ${branchName}\n\nTemplate code generated by AI assistant`
        : `Add index.html to ${branchName}`;

      await repoGit.commit(commitMessage, {
        "--author": '"Warp Agent <agent@warp.dev>"'
      });

      // Push to remote - use force if overwrite is true
      if (overwrite) {
        console.log(`🔄 Force pushing to branch ${branchName} (overwrite mode)`);
        await repoGit.push("origin", branchName, ["--force"]);
      } else {
        await repoGit.push("origin", branchName);
      }

      // Cleanup temp directories
      await fs.rm(tempDir, { recursive: true, force: true });

      if (tempKeyFile) {
        await fs.rm(tempKeyDir, { recursive: true, force: true });
        console.log("🧹 Cleaned up temporary SSH key file");
      }

      // Trigger Vercel deployment if instagramUsername is provided
      let deploymentResult = null;
      console.log(`📋 Checking deployment conditions - instagramUsername: ${instagramUsername}, VERCEL_TOKEN exists: ${!!process.env.VERCEL_TOKEN}`);

      if (instagramUsername) {
        console.log(`🚀 Starting Vercel deployment for branch: ${branchName}, alias: ${instagramUsername}.vercel.app`);

        try {
          // Initialize Vercel SDK
          const vercel = new Vercel({
            bearerToken: process.env.VERCEL_TOKEN,
          });

          // Configuration for the deployment
          const projectName = "socialweb-projects";
          const githubRepo = "socialweb-projects";
          const githubOrg = "marianocorvatta";
          const aliasName = `${instagramUsername}.vercel.app`;

          console.log(`📦 Creating deployment for ${githubOrg}/${githubRepo}@${branchName}`);

          // Create a new deployment
          const createResponse = await vercel.deployments.createDeployment({
            requestBody: {
              name: projectName,
              target: "production",
              gitSource: {
                type: "github",
                repo: githubRepo,
                ref: branchName,
                org: githubOrg,
              },
              projectSettings: {
                framework: null,
                devCommand: null,
                installCommand: null,
                buildCommand: "echo 'Static site - no build needed'",
                outputDirectory: ".",
                rootDirectory: null,
              },
            },
          });

          const deploymentId = createResponse.id;
          const deploymentURL = createResponse.url;

          console.log(`✅ Deployment created: ID ${deploymentId}, URL: ${deploymentURL}, Status: ${createResponse.status}`);

          // Monitor deployment synchronously (wait for completion)
          console.log(`⏳ Monitoring deployment ${deploymentId}...`);

          let deploymentStatus = createResponse.status;
          const maxAttempts = 60; // 5 minutes max
          let attempts = 0;

          while (
            (deploymentStatus === "BUILDING" || deploymentStatus === "INITIALIZING" || deploymentStatus === "QUEUED") &&
            attempts < maxAttempts
          ) {
            await new Promise((resolve) => setTimeout(resolve, 5000));

            const statusResponse = await vercel.deployments.getDeployment({
              idOrUrl: deploymentId,
              withGitRepoInfo: "true",
            });

            deploymentStatus = statusResponse.status;
            attempts++;

            console.log(`📊 Deployment status (attempt ${attempts}/${maxAttempts}): ${deploymentStatus}`);
          }

          if (deploymentStatus === "READY") {
            console.log(`🎉 Deployment successful! URL: ${deploymentURL}`);

            // Assign alias
            try {
              const aliasResponse = await vercel.aliases.assignAlias({
                id: deploymentId,
                requestBody: {
                  alias: aliasName,
                  redirect: null,
                },
              });

              console.log(`🔗 Alias assigned: ${aliasResponse.alias}`);

              deploymentResult = {
                success: true,
                deploymentId,
                deploymentURL,
                status: deploymentStatus,
                alias: aliasResponse.alias,
                message: "Deployment completed and alias assigned successfully",
              };
            } catch (aliasError) {
              console.error(`❌ Error assigning alias:`, aliasError);
              deploymentResult = {
                success: true,
                deploymentId,
                deploymentURL,
                status: deploymentStatus,
                message: "Deployment completed but alias assignment failed",
                aliasError: aliasError instanceof Error ? aliasError.message : 'Unknown alias error',
              };
            }
          } else if (attempts >= maxAttempts) {
            console.error(`⏱️  Deployment timeout - took too long to complete`);
            deploymentResult = {
              success: false,
              deploymentId,
              deploymentURL,
              status: deploymentStatus,
              error: "Deployment timeout - took too long to complete",
            };
          } else {
            console.error(`❌ Deployment failed with status: ${deploymentStatus}`);
            deploymentResult = {
              success: false,
              deploymentId,
              deploymentURL,
              status: deploymentStatus,
              error: `Deployment failed with status: ${deploymentStatus}`,
            };
          }

        } catch (deployError) {
          console.error('❌ Error creating Vercel deployment:', deployError);
          console.error('Error details:', JSON.stringify(deployError, null, 2));
          deploymentResult = {
            initiated: false,
            error: deployError instanceof Error ? deployError.message : 'Unknown deployment error',
            details: deployError,
          };
        }
      } else {
        console.log(`⚠️  Skipping Vercel deployment - instagramUsername not provided`);
      }

      return NextResponse.json({
        success: true,
        message: `Successfully pushed to branch: ${branchName}`,
        branch: branchName,
        repository: repoUrl,
        file: "index.html",
        timestamp: new Date().toISOString(),
        deployment: deploymentResult,
      });

    } catch (gitError) {
      // Cleanup temp directories on error
      await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {});
      await fs.rm(tempKeyDir, { recursive: true, force: true }).catch(() => {});
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
