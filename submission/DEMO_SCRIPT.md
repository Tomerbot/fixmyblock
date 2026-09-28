# FixMyBlock demo video script

## Why about 4 minutes and not 2

The hackathon asks for a video of up to **5 minutes** that covers 4 things: **The Problem, The Build
(a walkthrough of the code), The Demo, and Scalability.** The judges also score the **business model**
(25%) and **communication** (25%) from the video. A 2-minute video would only fit the demo.

So the plan is **about 4 minutes 15 seconds**. The app demo is the 2-minute core, in the middle.

| Part | Time | What the viewer sees |
|---|---|---|
| 1. The problem | 0:00–0:30 | Thumbnail/title slide, then the map |
| 2. The demo | 0:30–2:30 | Phone screen recording |
| 3. The build | 2:30–3:15 | The code on the computer |
| 4. Scalability | 3:15–3:40 | A simple diagram slide |
| 5. Business model | 3:40–4:10 | A slide |
| 6. Closing | 4:10–4:15 | Logo + link |

**Voice:** the judges score "communication", so your own voice is best, even with an accent.
Read the lines slowly. If you prefer, Claude can make an AI voice from the same text (the rules allow AI).
Slides for parts 1, 4, 5 and 6: Claude makes them when editing the video.

---

## Before you record

1. Open the app on your phone: `https://tomerbot.github.io/fixmyblock/` (after GitHub Pages is on).
2. Tap **(i) → Reset demo data**, so the numbers match this script.
3. Turn on **Do Not Disturb**, so no messages pop up.
4. Find a real problem outside to photograph (a broken light, a crack, overflowing trash).
   **No faces, no house numbers, no car plates** in the photo.
5. **Don't tap "Use my location" at home** while recording. It would show where you live.
   Move the map by hand instead.
6. Record with the Android screen recorder (pull down the quick settings → Screen record).
   Move slowly and wait 2–3 seconds on every result. No need to talk while recording.
7. Send the recording to yourself on WhatsApp **as a document** (not as a video), so it stays sharp.

---

## Part 1: The problem (0:00–0:30)

**Screen:** title slide with the thumbnail, then the map with all the rings.

> "[Your real story in one or two sentences. Example: "There was a broken streetlight on my way home for
> weeks."] Everyone saw it, but nobody reported it, because we all thought someone else already did.
> And when many people do report, the city gets twenty separate complaints, not one clear answer to:
> what should we fix first? I built FixMyBlock to fix that."

*(The part in brackets must be your real story, the same one as in DEVPOST.md.)*

---

## Part 2: The demo (0:30–2:30), phone recording

| # | Do this on the phone | Say this |
|---|---|---|
| 1 | Show the map. Wait 3 seconds. | "This is my neighborhood map. Every orange ring is a problem someone reported. A bigger ring means more neighbors saw it. The dashed rings are the top three." |
| 2 | Tap the biggest ring (the **9**, Pothole). Wait 3 seconds. | "This pothole was reported 6 days ago, and 9 neighbors saw it." |
| 3 | Tap **I saw it too**. The number becomes 10 and the button turns yellow. Wait 2 seconds. Close with X. | "Instead of writing the same report again, I just tap: I saw it too. Now it's 10." |
| 4 | Tap **Report a problem**. | "Now I'll report something new." |
| 5 | Tap the category of your real problem (for example **Streetlight**). | "I pick what's wrong," |
| 6 | Tap **Take or choose a photo** and take the photo. | "take a photo," |
| 7 | Drag the map so the dashed ring sits on a street. | "and move the map so the ring is on the spot." |
| 8 | Type a short note, for example `Light is out next to the kiosk`. | *(no need to talk while typing; this part will be sped up)* |
| 9 | Tap **Add to the map**. Wait 3 seconds on the new ring with the yellow dot. | "It's on the map. The yellow dot means it's mine." |
| 10 | Tap the **Fix first** tab. Scroll down slowly, then back up. | "The Fix first list ranks every open problem. Two points for every neighbor who saw it, three points for each level of danger, and one point for every day it waits. So a dangerous pothole beats a pile of trash, even with fewer votes." |
| 11 | Tap **Download list for the city (CSV)**. | "A city worker can download this list for Excel." |
| 12 | Tap row **2** (Streetlight). Tap **Share with city**. When the share menu opens, wait 2 seconds and close it (don't send). | "Share with city sends the details, a map link and the photo by email or WhatsApp." |
| 13 | Tap **Mark fixed**. The ring turns green. Wait 3 seconds. | "When it's fixed, anyone can mark it fixed, and the ring turns green." |
| 14 | Close the sheet. Tap the **Fixed** tab. Wait 3 seconds. | "The Fixed tab shows what got better on our block, and how many days each fix took." |

---

## Part 3: The build (2:30–3:15), computer screen recording

Record the computer screen (Windows: **Win + Alt + R**, or the Snipping Tool's video mode).
Open the project in VS Code (or on GitHub). Spend about 8 seconds on each item.

| Show | Say |
|---|---|
| The file list | "FixMyBlock is plain HTML, CSS and JavaScript, with no framework, so every file is small." |
| `js/map.js`, the `ringIcon` function | "The map is Leaflet with free OpenStreetMap tiles. Each ring is drawn as an SVG, and a spray-paint filter makes the edges rough." |
| `js/store.js`, the `urgency` function | "store.js holds all the data: saving, voting, marking fixed, and this urgency score." |
| `js/photo.js` | "Phone photos are shrunk on the phone to about 100 kilobytes before saving, because the browser only gives a site about 5 megabytes." |
| `js/app.js` | "And app.js connects it all to the buttons and screens." |

---

## Part 4: Scalability (3:15–3:40), diagram slide

**Slide:** `app.js / map.js` → `store.js` → today: `localStorage` | next: `online database + photo storage`

> "Right now, reports are saved in the browser. That's a demo. But everything goes through one file,
> store.js. To serve a whole city, only that file changes: it talks to an online database, and photos go
> to file storage. With thousands of reports, the map loads only the area you're looking at and groups
> nearby rings together."

---

## Part 5: Business model (3:40–4:10), slide

**Slide:** Residents: free. Schools and committees: ~$19/month. Small towns: ~$99/month.

> "Residents always use FixMyBlock for free. The customers are the people who fix things: small towns
> that can't afford big city software, and schools, campuses and neighborhood committees. They pay a
> monthly subscription for a dashboard: the Fix first list for their area, assigning work, and reports
> like average days to fix. My first step is a free pilot with one neighborhood, to get real numbers."

---

## Part 6: Closing (4:10–4:15)

**Slide:** the logo, "See it. Pin it. Get it fixed.", and the link.

> "FixMyBlock. See it, pin it, get it fixed. Thanks for watching."

---

## After recording

Send Claude the phone recording, the computer recording and (if you recorded one) your voice.
Claude will cut, speed up the typing, add captions and the slides, and check that it is under 5 minutes.
Upload to YouTube as **Unlisted**, choose **"No, it's not made for kids"**, and paste the
`https://www.youtube.com/watch?v=...` link into Devpost.
