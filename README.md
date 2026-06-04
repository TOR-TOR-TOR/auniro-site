# Auniro

A static landing page for Auniro and the Duesly waitlist.

## Run Locally

```powershell
node server.mjs
```

Then open:

```text
http://127.0.0.1:4173
```

## Deploy To GitHub Pages

1. Create a new GitHub repository, for example `auniro-site`.
2. Push these files to the repository root.
3. In GitHub, open `Settings -> Pages`.
4. Set `Source` to `Deploy from a branch`.
5. Select the `main` branch and `/root`.
6. Save. GitHub will publish the site at:

```text
https://YOUR_USERNAME.github.io/auniro-site/
```

For a custom domain like `auniro.com`, add the domain under `Settings -> Pages`, then point the domain DNS to GitHub Pages.

## Connect The Waitlist

The waitlist form reads its backend URL from this tag in `index.html`:

```html
<meta name="waitlist-endpoint" content="">
```

Set `content` to your backend endpoint.

### Easiest Option: Formspree

1. Create a Formspree form.
2. Copy the endpoint URL. It looks like:

```text
https://formspree.io/f/your-form-id
```

3. Add it to `index.html`:

```html
<meta name="waitlist-endpoint" content="https://formspree.io/f/your-form-id">
```

No backend code is needed.

### Better App Backend: Supabase

Create a `waitlist` table with columns:

- `id`
- `name`
- `email`
- `groupType`
- `channel`
- `source`
- `createdAt`

Then create a tiny API endpoint with Supabase Edge Functions or your own server. Point `waitlist-endpoint` to that endpoint.
