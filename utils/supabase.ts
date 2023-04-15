// utils/api-helpers.ts
import { NextApiRequest, NextApiResponse } from "next";
import {
  User,
  createServerSupabaseClient,
} from "@supabase/auth-helpers-nextjs";

export async function authenticateUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // console.log("logging headers", req.headers);

  // modify authorization header to be compatible with supabase. remove "bearer" and just keep token.
  const token = req.headers.authorization?.replace("Bearer ", "");
  // req.headers.authorization = token;

  const supabase = createServerSupabaseClient({ req, res });
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  // console.error("error getting user", error);
  // if (error) throw Error(error.message);

  if (!user) throw Error("Could not get user");

  return { user, supabase };
}

export function handleMethodNotAllowed(
  req: NextApiRequest,
  res: NextApiResponse,
  allowedMethods: string[]
) {
  res.setHeader("Allow", allowedMethods);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}

export function handleNotFound(req: NextApiRequest, res: NextApiResponse) {
  res.status(404).json({ error: `Cannot ${req.method} ${req.url}` });
}

export async function getSessionToken(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabase = createServerSupabaseClient({ req, res });
  const { data: session } = await supabase.auth.getSession();
  return session;
}
