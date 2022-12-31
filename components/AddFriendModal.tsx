import { useFormik } from "formik";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setShowAddFriendModal } from "../redux/slices/mainSlice";
import { BaseModal } from "./BaseModal";
import { StreamThingButton } from "./StreamThingButton";

export const AddFriendModal = () => {
  const dispatch = useAppDispatch();
  const { showAddFriendModal } = useAppSelector((state) => state.main);

  const formik = useFormik({
    initialValues: {
      friendUsername: "",
    },
    onSubmit: (values) => {},
  });

  function closeModal() {
    dispatch(setShowAddFriendModal(false));
  }
  return (
    <BaseModal showCondition={showAddFriendModal} closeModal={closeModal}>
      <div className="w-fit justify-items-center space-y-6 p-2">
        <div className="text-2xl">
          Add your friends to see their channel in your network
        </div>
        <form onSubmit={formik.handleSubmit}>
          <span className="space-y-2 w-11/12">
            <input
              type="text"
              name="friendUsername"
              value={formik.values.friendUsername}
              onChange={formik.handleChange}
              placeholder="Username"
              className="w-full text-black border border-white rounded-md px-4 focus:ring focus:ring-white focus:ring-opacity-20 focus:outline-none"
            />
            <span className="w-full flex justify-end pt-4">
              <StreamThingButton
                innerText="Add Friend"
                disabled={
                  formik.values.friendUsername === "" ||
                  formik.values.friendUsername.length > 50
                }
              />
            </span>
          </span>
        </form>
      </div>
    </BaseModal>
  );
};
