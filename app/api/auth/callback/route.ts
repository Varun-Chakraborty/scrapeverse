import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createSession } from "@/lib/session";
import { recordConsent } from "@/lib/consent";

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

interface GitHubUser {
  id: number;
  login: string;
  name: string | null;
  email: string | null;
  avatar_url: string | null;
}

interface GitHubEmail {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: string | null;
}

async function getAccessToken(code: string): Promise<string> {
  const res = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const data = await res.json();
  if (data.error) {
    throw new Error(data.error_description || "Failed to get access token");
  }
  return data.access_token;
}

async function getGitHubUser(token: string): Promise<GitHubUser> {
  const res = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
    },
  });

  if (!res.ok) {
    if (process.env.NODE_ENV === "development") {
      console.error("GitHub user fetch failed:", res.status, await res.text());
    } else {
      await res.text();
    }
    throw new Error("Failed to fetch GitHub user");
  }
  return res.json();
}

async function getGitHubEmails(token: string): Promise<GitHubEmail[]> {
  const res = await fetch("https://api.github.com/user/emails", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
    },
  });

  if (!res.ok) {
    if (process.env.NODE_ENV === "development") {
      console.error(
        "GitHub emails fetch failed:",
        res.status,
        await res.text(),
      );
    } else {
      await res.text();
    }
    throw new Error("Failed to fetch GitHub emails");
  }
  return res.json();
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(
      new URL(`/?error=${error || "missing_code"}`, request.url),
    );
  }

  try {
    const token = await getAccessToken(code);
    const githubUser = await getGitHubUser(token);

    let email = githubUser.email;
    if (!email) {
      const emails = await getGitHubEmails(token);
      const primary = emails.find((e) => e.primary && e.verified);
      email = primary?.email || emails[0]?.email || null;
    }

    if (!email) {
      return NextResponse.redirect(new URL("/?error=no_email", request.url));
    }

    const existingUser = await db.user.findFirst({
      where: {
        OR: [
          { githubId: String(githubUser.id) },
          { email: email.toLowerCase() },
        ],
      },
    });

    let user;
    let isNewUser = false;
    if (existingUser) {
      user = await db.user.update({
        where: { id: existingUser.id },
        data: {
          githubId: String(githubUser.id),
          avatarUrl: githubUser.avatar_url,
          name: githubUser.name || existingUser.name,
        },
      });
    } else {
      isNewUser = true;
      user = await db.user.create({
        data: {
          email: email.toLowerCase(),
          name: githubUser.name || githubUser.login,
          githubId: String(githubUser.id),
          avatarUrl: githubUser.avatar_url,
        },
      });
    }

    const ipAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;

    await recordConsent(user.id, ipAddress);

    await createSession({ userId: user.id, email: user.email });

    const destination = isNewUser ? "/onboarding" : "/results";
    return NextResponse.redirect(new URL(destination, request.url));
  } catch (err) {
    console.error("GitHub OAuth callback error:", err);
    return NextResponse.redirect(new URL("/?error=oauth_failed", request.url));
  }
}
