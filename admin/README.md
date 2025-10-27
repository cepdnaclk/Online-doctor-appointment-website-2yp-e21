# Admin app – env and API base

This admin SPA uses Vite env variables to choose which backend API to call.

## How it chooses the backend URL

- Primary: the query-string override `?api=...` on the page URL.
	- Example: `http://localhost:5173/login?api=https://your-service.up.railway.app`
- Fallback: `import.meta.env.VITE_BACKEND_URL` from env files or hosting env vars.
- We also trim trailing slashes.

Both Admin and Doctor contexts use this logic.

## Local development

- Use `.env.development` (already added) with:

	```
	VITE_BACKEND_URL=http://localhost:4000
	```

- Start the backend locally on port 4000, then start the admin dev server.

## Production (Netlify)

- Set an environment variable on your Netlify site:

	```
	VITE_BACKEND_URL=https://your-service.up.railway.app
	```

- Redeploy the site so the value is baked into the build.

## Quick switching without rebuilding

- Append `?api=` to the URL to temporarily point at a different backend without changing files or rebuilding.
	- Useful to test the hosted backend while running the admin locally.

## Gotchas

- If the site runs over HTTPS but `VITE_BACKEND_URL` is `http://localhost...`, the browser will block the requests (mixed content).
- When running on a non-localhost page, we log a console warning if your backend URL still points to `localhost`.
