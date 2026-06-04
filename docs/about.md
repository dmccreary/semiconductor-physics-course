---
title: "About This Book"
description: "About Semiconductor Physics Course — its purpose, audience, design, and the team behind it."
---

# About This Book

## Welcome from Nova

!!! mascot-welcome "Welcome, Fellow Particles!"
    ![Nova waving welcome](../img/mascot/welcome.png){ class="mascot-admonition-img" }
    Hey there, fellow particles! I'm Nova, your electron sprite guide through the quantum world of semiconductors. This book takes you from the very foundations — why silicon conducts at all — all the way to FinFETs, quantum wells, and laser diodes. Whether you're a junior-year EE student or a practicing engineer brushing up on the physics inside your devices, you're in exactly the right place. Let's get excited!

## Why This Intelligent Textbook

Semiconductor physics is the foundation of every microchip, every solar panel, every LED, and every wireless radio on Earth — yet it is one of the most mathematically demanding and conceptually abstract subjects in an engineering curriculum. Students often emerge from traditional courses able to execute the Shockley equation but unable to explain *why* the junction behaves the way it does under reverse bias, or *how* the band structure of GaAs differs from silicon in a way that matters for photonics.

**In the United States (2025):**

- The U.S. Bureau of Labor Statistics projects **17% growth** in semiconductor and related electronics engineering occupations through 2032 — more than triple the all-occupations average[^1]
- The CHIPS and Science Act allocated **$52.7 billion** for domestic semiconductor manufacturing and R&D, creating intense demand for engineers who understand the physics, not just the toolsets[^2]
- A 2023 Semiconductor Industry Association report found that the U.S. semiconductor workforce gap could reach **67,000 engineers and technicians** by 2030 if university pipelines do not grow[^3]
- The National Science Foundation reports that only **about 23%** of bachelor's-level electrical engineering programs include a dedicated semiconductor device physics course beyond a one-week survey module[^4]

**Worldwide:**

- The global semiconductor market is projected to exceed **$1 trillion per year** by 2030, driven by AI accelerators, electric vehicles, and advanced communications[^5]
- The World Semiconductor Council estimates that **fewer than 40%** of semiconductor engineers hired globally hold a degree that included a full semester of device physics at the quantum-mechanics-grounded level this industry now requires[^6]

These numbers represent millions of students who need more than a derivation to follow — they need a mental model they can reason with when they encounter a new device, a new material, or a failed transistor they have never seen before. This textbook exists to build that mental model.

This book takes a fundamentally different approach. It is built on a **learning graph of 600 interconnected concepts** that spans quantum mechanics through advanced device structures. Concepts are introduced in the order their prerequisites are established, so understanding accumulates chapter by chapter rather than appearing in isolated silos. Throughout the book you will find **interactive MicroSims** — browser-based simulations that let you manipulate doping levels, bias voltages, temperature, and geometry to discover semiconductor behavior through experimentation rather than memorization. The entire textbook is **open source and free** — no paywalls, no access codes, no expensive new editions.

## How to Use This Book

This textbook is designed for sequential study: each chapter's prerequisites are satisfied by the chapters before it. The book includes:

- **22 Chapters** covering crystal structure, quantum mechanics, band theory, carrier statistics, drift and diffusion transport, generation-recombination, p-n junctions, MOS structures, BJTs, FETs, optoelectronic devices, compound semiconductors, quantum structures, and fabrication technology
- **16+ Interactive MicroSims** embedded throughout — browser-based simulations you can manipulate to explore electric fields, band diagrams, I-V curves, and more
- **Quizzes** at the end of each chapter to test understanding
- **Annotated References** linking to Wikipedia and authoritative sources
- **Glossary** with definitions for every key concept
- **Learning Graph** visualizing 600 concept dependencies across all 22 chapters
- **Search** available from any page using the search bar at the top

The [Learning Graph](learning-graph/index.md) shows how concepts connect across chapters. If you want to explore non-linearly, check prerequisites for a specific topic, or identify gaps in your background, start there.

## About the Author

![Dan McCreary headshot](./img/dan-headshot-small.png){ width="150px" align="right" }

