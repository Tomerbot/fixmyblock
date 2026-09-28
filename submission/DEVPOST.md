# Devpost submission: FixMyBlock

> Before pasting: read every line and change anything that doesn't sound like you.
> The **Inspiration** section needs your real story. The part in [brackets] is only an example.

---

**Project name:** FixMyBlock

**Elevator pitch / tagline** (under 200 characters):
Report a broken streetlight or pothole with a photo and a pin. Neighbors confirm it, and the city gets a ranked list of what to fix first.

---

## Inspiration

[Write the real moment here. Example of the shape: "There is a streetlight on my way home that was broken for weeks. Everybody walking there in the dark noticed it, but I don't think anybody reported it, because we all thought someone else already did."]

That is the problem I wanted to solve. People see the same broken things every day, but reporting feels like it won't help, and when many people do report, the city gets 20 separate complaints instead of one clear answer to the question: what should we fix first?

## What it does

FixMyBlock puts every problem on one map of the neighborhood.

1. **Report a problem.** Pick what's wrong (pothole, streetlight, sidewalk, water leak, trash or something else), take a photo, and move the map so the orange ring sits on the spot. Or tap "Use my location".
2. **See it on the map.** Every report is a spray-paint ring, like the marks city crews paint around a pothole. The more people saw it, the bigger the ring.
3. **"I saw it too."** Instead of writing the same report again, neighbors confirm it with one tap.
4. **Fix first.** Open problems are ranked by an urgency score: 2 points for every neighbor who saw it, 3 points for each danger level (a pothole is more dangerous than trash), and 1 point for every day it has been waiting. The top 3 get a double ring on the map.
5. **Share with city.** Sends the problem, the number of neighbors, a map link and the photo through the phone's share menu (email, WhatsApp). The whole list can be downloaded as a CSV file for the city.
6. **Mark fixed.** The ring turns green, and the "Fixed" tab shows what got better and how many days each fix took.

It works in any phone or computer browser. There is nothing to install and no sign-up.

## How we built it

- Plain **HTML, CSS and JavaScript**, with no framework and no build step, so the whole app is small and I can read and explain every file.
- **Leaflet** for the map, with **OpenStreetMap** tiles. Both are free and need no API key.
- **localStorage** saves the reports in the browser for this demo. All saving and loading goes through one file (`store.js`), so moving to a real database later means changing only that file.
- Photos are shrunk on the phone with a **canvas** (max 900 px, JPEG) before saving, from a few MB down to about 100 KB.
- **Design:** the idea is "marked on the street". Each report looks like the spray-paint ring that city crews paint around a pothole. The map is grey like a sidewalk so the orange rings stand out. The font is Overpass, which is based on the typeface on US road signs.
- I built it with **Claude** (an AI assistant by Anthropic) as my coding partner. I chose the idea and how the app should work, tested it myself, and Claude helped me write the code and explained how it works.

## Business model

**Who uses it:** residents, for free, always. More reports and confirmations make the data more valuable.

**Who pays:** the people responsible for fixing things.
- **Small cities, towns and regional councils.** Big cities already buy expensive systems for this (and in Israel people call the 106 municipal hotline), but small towns often only have a phone line and a spreadsheet.
- **Neighborhood committees, schools, campuses and property managers,** who are responsible for their own buildings, paths and lights.

**What they pay for:** a "FixMyBlock for Teams" dashboard: the Fix first list for their area, assigning problems to a worker, confirming fixes, and monthly reports like "average days to fix". The plan is a monthly subscription, for example about $19/month for a school or building committee and about $99/month for a small town. These prices are my first guess and I would test them in pilots.

**Costs:** hosting and a database (free tiers are enough at the start), photo storage, and a paid map-tile provider once there is real traffic, because the free OpenStreetMap tiles are not meant for heavy commercial use.

**Path:** 1) a free pilot with one neighborhood or my school, 2) use the real "days to fix" numbers to show the value, 3) offer the paid dashboard to the local council.

**Competition:** apps like FixMyStreet (UK) and SeeClickFix (US) already exist and prove that cities want this. FixMyBlock is different because neighbors confirm one report instead of sending duplicates, the ranking is transparent (anyone can see why something is number 1), it opens in a browser with no download, and it is priced for small places.

## Challenges we ran into

- **Photos are huge.** A phone photo can be 4 MB, and a browser only lets a site save about 5 MB. I had to shrink every photo on the phone before saving it, so dozens of reports fit.
- **Putting the pin in the right place.** When you report, a sheet covers the bottom half of the map, so the pin can't be in the middle of the screen. The app calculates the middle of the part you can still see. I also had a bug where the map moved a report behind the sheet, because the sheet was still sliding up when the app measured it.
- **A fair ranking.** If only votes counted, a pile of trash with many votes would beat a dangerous pothole. So the score also counts danger and how long the problem has been waiting.

## Accomplishments that we're proud of

- It really works on a phone: take a photo, drop a pin, and it appears on the map in a few seconds.
- It needs no API keys, no accounts and no install.
- The spray-paint ring design makes the map easy to read: orange means open, bigger means more urgent, green means fixed.

## What we learned

- How web maps work: tiles, latitude and longitude, zoom levels, and turning a point on the screen into a place on the map.
- How to save data in the browser, and what its limits are.
- Keeping the data code in one place makes it much easier to grow later.
- Thinking like a founder: the users (residents) and the customers (cities and committees) are not the same people.

## What's next for FixMyBlock

- A shared online database, so everyone in the neighborhood sees the same map.
- Fixes confirmed by two neighbors or by a city account.
- A notification when a problem you reported or confirmed gets fixed.
- Hebrew and Arabic versions (right-to-left).
- A pilot with a real neighborhood committee or my school.

**Built with:** html5, css3, javascript, leaflet, openstreetmap, localstorage, canvas, claude

---

## Links for the form

- **Try it out:** `https://tomerbot.github.io/fixmyblock/` (after GitHub Pages is turned on)
- **Code:** `https://github.com/Tomerbot/fixmyblock`
- **Video:** the YouTube link (`https://www.youtube.com/watch?v=...`, not a `/shorts/` link)
- **Image gallery:** `FixMyBlock_thumbnail.png` first, then 2–3 screenshots from the phone (map, Fix first, a report)

## Notes for judges (if the form has an "additional info" field)

```
How to test:
- Open https://tomerbot.github.io/fixmyblock/ on a phone or computer. No sign-up.
- The map starts with 10 sample reports (drawn pictures, not real photos).
- Quickest path: tap the biggest ring, tap "I saw it too", open the "Fix first" tab,
  open a report and tap "Mark fixed", then look at the "Fixed" tab.
- To report: tap "Report a problem", pick a category, add a photo, move the map
  so the ring sits on the spot, and tap "Add to the map".
- Reports are saved only in your browser (demo). "About (i) > Reset demo data" starts over.
- Code and README: https://github.com/Tomerbot/fixmyblock

I built this with Claude (an AI assistant by Anthropic) as my coding partner. I chose
the idea, tested it, and recorded the demo myself.
```

## Form fields to leave alone

- Anything about a sponsor prize or another track: this hackathon has only 1st, 2nd and 3rd place. If a field is required and doesn't apply, write `Not applicable`.
- Never write numbers of users, downloads or money earned. FixMyBlock has none yet, and that is fine for a first version.
- Team members: only you (solo is allowed). Don't write your school's name or your full name in the public text.
