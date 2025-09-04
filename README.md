

# 🩺 Kidney Disease Classification using Deep Learning
**Multi-Class CT/X-Ray Image Classification | Basic CNN · VGG19 · ResNet50 · InceptionV3 + PSO Optimization**

---

##  Abstract
Kidney diseases — including **cysts**, **tumors**, and **stones** — are among the most prevalent renal disorders worldwide.  
Early detection using **CT scans** and **X-ray imaging** can significantly improve patient outcomes.  
This study presents a **comparative evaluation** of four deep learning architectures:

-  **Basic CNN** *(baseline model)*
-  **VGG19** *(deep hierarchical feature extraction)*
-  **ResNet50** *(residual learning for deeper representations)*
-  **InceptionV3** *(multi-scale feature fusion)*

Integrated **Particle Swarm Optimization (PSO)** to fine-tune hyperparameters, resulting in significant performance boosts.  
Results show **InceptionV3** achieves the highest classification accuracy, while **ResNet50** provides the best trade-off between precision and computational efficiency.

---

##  Dataset Overview

| **Property**            | **Details**                                |
|-------------------------|-------------------------------------------|
| **Dataset Size**        | **12,446 images**                         |
| **Classes**            | Normal · Cyst · Stone · Tumor             |
| **Image Types**        | CT scans + X-ray images                  |
| **Image Dimensions**   | 224 × 224 pixels                          |
| **Normalization**      | Z-score standardization                  |
| **Class Balancing**    | **SMOTE** oversampling for minority classes |
| **Data Augmentation**  | Random rotations, flips, zoom, shifts    |
| **Train : Val : Test** | 80% : 10% : 10%                          |

---

##  Preprocessing Pipeline

### **1. Noise Reduction**
- Applied **Gaussian denoising filter** to preserve delicate anatomical boundaries.

### **2. Normalization**
- Used **Z-score normalization** to stabilize intensity distributions.

### **3. Data Augmentation**
- **Random rotations**: ±15°  
- **Width/Height shifts**: ±10%  
- **Zoom range**: 0.8× to 1.2×  
- **Horizontal flips** for symmetry compensation

---

##  Model Architectures

### **1️⃣ Basic CNN (Baseline)**
- **3 Conv layers** → ReLU activations
- **MaxPooling** after each convolution
- **Flatten + Dense (128 neurons)**
- **Output Layer** → 4 classes (Softmax)
> Acts as a benchmark for deeper models.

### **2️⃣ VGG19**
- **19 layers**: 16 Conv + 3 Dense
- Uniform **3×3 kernels** for feature extraction
- **Pretrained on ImageNet** + fine-tuning top layers
- Strength: Captures **fine-grained patterns** like cystic boundaries.

### **3️⃣ ResNet50**
- **50 layers** with **residual skip connections**
- Uses **16 residual blocks** (1×1, 3×3, 1×1 conv layers)
- Avoids **vanishing gradient** → trains deeper networks efficiently
- Best suited for **complex textures** and **organ boundary variations**.

### **4️⃣ InceptionV3**
- **Inception Modules**: Multi-scale feature extraction
- Parallel **1×1, 3×3, 5×5 convolutions** per module
- **Factorized convolutions** for lower computation
- **Auxiliary classifiers** improve gradient flow
- Excels at **detecting subtle anomalies** in kidney CT images.

---

##  Optimization with Particle Swarm Optimization (PSO)

We used **PSO** to fine-tune hyperparameters like:
- **Learning rate**
- **Dropout rates**
- **Batch size**

###  Key Benefits:
- Automated hyperparameter search
- Faster convergence
- Reduced overfitting
- Boosted validation accuracy to **100%** on VGG19, ResNet50, and InceptionV3

---

##  Experimental Setup

| **Parameter**      | **Value**            |
|--------------------|----------------------|
| Framework         | TensorFlow + Keras   |
| Optimizer         | Adam                 |
| Learning Rate     | 0.001 (tuned via PSO)|
| Batch Size        | 32                   |
| Epochs            | 50                   |
| Loss Function     | Categorical Cross-Entropy |
| Hardware          | GPU-enabled system   |

---

##  Results & Comparison

| Model      | Accuracy | Precision | Recall | F1-Score | Inference Time |
|-----------|----------|-----------|--------|-----------|----------------|
| **Basic CNN** | 98.81% | 97.90% | 97.20% | 97.54% | **0.092s** |
| **VGG19**     | 98.20% | 98.10% | 97.90% | 97.95% | 0.138s |
| **ResNet50**  | 98.90% | 98.60% | 98.40% | 98.50% | **0.145s** |
| **InceptionV3** | **99.33%** | **99.25%** | **99.12%** | **99.18%** | 0.142s |

> **Post-PSO Optimization** →  
All advanced models (**VGG19**, **ResNet50**, **InceptionV3**) achieved **100% validation accuracy** with smoother convergence.

---

##  Practical Implications

- **Clinical Use**: Deployable in diagnostic labs & hospitals
- **Automation**: Reduces dependency on radiologists
- **Rural Healthcare**: Offline integration possible for low-resource regions
- **Scalability**: Could be embedded into cloud-based diagnostic platforms

---

##  Future Work

-  **Quantum-Enhanced CNNs (QDCNN)** → Faster and more accurate predictions
-  **Federated Learning** → Privacy-preserving training across hospitals
-  **Edge Deployment** → Real-time classification on mobile devices
-  **Multimodal Fusion** → Combine CT, MRI, and ultrasound data
-  **Clinical Trials** → Validate on real-world hospital datasets

---
