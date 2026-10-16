<!-- AGENTS:BEGIN -->
> [!IMPORTANT]
> Avoid rewriting published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history and the project may lose its history.
>
> Commits pushed to the connected branch should keep the branch in a working state.
<!-- AGENTS:END -->

Keep HELPS content as local arrays in `src/lib/site-data.ts` until a content service is requested, because this site is explicitly frontend-only.
Store downloaded original-site imagery as real files under `src/assets/original/`, because the site is also deployed to Vercel where Lovable CDN paths do not resolve.
Keep illustrative support imagery and its provenance separate from original founders and event assets, so stock or generated subjects are never represented as HELPS clients.
Keep policy information in shared PolicyPage views with separate leaf routes, because each policy needs a directly shareable address.
Use an email-app handoff for enquiries while the site remains frontend-only, because it must not imply an unsent enquiry has been received.
Admin and Resources talk to PHP only through src/lib/api.ts (ENDPOINTS, VITE_API_BASE); public pages fall back to local posts when the API is unreachable, because the PHP API is connected separately.
Build is a static export (nitro off, prerendered pages listed in vite.config.ts, _shell.html fallback via public/.htaccess, router trailingSlash "preserve"), because the site is hosted on PHP-only shared hosting; new article slugs must be added to the pages list to get their own HTML file.
