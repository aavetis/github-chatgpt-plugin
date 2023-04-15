import { NextApiRequest, NextApiResponse } from "next";
import { authenticateUser } from "@/utils/supabase";

const handleCallback = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { user } = await authenticateUser(req, res);

    res.redirect("/");
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

export default handleCallback;
