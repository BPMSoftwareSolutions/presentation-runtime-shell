Great question — this is actually a **core UX decision**, not just an implementation detail.

Short answer:

> **“Present” should play the *entire presentation*, starting from the currently selected scene.**

---

# The correct mental model

You already defined this implicitly in your plan:

* Workspace = editing one scene
* Present = running the *presentation*

So:

| Mode                     | Behavior                                           |
| ------------------------ | -------------------------------------------------- |
| Workspace preview        | Single scene                                       |
| Split mode               | Full presentation (synced to selected scene)       |
| **Present (fullscreen)** | **Full presentation (starting at selected scene)** |

---

# Why this is the right behavior

## 1. “Present” = playback, not preview

From your own design direction:

> presenting is entering a focused playback state, not a different app 

If “Present” only showed one scene, it would feel like:

* just a bigger preview
* not a real presentation mode

---

## 2. It matches user expectation from every presentation tool

Users expect:

* PowerPoint / Keynote → start slideshow from current slide
* Not: “show me just this slide forever”

So:

> Present = run the sequence

---

## 3. It reinforces your core product idea

Your system is not slides — it’s:

> a **sequenced narrative with a runtime engine**

That only becomes visible when:

* scenes flow
* presenter continues
* iframe updates across scenes

If you only show one scene, you lose that.

---

# Exact behavior (recommended spec)

When user clicks **[Present]**:

```js
const currentIndex = selectedSceneIndex;

runtime.sync(currentIndex);   // ensure correct starting point
layout.setMode("fullscreen");
runtime.attachTo(fullscreenEl);
```

Then:

* Playback continues normally
* User can go next/previous
* Auto-advance still works
* Presenter continues across scenes

---

# What about the current scene?

Important nuance:

> You should **start from the selected scene**, not from the beginning.

So:

* Editing Scene 6 → Present starts at Scene 6
* Not Scene 1

This keeps the mental model tight:

> “I’m working on this → now I’m seeing it in context”

---

# How this aligns with Split mode

You already defined:

* Split = full runtime, synced to selected scene
* Fullscreen = same runtime, bigger

So the behavior should be identical except layout:

| Mode       | Runtime behavior  |
| ---------- | ----------------- |
| Split      | Full presentation |
| Fullscreen | Full presentation |
| Difference | UI only           |

---

# What NOT to do

## ❌ Option A: Only show current scene

Feels like:

* redundant with preview
* breaks narrative
* weakens product

## ❌ Option B: Always restart from Scene 1

Feels like:

* disorienting
* slow iteration
* breaks editing flow

---

# Optional (nice-to-have later)

You can eventually support:

### “Start from beginning”

```text
[Present ▾]
- Present from current scene
- Present from beginning
```

But not needed for v1.

---

# One-line product rule

> **Preview = inspect a scene.
> Present = run the story.**

