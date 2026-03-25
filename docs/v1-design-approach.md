For this idea, **plain HTML/CSS/JavaScript is a very reasonable v1**, and I would not choose React or Next by default unless you already know you need their strengths.

# The real question

The system you described has only a few essential jobs:

* load a JSON contract
* type presenter text
* swap/update an `iframe`
* send and receive `postMessage` events
* move through scenes
* show some controls

None of that requires React or Next.

So the default engineering stance should be:

> **Start with the simplest architecture that preserves the core interaction model.**

---

# When plain HTML/CSS/JS is enough

A non-framework setup is probably best if you want to validate the concept quickly.

## Good fit for vanilla

* one master shell
* a few panels
* a scene runner
* deterministic sequencing
* local JSON files
* a handful of generated demo pages
* same-origin iframe messaging

You can absolutely build that with:

* `index.html`
* `styles.css`
* `shell.js`
* `presenter.js`
* `runtime.js`
* `contracts/demo.json`

That would likely be:

* easier to reason about
* easier to debug
* faster to prototype
* less abstraction-heavy
* better for discovering the actual shape of the system

---

# Where React/Next can become accidental complexity

## React can add overhead when:

* state is actually simple and linear
* most behavior is imperative anyway
* your runtime is event-driven rather than UI-composition-heavy
* you are still discovering the product model

For example, a scene engine often naturally wants code like:

```js
await navigateIframe(route)
await waitForIframeReady()
await typeBlocks(blocks)
await waitForAdvance()
```

That is a **runtime/orchestration problem**, not primarily a component problem.

React sometimes nudges people into over-modeling everything as component state when a small controller object would be cleaner.

## Next can add even more overhead when:

* you do not need SSR
* you do not need routing complexity
* you do not need server components
* you do not need deployment conventions tied to app routes
* the generated content is local/static anyway

For a prototype, Next can easily be more platform than product.

---

# My honest recommendation

## For v1

Use **plain HTML/CSS/JavaScript**.

Build:

* one shell page
* one scene runtime
* one typed presenter module
* one iframe bridge
* one JSON contract
* two or three demo scenes

That will tell you very quickly whether the idea works.

---

# A good v1 architecture without React

## Files

```text
/index.html
/styles.css
/shell.js
/runtime.js
/presenter.js
/iframe-bridge.js
/contracts/demo.json
/generated/opening/index.html
/generated/lab/index.html
/generated/summary/index.html
```

## Runtime shape

```js
const deck = await loadContract('/contracts/demo.json')

for (const scene of deck.scenes) {
  await frame.navigate(scene.content.route)

  if (scene.content.waitForReady) {
    await frame.waitForReady()
  }

  await runActions(scene.actions || [])
  await presenter.play(scene.presenter)
  await waitForAdvance(scene.advance)
}
```

That is clean and direct.

---

# When React actually helps

React becomes useful when the shell turns into a real application with lots of UI state.

## React is worth it if you expect:

* complex control panels
* editable timelines
* scene inspector panels
* reusable UI widgets
* preview panes
* branching presentation flows
* live contract editing
* collaboration features
* asset libraries
* multiple synchronized views

At that point, React helps because you are no longer just building a runtime. You are building an **authoring environment**.

So:

* **runtime prototype** → vanilla JS is great
* **authoring tool / production platform** → React becomes more compelling

---

# When Next makes sense

Next is useful later if you want:

* file-based routing for many generated experiences
* server-side generation pipelines
* API routes for prompt-to-scene generation
* authentication
* persistence
* multi-user editing
* deployment conventions across many route-based demo pages

That is more of a **platform phase** than a prototype phase.

---

# A practical way to avoid overbuilding

Use a two-layer mindset:

## Layer 1: Presentation runtime

Keep this tiny and framework-light.

Responsibilities:

* load contract
* control presenter
* control iframe
* advance scenes

## Layer 2: Generated experiences

Each experience can be whatever it needs to be.

Some scenes might be:

* plain HTML
* canvas
* Svelte
* React
* Three.js
* charting libraries

The shell does not need to care.

That separation reduces accidental complexity a lot.

---

# The strongest argument against React for v1

Your system is fundamentally a **sequencer**.

Sequencers usually want:

* events
* state machines
* timing
* messaging
* deterministic playback

Those are often simpler in plain JavaScript than in a component-first framework.

---

# The strongest argument for React later

Once you want the shell to become:

* editable
* inspectable
* configurable
* multi-pane
* reusable across many demos

then a component model starts paying off.

---

# My recommendation in one line

**Prototype the runtime in plain HTML/CSS/JavaScript first; introduce React only when the shell becomes an authoring app rather than a demo orchestrator.**

# A sensible progression

## Phase 1

Vanilla JS prototype

* prove the concept
* test pacing
* test iframe coordination
* refine JSON contract

## Phase 2

Small framework only if pain appears

* maybe React for shell UI
* keep runtime logic framework-agnostic

## Phase 3

Next only if you need platform features

* route management
* backend generation
* persistence
* multi-user workflows

---

# Rule of thumb

Choose React/Next only if they solve a problem you **already have**, not one you imagine you might have.

For this idea, the probable risk is not “too little framework.”

It is **building too much shell before proving the magic of the synchronized presenter + iframe experience**.
