import { SupabaseClient, User } from "@supabase/supabase-js";
import { toast } from "react-toastify";
import { AppDispatch } from "../redux/store";
import {
  setAccountInfoLoading,
  setUsername,
  setAvatarUrl,
  setAccountImageLoading,
  setFollowers,
  setFollowing,
} from "../redux/slices/accountSlice";

import type { UserRecord } from "./types";

export async function getProfile(
  user: User,
  supabaseClient: SupabaseClient,
  dispatch: AppDispatch
): Promise<void> {
  try {
    dispatch(setAccountInfoLoading(true));
    if (!user) throw new Error("No user");

    const { data, error } = await supabaseClient
      .rpc("get_profile_from_id", { userid: user.id })
      .single();

    if (error) throw error;

    if (data) {
      const explodedFollowingRecords = await Promise.all(
        data.following.map(async (id: string) => {
          return await getUserRecordFromId(id, supabaseClient);
        })
      );
      dispatch(setUsername(data.username));
      dispatch(setAvatarUrl(data.avatar_url));
      dispatch(setFollowers(data.followers));
      dispatch(setFollowing(explodedFollowingRecords));
    }
  } catch (error) {
    toast.error("Error loading user data", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  } finally {
    dispatch(setAccountInfoLoading(false));
  }
}

export async function getNetworkUserInfo(
  userId: string,
  supabaseClient: SupabaseClient
): Promise<UserRecord> {
  const { data, error } = await supabaseClient
    .from("profiles")
    .select("id, username, avatar_url")
    .eq("id", userId)
    .single();

  if (error) throw error;

  const returnData: UserRecord = {
    id: data.id,
    username: data.username,
    avatarUrl: data.avatar_url,
  };

  return returnData;
}

export async function updateUserAvatarUrl(
  user: User,
  avatarUrl: string,
  supabaseClient: SupabaseClient,
  dispatch: AppDispatch
): Promise<void> {
  try {
    dispatch(setAccountInfoLoading(true));
    if (!user) throw new Error("No user");

    const updates = {
      id: user.id,
      avatar_url: avatarUrl,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabaseClient.from("profiles").upsert(updates);
    if (error) throw error;
    await getProfile(user, supabaseClient, dispatch);
  } catch (error) {
    toast.error("Error updating the data", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  } finally {
    dispatch(setAccountInfoLoading(false));
  }
}

export async function updateUsername(
  user: User,
  username: string,
  supabaseClient: SupabaseClient,
  dispatch: AppDispatch
): Promise<void> {
  try {
    dispatch(setAccountInfoLoading(true));
    if (!user) throw new Error("No user");

    const updates = {
      id: user.id,
      username,
      updated_at: new Date().toISOString(),
    };

    let { error } = await supabaseClient.from("profiles").upsert(updates);
    if (error) throw error;
    toast.success("Username updated", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
    await getProfile(user, supabaseClient, dispatch);
  } catch (error: any) {
    switch (error?.code) {
      case "23505":
        toast.error("That username is taken, try again", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        break;
      default:
        toast.error("Error updating username", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        break;
    }
  } finally {
    dispatch(setAccountInfoLoading(false));
  }
}

export async function uploadUserImage(
  file: File,
  uploadPath: string,
  user: User,
  supabaseClient: SupabaseClient,
  dispatch: AppDispatch
): Promise<void> {
  try {
    dispatch(setAccountImageLoading(true));
    const { data, error } = await supabaseClient.storage
      .from("avatars")
      .upload(uploadPath, file, { upsert: true, cacheControl: "300" });

    if (error) throw error;

    toast.success(
      "Avatar updated. It may take up to 5 minutes to see your changes.",
      {
        position: toast.POSITION.BOTTOM_CENTER,
      }
    );

    const { data: urlData } = await supabaseClient.storage
      .from("avatars")
      .getPublicUrl(uploadPath);

    await updateUserAvatarUrl(
      user,
      urlData.publicUrl,
      supabaseClient,
      dispatch
    );
  } catch {
    toast.error("Error uploading logo", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  } finally {
    dispatch(setAccountImageLoading(false));
  }
}

export async function sendFollow(
  newFollowerId: string,
  newFolloweeUsername: string,
  supabaseClient: SupabaseClient
) {
  try {
    const { data, error, status } = await supabaseClient
      .rpc("send_follow", {
        follower_id: newFollowerId,
        followee_username: newFolloweeUsername,
      })
      .single();

    if (error) throw error;

    toast.success("User followed! They will now appear in your network", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  } catch (error: any) {
    switch (error.message) {
      case "already_following":
        toast.error("Already following this user", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        break;
      case "not_found":
        toast.error("User not found", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        break;
      default:
        toast.error("Couldn't follow user, try again later", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
    }
  }
}

export async function sendUnfollow(
  followerId: string,
  followeeId: string,
  supabaseClient: SupabaseClient
) {
  try {
    const { data, error } = await supabaseClient.rpc("send_unfollow", {
      follower_id: followerId,
      followee_id: followeeId,
    });

    if (error) throw error;

    toast.success("User removed from your network", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  } catch (error: any) {
    toast.error("Error unfollowing user", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  }
}

export async function addContentSource(
  userId: string,
  contentLink: string,
  supabaseClient: SupabaseClient
) {
  try {
    const { data, error } = await supabaseClient.rpc("add_content_source", {
      user_id: userId,
      content_link: contentLink,
    });

    if (error) throw error;

    toast.success("Content source added to your account!", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  } catch (error: any) {
    switch (error.message) {
      case "invalid_source":
        toast.error("Invalid source, please try again.", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        break;
      case "already_content_source":
        toast.error("Content source already in your channel.", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
    }
  }
}

async function getUserRecordFromId(
  friendId: string,
  supabaseClient: SupabaseClient
): Promise<UserRecord | void> {
  const { data, error } = await supabaseClient
    .from("profiles")
    .select("id, username,  avatar_url")
    .eq("id", friendId)
    .single();

  if (data)
    return {
      id: data?.id,
      username: data?.username,
      avatarUrl: data?.avatar_url,
    };
}

async function getUserIdFromUsername(
  username: string,
  supabaseClient: SupabaseClient
) {
  const { data, error } = await supabaseClient
    .from("profiles")
    .select("id")
    .eq("username", username)
    .single();

  if (error) throw error;

  return data.id;
}
