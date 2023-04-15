// pages/api/repo.ts

import { NextApiRequest, NextApiResponse } from "next";
import { Octokit } from "@octokit/rest";
import { authenticateUser } from "@/utils/supabase";

// eslint-disable-next-line import/no-anonymous-default-export
const handleRepo = async (req: NextApiRequest, res: NextApiResponse) => {
  const { owner, repo } = req.query;

  const { user, supabase } = await authenticateUser(req, res);

  //authenticate using bearer token
  // const { user, session, error } = await supabase.auth.api.getUserByCookie(req);

  // Check if the user is authenticated
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Retrieve the stored access token for the authenticated user from the Supabase session
  const { data: session } = (await supabase.auth.getSession()) as any;

  // Check if the session data contains the GitHub access token
  if (!session) {
    return res.status(401).json({ error: "GitHub access token not found" });
  }

  console.log("sessions", session);

  // Initialize the Octokit GitHub client with the access token
  const octokit = new Octokit({ auth: session.session.access_token });

  try {
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
    res.status(404).json({ error: error.message });
  }
};

export default handleRepo;
