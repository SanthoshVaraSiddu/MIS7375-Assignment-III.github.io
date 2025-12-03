

// Global error tracking
let formErrors = {};

// SSN masking variables
let ssnActualValue = '';
let lastSSNMaskedLength = 0;

// Display current date on page load
function showCurrentDate() {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();
    const dayName = days[now.getDay()];
    const monthName = months[now.getMonth()];
    const day = now.getDate();
    const year = now.getFullYear();
    const formatted = dayName + ", " + monthName + " " + day + ", " + year;
    document.getElementById("current-date").textContent = formatted;
}

// Set min and max dates for DOB field
function setDateLimits() {
    const today = new Date();
    const maxDate = today.toISOString().split('T')[0];
    
    const minDate = new Date();
    minDate.setFullYear(today.getFullYear() - 120);
    const minDateStr = minDate.toISOString().split('T')[0];
    
    const dobField = document.getElementById("dob");
    if (dobField) {
        dobField.setAttribute("max", maxDate);
        dobField.setAttribute("min", minDateStr);
    }
}

// Show error message for a field
function showError(fieldName, message) {
    formErrors[fieldName] = message;
    const errorSpan = document.getElementById(fieldName + "-error");
    if (errorSpan) {
        errorSpan.textContent = message;
        errorSpan.style.display = "block";
    }
    updateSubmitButton();
}

// Clear error message for a field
function clearError(fieldName) {
    delete formErrors[fieldName];
    const errorSpan = document.getElementById(fieldName + "-error");
    if (errorSpan) {
        errorSpan.textContent = "";
        errorSpan.style.display = "none";
    }
    updateSubmitButton();
}

// Update submit button state based on errors and required fields
function updateSubmitButton() {
    const submitBtn = document.getElementById("submit-btn");
    const errorCount = Object.keys(formErrors).length;
    
    // Check if all required fields are filled
    const allRequiredFieldsFilled = checkAllRequiredFields();
    
    if (submitBtn) {
        if (errorCount > 0 || !allRequiredFieldsFilled) {
            submitBtn.disabled = true;
            submitBtn.style.opacity = "0.5";
            submitBtn.style.cursor = "not-allowed";
            submitBtn.title = "Please fill all required fields correctly before submitting";
        } else {
            submitBtn.disabled = false;
            submitBtn.style.opacity = "1";
            submitBtn.style.cursor = "pointer";
            submitBtn.title = "Submit the form";
        }
    }
}

// Check if all required fields have values
function checkAllRequiredFields() {
    const form = document.getElementById("patient-form");
    if (!form) return false;
    
    // Check all required text/email/tel fields
    const firstName = form.firstName.value.trim();
    const lastName = form.lastName.value.trim();
    const dob = form.dob.value;
    const email = form.email.value.trim();
    const phone = form.phone.value.replace(/\D/g, '');
    const address1 = form.address1.value.trim();
    const city = form.city.value.trim();
    const state = form.state.value;
    const zip = form.zip.value.replace(/\D/g, '');
    const userId = form.userId.value.trim();
    const password = form.password.value;
    const repassword = form.repassword.value;
    
    // Check required radio button (gender)
    const genderChecked = form.querySelector('input[name="gender"]:checked');
    
    // Return true only if ALL required fields have values
    return firstName !== "" &&
           lastName !== "" &&
           dob !== "" &&
           ssnActualValue.length === 9 &&
           email !== "" &&
           phone.length === 10 &&
           address1 !== "" &&
           city !== "" &&
           state !== "" &&
           zip.length === 5 &&
           userId !== "" &&
           password !== "" &&
           repassword !== "" &&
           genderChecked !== null;
}

