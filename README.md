# abraraltaflone.com

Personal portfolio of Abrar Altaf Lone. A static site built with Next.js (App Router), React, TypeScript and plain CSS modules.

## Run it

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build      # writes the finished static site to ./out
```

Node 20 or newer.

## Where things live

| What | Where |
| --- | --- |
| All text, links, lists | `src/content/` (`site.ts` for the home page and shared details, one file per other page) |
| Pages | `src/app/` (`page.tsx`, `about/`, `biblo/`, `aibytehub/`) |
| Shared pieces (nav, footer, buttons, cursor, motion helpers, icons) | `src/components/` |
| Page-specific sections | `src/components/home/`, `about/`, `biblo/`, `aibytehub/`, `casestudy/` |
| Images | `public/images/` |
| Resume | source `resume/AbrarResume.tex`, built PDF `public/files/AbrarResume.pdf` |
| Lanyard card | `src/components/lanyard/`, artwork in `public/lanyard/` |

### Common edits

- **Change wording, add a project, a job or a testimonial:** edit the arrays in `src/content/site.ts`. The layout follows the data.
- **Resume:** the source is `resume/AbrarResume.tex` (LaTeX). Edit it, then build the PDF into the site:
  `tectonic resume/AbrarResume.tex --outdir public/files` (or `pdflatex`, or paste the file into Overleaf and save the PDF as `public/files/AbrarResume.pdf`). The viewer pages through whatever PDF is there.
- **Lanyard card artwork:** replace `public/lanyard/front.png` and `back.png` (355 × 530 px) and `strap.png` (250 × 50 px, repeats along the strap).
- **Lanyard feel:** `src/components/lanyard/Lanyard.tsx` has one block of settings per screen size (gravity, camera distance, lighting, whether it can be dragged).

## Layout rules

Three layouts, switched by width:

- desktop: 1200px and up (fluid between 1200px and 1440px, fixed proportions above that)
- tablet: 810px to 1199px
- phone: up to 809px

## Notes

- The PDF viewer loads `public/files/pdf.worker.min.mjs`. After upgrading `pdfjs-dist`, copy the new worker over it:
  `cp node_modules/pdfjs-dist/legacy/build/pdf.worker.min.mjs public/files/`
- The site is exported as static files (`output: "export"` in `next.config.ts`), so it can be hosted anywhere that serves a folder.
