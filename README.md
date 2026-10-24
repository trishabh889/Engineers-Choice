# Engineer's Choice - Multi-Page Precision Engineering Website

A comprehensive, multi-page commercial website built with pure **HTML5, CSS3, and JavaScript**. Designed for promoting and managing inquiries for high-precision engineering instruments, calibration services, and industrial tooling.

---

## 📄 Website Pages Overview

1. **[Home / Landing Page (index.html)](index.html)**
   - High-impact Hero section with live stats and interactive 3D-styled vector product card with animated hotspots.
   - Core value propositions, technical specification matrix, client testimonials, and FAQ accordion.
   - **Interactive Price & Quantity Estimator**: Real-time quotation calculator that auto-populates the inquiry form.
   - Direct Product Query Form & WhatsApp integration.

2. **[About Us (about.html)](about.html)**
   - Company story: Established to solve the 0.001mm measurement challenge.
   - Core philosophy: Accuracy obsession, hazardous duty durability, and engineer-to-engineer support.
   - ISO 9001:2015, NABL ISO/IEC 17025, and DIN 862 certifications wall.
   - Technical leadership & metrology R&D team profiles.

3. **[Services (services.html)](services.html)**
   - **NABL Accredited Calibration**: 48-hour express turnaround with traceable reports.
   - **Custom Precision Tooling & Prototyping**: Titanium/carbide jaws, specialized jigs (7-day dispatch).
   - **Annual Maintenance Contracts (AMC)**: Preventive servicing and free loaner instruments.
   - **Metrology Audits & Technical Training**: Hands-on workshops for industrial plants and engineering institutes.
   - 4-Step transparent service workflow.

4. **[Product Catalog (products.html)](products.html)**
   - Interactive category filtering tabs: *All Instruments, Precision Calipers, Digital Micrometers, Height & Depth Gauges, Standards & Accessories*.
   - Product cards with model numbers, technical specification badges, price tags, and direct **WhatsApp inquiry buttons**.
   - 1-click **"Enquire"** action that navigates to the contact page with pre-filled product details.

5. **[Contact & Query Desk (contact.html)](contact.html)**
   - Direct phone helplines, official emails, regional branch addresses (Delhi NCR, Pune, Bengaluru).
   - Full accessible inquiry form with `:user-invalid` validation feedback.
   - Instant WhatsApp message forwarding with all filled details pre-formatted.
   - Automatic local saving of all inquiries for the website administrator.

---

## 🌟 Common Features Across All Pages

- **Floating WhatsApp Widget (Bottom-Right)**: Pulsating WhatsApp button with interactive popup card, quick question chips, and custom chat input.
- **Dark / Light Theme Toggle**: Persistent mode switcher saved in `localStorage`.
- **Built-in Leads / Queries Dashboard**: Click **"📋 View Submitted Queries"** in the footer of any page to view received leads, chat with them on WhatsApp, or export to CSV.
- **Mobile Responsive**: Custom hamburger menu and flexible layout for phones, tablets, and desktops.

---

## ⚙️ Configuration (Set Your Phone & Email)

Open `js/script.js` (lines 18-28):

```javascript
const CONFIG = {
  // Your 10-digit WhatsApp number with country code (e.g. 91 for India):
  whatsappNumber: "919876543210",
  
  businessEmail: "inquiry@engineerschoice.com",
  brandName: "Engineer's Choice",
  
  // (Optional) Web3Forms free key for email alerts:
  web3formsAccessKey: ""
};
```

---

## 🚀 How to Run the Website

Simply double-click `index.html` to open in your browser, or start a local server:

```powershell
cd c:\Users\Rishabh.Tripathi\Documents\Cipet\engineers-choice
python -m http.server 8000
```
Open `http://localhost:8000` in your web browser.
