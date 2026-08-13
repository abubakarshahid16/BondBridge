# BondBridge

BondBridge is a trust-first social connection app for verified students, professionals, families, friendships, serious relationships, and global respectful conversations.

## Use The App

- Live production app: https://bondbridge-verified-20260813.tabisharshad51.chatgpt.site
- GitHub Pages install app: https://abubakarshahid16.github.io/BondBridge/

## Install On Phone Or Desktop

Android / Chrome:

1. Open the GitHub Pages app link.
2. Tap the browser menu.
3. Tap Install app or Add to Home screen.

IPhone / Safari:

1. Open the GitHub Pages app link.
2. Tap Share.
3. Tap Add to Home Screen.

Desktop Chrome / Edge:

1. Open the GitHub Pages app link.
2. Click the install icon in the address bar, or use browser menu > Install app.

## One-Time GitHub Pages Switch

The workflow already builds and pushes the installable app to the `gh-pages` branch. For a brand-new repo, GitHub requires the owner to enable Pages once:

1. Open `Settings` in this repo.
2. Open `Pages` from the left sidebar.
3. Under `Build and deployment`, set `Source` to `Deploy from a branch`.
4. Set `Branch` to `gh-pages` and folder to `/ (root)`.
5. Click `Save`.

After saving, the app should be live at https://abubakarshahid16.github.io/BondBridge/ within 1-3 minutes.

## What Is Included

- Instagram-style feed and story UI
- Responsive mobile, tablet, laptop, and desktop layout
- Installable PWA shell
- Verified stranger discovery flow
- Family and friend reminder flows
- Respectful chat with foul-language blocking
- AI-style local message coach
- Profile photo and proof-upload UI
- Video lounge UI with browser-native WebRTC path
- Safety, proof review, data export, and local privacy controls
- Free backend path through the deployed production app

## Free Stack

This version avoids paid APIs. It uses the live production site for API routes and can use Supabase free tier plus browser-native WebRTC for real-time/video features.

## GitHub Pages Deployment

The workflow in `.github/workflows/deploy-pages.yml` mirrors the live production app into the `gh-pages` branch as an installable PWA.

Important: GitHub Pages may take 1-3 minutes after each workflow run before the public URL is live.
