# Current Goal
Publish the Expo Web app so the user can share it externally.

# Decisions
- Use Netlify production deploy because GitHub Pages push failed on SSH auth.
- Keep persistence local-first for now; shared accounts/server database are not implemented.
- Add `.netlify/` to `.gitignore` because it is local deployment state.

# Plan Status
- Local web build completed with `npm run build:web`.
- Netlify production deploy completed for `jianfei-xiexiu-app`.
- Remaining work is optional: commit current changes and add backend storage if cross-device shared data is required.

# Evidence
- Public URL: https://jianfei-xiexiu-app.netlify.app
- Deploy URL: https://6a414693868a3c2107f4ea1b--jianfei-xiexiu-app.netlify.app
- `curl -I` returned HTTP 200 for the public site.
- Network checks returned HTTP 200 for `/`, `/favicon.ico`, and the main Expo JS bundle.

# Open Issues
- Browser automation could not run because Playwright browser binaries are missing.
- Data currently stays in each visitor's browser storage.
