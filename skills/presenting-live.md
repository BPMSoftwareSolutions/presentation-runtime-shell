# Skill: Presenting Live

How to deliver a polished presentation using the runtime shell — in the workspace during prep, and in fullscreen for the real thing.

---

## Before You Present

### 1. Set the advance rule on every scene
Open each scene in the workspace inspector and confirm the advance type:
- **Manual** — you control every transition (recommended for live demos)
- **Delay** — auto-advances after N ms (good for intros/outros)
- **WaitForEvent** — scene waits for an animation or interaction in the iframe

### 2. Set the playback mode
In the inspector's **Presentation Settings** section:
- **Interactive** — standard live presenting; you advance manually
- **Autoplay** — demo runs itself (great for looping kiosk displays)
- **Capture** — fully deterministic; use when recording video

### 3. Set typing speed
Default is 22ms/char. For a live audience, 18–22ms feels natural. For video recording, 16ms reads better at playback speed.

### 4. Rehearse with split view
Use **Preview → Split view** to rehearse without going fullscreen. The scene list on the left lets you jump around freely.

---

## Entering Fullscreen

Click **Present** in the top-right corner. The shell takes over the full viewport.

The HUD is invisible until you need it — move your cursor to the top of the screen to reveal it.

---

## The Fullscreen HUD

Hover over the top of the screen to reveal the glass control bar:

```
[Scene N / Total — Scene Title]    [«] [‹] [▶/⏸] [›] [»]  [✕ Esc]
```

| Control | What it does |
|---------|-------------|
| `«` | Jump to first scene |
| `‹` | Previous scene |
| `▶` | Advance to next scene (when waiting) |
| `⏸` | Pause the typewriter mid-narration |
| `▶` (when paused) | Resume narration from exactly where it stopped |
| `›` | Next scene |
| `»` | Jump to last scene |
| `✕ Esc` | Exit fullscreen → back to workspace |

The HUD fades out when you move the cursor away — the slide content fills the screen without distraction.

---

## Keyboard Shortcuts (Fullscreen + Split)

| Key | Action |
|-----|--------|
| `Space` or `→` | Advance |
| `←` | Previous scene |
| `r` | Replay current scene from the start |
| `s` | Skip typing — flush narration instantly |
| `Esc` | Exit fullscreen |

> Shortcuts are disabled when a text input has focus.

---

## Transport Patterns During a Demo

### Standard flow (manual advance)
1. Scene loads → typewriter starts → you watch
2. Typewriter finishes → status shows `WAITING-ADVANCE`
3. Press `Space` or click `▶` to move to the next scene

### If you need to pause mid-sentence
Click `⏸` or the transport pause button. The typewriter freezes on the current character. Resume with `▶`. Perfect for fielding a question mid-narration.

### If you jumped ahead by mistake
Click `‹` or press `←` to go back one scene. The scene replays from the beginning.

### If you want to jump to a specific scene
Exit fullscreen → use the scene list → click **Present** again. Or use split view and click the scene list while the iframe shows live.

### Skip typing during a run-through
Press `s` to flush the narration instantly. Useful when rehearsing and you already know the text.

---

## Recording Tips

### Use Capture mode
Set playback mode to **Capture** in the inspector. All manual advances become timed delays — the presentation runs itself with consistent timing.

### Set `startDelayMs`
Gives you time to position your screen recorder before the first scene fires. Set in the JSON contract:
```json
"settings": {
  "startDelayMs": 3000
}
```

### Set `endCardDurationMs`
Hold the last scene for N ms before the runtime marks complete. Gives you time to fade out your recording:
```json
"settings": {
  "endCardDurationMs": 2000
}
```

### Hide the shell chrome
In fullscreen mode, the HUD is invisible at rest. Move your cursor away from the top before you start recording.

---

## Recovering During a Live Demo

| Problem | Fix |
|---------|-----|
| Typewriter running too fast | Press `⏸` to pause, talk through it, then `▶` to resume |
| Accidentally advanced too far | Press `←` or click `‹` to go back |
| Scene didn't load | Press `r` to replay — scene-runner re-navigates the iframe |
| Narration finished but scene is wrong | Jump to any scene with `«`/`»` or exit to workspace |
| Shell unresponsive | Press `Esc` to exit fullscreen and diagnose from workspace |

---

## Workspace Transport (During Prep)

The workspace canvas also has transport controls just below the narrator status bar:

```
[«]  [‹]  [▶/⏸]  [3 / 8]  [›]  [»]
```

Same behaviour as fullscreen. Use this during rehearsal without needing to enter fullscreen.

The scene counter always shows your current position (`3 / 8`). First and last buttons disable when you're already at the boundary.
