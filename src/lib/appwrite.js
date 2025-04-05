import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
} from "appwrite";

// Appwrite Config
export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  projectId: "67ef446a00370247af57",
  databaseId: "67ef45af001fbc88dfd1",
  userCollectionId: "67ef45ea00359bd096c8",
  threadsCollectionId: "67ef4601001524aebe15",
  commentsCollectionId: "67ef460d002d311ad862",
  votesCollectionId: "67ef461d0018dac1163c",
};

// Destructure config
const {
  endpoint,
  projectId,
  databaseId,
  userCollectionId,
} = appwriteConfig;

// Initialize Appwrite client and services
const client = new Client().setEndpoint(endpoint).setProject(projectId);
const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

// Create new user account
export const createUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw new Error("Account creation failed");

    const avatarUrl = avatars.getInitials(username);

    // Optional: send email verification
    // await account.createVerification(`${window.location.origin}/auth/callback`);

    // Sign in immediately (optional depending on UX preference)
    await signIn(email, password);

    const newUser = await databases.createDocument(
      databaseId,
      userCollectionId,
      ID.unique(),
      {
        username,
        email,
        bio: "",
        createdAt: new Date().toISOString(),
        avatar: avatarUrl,
        accountId: newAccount.$id
      }
    );

    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

// Sign in existing user
export const signIn = async (email, password) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    throw new Error("Invalid credentials. Please check the email and password.");
  }
};

// Get Appwrite account (basic info)
export const getAccount = async () => {
  try {
    return await account.get();
  } catch (error) {
    console.error("Failed to get user:", error);
    return null;
  }
};

// Get user data from database
export const getCurrentUser = async () => {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw new Error("No current account");

    const { documents } = await databases.listDocuments(
      databaseId,
      userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    return documents[0];
  } catch (error) {
    console.error("Failed to get current user data:", error);
    return null;
  }
};

// Logout user
export const signOutUser = async () => {
  try {
    await account.deleteSession("current");
  } catch (error) {
    console.error("Logout failed:", error.message);
  }
};
