import { SupabaseClient, User } from "@supabase/supabase-js";
import { toast } from "react-toastify";
import { AppDispatch } from "../redux/store";
import {
  setAccountInfoLoading,
  setFullName,
  setUsername,
  setAvatarUrl,
  setAccountImageLoading,
  setNetworks,
  setActiveNetwork,
} from "../redux/slices/accountSlice";
import { setShowCreateNetworkModal } from "../redux/slices/mainSlice";
import {
  setNetworkAdmins,
  setNetworkId,
  setNetworkLogoUrl,
  setNetworkMembers,
  setNetworkName,
  setNetworkOwner,
} from "../redux/slices/networkSlice";

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
      .select("username, avatar_url, full_name, id, active_network, networks")
      .eq("id", user.id)
      .single();

    if (error) {
      throw error;
    }

    if (data) {
      dispatch(setNetworks(data.networks));
      dispatch(setActiveNetwork(data.active_network));
      dispatch(setFullName(data.full_name));
      dispatch(setUsername(data.username));
      dispatch(setAvatarUrl(data.avatar_url));

      if (data.active_network) {
        getNetwork(data.active_network, supabaseClient, dispatch);
      }
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

export async function getNetwork(
  networkId: string,
  supabaseClient: SupabaseClient,
  dispatch: AppDispatch
): Promise<void> {
  try {
    const { data, error } = await supabaseClient
      .from("networks")
      .select("id, name, members, admins, logo_url, owner")
      .eq("id", networkId)
      .single();

    if (error) {
      throw error;
    }

    if (data) {
      const membersInfo = await Promise.all(
        data.members.map(async (member: string) => {
          return await getNetworkUserInfo(member, supabaseClient);
        })
      );
      dispatch(setNetworkMembers(membersInfo));
      dispatch(setNetworkId(data.id));
      dispatch(setNetworkName(data.name));
      dispatch(setNetworkAdmins(data.admins));
      dispatch(setNetworkLogoUrl(data.logo_url));
      dispatch(setNetworkOwner(data.owner));
    }
  } catch (error) {
    toast.error("Error loading network data", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  }
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

export async function updateNetworkAvatarUrl(
  networkId: string,
  logoUrl: string,
  supabaseClient: SupabaseClient,
  dispatch: AppDispatch
): Promise<void> {
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

    toast.success("Logo updated", {
      position: toast.POSITION.BOTTOM_CENTER,
    });

    await getNetwork(networkId, supabaseClient, dispatch);
  } catch (error) {
    toast.error("Error updating network logo", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
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

export async function updateNetworkName(
  networkId: string,
  networkName: string,
  supabaseClient: SupabaseClient,
  dispatch: AppDispatch
): Promise<void> {
  try {
    const updates = {
      id: networkId,
      name: networkName,
      updated_at: new Date().toISOString(),
    };

    let { error } = await supabaseClient.from("networks").upsert(updates);
    if (error) throw error;
    toast.success("Network updated", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
    await getNetwork(networkId, supabaseClient, dispatch);
  } catch (error: any) {
    toast.error("Error updating network", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  }
}

export async function updateUserNetworks(
  user: User,
  // networkId?: string,
  supabaseClient: SupabaseClient,
  dispatch: AppDispatch
): Promise<void> {
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

export async function uploadNetworkImage(
  networkId: string,
  file: File,
  uploadPath: string,
  supabaseClient: SupabaseClient,
  dispatch: AppDispatch
): Promise<string | void> {
  try {
    dispatch(setAccountImageLoading(true));
    const { data, error } = await supabaseClient.storage
      .from("avatars")
      .upload(uploadPath, file, { upsert: true });

    if (error) throw error;

    toast.success("Logo uploaded", {
      position: toast.POSITION.BOTTOM_CENTER,
    });

    const { data: urlData } = await supabaseClient.storage
      .from("avatars")
      .getPublicUrl(uploadPath);

    await updateNetworkAvatarUrl(
      networkId,
      urlData.publicUrl,
      supabaseClient,
      dispatch
    );

    return urlData.publicUrl;
  } catch {
    toast.error("Error uploading avatar", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  } finally {
    dispatch(setAccountImageLoading(false));
  }
}

export async function getUserNetworks(
  user: User,
  supabaseClient: SupabaseClient
): Promise<string[]> {
  const { data } = await supabaseClient
    .from("profiles")
    .select("networks")
    .eq("id", user.id);

  return data ? data[0].networks : [];
}

export async function createNetwork(
  user: User,
  networkName: string,
  supabaseClient: SupabaseClient,
  dispatch: AppDispatch
): Promise<void> {
  try {
    const insertData = {
      name: networkName,
      members: [user.id],
      admins: [user.id],
      owner: user.id,
      logo_url:
        "https://uieskineapnmdqwofpjx.supabase.co/storage/v1/object/public/avatars/networks/default.png",
      updated_at: new Date().toISOString(),
    };

    const { data: netData, error } = await supabaseClient
      .from("networks")
      .insert(insertData)
      .select();

    if (error) throw error;

    const newNetwork = netData[0].id;

    const currentNetworks = await getUserNetworks(user, supabaseClient);
    const networksToUpdate = [...currentNetworks, newNetwork];

    const { error: addUserNetError } = await supabaseClient
      .from("profiles")
      .update({ networks: networksToUpdate, active_network: newNetwork })
      .eq("id", user.id);

    if (addUserNetError) throw addUserNetError;

    dispatch(setShowCreateNetworkModal(false));

    await getNetwork(newNetwork, supabaseClient, dispatch);

    toast.success("Network created", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  } catch {
    toast.error("Error creating network", {
      position: toast.POSITION.BOTTOM_CENTER,
    });
  }
}
