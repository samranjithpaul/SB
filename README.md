# SB · The FLAMES notebook

A playful, silent notebook animation for Sam and Binusha, inspired by the schoolyard FLAMES game. Open the page and a black mosaic reveals the ruled paper. The pen writes FLAMES, then the first name, then the second. Matching letters get individual cancellation strokes. Finally, the pen eliminates five letters from FLAMES and draws a red heart around the survivor. The last frame stays still for a screenshot. Refresh to replay.

The desk fills the browser window. The notebook and writing share a vector coordinate system so the letters stay together as the window changes shape. The ink stays sharp on Retina and 4K displays. Reduced-motion preferences show the finished notebook immediately.

## Run on your computer

1. Install Node.js 22.13 or newer and Git.
2. Run the commands below in Terminal.
3. Open http://localhost:3000 and refresh to replay. Press Control-C in Terminal to stop the server.

~~~sh
git clone https://github.com/samranjithpaul/SB.git
cd SB
cp .env.example .env.local
npm install
npm run dev
~~~

## Change the names

Open .env.local in a text editor. Put the first name on the upper line and the second name on the lower line. Save, stop the development server, and run npm run dev again.

~~~dotenv
MALE_NAME="SAM RANJITH PAUL S"
FEMALE_NAME="BINUSHA B"
~~~

These variables are read on the server. Visitors see the configured names in the scene. The two names above are the defaults when variables are absent. An empty or punctuation-only value produces a server configuration error. Uppercase Latin letters use hand-drawn paths. Other visible characters fade in using the browser's cursive font.

## How the game works

Read the first name from left to right. Pair each letter with the first available occurrence in the second name, ignoring case, spaces and punctuation. Count the unmatched letters in both names. Count around the surviving FLAMES letters using that number, removing the letter where each count ends. Resume at the next surviving letter.

For the default names, six pairs cancel. Eleven letters remain. E, S, A, F and L are eliminated in order. M survives and receives the heart. The six outcomes are Friends, Love, Affection, Marriage, Enemies and Siblings. A zero count ends with a handwritten message. This is a spelling game for fun.

## Deploy on Vercel

Import samranjithpaul/SB into Vercel with the Next.js preset and the repository root as the project directory. Use main as the production branch. To customize the live names, open the project's Settings → Environment Variables, add MALE_NAME and FEMALE_NAME for Production, then redeploy. Subsequent main-branch pushes trigger fresh deployments when Git integration is enabled.

## Check and customize

Run npm test for the counting checks. Run npm run build followed by npm start to serve a production build locally.

- lib/game.ts pairs original character positions and calculates the elimination order.
- lib/glyph.ts defines the uppercase pen paths. A vertical bar separates strokes.
- app/page.tsx positions the notebook, generates the animation timeline on the server, and places the heart. Change the duration in strike() and its following pause to adjust the pace.
- app/style.css controls viewport coverage, mosaic timing and reduced motion.
- public/grain.svg supplies the repeating paper grain.
