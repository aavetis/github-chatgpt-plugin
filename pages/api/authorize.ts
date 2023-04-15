// pages/api/authorize.ts

import { NextApiResponse, NextApiRequest } from "next";
import { authenticateUser } from "@/utils/supabase";

const handleAuthorize = async (req: NextApiRequest, res: NextApiResponse) => {
  // const { url, error } = supabase.auth.signIn({ provider: "github" });

  try {
    const { user, supabase } = await authenticateUser(req, res);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

//   if (error) {
//     res.status(400).json({ error: error.message });
//   } else {
//     res.redirect(url);
//   }
// };

export default handleAuthorize;
