import { SupabaseClient, User } from "@supabase/supabase-js";
import { toast } from "react-toastify";
import { AppDispatch } from "../redux/store";
import {
  setAccountInfoLoading,
  setFullName,
  setUsername,
  setAvatarUrl,
  setAccountImageLoading,
} from "../redux/slices/accountSlice";

export async function getProfile(
  user: User,
  supabaseClient: SupabaseClient,
  dispatch: AppDispatch
) {
  try {
    dispatch(setAccountInfoLoading(true));
    if (!user) throw new Error("No user");

    const { data, error, status } = await supabaseClient
      .from("profiles")
      .select(`username, avatar_url, full_name, id`)
      .eq("id", user.id)
      .single();

    if (error && status !== 406) {
      throw error;
    }

    if (data) {
      dispatch(setFullName(data.full_name));
      dispatch(setUsername(data.username));
      dispatch(setAvatarUrl(data.avatar_url));
    }
  } catch (error) {
    toast.error("Error loading user data", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  } finally {
    dispatch(setAccountInfoLoading(false));
  }
}

export async function updateAvatarUrl(
  user: User,
  avatarUrl: string,
  supabaseClient: SupabaseClient,
  dispatch: AppDispatch
) {
  try {
    dispatch(setAccountInfoLoading(true));
    if (!user) throw new Error("No user");

    const updates = {
      id: user.id,
      avatar_url: avatarUrl,
      updated_at: new Date().toISOString(),
    };

    let { error } = await supabaseClient.from("profiles").upsert(updates);
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
) {
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
  } catch (error) {
    toast.error("Error updating username", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  } finally {
    dispatch(setAccountInfoLoading(false));
  }
}

export async function uploadImage(
  file: File,
  filename: string,
  user: User,
  supabaseClient: SupabaseClient,
  dispatch: AppDispatch
) {
  try {
    dispatch(setAccountImageLoading(true));
    const { data, error } = await supabaseClient.storage
      .from("avatars")
      .upload(filename, file, { upsert: true });

    if (error) throw error;

    toast.success("Avatar updated", {
      position: toast.POSITION.BOTTOM_CENTER,
    });

    const { data: urlData } = await supabaseClient.storage
      .from("avatars")
      .getPublicUrl(filename);

    await updateAvatarUrl(user, urlData.publicUrl, supabaseClient, dispatch);
  } catch {
    toast.error("Error updating avatar", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  } finally {
    dispatch(setAccountImageLoading(false));
  }
}
