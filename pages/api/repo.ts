// pages/api/repo.ts

import { NextApiRequest, NextApiResponse } from "next";
import { Octokit } from "@octokit/rest";
import { authenticateUser } from "@/utils/supabase";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

const verifyToken = (req: NextApiRequest) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return false;
  }
  const token = authHeader.split(" ")[1];
  return token === process.env.OPENAI_VERIFY_TOKEN;
};

const handleRepo = async (req: NextApiRequest, res: NextApiResponse) => {
  const { owner, repo } = req.query;

  // Get the auth header and extract the token
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Missing authorization header" });
  }
  const token = authHeader.split(" ")[1];

  try {
    // Verify the user token with Supabase
    const supabase = createServerSupabaseClient({
      req,
      res,
    });

    const { data: user, error } = await supabase.auth.getUser(token);

    if (error) {
      throw new Error(error.message);
    }

    // Initialize the Octokit GitHub client with the access token
    const octokit = new Octokit({ auth: token });

    // Fetch repository details from the GitHub API
    const { data: repository } = await octokit.rest.repos.get({
      owner: owner as string,
      repo: repo as string,
    });

    res.status(200).json({
      id: repository.id,
      name: repository.name,
      full_name: repository.full_name,
      description: repository.description,
    });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};

export default handleRepo;
