<<<<<<< HEAD
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
=======
# BioLab Research - AI-Powered Medical Diagnostic Platform

## 🩺 Overview
BioLab Research is a comprehensive web platform that uses deep learning to automatically diagnose lung conditions from chest X-ray images. The system classifies images into three categories: **Pneumonia**, **Lung Opacity**, and **Normal**, providing fast, consistent diagnostic support for healthcare professionals.


## ✨ Key Features
- **AI Diagnosis**: Custom CNN model with 95% validation accuracy for chest X-ray classification
- **Dual Interface**: Patient portal for scan uploads and results, Admin dashboard for user management
- **Real-time Processing**: Instant X-ray analysis with detailed confidence scores
- **Medical Workflow**: Integrated appointment booking and patient history tracking
- **Secure Platform**: HIPAA-compliant data handling and user authentication

## 🛠️ Technology Stack
**Frontend:** React 19, Next.js 15, Tailwind CSS  
**Backend:** FastAPI, Next.js API Routes  
**AI/ML:** TensorFlow, Keras, Custom CNN Architecture  
**Database:** Supabase (PostgreSQL)  
**Deployment:** Vercel, Docker  
**Other:** Git, Figma (UI Design)

## 🧠 Deep Learning Model
### Architecture
- **Input**: 224×224 grayscale chest X-ray images
- **CNN Blocks**: Two convolutional layers with ReLU activation
- **Classifier**: Dense layer with dropout (0.3) for regularization
- **Output**: 3-class softmax classification (Pneumonia/Lung Opacity/Normal)

### Performance
- **Validation Accuracy**: 95%
- **Dataset**: Balanced medical imaging dataset
- **Training**: 60 epochs with early stopping
- **Metrics**: Confusion matrix shows strong class separation


## 🚀 Installation & Setup

### Prerequisites
- Python 3.9+
- Node.js 18+
- TensorFlow 2.13+
- Supabase account

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
>>>>>>> 1a498d5e1c886d2581775c9742cd3b080e4d3e3a
