// pages/api/repo.ts

import { NextApiRequest, NextApiResponse } from "next";
import { Octokit } from "@octokit/rest";
import { authenticateUser } from "@/utils/supabase";

const verifyToken = (req: NextApiRequest) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return false;
  }
  const token = authHeader.split(" ")[1];
  return token === process.env.OPENAI_VERIFY_TOKEN;
};

// eslint-disable-next-line import/no-anonymous-default-export
const handleRepo = async (req: NextApiRequest, res: NextApiResponse) => {
  // log auth token from header
  console.log("req.headers", req.headers.authorization);

  const { owner, repo } = req.query;

  const { user, supabase } = await authenticateUser(req, res);

  //authenticate using bearer token
  // const { user, session, error } = await supabase.auth.api.getUserByCookie(req);

  // check openai verification token
  if (!verifyToken(req)) {
    return res
      .status(401)
      .json({ error: "OpenAI verification token invalid." });
  }

  // Check if the user is authenticated
  if (!user) {
    return res.status(401).json({ error: "User not authorized" });
  }

  // Retrieve the stored access token for the authenticated user from the Supabase session
  const { data: session } = (await supabase.auth.getSession()) as any;

  // Check if the session data contains the GitHub access token
  if (!session) {
    return res.status(401).json({ error: "Session not found" });
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
