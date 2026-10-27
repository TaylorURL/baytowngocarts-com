import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Button from "../components/ui/Button";
import Icon from "../components/ui/Icon.jsx";
import AuthShell from "../components/layout/AuthShell.jsx";
import RouteMeta from "../components/shell/RouteMeta.jsx";
import { supabaseClient } from "../lib/supabase";
import { CONTACT_INFO } from "../lib/content/business.js";
import { SHARE_IMAGE, SITE_URL } from "../lib/seo/schema.js";

export const metadata = {
  title: "Unsubscribe | Speedway 146",
  description:
    "Stop cart reminders, offers and come-back emails from Speedway 146.",
  canonical: "/unsubscribe",
  robots: "noindex, nofollow",
  crumbs: [{ name: "Unsubscribe", path: "/unsubscribe" }],
  openGraph: {
    "og:title": "Unsubscribe | Speedway 146",
    "og:description":
      "Stop cart reminders, offers and come-back emails from Speedway 146.",
    "og:url": SITE_URL + "/unsubscribe",
    "og:image": SHARE_IMAGE,
    "og:type": "website",
  },
};

const TOKEN_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/*
 * The email's link lands here and the reader presses the button. Unsubscribing
 * on arrival would let any mail scanner that follows links unsubscribe people
 * who never asked to be; the one-click button in the mail client posts to the
 * function directly and never comes through this page.
 */
const UnsubscribePage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [state, setState] = useState({ status: "ready" });

  const unsubscribe = async () => {
    setState({ status: "working" });
    try {
      const { error } = await (
        await supabaseClient()
      ).functions.invoke("email-unsubscribe", { body: { token } });
      if (error) {
        const refused = await error.context?.json?.().catch(() => null);
        setState({
          status: "error",
          message:
            refused?.error || "That didn't go through. Please try again.",
        });
        return;
      }
      setState({ status: "done" });
    } catch {
      setState({
        status: "error",
        message: "That didn't go through. Please try again.",
      });
    }
  };

  const validToken = TOKEN_PATTERN.test(token);

  return (
    <AuthShell>
      <RouteMeta metadata={metadata} />
      <div className="bg-chalk rounded-lg shadow-lift border border-asphalt-200 overflow-hidden">
        <div className="caution-tape h-2" aria-hidden="true" />
        <div className="p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-asphalt-50 ring-1 ring-asphalt-200 mx-auto mb-4">
            <Icon
              name={state.status === "done" ? "check-circle" : "mail"}
              className={`h-8 w-8 ${state.status === "done" ? "text-green-600" : "text-race-600"}`}
            />
          </div>
          {state.status === "done" ? (
            <>
              <h1 className="font-display text-3xl tracking-tight text-asphalt-900 mb-2">
                You're unsubscribed
              </h1>
              <p className="text-asphalt-600 mb-6">
                Speedway 146 won't send you any more deals, cart reminders or
                come-back emails.
              </p>
              <Button to="/" variant="outline" fullWidth>
                Return to Home
              </Button>
            </>
          ) : validToken ? (
            <>
              <h1 className="font-display text-3xl tracking-tight text-asphalt-900 mb-2">
                Unsubscribe from Speedway 146 emails?
              </h1>
              <p className="text-asphalt-600 mb-6">
                This stops deals, cart reminders and come-back emails for your
                account.
              </p>
              {state.status === "error" && (
                <p role="alert" className="text-sm text-race-700 mb-4">
                  {state.message}
                </p>
              )}
              <Button
                variant="primary"
                fullWidth
                size="lg"
                onClick={unsubscribe}
                disabled={state.status === "working"}
              >
                {state.status === "working" ? "Unsubscribing…" : "Unsubscribe"}
              </Button>
            </>
          ) : (
            <>
              <h1 className="font-display text-3xl tracking-tight text-asphalt-900 mb-2">
                This link isn't complete
              </h1>
              <p className="text-asphalt-600 mb-6">
                Use the unsubscribe link at the bottom of any Speedway 146
                email, or email{" "}
                <a
                  href={CONTACT_INFO.emailMailto}
                  className="text-race-600 font-semibold"
                >
                  {CONTACT_INFO.email}
                </a>{" "}
                and we'll take you off the list.
              </p>
              <Button to="/" variant="outline" fullWidth>
                Return to Home
              </Button>
            </>
          )}
        </div>
      </div>
    </AuthShell>
  );
};

export default UnsubscribePage;
