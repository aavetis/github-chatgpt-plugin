import { NextApiRequest, NextApiResponse } from "next";
import { Octokit } from "@octokit/rest";

interface RepoResponse {
  id: number;
  name: string;
  full_name: string;
  description: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { owner, repo } = req.query;

  if (typeof owner !== "string" || typeof repo !== "string") {
    return res.status(400).json({ error: "Invalid query parameters" });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const octokit = new Octokit({ auth: token });
    const { data } = await octokit.rest.repos.get({ owner, repo });

    const response: RepoResponse = {
      id: data.id,
      name: data.name,
      full_name: data.full_name,
      description: data.description || "",
    };

    res.status(200).json(response);
  } catch (error) {
    if (error.status === 404) {
      res.status(404).json({ error: "Not Found" });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
