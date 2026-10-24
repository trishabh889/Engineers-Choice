/**
 * Engineer's Choice - Landing Page Interactive Script
 * Handles:
 * 1. Product Query Form Submission & Validation (:user-invalid handling)
 * 2. WhatsApp Instant Message Pre-population & Redirects
 * 3. LocalStorage Lead Storing & Admin Leads Viewer Modal
 * 4. Interactive Product Estimator (Auto-populates Form)
 * 5. Floating WhatsApp Chat Popup Widget
 * 6. FAQ Accordion & Active Section Nav Highlighting
 * 7. Light / Dark Theme Mode Switching
 */

// ==========================================
// 1. CONFIGURATION (Edit your details here)
// ==========================================
const CONFIG = {
  // Replace with your real WhatsApp number with country code (e.g., 91 for India, no + or spaces)
  whatsappNumber: "919876543210",
  
  // Business email address for inquiries
  businessEmail: "inquiry@engineerschoice.com",
  
  // Brand Name
  brandName: "Engineer's Choice",

  // (Optional) Web3Forms Access Key for free email forwarding:
  // Get a free key at https://web3forms.com and paste it here if you want an email for every query!
  web3formsAccessKey: ""
};

// ==========================================
// 2. DOM Elements Selection
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  // Theme Toggle
  const themeToggle = document.getElementById("themeToggle");
  
  // Mobile Nav
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav-link");

  // Estimator Elements
  const variantInputs = document.querySelectorAll('input[name="estimatorVariant"]');
  const quantityRange = document.getElementById("quantityRange");
  const qtyValue = document.getElementById("qtyValue");
  const addonCalibration = document.getElementById("addonCalibration");
  const addonCase = document.getElementById("addonCase");
  const summaryModel = document.getElementById("summaryModel");
  const summaryQty = document.getElementById("summaryQty");
  const summaryAddons = document.getElementById("summaryAddons");
  const summaryDiscount = document.getElementById("summaryDiscount");
  const bulkDiscountRow = document.getElementById("bulkDiscountRow");
  const summaryTotal = document.getElementById("summaryTotal");
  const applyToFormBtn = document.getElementById("applyToFormBtn");
  const whatsappEstimateBtn = document.getElementById("whatsappEstimateBtn");

  // Query Form Elements
  const queryForm = document.getElementById("productQueryForm");
  const userNameInput = document.getElementById("userName");
  const userPhoneInput = document.getElementById("userPhone");
  const userEmailInput = document.getElementById("userEmail");
  const userCompanyInput = document.getElementById("userCompany");
  const productInterestSelect = document.getElementById("productInterest");
  const userMessageTextarea = document.getElementById("userMessage");
  const sendOnWhatsAppCheckbox = document.getElementById("sendOnWhatsApp");

  // Modals
  const successModal = document.getElementById("successModal");
  const modalUserName = document.getElementById("modalUserName");
  const modalWaBtn = document.getElementById("modalWaBtn");
  const closeSuccessModalBtn = document.getElementById("closeSuccessModalBtn");

  const adminQueriesModal = document.getElementById("adminQueriesModal");
  const viewQueriesBtn = document.getElementById("viewQueriesBtn");
  const closeAdminModalBtn = document.getElementById("closeAdminModalBtn");
  const leadsTableBody = document.getElementById("leadsTableBody");
  const queryCountBadge = document.getElementById("queryCountBadge");
  const exportLeadsBtn = document.getElementById("exportLeadsBtn");
  const clearLeadsBtn = document.getElementById("clearLeadsBtn");

  // Floating WhatsApp Widget
  const floatingWaBtn = document.getElementById("floatingWaBtn");
  const waPopupCard = document.getElementById("waPopupCard");
  const waCloseBtn = document.getElementById("waCloseBtn");
  const waSendBtn = document.getElementById("waSendBtn");
  const waQuickInput = document.getElementById("waQuickInput");
  const waChips = document.querySelectorAll(".wa-chip");

  // FAQ Accordion
  const faqQuestions = document.querySelectorAll(".faq-question");

  // ==========================================
  // 3. Theme Management (Dark / Light Mode)
  // ==========================================
  const savedTheme = localStorage.getItem("ec_theme") || "dark";
  document.body.setAttribute("data-theme", savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const currentTheme = document.body.getAttribute("data-theme");
      const nextTheme = currentTheme === "dark" ? "light" : "dark";
      document.body.setAttribute("data-theme", nextTheme);
      localStorage.setItem("ec_theme", nextTheme);
      showToast(`Switched to ${nextTheme} theme`);
    });
  }

  // ==========================================
  // 4. Mobile Menu Navigation
  // ==========================================
  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener("click", () => {
      navMenu.classList.toggle("open");
    });

    navLinks.forEach(link => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("open");
      });
    });
  }

  // ScrollSpy for Active Nav Link
  window.addEventListener("scroll", () => {
    let currentSection = "";
    const sections = document.querySelectorAll("section[id]");
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute("id");

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        currentSection = sectionId;
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${currentSection}`) {
        link.classList.add("active");
      }
    });
  });

  // ==========================================
  // 5. Interactive Price & Variant Estimator
  // ==========================================
  function calculateEstimate() {
    if (!quantityRange) return null;

    let basePrice = 8999;
    let selectedName = "Pro Edition (0.001mm Laser Precision)";

    variantInputs.forEach(input => {
      if (input.checked) {
        basePrice = parseInt(input.getAttribute("data-price"), 10);
        selectedName = input.getAttribute("data-name");
      }
    });

    const quantity = parseInt(quantityRange.value, 10);
    if (qtyValue) qtyValue.textContent = quantity;

    let addonsCostPerUnit = 0;
    const addonNames = [];

    if (addonCalibration && addonCalibration.checked) {
      addonsCostPerUnit += parseInt(addonCalibration.getAttribute("data-cost"), 10);
      addonNames.push("Calibration Cert");
    }

    if (addonCase && addonCase.checked) {
      addonsCostPerUnit += parseInt(addonCase.getAttribute("data-cost"), 10);
      addonNames.push("Pelican Case");
    }

    const subtotal = (basePrice + addonsCostPerUnit) * quantity;
    let discount = 0;

    // Apply 20% bulk discount for 50 or more units
    if (quantity >= 50) {
      discount = subtotal * 0.20;
      if (bulkDiscountRow) bulkDiscountRow.style.display = "flex";
      if (summaryDiscount) summaryDiscount.textContent = `- ₹${Math.round(discount).toLocaleString("en-IN")}`;
    } else {
      if (bulkDiscountRow) bulkDiscountRow.style.display = "none";
    }

    const finalTotal = subtotal - discount;

    if (summaryModel) summaryModel.textContent = selectedName;
    if (summaryQty) summaryQty.textContent = `${quantity} Unit${quantity > 1 ? 's' : ''}`;
    if (summaryAddons) summaryAddons.textContent = addonNames.length > 0 ? addonNames.join(", ") : "None";
    if (summaryTotal) summaryTotal.textContent = `₹${Math.round(finalTotal).toLocaleString("en-IN")}`;

    return {
      selectedName,
      quantity,
      addons: addonNames.join(", ") || "None",
      finalTotal: Math.round(finalTotal).toLocaleString("en-IN")
    };
  }

  // Bind Estimator Change Events
  variantInputs.forEach(radio => radio.addEventListener("change", calculateEstimate));
  if (quantityRange) quantityRange.addEventListener("input", calculateEstimate);
  if (addonCalibration) addonCalibration.addEventListener("change", calculateEstimate);
  if (addonCase) addonCase.addEventListener("change", calculateEstimate);

  // "Apply to Query Form" action
  if (applyToFormBtn) {
    applyToFormBtn.addEventListener("click", () => {
      const estimate = calculateEstimate();
      
      // Auto-update Query Form Message and Product Selector
      if (productInterestSelect) {
        // Try selecting closest option
        for (let i = 0; i < productInterestSelect.options.length; i++) {
          if (productInterestSelect.options[i].text.toLowerCase().includes(estimate.selectedName.toLowerCase().split(" ")[0])) {
            productInterestSelect.selectedIndex = i;
            break;
          }
        }
      }

      if (userMessageTextarea) {
        userMessageTextarea.value = `I am interested in requesting an official quotation for:\n- Model: ${estimate.selectedName}\n- Quantity: ${estimate.quantity} Units\n- Add-ons: ${estimate.addons}\n- Estimated Price: ₹${estimate.finalTotal}\n\nPlease share delivery timeframe and formal invoice details.`;
      }

      // Smooth scroll to form
      const querySection = document.getElementById("query-section");
      if (querySection) {
        querySection.scrollIntoView({ behavior: "smooth" });
        if (userNameInput) userNameInput.focus();
        showToast("Configuration applied to inquiry form!");
      }
    });
  }

  // "Send Estimate on WhatsApp" action
  if (whatsappEstimateBtn) {
    whatsappEstimateBtn.addEventListener("click", () => {
      const estimate = calculateEstimate();
      const message = `*Quotation Request from Engineer's Choice Website*\n----------------------------------------\n*Model:* ${estimate.selectedName}\n*Quantity:* ${estimate.quantity} unit(s)\n*Add-ons:* ${estimate.addons}\n*Estimated Total:* ₹${estimate.finalTotal}\n----------------------------------------\nPlease share the formal catalog and discount availability.`;
      
      const waUrl = `https://api.whatsapp.com/send?phone=${CONFIG.whatsappNumber}&text=${encodeURIComponent(message)}`;
      window.open(waUrl, "_blank");
    });
  }

  // ==========================================
  // 6. Accessible Modern Form Validation
  // ==========================================
  // Synchronize programmatic accessibility states (like aria-invalid) with :user-invalid
  const syncAria = (el) => {
    if (!el || typeof el.getAttribute !== "function") return;
    try {
      const isInvalid = el.matches(":user-invalid") || el.classList.contains("user-invalid-fallback");
      el.setAttribute("aria-invalid", isInvalid ? "true" : "false");
    } catch (e) {
      // In case older browser selector parsing fails
    }
  };

  document.addEventListener("blur", (e) => {
    if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")) {
      syncAria(e.target);
    }
  }, true);

  document.addEventListener("input", (e) => {
    if (e.target && e.target.hasAttribute("aria-invalid")) {
      syncAria(e.target);
    }
  });

  // Fallback for browsers that do not yet support :user-invalid
  if (!CSS.supports("selector(:user-invalid)")) {
    const handleFieldFallback = (el) => {
      const isValid = el.checkValidity();
      el.classList.toggle("user-invalid-fallback", !isValid);
      el.classList.toggle("user-valid-fallback", isValid);
    };

    [userNameInput, userPhoneInput, userEmailInput, userMessageTextarea].forEach(input => {
      if (input) {
        input.addEventListener("blur", () => handleFieldFallback(input));
        input.addEventListener("input", () => {
          if (input.classList.contains("user-invalid-fallback")) {
            handleFieldFallback(input);
          }
        });
      }
    });
  }

  // ==========================================
  // 7. Query Form Submission Handler (CORE)
  // ==========================================
  if (queryForm) {
    queryForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Check form validity
      if (!queryForm.checkValidity()) {
        // Trigger reportValidity so browser flags invalid fields
        queryForm.reportValidity();
        showToast("Please fill all required fields correctly.", "error");
        return;
      }

      // Collect field values
      const formData = {
        id: "EC-" + Date.now(),
        timestamp: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
        name: userNameInput.value.trim(),
        phone: userPhoneInput.value.trim(),
        email: userEmailInput.value.trim(),
        company: userCompanyInput ? userCompanyInput.value.trim() : "",
        product: productInterestSelect ? productInterestSelect.value : "Pro Edition",
        message: userMessageTextarea.value.trim(),
        sendOnWhatsApp: sendOnWhatsAppCheckbox ? sendOnWhatsAppCheckbox.checked : true
      };

      // 1. Save query to LocalStorage (Owner never loses an inquiry)
      saveLeadToStorage(formData);
      updateLeadsBadge();

      // 2. Prepare WhatsApp message
      const formattedWaMessage = 
`*New Product Query - Engineer's Choice*
---------------------------------------
👤 *Name:* ${formData.name}
📱 *Phone:* ${formData.phone}
📧 *Email:* ${formData.email}
🏢 *Company:* ${formData.company || 'Not Specified'}
📦 *Product Interest:* ${formData.product}

💬 *Query / Requirement:*
${formData.message}
---------------------------------------
Sent via Engineer's Choice Web Portal`;

      const waUrl = `https://api.whatsapp.com/send?phone=${CONFIG.whatsappNumber}&text=${encodeURIComponent(formattedWaMessage)}`;

      // 3. Optional: Send to Web3Forms / Email webhook if key is provided
      if (CONFIG.web3formsAccessKey) {
        fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            access_key: CONFIG.web3formsAccessKey,
            subject: `[Engineer's Choice] New Query from ${formData.name}`,
            from_name: "Engineer's Choice Web Inquiry",
            ...formData
          })
        }).catch(err => console.log("Email dispatch:", err));
      }

      // 4. Show Confirmation Modal
      if (modalUserName) modalUserName.textContent = formData.name;
      if (modalWaBtn) {
        modalWaBtn.href = waUrl;
      }

      if (successModal) {
        successModal.classList.add("show");
      }

      // 5. If user opted for WhatsApp direct send, open WhatsApp
      if (formData.sendOnWhatsApp) {
        window.open(waUrl, "_blank");
      }

      // 6. Reset Form
      queryForm.reset();
      showToast("Query successfully submitted! We will respond shortly.", "success");
    });
  }

  // Close Success Modal
  if (closeSuccessModalBtn && successModal) {
    closeSuccessModalBtn.addEventListener("click", () => {
      successModal.classList.remove("show");
    });

    successModal.addEventListener("click", (e) => {
      if (e.target === successModal) {
        successModal.classList.remove("show");
      }
    });
  }

  // ==========================================
  // 8. LocalStorage Queries Manager (Admin Leads)
  // ==========================================
  function getStoredLeads() {
    try {
      const stored = localStorage.getItem("ec_queries_leads");
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  function saveLeadToStorage(newLead) {
    const leads = getStoredLeads();
    leads.unshift(newLead); // prepend latest
    localStorage.setItem("ec_queries_leads", JSON.stringify(leads));
  }

  function updateLeadsBadge() {
    const count = getStoredLeads().length;
    if (queryCountBadge) {
      queryCountBadge.textContent = count;
    }
  }

  function renderLeadsTable() {
    const leads = getStoredLeads();
    if (!leadsTableBody) return;

    if (leads.length === 0) {
      leadsTableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 24px; color: var(--text-muted);">
            No inquiries received yet. Submit the form on the landing page to test!
          </td>
        </tr>
      `;
      return;
    }

    leadsTableBody.innerHTML = leads.map(lead => `
      <tr>
        <td><small>${lead.timestamp}</small></td>
        <td><strong>${escapeHtml(lead.name)}</strong></td>
        <td><a href="tel:${escapeHtml(lead.phone)}">${escapeHtml(lead.phone)}</a></td>
        <td><a href="mailto:${escapeHtml(lead.email)}">${escapeHtml(lead.email)}</a></td>
        <td><span class="badge-pill" style="margin: 0; padding: 2px 8px; font-size: 0.72rem;">${escapeHtml(lead.product)}</span></td>
        <td>${escapeHtml(lead.message)}</td>
        <td>
          <a href="https://api.whatsapp.com/send?phone=91${encodeURIComponent(lead.phone)}&text=Hello%20${encodeURIComponent(lead.name)},%20thank%20you%20for%20contacting%20Engineer's%20Choice!" target="_blank" class="btn btn-whatsapp btn-sm" style="padding: 4px 8px; font-size: 0.75rem;">
            Chat
          </a>
        </td>
      </tr>
    `).join("");
  }

  // Open & Close Admin Modal
  if (viewQueriesBtn && adminQueriesModal) {
    viewQueriesBtn.addEventListener("click", () => {
      renderLeadsTable();
      adminQueriesModal.classList.add("show");
    });
  }

  if (closeAdminModalBtn && adminQueriesModal) {
    closeAdminModalBtn.addEventListener("click", () => {
      adminQueriesModal.classList.remove("show");
    });

    adminQueriesModal.addEventListener("click", (e) => {
      if (e.target === adminQueriesModal) {
        adminQueriesModal.classList.remove("show");
      }
    });
  }

  // Export Leads to CSV
  if (exportLeadsBtn) {
    exportLeadsBtn.addEventListener("click", () => {
      const leads = getStoredLeads();
      if (leads.length === 0) {
        showToast("No queries to export.", "error");
        return;
      }

      let csv = "ID,Timestamp,Name,Phone,Email,Company,Product,Message\n";
      leads.forEach(l => {
        csv += `"${l.id}","${l.timestamp}","${l.name}","${l.phone}","${l.email}","${l.company || ''}","${l.product}","${(l.message || '').replace(/"/g, '""')}"\n`;
      });

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `engineers_choice_leads_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast("Queries exported to CSV!");
    });
  }

  // Clear Leads
  if (clearLeadsBtn) {
    clearLeadsBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to delete all saved queries?")) {
        localStorage.removeItem("ec_queries_leads");
        renderLeadsTable();
        updateLeadsBadge();
        showToast("All queries cleared.");
      }
    });
  }

  // ==========================================
  // 9. Floating WhatsApp Widget & Quick Chat
  // ==========================================
  if (floatingWaBtn && waPopupCard) {
    floatingWaBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      waPopupCard.classList.toggle("open");
      if (waPopupCard.classList.contains("open") && waQuickInput) {
        waQuickInput.focus();
      }
    });

    if (waCloseBtn) {
      waCloseBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        waPopupCard.classList.remove("open");
      });
    }

    // Close when clicking outside popup
    document.addEventListener("click", (e) => {
      if (!waPopupCard.contains(e.target) && !floatingWaBtn.contains(e.target)) {
        waPopupCard.classList.remove("open");
      }
    });

    // Quick chip clicks
    waChips.forEach(chip => {
      chip.addEventListener("click", () => {
        const msg = chip.getAttribute("data-msg");
        sendWhatsAppText(msg);
      });
    });

    // Quick text input send
    if (waSendBtn && waQuickInput) {
      waSendBtn.addEventListener("click", () => {
        const text = waQuickInput.value.trim();
        if (text) {
          sendWhatsAppText(text);
          waQuickInput.value = "";
          waPopupCard.classList.remove("open");
        }
      });

      waQuickInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          waSendBtn.click();
        }
      });
    }
  }

  function sendWhatsAppText(message) {
    const url = `https://api.whatsapp.com/send?phone=${CONFIG.whatsappNumber}&text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  }

  // ==========================================
  // 10. FAQ Accordion Interaction
  // ==========================================
  faqQuestions.forEach(btn => {
    btn.addEventListener("click", () => {
      const item = btn.parentElement;
      const isOpen = item.classList.contains("active");

      // Close all other items
      document.querySelectorAll(".faq-item").forEach(other => {
        other.classList.remove("active");
        other.querySelector(".faq-question").setAttribute("aria-expanded", "false");
      });

      if (!isOpen) {
        item.classList.add("active");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  // ==========================================
  // 11. Helper Utilities: Toast & HTML Escape
  // ==========================================
  function showToast(message, type = "info") {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type === "success" ? "toast-success" : ""}`;
    toast.innerHTML = `
      <span>${type === "success" ? "✅" : "💡"}</span>
      <span>${escapeHtml(message)}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(30px)";
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  function escapeHtml(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // ==========================================
  // 12. Products Catalog Category Filtering
  // ==========================================
  const catalogFilters = document.querySelectorAll("#catalogFilters .filter-btn");
  const productCards = document.querySelectorAll("#productsCatalogGrid .product-item-card");

  if (catalogFilters.length > 0 && productCards.length > 0) {
    catalogFilters.forEach(button => {
      button.addEventListener("click", () => {
        catalogFilters.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        const selectedFilter = button.getAttribute("data-filter");

        productCards.forEach(card => {
          const category = card.getAttribute("data-category");
          if (selectedFilter === "all" || category === selectedFilter) {
            card.classList.remove("hidden");
          } else {
            card.classList.add("hidden");
          }
        });
      });
    });
  }

  // ==========================================
  // 13. Pre-fill Contact Product from URL Params
  // ==========================================
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const requestedProduct = urlParams.get("product");
    if (requestedProduct && productInterestSelect) {
      for (let i = 0; i < productInterestSelect.options.length; i++) {
        if (productInterestSelect.options[i].text.toLowerCase().includes(requestedProduct.toLowerCase())) {
          productInterestSelect.selectedIndex = i;
          break;
        }
      }
      if (userMessageTextarea) {
        userMessageTextarea.value = `Hello! I would like to inquire about pricing, technical specifications, and delivery timelines for ${requestedProduct}.`;
      }
    }
  } catch (e) {
    // URL parsing fallback
  }

  // Initialize
  calculateEstimate();
  updateLeadsBadge();
});

