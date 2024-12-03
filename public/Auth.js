// Import required libraries
const crypto = window.crypto || window.msCrypto;

// to be used booleans
let userSignedIn = false
let userSignedUp = false;
let hasErrors = false;
let signedUp = false;

// Function to hash password
function hashPassword(password) {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);
  return crypto.subtle.digest('SHA-256', passwordBuffer).then((hash) => {
    const hashArray = Array.from(new Uint8Array(hash));
    return hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('');
  });
}

// Function to generate random salt
function generateSalt() {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(salt, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

// Store user data in local storage
const users = JSON.parse(localStorage.getItem('users')) || [];

// Sign-in function
async function signIn() {
  const email = document.getElementById('signInEmail').value;
  const password = document.getElementById('signInPassword').value;

  // Find user by email
  const user = users.find((u) => u.email === email);

  if (!user) {
    message.innerHTML = 'Email not found!';
    return;
  }

  // Hash input password with stored salt
  const hashedPassword = await hashPassword(password + user.salt);

  // Check password match
  if (hashedPassword !== user.password) {
    message.innerHTML = 'Incorrect password!';
    return;
  }

  // Store current user in localStorage
  localStorage.setItem('currentUser', JSON.stringify(user));

  message.innerHTML = 'Signed in successfully!';
  document.getElementById('signInButton').disabled = true;
  // Call showSignInForm() or redirect to dashboard
  countdownTimer.innerHTML = 'Redirecting to Home in 10 seconds...';
    let countdown = 10;
    const intervalId = setInterval(() => {
      countdown--;
      countdownTimer.innerHTML = `Redirecting in ${countdown} seconds...`;
      if (countdown === 0) {
        clearInterval(intervalId);
        // Redirect to Order Confirmation page
        window.location.href = 'index.htm';
      }
    }, 1000);

}

// Sign-up function

const countdownTimer = document.getElementById('countdown-timer');
async function signUp() {
  const email = document.getElementById('signUpEmail').value;
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  // Validate user input
  const errors = validatePassword(password);
  if (errors.length > 0) {
    // message.innerHTML = 'Password requirements not met!';
    const errorMessage = errors.join("<br>");
    message.innerHTML = `<h3>Oopsie, error occurred</h3>:<br><i>${errorMessage}</i>`;
    document.getElementById('message').className = 'error';
    return;
  }

  if (password !== confirmPassword) {
    message.innerHTML = 'Passwords do not match!';
    document.getElementById('message').className = 'error';
    return;
  }

  // Generate salt and hash password
  const salt = generateSalt();
  const hashedPassword = await hashPassword(password + salt);

  // Check for existing user
  const existingUser = users.find((u) => u.email === email);
  if (existingUser) {
    message.innerHTML = 'Email already in use!';
    document.getElementById('message').className = 'error';
    return;
  }

  // Create new user object
  const user = { email, password: hashedPassword, salt };

  // Store user data in localStorage
  users.push(user);
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('currentUser', JSON.stringify(user));

  message.innerHTML = 'Signed up successfully!';
  document.getElementById('message').className = 'success';
  document.getElementById('signUpButton').disabled = true;

  signedUp = true; // dont show sign-in again in toggle
  showSignInForm();

}


// Get elements
const showSignUpFormLink = document.getElementById('showSignUpForm');
const showSignInFormLink = document.getElementById('showSignInForm');
let signInForm = document.getElementById('signInForm');
let signUpForm = document.getElementById('signUpForm');

// Add event listeners
showSignUpFormLink.addEventListener('click', showSignUpForm);
showSignInFormLink.addEventListener('click', showSignInForm);

// Functions to toggle forms
function showSignUpForm() {
  signInForm.style.display = 'none';
  signUpForm.style.display = 'block';
  message.innerHTML = '';
}

function showSignInForm() {
  message.innerHTML = '';
  if(signedUp){
    setTimeout(() => {
      document.getElementById('sign-in-Talker').textContent = "You've Signed-Up. Sign In Now!";
      signInForm.style.display = 'block';
      signUpForm.style.display = 'none';
      message.innerHTML = '';
  }, 5000); // Wait for 5 seconds 
  }
  else{
     document.getElementById('sign-in-Talker').textContent = "Sign In";
    signInForm.style.display = 'block';
  signUpForm.style.display = 'none'; 
  }

     
 
}

function validatePassword(password) {
    const errors = [];
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least 1 uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least 1 lowercase letter');
    }
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least 1 number');
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      errors.push('Password must contain at least 1 special character');
    }
    return errors;
  }

  const passwordInput = document.getElementById('signUpPassword');
  const confirmPasswordInput = document.getElementById('confirmPassword');

  // Add event listeners
  passwordInput.addEventListener('input', checkPasswordsMatch);
  confirmPasswordInput.addEventListener('input', checkPasswordsMatch);
  
  // Function to check passwords match
  function checkPasswordsMatch() {
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
  
    if (password !== confirmPassword) {
      document.getElementById('password-match-error').innerHTML = 'Passwords do not match!';
      document.getElementById('signUpButton').disabled = true;
    } else {
      document.getElementById('password-match-error').innerHTML = '';
      document.getElementById('signUpButton').disabled = false;
    }
  }
  




// // Add event listeners
// Resolved event submit here
document.getElementById('signInButton').addEventListener('click', (e) => {
  e.preventDefault(); // Prevent default form submission
  signIn(); // Call signIn function
});
document.getElementById('signUpButton').addEventListener('click', signUp);
// document.getElementById('showSignInForm').addEventListener('click', showSignInForm);