// Format and mask SSN
function formatSSN(input) {
    let currentValue = input.value;
    let currentLength = currentValue.length;
    
    // Detect if user is adding or removing characters
    if (currentLength > lastSSNMaskedLength) {
        // User is typing - extract the new digit
        let newChar = currentValue.charAt(currentLength - 1);
        // Only process if it's a digit
        if (/\d/.test(newChar)) {
            // Add the digit to our actual value (max 9 digits)
            if (ssnActualValue.length < 9) {
                ssnActualValue += newChar;
            }
        }
    } else if (currentLength < lastSSNMaskedLength) {
        // User is deleting - remove last digit from actual value
        ssnActualValue = ssnActualValue.slice(0, -1);
    }
    
    // Create masked display value with dashes
    let maskedValue = '';
    for (let i = 0; i < ssnActualValue.length; i++) {
        maskedValue += 'X';
        // Add dashes after 3rd and 5th digit
        if (i === 2 || i === 4) {
            maskedValue += '-';
        }
    }
    
    // Update the field value
    input.value = maskedValue;
    
    // Store the new masked length for next comparison
    lastSSNMaskedLength = maskedValue.length;
    
    // Validate on input
    validateSSN();
}

// Validate SSN
function validateSSN() {
    if (ssnActualValue === "") {
        showError("ssn", "Social Security Number is required (9 digits)");
        return false;
    }
    if (ssnActualValue.length !== 9) {
        showError("ssn", "SSN must be exactly 9 digits");
        return false;
    }
    if (!/^\d{9}$/.test(ssnActualValue)) {
        showError("ssn", "SSN must contain only numbers");
        return false;
    }
    clearError("ssn");
    return true;
}

