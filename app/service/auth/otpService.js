// Firebase Multi-Factor Authentication (MFA) and Communication App Features Implementation

import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  multiFactor,
  PhoneMultiFactorGenerator,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  signOut,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  collection,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { app } from '../../config/firebaseConfig';

const auth = getAuth(app);
const db = getFirestore(app);

// Step 1: Email/Password Registration
export const registerWithEmail = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    await saveUserData(user);
    console.log('User registered:', user);
    return user;
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.error(
        'This email is already in use. Please use a different email.'
      );
    } else {
      console.error('Error registering user:', error);
    }
    throw error;
  }
};

// Step 2: Save User Data to Firestore
export const saveUserData = async (user) => {
  try {
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      email: user.email,
      phoneNumber: user.phoneNumber || null,
      createdAt: new Date(),
      contacts: [], // Add contacts list for communication
      status: 'offline', // User's online/offline status
    });
  } catch (error) {
    console.error('Error saving user data to Firestore:', error);
    throw error;
  }
};

// Step 3: Setup Recaptcha and Send OTP for Phone Verification
export const setupRecaptcha = (elementId) => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(
      elementId,
      {
        size: 'invisible',
        callback: (response) => {
          console.log('Recaptcha verified:', response);
        },
      },
      auth
    );
  }
};

export const sendOTP = async (phoneNumber) => {
  setupRecaptcha('recaptcha-container');
  try {
    const confirmationResult = await signInWithPhoneNumber(
      auth,
      phoneNumber,
      window.recaptchaVerifier
    );
    window.confirmationResult = confirmationResult;
    console.log('OTP sent successfully');
  } catch (error) {
    if (error.code === 'auth/too-many-requests') {
      console.error('Too many requests. Please try again later.');
    } else {
      console.error('Error sending OTP:', error);
    }
    throw error;
  }
};

// Step 4: Verify OTP and Enroll in Multi-Factor Authentication
export const verifyAndEnrollMFA = async (otp) => {
  try {
    const confirmationResult = window.confirmationResult;
    const userCredential = await confirmationResult.confirm(otp);
    const user = userCredential.user;

    const multiFactorSession = await multiFactor(user).getSession();
    const phoneAuthAssertion = PhoneMultiFactorGenerator.assertion(
      confirmationResult.verificationId,
      otp
    );
    await multiFactor(user).enroll(
      phoneAuthAssertion,
      'My personal phone number'
    );

    console.log('Multi-Factor Authentication enrolled successfully');
    return user;
  } catch (error) {
    if (error.code === 'auth/invalid-verification-code') {
      console.error(
        'Invalid verification code. Please check the code and try again.'
      );
    } else {
      console.error('Error verifying OTP or enrolling in MFA:', error);
    }
    throw error;
  }
};

// Step 5: Login with Email and Password
export const loginWithEmail = async (email, password) => {
  try {
    await setPersistence(auth, browserLocalPersistence); // Enable automatic login by saving session locally
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    await updateUserStatus(userCredential.user.uid, 'online'); // Update user status to online
    console.log('User logged in:', userCredential.user);
    return userCredential.user;
  } catch (error) {
    if (error.code === 'auth/wrong-password') {
      console.error('Incorrect password. Please try again.');
    } else if (error.code === 'auth/user-not-found') {
      console.error(
        'No user found with this email. Please check the email and try again.'
      );
    } else {
      console.error('Error logging in user:', error);
    }
    throw error;
  }
};

// Step 6: Logout User
export const logoutUser = async () => {
  try {
    const user = auth.currentUser;
    if (user) {
      await updateUserStatus(user.uid, 'offline'); // Update user status to offline
    }
    await signOut(auth);
    console.log('User logged out successfully');
  } catch (error) {
    console.error('Error logging out user:', error);
    throw error;
  }
};

// Step 7: Update User Status
export const updateUserStatus = async (userId, status) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { status });
  } catch (error) {
    console.error('Error updating user status:', error);
    throw error;
  }
};

// Step 8: Add Contact
export const addContact = async (userId, contactId) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      contacts: arrayUnion(contactId),
    });
    console.log('Contact added successfully');
  } catch (error) {
    console.error('Error adding contact:', error);
    throw error;
  }
};

// Step 9: Send Message
export const sendMessage = async (chatId, senderId, messageContent) => {
  try {
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    await addDoc(messagesRef, {
      senderId,
      messageContent,
      timestamp: serverTimestamp(),
    });
    console.log('Message sent successfully');
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// Usage Example (Frontend)
// 1. Register user with email/password using registerWithEmail(email, password)
// 2. Send OTP to phone number using sendOTP(phoneNumber)
// 3. Verify OTP and enroll in MFA using verifyAndEnrollMFA(otp)
// 4. Login with email/password using loginWithEmail(email, password)
// 5. Add a contact using addContact(userId, contactId)
// 6. Send a message using sendMessage(chatId, senderId, messageContent)
// 7. Logout using logoutUser()
