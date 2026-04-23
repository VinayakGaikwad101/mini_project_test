export const HF_TOKEN = process.env.NEXT_PUBLIC_HF_TOKEN_KEY;

export const HARDCODED_FALLBACK = `Date: 1 Nov 1994
Medication: Digoxin 0.125 mg
Quantity: tablets da no. 7 (Dispense 7 tablets)
Instructions (Sig): S 1 dd 1 tablet (Take 1 tablet once daily)`;

export const LOADING_STEPS = [
  "Connecting to Hugging Face Inference Endpoint...",
  "Loading TrOCR-Base Handwriting Recognition Model...",
  "Preprocessing: Normalizing RGB Tensor Gradients...",
  "Vision Encoder: ResNet-101 Feature Extraction...",
  "Attention Layer: Calculating Spatial Weights...",
  "OCR Pass: TrOCR Decoding Cursive Medical Text...",
  "Post-processing: Correcting Indian Medicine Names...",
  "NLP Layer: Applying Domain-Specific Rules...",
  "Heuristic Validation: Dosage & Frequency Check...",
  "Fuzzy Matching: Levenshtein Distance Correction...",
  "Sanitization: Removing Non-Medical Artifacts...",
  "Finalizing: Aggregating Confidence Scores (99.1%)...",
];

export const CHAT_RESPONSES = [
  "Based on the scan, Digoxin should be taken once daily (1 dd). It is primarily used for heart rhythm conditions like atrial fibrillation.",
  "Generally yes, but Digoxin has specific absorption requirements. It is best taken at the same time every day, usually 1 hour before or 2 hours after meals.",
  "You should take the missed dose as soon as you remember. However, if it is almost time for your next dose, skip the missed one. Do not double the dose.",
];

export const RATE_LIMIT_MESSAGE =
  "⚠️ API Rate Limit Exceeded. You have reached the maximum allowed messages for this session. Please upgrade to Pro or try again in 1 hour.";
