import { NextRequest, NextResponse } from "next/server";
import { Vercel } from "@vercel/sdk";

interface DeployRequest {
  branchName: string;
  instagramUsername: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as DeployRequest;
    const { branchName, instagramUsername } = body;

    if (!branchName || !instagramUsername) {
      return NextResponse.json(
        { error: "branchName and instagramUsername are required" },
        { status: 400 }
      );
    }

    // Validate inputs
    if (!/^[a-zA-Z0-9_-]+$/.test(branchName)) {
      return NextResponse.json(
        {
          error:
            "Invalid branch name. Use only letters, numbers, hyphens and underscores",
        },
        { status: 400 }
      );
    }

    if (!/^[a-zA-Z0-9_.-]+$/.test(instagramUsername)) {
      return NextResponse.json(
        {
          error:
            "Invalid Instagram username. Use only letters, numbers, hyphens, underscores and dots",
        },
        { status: 400 }
      );
    }

    // Initialize Vercel SDK
    const vercel = new Vercel({
      bearerToken: process.env.VERCEL_API_TOKEN,
    });

    // Configuration for the deployment
    const projectName = "socialweb-projects";
    const githubRepo = "socialweb-projects";
    const githubOrg = "marianocorvatta"; // Your GitHub username
    const aliasName = `${instagramUsername}.vercel.app`;

    console.log(`Creating deployment for branch: ${branchName}`);

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
      },
    });

    const deploymentId = createResponse.id;

    console.log(
      `Deployment created: ID ${deploymentId} and status ${createResponse.status}`
    );

    // Check deployment status with timeout
    let deploymentStatus;
    let deploymentURL;
    const maxAttempts = 60; // 5 minutes max (60 * 5 seconds)
    let attempts = 0;

    do {
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds between checks

      const statusResponse = await vercel.deployments.getDeployment({
        idOrUrl: deploymentId,
        withGitRepoInfo: "true",
      });

      deploymentStatus = statusResponse.status;
      deploymentURL = statusResponse.url;
      console.log(`Deployment status: ${deploymentStatus}`);

      attempts++;

      if (attempts >= maxAttempts) {
        throw new Error("Deployment timeout - took too long to complete");
      }
    } while (
      deploymentStatus === "BUILDING" ||
      deploymentStatus === "INITIALIZING"
    );

    if (deploymentStatus === "READY") {
      console.log(`Deployment successful. URL: ${deploymentURL}`);

      // Assign alias to the deployment
      const aliasResponse = await vercel.aliases.assignAlias({
        id: deploymentId,
        requestBody: {
          alias: aliasName,
          redirect: null,
        },
      });

      console.log(`Alias created: ${aliasResponse.alias}`);

      return NextResponse.json({
        success: true,
        message: "Deployment created and alias assigned successfully",
        deploymentId,
        deploymentURL,
        alias: aliasResponse.alias,
        status: deploymentStatus,
        branch: branchName,
        instagramUsername,
        timestamp: new Date().toISOString(),
      });
    } else {
      console.log(
        `Deployment failed or was canceled. Status: ${deploymentStatus}`
      );
      return NextResponse.json(
        {
          error: "Deployment failed or was canceled",
          deploymentId,
          status: deploymentStatus,
        },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error("Error creating Vercel deployment:", err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: errorMessage, details: err },
      { status: 500 }
    );
  }
}
