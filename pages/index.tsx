import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  useUser,
  useSupabaseClient,
  useSession,
} from "@supabase/auth-helpers-react";
import { supabase } from "@supabase/auth-ui-shared";

const SignIn = () => {
  const router = useRouter();
  const user = useUser();
  const supabaseClient = useSupabaseClient();
  const [redirectUri, setRedirectUri] = useState("");
  const [accessToken, setAccessToken] = useState("");

  const session = useSession();

  useEffect(() => {
    const redirectParam = router.query.redirect_uri as string;
    if (redirectParam) {
      setRedirectUri(redirectParam);
      console.log("about to redirect to ", redirectParam);
    }
  }, [router.query]);

  useEffect(() => {
    if (session) {
      setAccessToken(session.provider_token as string);
    }
  }, [session]);

  useEffect(() => {
    if (user && accessToken) {
      if (redirectUri) {
        router.replace(`${redirectUri}?code=${accessToken}`);
      } else {
        // Redirect to the desired page if redirectUri is not available
        // router.replace("/welcome");
      }
    }
  }, [user, router, redirectUri, accessToken]);

  const handleGithubSignIn = async () => {
    const { data, error } = (await supabaseClient.auth.signInWithOAuth({
      provider: "github",
      options: {
        scopes: "repo gist",
        // redirectTo: redirectUri,
      },
    })) as any;

    if (error) {
      console.log(error);
      return;
    }

    if (data && data.session) {
      console.log("we just got a successful login");
      // const accessToken = data.session.provider_token;
      console.log("accessToken", accessToken);
      setAccessToken(accessToken);

      if (redirectUri) {
        router.replace(`${redirectUri}?code=${accessToken}`);
      } else {
        console.log("don't have a redirect");

        // Redirect to the desired page if redirectUri is not available
        router.replace("/welcome");
      }
    }
  };

  const handleAnonymousSignIn = () => {
    const anonymousToken = "ANONYMOUS";
    if (redirectUri) {
      router.replace(`${redirectUri}?code=${anonymousToken}`);
    } else {
      // Redirect to the desired page if redirectUri is not available
      // router.replace("/welcome");
    }
  };

  if (!user)
    return (
      <div className="flex justify-center height-screen-helper">
        <div className="flex flex-col justify-between max-w-lg p-3 m-auto w-80 ">
          <div className="flex justify-center pb-12 "></div>
          <div className="flex flex-col space-y-4">
            <button
              onClick={handleGithubSignIn}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Sign in with GitHub
            </button>
            <button
              onClick={handleAnonymousSignIn}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Use Anonymously
            </button>
          </div>
        </div>
      </div>
    );

  return null;
};

export default SignIn;
