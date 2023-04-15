// welcome page for logged in users
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useUser, useSession } from "@supabase/auth-helpers-react";
import Image from "next/image";

const Welcome = () => {
  const user = useUser();

  // redirect to / if user is not logged in
  const router = useRouter();

  // get user access token from session in useuser
  const session = useSession();
  const access_token = session?.access_token;

  return (
    <>
      <div className="container max-w-4xl mx-auto mt-20">
        yer
        <div>email: {JSON.stringify(user?.user_metadata)}</div>
        <Image
          className="inline-block h-8 w-8 rounded-full mr-2"
          width={50}
          height={50}
          src={user?.user_metadata.avatar_url}
          alt=""
        />
        <b>{user?.user_metadata.user_name}</b>
      </div>
    </>
  );
};

export default Welcome;
