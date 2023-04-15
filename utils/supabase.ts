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
  const supabase = createServerSupabaseClient({ req, res });
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
