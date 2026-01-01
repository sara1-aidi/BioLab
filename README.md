# BioLab Research - AI-Powered Medical Diagnostic Platform

## 🩺 Overview
BioLab Research is a comprehensive web platform that uses deep learning to automatically diagnose lung conditions from chest X-ray images. The system classifies images into three categories: **Pneumonia**, **Lung Opacity**, and **Normal**, providing fast, consistent diagnostic support for healthcare professionals.

## 🚀 Live Demo
[View Live Platform](https://biolab-research.vercel.app) *(Replace with your actual link)*

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

## 📁 Project Structure
