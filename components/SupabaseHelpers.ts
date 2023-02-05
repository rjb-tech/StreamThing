import { SupabaseClient } from "@supabase/supabase-js";
import { toast } from "react-toastify";
import { AppDispatch } from "../redux/store";
import {
  setAccountInfoLoading,
  setUsername,
  setAvatarUrl,
  setAccountImageLoading,
  setFollowers,
  setFollowing,
  setContentSources,
  setActiveContentSource,
  setChannelCurrentlyViewing,
  setShuffleMode,
} from "../redux/slices/accountSlice";

import type { UserRecord } from "./types";
import {
  setActiveStream,
  setContentSourceBeingAdded,
  setContentSourceCurrentlyShowing,
} from "../redux/slices/uiSlice";

export async function getProfile(
  userId: string,
  supabaseClient: SupabaseClient,
  dispatch: AppDispatch
): Promise<void> {
  try {
    dispatch(setAccountInfoLoading(true));

    const { data, error } = await supabaseClient
      .rpc("get_profile_from_id", { userid: userId })
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
      dispatch(setContentSources(data.content_sources));
      dispatch(setFollowing(explodedFollowingRecords));
      dispatch(setActiveContentSource(data.active_content_source));
      dispatch(setShuffleMode(data.shuffle_mode));
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
    .select("id, username, avatar_url, active_content_source")
    .eq("id", userId)
    .single();

  if (error) throw error;

  const returnData: UserRecord = {
    id: data.id,
    username: data.username,
    avatarUrl: data.avatar_url,
    activeContentSource: data.active_content_source,
  };

  return returnData;
}

export async function updateUserAvatarUrl(
  userId: string,
  avatarUrl: string,
  supabaseClient: SupabaseClient,
  dispatch: AppDispatch
): Promise<void> {
  try {
    dispatch(setAccountInfoLoading(true));

    const updates = {
      id: userId,
      avatar_url: avatarUrl,
      last_update: new Date().toISOString(),
    };

    const { error } = await supabaseClient.from("profiles").upsert(updates);
    if (error) throw error;
    await getProfile(userId, supabaseClient, dispatch);
  } catch (error) {
    toast.error("Error updating the data", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  } finally {
    dispatch(setAccountInfoLoading(false));
  }
}

export async function updateUsername(
  userId: string,
  username: string,
  supabaseClient: SupabaseClient,
  dispatch: AppDispatch
): Promise<void> {
  try {
    dispatch(setAccountInfoLoading(true));

    const updates = {
      id: userId,
      username,
      last_update: new Date().toISOString(),
    };

    const { error } = await supabaseClient.from("profiles").upsert(updates);
    if (error) throw error;
    toast.success("Username updated", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
    await getProfile(userId, supabaseClient, dispatch);
  } catch (error: any) {
    switch (error?.code) {
      case "23505":
        toast.error("That username is taken, try again", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        break;
      case "80085":
        toast.info(`Nice try, ${username}`, {
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
  userId: string,
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
      userId,
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
  supabaseClient: SupabaseClient,
  dispatch: AppDispatch
) {
  try {
    const { data, error, status } = await supabaseClient
      .rpc("send_follow", {
        follower_id: newFollowerId,
        followee_username: newFolloweeUsername,
      })
      .single();

    if (error) throw error;

    getProfile(newFollowerId, supabaseClient, dispatch);

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
  supabaseClient: SupabaseClient,
  dispatch: AppDispatch
) {
  try {
    const { data, error } = await supabaseClient.rpc("send_unfollow", {
      follower_id: followerId,
      followee_id: followeeId,
    });

    if (error) throw error;

    getProfile(followerId, supabaseClient, dispatch);

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
  supabaseClient: SupabaseClient,
  dispatch: AppDispatch
) {
  try {
    dispatch(setContentSourceBeingAdded(true));
    const { data, error } = await supabaseClient.rpc("add_content_source", {
      user_id: userId,
      content_link: contentLink,
    });

    if (error) throw error;

    await getProfile(userId, supabaseClient, dispatch);

    toast.success("Content source added to your channel!", {
      position: toast.POSITION.BOTTOM_CENTER,
    });

    getContentSources(userId, supabaseClient, dispatch);
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
        break;
      case "content_sources_full":
        toast.error("You can only add 20 content sources", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        break;
      default:
        toast.error("Error adding content source.", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        break;
    }
  } finally {
    dispatch(setContentSourceBeingAdded(false));
  }
}

export async function removeContentSource(
  userId: string,
  contentSource: string,
  supabaseClient: SupabaseClient,
  dispatch: AppDispatch
) {
  try {
    const { data, error } = await supabaseClient.rpc("remove_content_source", {
      user_id: userId,
      source_to_remove: contentSource,
    });

    if (error) throw error;

    await getProfile(userId, supabaseClient, dispatch);

    toast.success("Content source removed!", {
      position: toast.POSITION.BOTTOM_CENTER,
    });

    getContentSources(userId, supabaseClient, dispatch);
  } catch {
    toast.error("Error removing content source", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  }
}

export async function getAndSetShuffleModeVideo(
  userId: string,
  supabaseClient: SupabaseClient,
  dispatch: AppDispatch
) {
  try {
    const { data: videoId, error } = await supabaseClient.rpc(
      "get_shuffle_mode_video",
      {
        user_id: userId,
      }
    );

    if (error) throw error;

    dispatch(setContentSourceCurrentlyShowing("shuffle_mode"));
    dispatch(setActiveStream(`https://www.youtube.com/watch?v=${videoId}`));
  } catch {
    toast.error("Error getting video", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  }
}

export async function getAndSetVideoFromContentSource(
  contentSourceLink: string,
  supabaseClient: SupabaseClient,
  dispatch: AppDispatch
) {
  try {
    const { data: videoId, error } = await supabaseClient.rpc(
      "get_random_video_id_from_content_source",
      { content_source_link: contentSourceLink }
    );

    if (error) throw error;

    dispatch(setContentSourceCurrentlyShowing(contentSourceLink));
    dispatch(setActiveStream(`https://www.youtube.com/watch?v=${videoId}`));
  } catch (err) {
    toast.error("Error setting active content source", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  }
}

export async function updateActiveContentSource(
  userId: string,
  contentLink: string,
  supabaseClient: SupabaseClient,
  dispatch: AppDispatch
) {
  try {
    const { data, error } = await supabaseClient
      .from("profiles")
      .update({
        active_content_source: contentLink,
        last_content_update: new Date().toISOString(),
      })
      .eq("id", userId);

    if (error) throw error;

    dispatch(setActiveContentSource(contentLink));
    getProfile(userId, supabaseClient, dispatch);
  } catch (error) {
    toast.error(`Error elevating ${contentLink}. Please try again`);
  }
}

export async function toggleShuffleMode(
  userId: string,
  currentShuffleMode: boolean,
  supabaseClient: SupabaseClient,
  dispatch: AppDispatch
) {
  try {
    const { data: shuffleMode, error } = await supabaseClient
      .rpc("toggle_shuffle_mode", {
        user_id: userId,
        current_shuffle_mode: currentShuffleMode,
      })
      .single();

    if (error) throw error;

    dispatch(setShuffleMode(shuffleMode));
    getProfile(userId, supabaseClient, dispatch);
  } catch (error) {
    toast.error("Error setting shuffle mode", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  }
}

async function getContentSources(
  id: string,
  supabaseClient: SupabaseClient,
  dispatch: AppDispatch
) {
  const { data, error } = await supabaseClient
    .rpc("get_content_sources_from_id", { user_id: id })
    .single();

  dispatch(setContentSources(data.content_sources));
}

async function getUserRecordFromId(
  friendId: string,
  supabaseClient: SupabaseClient
): Promise<UserRecord | void> {
  const { data, error } = await supabaseClient
    .from("profiles")
    .select("id, username,  avatar_url, active_content_source")
    .eq("id", friendId)
    .single();

  if (data)
    return {
      id: data?.id,
      username: data?.username,
      avatarUrl: data?.avatar_url,
      activeContentSource: data?.active_content_source,
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
