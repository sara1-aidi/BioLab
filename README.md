# BioLab Research - AI-Powered Medical Diagnostic Platform

## 🩺 Overview
BioLab Research is a comprehensive web platform that uses deep learning to automatically diagnose lung conditions from chest X-ray images. The system classifies images into three categories: **Pneumonia**, **Lung Opacity**, and **Normal**, providing fast, consistent diagnostic support for healthcare professionals.

## 🚀 Live Demo
*[Add your live demo link here when ready]*

## ✨ Key Features
- **AI Diagnosis**: Custom CNN model with 95% validation accuracy for chest X-ray classification
- **Dual Interface**: Patient portal for scan uploads and results, Admin dashboard for user management
- **Real-time Processing**: Instant X-ray analysis with detailed confidence scores
- **Medical Workflow**: Integrated appointment booking and patient history tracking
- **Secure Platform**: HIPAA-compliant data handling and user authentication

## 📸 Project Screenshots



| Dashboard & Login | Diagnostic Results | Admin Management |
|-------------------|--------------------|------------------|
| ![Dashboard](https://i.ibb.co/8gFS5Jgd/Capture-d-cran-2025-05-07-211925.png) | ![Results](https://i.ibb.co/QFw33cpn/Capture-d-cran-2025-05-07-212444.png) | ![Admin](https://i.ibb.co/ytd9vFX/Capture-d-cran-2025-05-07-212507.png) |
| *Main dashboard with login interface* | *Patient diagnostic results page* | *Admin user management panel* |

| Patient Portal | Appointment Booking | Model Training |
|----------------|---------------------|----------------|
| ![Portal](https://i.ibb.co/TqPKF1yn/Capture-d-cran-2025-05-07-212032.png) | ![Booking](https://i.ibb.co/x8FY6jd6/Capture-d-cran-2025-05-07-212548.png) | ![Training](https://i.ibb.co/HpGQxKnf/Capture-d-cran-2025-05-07-212626.png) |
| *Patient portal for scan uploads* | *Appointment scheduling system* | *Model training performance graphs* |

*Authentication Interface:*
![Login Page](https://i.ibb.co/nNZ27WwP/Capture-d-cran-2025-05-07-212423.png)
*Secure user authentication page*

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

