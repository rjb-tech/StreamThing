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
import { setShowCreateNetworkModal } from "../redux/slices/mainSlice";

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
      .select("username, avatar_url, full_name, id, default_network, networks")
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

export async function updateUserAvatarUrl(
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

export async function updateNetworkAvatarUrl(
  networkId: string,
  logoUrl: string,
  supabaseClient: SupabaseClient,
  dispatch: AppDispatch
) {
  try {
    const updates = {
      id: networkId,
      logo_url: logoUrl,
      updated_at: new Date().toISOString(),
    };

    let { data, error } = await supabaseClient
      .from("networks")
      .upsert(updates)
      .select();

    if (error) throw error;

    console.log(data);
  } catch (error) {
    toast.error("Error creating new network", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
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

export async function updateUserNetworks(
  user: User,
  // networkId?: string,
  supabaseClient: SupabaseClient,
  dispatch: AppDispatch
) {
  try {
    if (!user) throw new Error("No user");

    const {
      data: networksData,
      error: infoError,
      status,
    } = await supabaseClient
      .from("profiles")
      .select("networks[]")
      .eq("id", user.id)
      .single();

    console.log(networksData);

    // const updates = {
    //   id: user.id,
    //   default_network: networkId,
    //   updated_at: new Date().toISOString(),
    // };

    // let { data, error } = await supabaseClient.from("profiles").upsert(updates);

    // if (error) throw error;

    // toast.success("Network added", {
    //   position: toast.POSITION.BOTTOM_CENTER,
    // });

    // await getProfile(user, supabaseClient, dispatch);
  } catch (error) {
    toast.error("Error updating username", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  } finally {
    dispatch(setAccountInfoLoading(false));
  }
}

export async function uploadUserImage(
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

    await updateUserAvatarUrl(
      user,
      urlData.publicUrl,
      supabaseClient,
      dispatch
    );
  } catch {
    toast.error("Error updating avatar", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  } finally {
    dispatch(setAccountImageLoading(false));
  }
}

export async function uploadNetworkImage(
  file: File,
  filename: string,
  supabaseClient: SupabaseClient,
  dispatch: AppDispatch
) {
  try {
    dispatch(setAccountImageLoading(true));
    const { data, error } = await supabaseClient.storage
      .from("avatars")
      .upload(filename, file, { upsert: true });

    if (error) throw error;

    const { data: urlData } = await supabaseClient.storage
      .from("avatars")
      .getPublicUrl(filename);

    return urlData.publicUrl;
  } catch {
    toast.error("Error updating avatar", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  } finally {
    dispatch(setAccountImageLoading(false));
  }
}

export async function createNetwork(
  user: User,
  networkName: string,
  supabaseClient: SupabaseClient,
  dispatch: AppDispatch
) {
  try {
    const insertData = {
      name: networkName,
      members: [user.id],
      admins: [user.id],
      owner: user.id,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseClient
      .from("networks")
      .insert(insertData)
      .select();

    if (error) throw error;

    dispatch(setShowCreateNetworkModal(false));

    toast.success("Network created", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  } catch {
    toast.error("Error creating network", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  }
}