// Validate First Name
function validateFirstName() {
    const field = document.querySelector('input[name="firstName"]');
    const value = field.value.trim();
    
    if (value === "") {
        showError("firstName", "First Name is required");
        return false;
    }
    if (value.length < 1 || value.length > 30) {
        showError("firstName", "First Name must be 1-30 characters");
        return false;
    }
    if (!/^[A-Za-z\-']+$/.test(value)) {
        showError("firstName", "First Name can only contain letters, hyphens, and apostrophes");
        return false;
    }
    clearError("firstName");
    return true;
}

// Validate Middle Initial
function validateMiddleInitial() {
    const field = document.querySelector('input[name="middleInitial"]');
    const value = field.value.trim();
    
    // Middle initial is optional
    if (value === "") {
        clearError("middleInitial");
        return true;
    }
    if (value.length > 1) {
        showError("middleInitial", "Middle Initial must be only 1 character");
        return false;
    }
    if (!/^[A-Za-z]$/.test(value)) {
        showError("middleInitial", "Middle Initial must be a letter");
        return false;
    }
    clearError("middleInitial");
    return true;
}

// Validate Last Name
function validateLastName() {
    const field = document.querySelector('input[name="lastName"]');
    const value = field.value.trim();
    
    if (value === "") {
        showError("lastName", "Last Name is required");
        return false;
    }
    if (value.length < 1 || value.length > 30) {
        showError("lastName", "Last Name must be 1-30 characters");
        return false;
    }
    if (!/^[A-Za-z\-'2-5]+$/.test(value)) {
        showError("lastName", "Last Name can only contain letters, hyphens, apostrophes, and numbers 2-5");
        return false;
    }
    clearError("lastName");
    return true;
}

// Validate Date of Birth
function validateDOB() {
    const field = document.getElementById("dob");
    const value = field.value;
    
    if (value === "") {
        showError("dob", "Date of Birth is required");
        return false;
    }
    
    const dob = new Date(value);
    const today = new Date();
    const maxAge = new Date();
    maxAge.setFullYear(today.getFullYear() - 120);
    
    if (dob > today) {
        showError("dob", "Date of Birth cannot be in the future");
        return false;
    }
    if (dob < maxAge) {
        showError("dob", "Date of Birth cannot be more than 120 years ago");
        return false;
    }
    clearError("dob");
    return true;
}

// Validate Email
function validateEmail() {
    const field = document.querySelector('input[name="email"]');
    const value = field.value.trim().toLowerCase();
    field.value = value; // Force lowercase
    
    if (value === "") {
        showError("email", "Email is required");
        return false;
    }
    if (value.length > 50) {
        showError("email", "Email cannot exceed 50 characters");
        return false;
    }
    // Email regex: must have format name@domain.tld
    if (!/^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(value)) {
        showError("email", "Email must be in format: name@domain.tld");
        return false;
    }
    clearError("email");
    return true;
}

// Validate Phone Number
function validatePhone() {
    const field = document.getElementById("phone");
    const value = field.value;
    const digits = value.replace(/\D/g, '');
    
    if (value === "") {
        showError("phone", "Phone Number is required");
        return false;
    }
    if (digits.length !== 10) {
        showError("phone", "Phone Number must be exactly 10 digits");
        return false;
    }
    if (!/^\(\d{3}\)-\d{3}-\d{4}$/.test(value)) {
        showError("phone", "Phone must be in format: (XXX)-XXX-XXXX");
        return false;
    }
    clearError("phone");
    return true;
}

// Format phone number as (XXX)-XXX-XXXX
function formatPhoneNumber(value) {
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length === 0) {
        return '';
    } else if (numbers.length <= 3) {
        return '(' + numbers;
    } else if (numbers.length <= 6) {
        return '(' + numbers.slice(0, 3) + ')-' + numbers.slice(3);
    } else {
        return '(' + numbers.slice(0, 3) + ')-' + numbers.slice(3, 6) + '-' + numbers.slice(6, 10);
    }
}

// Setup phone number auto-formatting with validation
function setupPhoneFormatting() {
    const phoneField = document.getElementById("phone");
    if (phoneField) {
        phoneField.addEventListener("input", function(e) {
            const cursorPosition = this.selectionStart;
            const oldLength = this.value.length;
            const oldValue = this.value;
            
            this.value = formatPhoneNumber(this.value);
            
            if (oldValue !== this.value) {
                const newLength = this.value.length;
                let newCursorPos = cursorPosition + (newLength - oldLength);
                this.setSelectionRange(newCursorPos, newCursorPos);
            }
            
            // Validate on input
            validatePhone();
        });
        
        phoneField.addEventListener("blur", validatePhone);
    }
}

// Validate Address Line 1
function validateAddress1() {
    const field = document.querySelector('input[name="address1"]');
    const value = field.value.trim();
    
    if (value === "") {
        showError("address1", "Address Line 1 is required");
        return false;
    }
    if (value.length < 2 || value.length > 30) {
        showError("address1", "Address Line 1 must be 2-30 characters");
        return false;
    }
    clearError("address1");
    return true;
}

// Validate Address Line 2 (optional)
function validateAddress2() {
    const field = document.querySelector('input[name="address2"]');
    const value = field.value.trim();
    
    // Optional field - if empty, it's valid
    if (value === "") {
        clearError("address2");
        return true;
    }
    // If entered, must be between 2-30 characters as per requirements
    if (value.length < 2 || value.length > 30) {
        showError("address2", "Address Line 2 must be 2-30 characters if provided");
        return false;
    }
    clearError("address2");
    return true;
}

// Validate City
function validateCity() {
    const field = document.querySelector('input[name="city"]');
    const value = field.value.trim();
    
    if (value === "") {
        showError("city", "City is required");
        return false;
    }
    if (value.length < 2 || value.length > 30) {
        showError("city", "City must be 2-30 characters");
        return false;
    }
    if (!/^[A-Za-z\s\-']+$/.test(value)) {
        showError("city", "City can only contain letters, spaces, hyphens, and apostrophes");
        return false;
    }
    clearError("city");
    return true;
}

// Validate State
function validateState() {
    const field = document.querySelector('select[name="state"]');
    const value = field.value;
    
    if (value === "") {
        showError("state", "State is required - please select from dropdown");
        return false;
    }
    clearError("state");
    return true;
}

// Validate ZIP Code
function validateZip() {
    const field = document.getElementById("zip");
    const value = field.value;
    const digits = value.replace(/\D/g, '');
    
    if (value === "") {
        showError("zip", "ZIP Code is required");
        return false;
    }
    if (digits.length !== 5) {
        showError("zip", "ZIP Code must be exactly 5 digits");
        return false;
    }
    if (!/^\d{5}$/.test(digits)) {
        showError("zip", "ZIP Code must contain only numbers");
        return false;
    }
    clearError("zip");
    return true;
}

// Format ZIP code as XXXXX (5 digits only)
function formatZipCode(value) {
    const numbers = value.replace(/\D/g, '');
    
    // Only allow 5 digits
    return numbers.slice(0, 5);
}

// Setup ZIP code auto-formatting with validation
function setupZipFormatting() {
    const zipField = document.getElementById("zip");
    if (zipField) {
        zipField.addEventListener("input", function(e) {
            const cursorPosition = this.selectionStart;
            const oldLength = this.value.length;
            this.value = formatZipCode(this.value);
            const newLength = this.value.length;
            
            const diff = newLength - oldLength;
            this.setSelectionRange(cursorPosition + diff, cursorPosition + diff);
            
            // Validate on input
            validateZip();
        });
        
        zipField.addEventListener("blur", validateZip);
    }
}

// Validate Symptoms (optional)
function validateSymptoms() {
    // Symptoms are optional, so just clear any errors
    clearError("symptoms");
    return true;
}

// Validate Gender
function validateGender() {
    const genderChecked = document.querySelector('input[name="gender"]:checked');
    
    if (!genderChecked) {
        showError("gender", "Gender selection is required");
        return false;
    }
    clearError("gender");
    return true;
}

// Validate User ID
function validateUserId() {
    const field = document.getElementById("userId");
    let value = field.value.trim();
    
    // Force lowercase
    value = value.toLowerCase();
    field.value = value;
    
    if (value === "") {
        showError("userId", "User ID is required");
        return false;
    }
    if (value.length < 5 || value.length > 20) {
        showError("userId", "User ID must be 5-20 characters");
        return false;
    }
    if (/^\d/.test(value)) {
        showError("userId", "User ID cannot start with a number");
        return false;
    }
    if (!/^[a-z][a-z0-9_\-]*$/.test(value)) {
        showError("userId", "User ID can only contain letters, numbers, underscore, and dash (no spaces or special characters)");
        return false;
    }
    if (/\s/.test(value)) {
        showError("userId", "User ID cannot contain spaces");
        return false;
    }
    clearError("userId");
    return true;
}

// Validate Password
function validatePassword() {
    const field = document.getElementById("password");
    const value = field.value;
    const userId = document.getElementById("userId").value.toLowerCase();
    const firstName = document.querySelector('input[name="firstName"]').value.toLowerCase();
    const lastName = document.querySelector('input[name="lastName"]').value.toLowerCase();
    
    if (value === "") {
        showError("password", "Password is required");
        return false;
    }
    if (value.length < 8 || value.length > 30) {
        showError("password", "Password must be 8-30 characters");
        return false;
    }
    if (!/[a-z]/.test(value)) {
        showError("password", "Password must include at least 1 lowercase letter");
        return false;
    }
    if (!/[A-Z]/.test(value)) {
        showError("password", "Password must include at least 1 uppercase letter");
        return false;
    }
    if (!/\d/.test(value)) {
        showError("password", "Password must include at least 1 number");
        return false;
    }
    if (!/[!@#%^&*()\-_+=\\/<>.,`~]/.test(value)) {
        showError("password", "Password must include at least 1 special character (!@#%^&*()-_+=\\/<>.,`~)");
        return false;
    }
    if (/"/.test(value)) {
        showError("password", "Password cannot contain quotes");
        return false;
    }
    if (value.toLowerCase() === userId) {
        showError("password", "Password cannot be the same as User ID");
        return false;
    }
    if (value.toLowerCase() === firstName || value.toLowerCase() === lastName) {
        showError("password", "Password cannot be the same as your name");
        return false;
    }
    clearError("password");
    return true;
}

// Validate Re-enter Password
function validateRePassword() {
    const passwordField = document.getElementById("password");
    const repasswordField = document.getElementById("repassword");
    const password = passwordField.value;
    const repassword = repasswordField.value;
    
    if (repassword === "") {
        showError("repassword", "Please re-enter your password");
        return false;
    }
    if (password !== repassword) {
        showError("repassword", "Passwords do not match");
        return false;
    }
    clearError("repassword");
    return true;
}

// Update health score display dynamically
function updateHealthScore() {
    const slider = document.getElementById("healthscore");
    const scoreDisplay = document.getElementById("score");
    
    if (slider && scoreDisplay) {
        slider.addEventListener("input", function() {
            scoreDisplay.textContent = this.value;
        });
    }
}

// Review form function
function reviewForm() {
    // Validate all fields before showing review
    const isValid = validateAllFields();
    
    if (!isValid) {
        alert("Please fix all errors before reviewing the form.");
        return;
    }
    
    const form = document.getElementById("patient-form");
    const reviewContainer = document.getElementById("review-container");
    const reviewContent = document.getElementById("review-content");
    
    // Get all form values
    const firstName = form.firstName.value.trim();
    const middleInitial = form.middleInitial.value.trim();
    const lastName = form.lastName.value.trim();
    const dob = form.dob.value;
    const ssn = ssnActualValue;
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();
    const address1 = form.address1.value.trim();
    const address2 = form.address2.value.trim();
    const city = form.city.value.trim();
    const state = form.state.value;
    const zip = form.zip.value.trim();
    const symptoms = form.symptoms.value.trim();
    
    // Get checked medical history
    const historyBoxes = form.querySelectorAll('input[name="history"]:checked');
    const historyArray = Array.from(historyBoxes).map(box => box.value);
    const historyText = historyArray.length > 0 ? historyArray.join(', ') : 'None';
    
    // Get radio button values
    const gender = form.querySelector('input[name="gender"]:checked')?.value || 'Not specified';
    const vaccinated = form.querySelector('input[name="vaccinated"]:checked')?.value || 'Not specified';
    const insurance = form.querySelector('input[name="insurance"]:checked')?.value || 'Not specified';
    
    const healthscore = form.healthscore.value;
    const userId = form.userId.value.trim();
    const password = form.password.value;
    
    // Build review HTML
    let html = '';
    
    // Personal Information Section
    html += '<div class="review-section">';
    html += '<h3>Personal Information</h3>';
    html += '<div class="review-row"><span class="review-label">First Name:</span><span class="review-value">' + firstName + '</span><span class="review-status pass">✓</span></div>';
    if (middleInitial) {
        html += '<div class="review-row"><span class="review-label">Middle Initial:</span><span class="review-value">' + middleInitial + '</span><span class="review-status pass">✓</span></div>';
    }
    html += '<div class="review-row"><span class="review-label">Last Name:</span><span class="review-value">' + lastName + '</span><span class="review-status pass">✓</span></div>';
    html += '<div class="review-row"><span class="review-label">Date of Birth:</span><span class="review-value">' + dob + '</span><span class="review-status pass">✓</span></div>';
    html += '<div class="review-row"><span class="review-label">SSN:</span><span class="review-value">***-**-' + ssn.slice(-4) + '</span><span class="review-status pass">✓</span></div>';
    html += '</div>';
    
    // Contact Information Section
    html += '<div class="review-section">';
    html += '<h3>Contact Information</h3>';
    html += '<div class="review-row"><span class="review-label">Email:</span><span class="review-value">' + email + '</span><span class="review-status pass">✓</span></div>';
    html += '<div class="review-row"><span class="review-label">Phone:</span><span class="review-value">' + phone + '</span><span class="review-status pass">✓</span></div>';
    html += '<div class="review-row"><span class="review-label">Address Line 1:</span><span class="review-value">' + address1 + '</span><span class="review-status pass">✓</span></div>';
    if (address2) {
        html += '<div class="review-row"><span class="review-label">Address Line 2:</span><span class="review-value">' + address2 + '</span><span class="review-status pass">✓</span></div>';
    }
    html += '<div class="review-row"><span class="review-label">City:</span><span class="review-value">' + city + '</span><span class="review-status pass">✓</span></div>';
    html += '<div class="review-row"><span class="review-label">State:</span><span class="review-value">' + state + '</span><span class="review-status pass">✓</span></div>';
    html += '<div class="review-row"><span class="review-label">ZIP Code:</span><span class="review-value">' + zip + '</span><span class="review-status pass">✓</span></div>';
    html += '</div>';
    
    // Medical Information Section
    html += '<div class="review-section">';
    html += '<h3>Medical Information</h3>';
    html += '<div class="review-row"><span class="review-label">Medical History:</span><span class="review-value">' + historyText + '</span><span class="review-status pass">✓</span></div>';
    html += '<div class="review-row"><span class="review-label">Gender:</span><span class="review-value">' + gender + '</span><span class="review-status pass">✓</span></div>';
    html += '<div class="review-row"><span class="review-label">Vaccinated:</span><span class="review-value">' + vaccinated + '</span><span class="review-status pass">✓</span></div>';
    html += '<div class="review-row"><span class="review-label">Insurance:</span><span class="review-value">' + insurance + '</span><span class="review-status pass">✓</span></div>';
    html += '<div class="review-row"><span class="review-label">Health Score:</span><span class="review-value">' + healthscore + ' / 10</span><span class="review-status pass">✓</span></div>';
    html += '<div class="review-row"><span class="review-label">Symptoms:</span><span class="review-value">' + (symptoms || 'None provided') + '</span><span class="review-status pass">✓</span></div>';
    html += '</div>';
    
    // User Credentials Section
    html += '<div class="review-section">';
    html += '<h3>User Credentials</h3>';
    html += '<div class="review-row"><span class="review-label">User ID:</span><span class="review-value">' + userId + '</span><span class="review-status pass">✓</span></div>';
    html += '<div class="review-row"><span class="review-label">Password:</span><span class="review-value">' + '*'.repeat(password.length) + ' (hidden)</span><span class="review-status pass">✓</span></div>';
    html += '</div>';
    
    // Display the review
    reviewContent.innerHTML = html;
    reviewContainer.style.display = 'block';
    
    // Scroll to review section
    reviewContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Validate all fields
function validateAllFields() {
    let allValid = true;
    
    // Clear all existing errors first
    formErrors = {};
    
    // Validate each field
    if (!validateFirstName()) allValid = false;
    if (!validateMiddleInitial()) allValid = false;
    if (!validateLastName()) allValid = false;
    if (!validateDOB()) allValid = false;
    if (!validateSSN()) allValid = false;
    if (!validateEmail()) allValid = false;
    if (!validatePhone()) allValid = false;
    if (!validateAddress1()) allValid = false;
    if (!validateAddress2()) allValid = false;
    if (!validateCity()) allValid = false;
    if (!validateState()) allValid = false;
    if (!validateZip()) allValid = false;
    if (!validateGender()) allValid = false;
    if (!validateUserId()) allValid = false;
    if (!validatePassword()) allValid = false;
    if (!validateRePassword()) allValid = false;
    
    updateSubmitButton();
    return allValid;
}

// Clear form function
function clearForm() {
    if (confirm("Are you sure you want to clear all form data?")) {
        document.getElementById("patient-form").reset();
        document.getElementById("review-container").style.display = 'none';
        document.getElementById("score").textContent = '5';
        
        // Reset SSN variables
        ssnActualValue = '';
        lastSSNMaskedLength = 0;
        
        // Clear all errors
        formErrors = {};
        const errorSpans = document.querySelectorAll('.error-message');
        errorSpans.forEach(span => {
            span.textContent = '';
            span.style.display = 'none';
        });
        
        updateSubmitButton();
    }
}

// Form submission validation
function validateFormOnSubmit(event) {
    const allValid = validateAllFields();
    
    if (!allValid) {
        event.preventDefault();
        alert("Please fix all errors before submitting the form.");
        return false;
    }
    
    return true;
}

// Setup all field validators
function setupFieldValidators() {
    // First Name
    const firstNameField = document.querySelector('input[name="firstName"]');
    if (firstNameField) {
        firstNameField.addEventListener("input", validateFirstName);
        firstNameField.addEventListener("blur", validateFirstName);
    }
    
    // Middle Initial
    const middleInitialField = document.querySelector('input[name="middleInitial"]');
    if (middleInitialField) {
        middleInitialField.addEventListener("input", validateMiddleInitial);
        middleInitialField.addEventListener("blur", validateMiddleInitial);
    }
    
    // Last Name
    const lastNameField = document.querySelector('input[name="lastName"]');
    if (lastNameField) {
        lastNameField.addEventListener("input", validateLastName);
        lastNameField.addEventListener("blur", validateLastName);
    }
    
    // Date of Birth
    const dobField = document.getElementById("dob");
    if (dobField) {
        dobField.addEventListener("change", validateDOB);
        dobField.addEventListener("blur", validateDOB);
    }
    
    // Email
    const emailField = document.querySelector('input[name="email"]');
    if (emailField) {
        emailField.addEventListener("input", validateEmail);
        emailField.addEventListener("blur", validateEmail);
    }
    
    // Address Line 1
    const address1Field = document.querySelector('input[name="address1"]');
    if (address1Field) {
        address1Field.addEventListener("input", validateAddress1);
        address1Field.addEventListener("blur", validateAddress1);
    }
    
    // Address Line 2
    const address2Field = document.querySelector('input[name="address2"]');
    if (address2Field) {
        address2Field.addEventListener("input", validateAddress2);
        address2Field.addEventListener("blur", validateAddress2);
    }
    
    // City
    const cityField = document.querySelector('input[name="city"]');
    if (cityField) {
        cityField.addEventListener("input", validateCity);
        cityField.addEventListener("blur", validateCity);
    }
    
    // State
    const stateField = document.querySelector('select[name="state"]');
    if (stateField) {
        stateField.addEventListener("change", validateState);
        stateField.addEventListener("blur", validateState);
    }
    
    // Gender
    const genderRadios = document.querySelectorAll('input[name="gender"]');
    genderRadios.forEach(radio => {
        radio.addEventListener("change", validateGender);
    });
    
    // User ID - force lowercase
    const userIdField = document.getElementById("userId");
    if (userIdField) {
        userIdField.addEventListener("input", function() {
            this.value = this.value.toLowerCase();
            validateUserId();
        });
        userIdField.addEventListener("blur", validateUserId);
    }
    
    // Password
    const passwordField = document.getElementById("password");
    if (passwordField) {
        passwordField.addEventListener("input", validatePassword);
        passwordField.addEventListener("blur", validatePassword);
    }
    
    // Re-enter Password
    const repasswordField = document.getElementById("repassword");
    if (repasswordField) {
        repasswordField.addEventListener("input", validateRePassword);
        repasswordField.addEventListener("blur", validateRePassword);
    }
}

// Initialize everything on page load
window.addEventListener("DOMContentLoaded", function() {
    showCurrentDate();
    setDateLimits();
    updateHealthScore();
    setupPhoneFormatting();
    setupZipFormatting();
    setupFieldValidators();
    
    // Initially disable submit button
    updateSubmitButton();
    
    // Add submit event listener
    const form = document.getElementById("patient-form");
    if (form) {
        form.addEventListener("submit", validateFormOnSubmit);
    }

});