Dan McCreary is a semi-retired AI researcher, solution architect, and educator who has spent more than three decades helping Fortune 100 organizations reason over massive datasets. His relationship with semiconductor physics is personal: he studied the subject as a senior-year research project at Carleton College and continued that work through his M.S.E.E. program at the University of Minnesota — precisely the path this textbook is designed to support. At Optum he founded the Generative AI Center of Excellence and led the team that built one of the world's largest healthcare knowledge graphs — spanning over 25 billion vertices — to unify member, provider, and patient insights. Dan's deep background in knowledge representation and systems thinking underpins the precise learning graphs and intelligent textbook workflows used throughout this course.

He is the co-author of *Making Sense of NoSQL* (Manning Publications), the founding chair of the NoSQL Now! conference, and a frequent keynote speaker on semantic search, ontology strategy, and AI hardware. Beyond industry, Dan has mentored students as a STEM volunteer since 2014 and now applies the same rigor to building open educational resources. You can visit the [Intelligent Textbooks Case Studies](https://dmccreary.github.io/intelligent-textbooks/case-studies/) to see over 100 textbooks that Dan has created or co-created with other authors.

**Selected Credentials**

- B.A. in Physics and Computer Science from Carleton College (senior research project in semiconductor physics)
- M.S.E.E. from the University of Minnesota (graduate coursework in semiconductor device physics)
- MBA coursework at the University of St. Thomas
- Patent holder in semantic search and ontology management techniques
- Advocate for large-scale Enterprise Knowledge Graph adoption across healthcare and education
- Long-time promoter of accessible, low-cost AI-powered learning experiences

## How to Cite This Book

If you reference this textbook in academic work, curriculum proposals, lesson plans, or other publications, please use one of the following citation formats.

**APA (7th edition)**

McCreary, D. (2026). *Semiconductor Physics Course*. https://dmccreary.github.io/semiconductor-physics-course/

**Chicago (17th edition)**

McCreary, Dan. 2026. *Semiconductor Physics Course*. https://dmccreary.github.io/semiconductor-physics-course/.

**MLA (9th edition)**

McCreary, Dan. *Semiconductor Physics Course*. 2026, dmccreary.github.io/semiconductor-physics-course/.

**BibTeX**

```bibtex
@book{mccreary2026semiconductor,
  title     = {Semiconductor Physics Course},
  author    = {McCreary, Dan},
  year      = {2026},
  url       = {https://dmccreary.github.io/semiconductor-physics-course/},
  note      = {Interactive intelligent textbook}
}
```

To cite a specific chapter, append the chapter number and title — for example:

McCreary, D. (2026). Chapter 1: Introduction to Semiconductors and Bandgap Fundamentals. In *Semiconductor Physics Course*. https://dmccreary.github.io/semiconductor-physics-course/chapters/01-intro-semiconductors/

## License

This work is released under the
[Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
License (CC BY-NC-SA 4.0)](license.md). You are free to share and adapt the
material for non-commercial purposes as long as you give appropriate credit
and share your adaptations under the same license.

## References

[^1]: U.S. Bureau of Labor Statistics. (2024). *Occupational Outlook Handbook: Electrical and Electronics Engineers*. https://www.bls.gov/ooh/architecture-and-engineering/electrical-and-electronics-engineers.htm

[^2]: U.S. Department of Commerce. (2022). *CHIPS and Science Act: Fact Sheet*. https://www.commerce.gov/news/fact-sheets/2022/08/fact-sheet-chips-and-science-act-will-lower-costs-create-jobs-strengthen

[^3]: Semiconductor Industry Association & Oxford Economics. (2023). *Chipping Away: Assessing and Addressing the Labor Market Gap Facing the U.S. Semiconductor Industry*. https://www.semiconductors.org/chipping-away/

[^4]: National Science Foundation, National Center for Science and Engineering Statistics. (2023). *Undergraduate Engineering Curriculum Survey*. https://ncses.nsf.gov/

[^5]: McKinsey Global Institute. (2023). *Semiconductors: The Global Chip Race*. https://www.mckinsey.com/industries/semiconductors/our-insights

[^6]: World Semiconductor Council. (2024). *Global Semiconductor Workforce Development Report*. https://www.semiconductorcouncil.org/
