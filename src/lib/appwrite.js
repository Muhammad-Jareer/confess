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
  threadsCollectionId,
  commentsCollectionId,
  votesCollectionId,
} = appwriteConfig;

// Initialize Appwrite client and services
const client = new Client().setEndpoint(endpoint).setProject(projectId);
const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

// Create new user account
export const createUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(ID.unique(), email, password, username);
    if (!newAccount) throw new Error("Account creation failed");

    const avatarUrl = avatars.getInitials(username);

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
        accountId: newAccount.$id,
      }
    );

    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const signIn = async (email, password) => {
  try {
    return await account.createEmailPasswordSession(email, password);
  } catch (error) {
    throw new Error("Invalid credentials. Please check the email and password.");
  }
};

export const getAccount = async () => {
  try {
    return await account.get();
  } catch (error) {
    console.error("Failed to get user:", error);
    return null;
  }
};

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

export const signOutUser = async () => {
  try {
    await account.deleteSession("current");
  } catch (error) {
    console.error("Logout failed:", error.message);
  }
};

export const updateUserDocument = async (documentId, updates) => {
  try {
    return await databases.updateDocument(
      databaseId,
      userCollectionId,
      documentId,
      updates
    );
  } catch (error) {
    console.error("Failed to update document:", error);
    throw error;
  }
};

export const createThread = async (threadData) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("No current user found");

    const { title, description, isAnonymous, category } = threadData;

    return await databases.createDocument(
      databaseId,
      threadsCollectionId,
      ID.unique(),
      {
        title,
        description,
        userId: currentUser.$id,
        likes: 0,
        createdAt: new Date().toISOString(),
        isAnonymous: isAnonymous || false,
        category: category || [],
        threadId: ID.unique(),
      }
    );
  } catch (error) {
    console.error("Error creating thread:", error);
    throw error;
  }
};

export const fetchUserThreads = async () => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("No current user found");

    const { documents } = await databases.listDocuments(
      databaseId,
      threadsCollectionId,
      [Query.equal("userId", currentUser.$id)]
    );

    return documents;
  } catch (error) {
    console.error("Error fetching threads:", error);
    throw error;
  }
};

export const fetchAllThreads = async () => {
  try {
    const { documents } = await databases.listDocuments(
      databaseId,
      threadsCollectionId
    );
    return documents;
  } catch (error) {
    console.error("Error fetching threads:", error);
    throw error;
  }
};

export const fetchThreadById = async (threadId) => {
  try {
    return await databases.getDocument(
      databaseId,
      threadsCollectionId,
      threadId
    );
  } catch (error) {
    console.error("Error fetching thread by ID:", error);
    throw error;
  }
};


//votes 
export const voteThread = async (threadId, direction) => {
  try {
    
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User not logged in");

    const existingVotes = await databases.listDocuments(
      databaseId,
      votesCollectionId,
      [
        Query.equal("threadsId", threadId),
        Query.equal("userID", currentUser.$id),
      ]
    );

    let voteAction;
    const voteValue = direction === "up" ? 1 : -1;

    if (existingVotes.total > 0) {
      const existingVote = existingVotes.documents[0];
    
      if (existingVote.voteType === voteValue) {
        await databases.deleteDocument(
          databaseId,
          votesCollectionId,
          existingVote.$id
        );
        voteAction = "removed";
      } else {
        await databases.updateDocument(
          databaseId,
          votesCollectionId,
          existingVote.$id,
          { voteType: voteValue }
        );
        voteAction = "updated";
      }
    } else {
      await databases.createDocument(
        databaseId,
        votesCollectionId,
        ID.unique(),
        {
          threadsId: threadId,
          userID: currentUser.$id,
          voteType: voteValue,
        }
      );
      voteAction = "created";
    }

    const allVotes = await databases.listDocuments(
      databaseId,
      votesCollectionId,
      [Query.equal("threadsId", threadId)]
    );

    const score = allVotes.documents.reduce(
      (sum, vote) => sum + vote.voteType,
      0
    );

    await databases.updateDocument(databaseId, threadsCollectionId, threadId, {
      likes: score,
    });

    return { score, voteAction };
  } catch (error) {
    console.error("[apiVoteThread] Error voting thread:", error);
    throw error;
  }
};



export const deleteThread = async (threadId) => {
  try {
    return await databases.deleteDocument(
      databaseId,
      threadsCollectionId,
      threadId
    );
  } catch (error) {
    console.error("Error deleting thread:", error);
    throw error;
  }
};

export const editThread = async (threadId, updates) => {
  try {
    return await databases.updateDocument(
      databaseId,
      threadsCollectionId,
      threadId,
      updates
    );
  } catch (error) {
    console.error("Error editing thread:", error);
    throw error;
  }
};
