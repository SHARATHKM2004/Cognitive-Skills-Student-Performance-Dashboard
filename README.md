

---

# Cognitive Skills & Student Performance Dashboard

## 📌 Project Overview

This project analyzes the relationship between **cognitive skills** and **student performance** using a synthetic dataset.
It includes:

* **Data analysis & ML modeling** in Jupyter Notebook.
* **Interactive Dashboard** built with Next.js, deployed on Vercel.

The dashboard provides insights into **student learning personas** and the impact of skills like attention, focus, and retention on performance.

---

## 📂 Repository Structure

```
├── IGEBRA_AI.ipynb             # Data analysis, ML model, clustering
├── app/                        # Next.js app pages
├── components/                 # Dashboard components (charts, tables, etc.)
├── package.json                # Project dependencies
├── tsconfig.json               # TypeScript config
├── next.config.mjs             # Next.js config
└── README.md                   # Project documentation
```

---

## ⚙️ Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/<your-username>/cognitive-skills-dashboard.git
cd cognitive-skills-dashboard
```

### 2. Run Jupyter Notebook

```bash
jupyter notebook IGEBRA_AI.ipynb
```

### 3. Run Next.js Dashboard Locally

```bash
npm install
npm run dev
```

Dashboard will be available at: **[http://localhost:3000](http://localhost:3000)**

---

## 🚀 Deployment

The dashboard is deployed on **Vercel**:
👉 [Live Demo](https://cognitive-skills-student-performanc-eight.vercel.app/)

---

## 📊 Key Findings (from ML & Analysis)

* **Attention & Focus** strongly correlate with assessment scores.
* Students can be clustered into **3 learning personas**:

  1. **High Performers** – Consistent comprehension, focus, retention.
  2. **Average Learners** – Moderate across skills.
  3. **Struggling Learners** – Low attention & engagement time, need support.
* Engagement time adds some predictive power but cognitive skills are stronger predictors.

---

## 📈 Dashboard Features

* **Overview stats** – Average scores and skill metrics.
* **Bar Chart** – Cognitive skills vs performance.
* **Scatter Plot** – Attention vs assessment score.
* **Radar Chart** – Student profile (comprehension, focus, retention, etc.).
* **Student Table** – Searchable & sortable records.
* **Insights Section** – Key findings & personas.
* **FAQ Section** – For quick guidance.

---

## 👨‍💻 Tech Stack

* **Python (Jupyter Notebook)** → Data Analysis, ML
* **scikit-learn, pandas, matplotlib** → Modeling & Visualization
* **Next.js + React + Tailwind + shadcn/ui** → Dashboard UI
* **Vercel** → Deployment

---

## 📧 Author

**Sharath K M**
Email: [sharathkmsharu2004@gmail.com](mailto:sharathkmsharu2004@gmail.com)

---

