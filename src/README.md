# Nadiya’s Cake Craft — Website Source Code

A simple, self-contained cake shop website built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**.

- **Zero monthly subscriptions or paid APIs**
- **Prices in Bangladeshi Taka (`BDT` / `৳`)**
- **Direct WhatsApp Cart & Order Summary (`+880 1903-588929`)**
- **Easy-to-edit cake catalog (`src/data/cakes.ts`) + built-in visual Catalog Editor**

---

## Folder Overview

- `src/data/cakes.ts` — **Your main product & shop file.** Edit your WhatsApp number, delivery charge, cake names, BDT prices, sizes, flavors, and photos here.
- `src/components/` — Clean, modular sections (`Navbar`, `HeroSection`, `CakeGallery`, `ProductDetailView`, `CartDrawer`, `CatalogEditorModal`, `CraftAndContact`).
- `src/utils/whatsapp.ts` — Formats BDT prices and generates the WhatsApp order summary messages.

---

## How to Edit Your Cakes, Photos & BDT Prices

### Option 1: Use the Visual Editor on Your Website (Beginner Friendly)
1. Click **Edit Catalog** in the top navigation bar.
2. Change any cake's **name**, **photo**, **BDT prices**, **sizes**, or **flavors**—or add a new cake.
3. Click **Download `cakes.ts`** (or **Copy `cakes.ts`**) at the bottom of the editor.
4. Open your GitHub repository, go to `src/data/cakes.ts`, and replace it with the downloaded file.

### Option 2: Edit `src/data/cakes.ts` Directly on GitHub
1. In your GitHub repository, open `src/data/cakes.ts` and click the pencil (**Edit**) icon.
2. To add your own cake photo:
   - Upload your photo into a `public/cakes/` folder (for example, `public/cakes/chocolate-truffle.jpg`).
   - Set `image: '/cakes/chocolate-truffle.jpg'` on your cake object in `src/data/cakes.ts`.
3. Update `priceBdt`, `sizes`, or `flavors` and click **Commit changes**.

---

## Run Locally on Your Computer

```bash
npm install
npm run dev
```

Build static files for production:

```bash
npm run build
```

---

## Free Hosting Guide (Vercel / Netlify / Cloudflare Pages)

Because this website is a static React + Vite app with no backend server or paid database required, you can host it **100% free**:

1. Push or sync this repository to your personal **GitHub** account.
2. Sign in to **Vercel** (vercel.com) or **Netlify** (netlify.com) using your GitHub account (Free Hobby tier, no credit card needed).
3. Click **Add New Project** and select your **Nadiya’s Cake Craft** GitHub repository.
4. Keep the default Vite settings:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Click **Deploy**. Every time you update `src/data/cakes.ts` in GitHub, your live website will update automatically within 1 minute!
