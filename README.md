# SB · The FLAMES notebook

Two names, a looping soundtrack, a ruled notebook, and the schoolyard FLAMES game. Open the page and the pen writes **FLAMES**, then both names. It crosses out matching letters one pair at a time, counts through FLAMES, and draws a red heart around the surviving letter. The finished page stays on screen while an orange butterfly continues flying around the margins. Refresh to replay.

**[Open the live notebook](https://sb-five-tau.vercel.app)**

<img width="1698" height="408" alt="The finished FLAMES row on ruled paper, with a red heart around M" src="https://github.com/user-attachments/assets/51320044-5176-4e28-ace1-ebe7a6eceec0" />

## Run locally

Use Git, npm, and Node.js 22.13 or newer on the 22.x line. From a terminal:

```sh
git clone https://github.com/samranjithpaul/SB.git
cd SB
cp .env.example .env.local
npm install
npm run dev
```

Open [localhost:3000](http://localhost:3000). On Windows PowerShell, use `Copy-Item .env.example .env.local` for the copy step. Press Ctrl+C to stop the server.

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local development server. |
| `npm test` | Run the game and date assertions with Node’s test runner. |
| `npm run build` | Compile a production build. |
| `npm start` | Serve the compiled build locally after building. |

## Change the names and date

Edit **.env.local** in the project root and restart the local server. The same keys can be set as Production environment variables in Vercel.

```dotenv
MALE_NAME="SAM RANJITH PAUL S"
FEMALE_NAME="BINUSHA B"
NOTEBOOK_DATE="08/12"
```

| Setting | What it controls |
| --- | --- |
| `MALE_NAME` | Upper line and first name in the pairing algorithm. |
| `FEMALE_NAME` | Lower line and second name in the pairing algorithm. |
| `NOTEBOOK_DATE` | Upper-right inscription. Use `08/12` for December 8 with the current India year, or `08/12/2026` to keep a fixed year. |

The example values are also the application defaults when the keys are absent. A supplied name must contain at least one letter. Each visit renders the configured names into the visible page and its accessible description. The date is decorative and has no effect on the game. Day and month require two digits. A date such as `29/02` is valid only when the resolved year is a leap year.

## Why this stack fits the project

| Choice | What it does here and why it fits |
| --- | --- |
| **Next.js 16, App Router** | One dynamic server-rendered route reads the configuration, resolves the date, and calculates the complete result on each request. Names and dates can be changed through hosting settings without creating a public input form or a separate API. |
| **React 19 and TSX** | The page maps each glyph, match, and elimination to an SVG element. The butterfly has its own client component because it needs browser frame timing and tab-visibility events. |
| **TypeScript** | The game works with original character indices and a winner that can be null. Types carry that distinction into the rendering code, where zero unmatched letters require a different ending. |
| **SVG** | Each glyph is a set of pen paths. The letter, its strike, and the final heart share coordinates and scale together on different screens. This allows the same artwork to handle new names and winners. |
| **CSS keyframes** | The handwriting has a known order once the names are set. The server assigns delays and durations, and CSS reveals each path. The same stylesheet handles the opening fade and reduced motion. |
| **Browser JavaScript** | The butterfly needs an open-ended flight. Its animation frame loop updates SVG transforms directly, so every wingbeat can be drawn without triggering a React render. |
| **Node.js, npm, and Vercel** | Node runs the server and the built-in assertion suite. npm exposes four project commands. Vercel builds the GitHub project and serves the dynamic route. |

The runtime dependency list contains Next.js, React, and React DOM. Game state is derived entirely from the two names. There is no database, login, external game API, or video file to configure.

## How FLAMES chooses the winner

1. Keep each letter’s position in the original name and lowercase it for comparison. Spaces, punctuation, and digits stay visible but do not count.
2. Read the upper name left to right. Match each letter to the first unused occurrence in the lower name. Each occurrence can be crossed out once.
3. Count all unmatched letters in both names. Starting at **F** as one, count around the remaining FLAMES letters and eliminate the letter where the count ends. Resume at the next surviving letter.
4. Repeat until one letter survives. The heart uses that letter’s position. When the unmatched count is zero, the page displays “No letters left to count.”

| F | L | A | M | E | S |
| --- | --- | --- | --- | --- | --- |
| Friends | Love | Affection | Marriage | Enemies | Siblings |

**Worked example.** SAM RANJITH PAUL S and BINUSHA B have 23 letters between them. Six pairs cancel in the order S, A, N, I, H, U, leaving 11 letters. Counting by 11 eliminates E, S, A, F, then L. The heart lands on **M**. For Amit and Anita the count is 3 and **F** wins.

## How the scene is built

The notebook uses a **777 × 947** SVG coordinate system inside a full-window desk background. A rotated paper rectangle, repeated rules, a red margin, and a grain texture form the page. Each name is measured using its glyph widths and scaled to fit its row. Known glyphs use custom strokes. Other visible characters use the browser’s cursive font and fade in. The matching logic uses Unicode letters, but the renderer places individual code points, so complex scripts and combining marks can need additional layout work.

| Stage | Timing or behavior |
| --- | --- |
| Opening | The opening follows the recording’s estimated pulse. Writing begins near 1.91 seconds. |
| Writing | Draw FLAMES first, then the upper and lower names. Each custom pen stroke takes 155 ms for FLAMES and 200 ms for the names. More strokes and longer names extend the scene. |
| Cancellations | Each 445 ms strike reuses the matched character’s transform. Repeated letters therefore receive marks on the paired occurrences. |
| Final reveal | After the last elimination, hold for at least one second. Draw the heart over four beats and darken its tail crossing. The final ink stays visible. |
| Butterfly | Pick a starting perch among eight margin positions. Vary each flight’s direction, bend, speed, and landing offset. Flap during flight, glide briefly, then rest for 1.2–3.8 seconds before taking off again. |

The butterfly pauses in a hidden tab and resumes when visible. With reduced motion enabled, the stylesheet displays the completed notebook immediately and hides the butterfly. The SVG’s accessible label includes the date, names, unmatched count, and outcome.

## Where to make changes

| File | Responsibility |
| --- | --- |
| [app/page.tsx](app/page.tsx) | Reads settings, places the three rows, constructs the timed stroke sequence, and positions the date and heart. Edit the row centers or timing here. |
| [app/butterfly.tsx](app/butterfly.tsx) | Defines the wings, color gradient, perches, frame loop, and visibility handling. |
| [app/style.css](app/style.css) | Controls the viewport, opening fade, stroke reveal, texture, and reduced-motion rules. |
| [app/layout.tsx](app/layout.tsx) | Sets the document language, browser title, description, and initial black background. |
| [lib/game.ts](lib/game.ts) | Produces the matched positions, unmatched count, elimination order, and winner index. |
| [lib/date.ts](lib/date.ts) | Validates the day and month and resolves the year using Asia/Kolkata when omitted. |
| [lib/glyph.ts](lib/glyph.ts) | Maps characters to SVG pen paths. A vertical bar separates strokes where the pen lifts. |
| [public/grain.svg](public/grain.svg) | Supplies the repeating grain over the paper and desk. |
| [tests.mjs](tests.mjs) | Checks the game and date functions independently of the animation. |
| [.env.example](.env.example), [.gitignore](.gitignore), [package.json](package.json) | Provide configuration examples, local file exclusions, dependency ranges, and run commands. |

## Testing and troubleshooting

The automated assertions cover the default couple, Amit and Anita, all six winners, repeated letters, a zero count, punctuation and original indices, and a long name. Date tests exercise the India New Year boundary, a valid leap day, and an impossible calendar date. These are logic tests. To check presentation after a visual edit, replay on a narrow phone and a wide desktop, watch the final heart alignment, then enable reduced motion and reload.

| Symptom | What to check |
| --- | --- |
| Live site still shows the previous names | Set the keys in the Vercel **Production** environment and redeploy. Locally, check the root .env.local and restart the dev server. |
| Server error after editing configuration | Check the server logs. Both names need a letter. Check the date format and whether that day exists in the chosen year. |
| Heart is missing | Check whether all letters paired off. A zero count intentionally produces the handwritten message. |
| Scene opens on the finished frame | Check the device’s reduced-motion preference. |
| Some letters appear differently | Check the glyph map. Characters outside it use the cursive fallback. |

## Deploy from GitHub

Import **samranjithpaul/SB** into Vercel, select the repository root and the **Next.js** preset, and use **main** as the production branch. Add any desired Production environment overrides, deploy, and open the production URL. For later code changes, push to the connected branch. For an environment-only edit, create a new deployment to apply it.

## License

Copyright © 2026 Sam Ranjith Paul. Distributed under the [MIT License](LICENSE).

## Soundtrack

The supplied loop is served as MP3. If the browser blocks audible autoplay, tap the notebook once to start the music and replay the writing in sync. Audio loops while the finished page holds. Strike cues use an estimated 142.65 BPM grid with a 227 ms offset. Changing the recording requires updating those values in app/page.tsx.
