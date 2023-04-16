import { NextApiRequest, NextApiResponse } from "next";
import { authenticateUser, getSessionToken } from "@/utils/supabase";
import {
  User,
  createServerSupabaseClient,
} from "@supabase/auth-helpers-nextjs";

const handleToken = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // Read the required parameters from the request body
    const { grant_type, client_id, client_secret, code, redirect_uri } =
      req.body;

    // Perform necessary validations
    if (
      grant_type !== "authorization_code" ||
      client_id !== "1" ||
      client_secret !== "1"
    ) {
      return res.status(400).json({ error: "invalid_request" });
    }

    const session = (await getSessionToken(req, res)) as any;
    console.log("session", session);

    // Send the access token back to ChatGPT
    res.json({ access_token: code });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

export default handleToken;
