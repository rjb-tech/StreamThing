import { SupabaseClient, User } from "@supabase/supabase-js";
import { toast } from "react-toastify";
import { AppDispatch } from "../redux/store";
import {
  setAccountInfoLoading,
  setFullName,
  setUsername,
  setAvatarUrl,
  setAccountImageLoading,
  setFriends,
} from "../redux/slices/accountSlice";

import type { FriendRecord } from "./types";

export async function getProfile(
  user: User,
  supabaseClient: SupabaseClient,
  dispatch: AppDispatch
): Promise<void> {
  try {
    dispatch(setAccountInfoLoading(true));
    if (!user) throw new Error("No user");

    const { data, error, status } = await supabaseClient
      .from("profiles")
      .select("username, avatar_url, full_name, id, friends")
      .eq("id", user.id)
      .single();

    if (error) throw error;

    if (data) {
      const formattedFriends = await Promise.all(
        data.friends.map(async (friendId: string) => {
          return await getFriendRecordFromId(friendId, supabaseClient);
        })
      );

      dispatch(setFullName(data.full_name));
      dispatch(setUsername(data.username));
      dispatch(setAvatarUrl(data.avatar_url));
      dispatch(setFriends(formattedFriends));
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
): Promise<{
  id: string;
  username: string;
  fullName: string;
  avatarUrl: string;
}> {
  const { data, error } = await supabaseClient
    .from("profiles")
    .select("id, username, full_name, avatar_url")
    .eq("id", userId)
    .single();

  if (error) throw error;

  const returnData = {
    id: data.id,
    username: data.username,
    fullName: data.full_name,
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
      .upload(uploadPath, file, { upsert: true });

    if (error) throw error;

    toast.success("Avatar updated", {
      position: toast.POSITION.BOTTOM_CENTER,
    });

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

async function getFriendRecordFromId(
  friendId: string,
  supabaseClient: SupabaseClient
): Promise<FriendRecord | void> {
  const { data, error } = await supabaseClient
    .from("profiles")
    .select("id, username, full_name, avatar_url")
    .eq("id", friendId)
    .single();

  if (data)
    return {
      id: data?.id,
      username: data?.username,
      fullName: data?.full_name,
      avatarUrl: data?.avatar_url,
    };
}
