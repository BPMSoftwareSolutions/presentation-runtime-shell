/**
 * Screen 03 — Import Scene
 * Route: #/presentation/:id/import
 *
 * Phase 5 will replace this stub with the full implementation.
 */
export function mountImportScene({ id, store, router, shell }) {
  const presentation = store.getById(id);
  const title = presentation ? presentation.title : id;

  shell.setBreadcrumb([
    { label: "Library", href: "#/library" },
    { label: title, href: `#/presentation/${id}` },
    { label: "Import Scene" },
  ]);
  shell.setTopBarActions(null);

  const root = document.getElementById("screen-root");
  root.innerHTML = `
    <div style="
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: var(--color-muted);
      font-size: 14px;
    ">
      Import Scene — Phase 5
    </div>
  `;

  return {
    unmount() {
      root.innerHTML = "";
    },
  };
}
