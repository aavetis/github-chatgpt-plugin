import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  useUser,
  useSupabaseClient,
  useSession,
} from "@supabase/auth-helpers-react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

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
    }
  }, [router.query]);

  useEffect(() => {
    if (session) {
      setAccessToken(session.access_token);
    }
  }, [session]);

  useEffect(() => {
    if (user && accessToken) {
      // console.log("access", accessToken);
      if (redirectUri) {
        // Redirect the user back to the Chat.openai endpoint with the authorization code
        router.replace(`${redirectUri}?code=${accessToken}`);
      } else {
        // Redirect to the desired page if redirectUri is not available
        // router.replace("/welcome");
      }
    }
  }, [user, router, redirectUri, accessToken]);
  if (!user)
    return (
      <div className="flex justify-center height-screen-helper">
        <div className="flex flex-col justify-between max-w-lg p-3 m-auto w-80 ">
          <div className="flex justify-center pb-12 "></div>
          <div className="flex flex-col space-y-4">
            {/* todo: add 'repo' scope so to get private repos, when this pr is merged */}
            {/* https://github.com/supabase/auth-ui/issues/102 */}
            <Auth
              supabaseClient={supabaseClient}
              providers={["github"]}
              redirectTo={"/"}
              onlyThirdPartyProviders={true}
              // magicLink={true}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: "#404040",
                      brandAccent: "#52525b",
                    },
                  },
                },
              }}
              theme="dark"
            />
          </div>
        </div>
      </div>
    );
  if (user)
    return (
      <div className="flex justify-center height-screen-helper">
        <div className="flex flex-col justify-between max-w-lg p-3 m-auto w-80 ">
          logged in as {JSON.stringify(user)}
        </div>
      </div>
    );
};

export default SignIn;
