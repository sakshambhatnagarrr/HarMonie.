# 🚀HarMonie.
> An Import/Export Business tool that helps to get the HS code associated with the specified item. It was built for "build with Gemini XPrize" Hackathon.

---

## 💡About The Project

💥 The Massive Problem

Cross-border e-commerce sellers, micro-exporters, and logistics startups spend billions annually on trade consultants and customs brokers to navigate shifting international tariffs, Harmonized System (HS) product code classifications, export documentation, and local import regulations. A single misclassified product code or missing compliance certificate can result in held shipments, heavy fines, or seized inventory.

🚀 The Product & How Gemini Powers It

HarMonie. acts as an HS Code Verifier:

- 🔨**Multimodal Invoice & Product Parsing:** A seller uploads product images, raw bills of materials, or PDF invoices. Gemini’s vision capabilities inspect the physical attributes and chemical/material composition of the items.

- 🔨**Courier & Package Tracking:** A Seller uploads the details of the package such as the tracking number, Destination etc. The website uses this data to track the package.

# Tech Stack used

**Frontend**
-React 19 with TypeScript,
Vite 6 (build tool),
Tailwind CSS v4,
Lucide React (icons),
Motion/Framer Motion (animations).

**Backend**
-Node.js with Express 4,
TypeScript (via tsx for dev, esbuild for prod).

**AI / APIs**
-Google Gemini API (@google/genai) — used for HS code classification, tariff search briefings, and multimodal invoice/image parsing
-Models referenced: gemini-3.1-pro-preview (classification) and gemini-3.6-flash (tariff search).

> As a first year student, This project represents my first dive into building real world software under a deadline. Pushed my limits, learnt a bunch of things on the fly and used AI tools to turn my idea into a fuctional prototype.

Built with LOTS of ENTHUSIASM, Late Night Coffee's and lots of learning! :D
