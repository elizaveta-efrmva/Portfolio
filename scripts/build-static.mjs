import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const outDir = join(root, "out");
const posthogProjectToken = process.env.POSTHOG_PROJECT_TOKEN?.trim();
const posthogHost = (process.env.POSTHOG_HOST?.trim() || "https://eu.i.posthog.com").replace(/\/+$/, "");

function createPosthogSnippet() {
  if (!posthogProjectToken) {
    return "";
  }

  if (!/^phc_[A-Za-z0-9_-]+$/.test(posthogProjectToken)) {
    throw new Error("POSTHOG_PROJECT_TOKEN must be a public PostHog project token starting with phc_.");
  }

  if (!/^https:\/\/[A-Za-z0-9.-]+(?::\d+)?$/.test(posthogHost)) {
    throw new Error("POSTHOG_HOST must be an HTTPS origin without a path.");
  }

  return `    <script>
      !(function (t, e) {
        var o, n, p, r;
        e.__SV ||
          ((window.posthog = e),
          (e._i = []),
          (e.init = function (i, s, a) {
            function g(t, e) {
              var o = e.split(".");
              (2 == o.length && ((t = t[o[0]]), (e = o[1])),
                (t[e] = function () {
                  t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
                }));
            }
            (((p = t.createElement("script")).type = "text/javascript"),
              (p.crossOrigin = "anonymous"),
              (p.async = !0),
              (p.src = s.api_host.replace(".i.posthog.com", "-assets.i.posthog.com") + "/static/array.js"),
              (r = t.getElementsByTagName("script")[0]).parentNode.insertBefore(p, r));
            var u = e;
            for (
              void 0 !== a ? (u = e[a] = []) : (a = "posthog"),
                u.people = u.people || [],
                u.toString = function (t) {
                  var e = "posthog";
                  return ("posthog" !== a && (e += "." + a), t || (e += " (stub)"), e);
                },
                u.people.toString = function () {
                  return u.toString(1) + ".people (stub)";
                },
                o =
                  "init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagResult isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug".split(
                    " ",
                  ),
                n = 0;
              n < o.length;
              n++
            )
              g(u, o[n]);
            e._i.push([i, s, a]);
          }),
          (e.__SV = 1));
      })(document, window.posthog || []);
      posthog.init(${JSON.stringify(posthogProjectToken)}, {
        api_host: ${JSON.stringify(posthogHost)},
        defaults: "2026-05-30",
        person_profiles: "identified_only",
        disable_session_recording: true,
        disable_surveys: true,
      });
    </script>`;
}

function copyFile(src, dest) {
  try {
    copyFileSync(src, dest);
  } catch (error) {
    if (error?.code !== "ETIMEDOUT") {
      throw error;
    }
    writeFileSync(dest, readFileSync(src));
  }
}

console.log("clean out");
rmSync(outDir, { force: true, maxRetries: 5, recursive: true, retryDelay: 100 });
mkdirSync(outDir, { recursive: true });

console.log("copy html");
const htmlTemplate = readFileSync(join(root, "static", "index.html"), "utf8");
const analyticsMarker = "    <!-- POSTHOG_ANALYTICS -->";

if (!htmlTemplate.includes(analyticsMarker)) {
  throw new Error(`Missing ${analyticsMarker.trim()} marker in static/index.html.`);
}

writeFileSync(
  join(outDir, "index.html"),
  htmlTemplate.replace(analyticsMarker, createPosthogSnippet()),
);
console.log(`PostHog analytics ${posthogProjectToken ? "enabled" : "disabled (POSTHOG_PROJECT_TOKEN is not set)"}`);

console.log("copy posters");
const posterSrcDir = join(root, "public", "posters");
if (existsSync(posterSrcDir)) {
  const posterOutDir = join(outDir, "posters");
  mkdirSync(posterOutDir, { recursive: true });
  for (const file of readdirSync(posterSrcDir)) {
    if (file.endsWith(".svg") || file.endsWith(".jpg") || file.endsWith(".jpeg") || file.endsWith(".png") || file.endsWith(".webp")) {
      console.log(`copy poster ${file}`);
      copyFile(join(posterSrcDir, file), join(posterOutDir, file));
    }
  }
}

for (const asset of [
  "showreel.mp4",
  "case-ai-illustrations.mp4",
  "case-dentists.mp4",
  "case-typography.mp4",
  "case-talking-head.mp4",
  "author-liza.png",
  "poster.jpg",
  "file.svg",
  "globe.svg",
  "next.svg",
  "vercel.svg",
  "window.svg",
  ".nojekyll",
]) {
  const src = join(root, "public", asset);
  if (existsSync(src)) {
    console.log(`copy asset ${asset}`);
    copyFile(src, join(outDir, asset));
  }
}

console.log("Static video portfolio exported to out/");
