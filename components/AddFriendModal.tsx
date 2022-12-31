import { useFormik } from "formik";
import classNames from "classnames";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setShowAddFriendModal } from "../redux/slices/mainSlice";
import { BaseModal } from "./BaseModal";
import { StreamThingButton } from "./StreamThingButton";

export const AddFriendModal = () => {
  const dispatch = useAppDispatch();
  const { showAddFriendModal } = useAppSelector((state) => state.main);

  const formik = useFormik({
    initialValues: {
      username: "",
    },
    onSubmit: (values) => {},
    validate: (values) => {
      const errors: { username?: string } = {};

      if (values.username === "") errors.username = "Username Required";
      if (values.username.length > 50)
        errors.username = "Must be less than 50 characters";

      return errors;
    },
  });

  function closeModal() {
    dispatch(setShowAddFriendModal(false));
    setTimeout(() => {
      formik.resetForm();
    }, 200);
  }
  return (
    <BaseModal showCondition={showAddFriendModal} closeModal={closeModal}>
      <div className="w-fit justify-items-center space-y-6 p-2">
        <form onSubmit={formik.handleSubmit}>
          <span className="space-y-2 w-11/12">
            <label
              className={classNames("w-full flex justify-start", {
                "text-red-500": formik.errors.username !== undefined,
              })}
            >
              {formik.errors.username
                ? formik.errors.username
                : "Add a friend to your network"}
            </label>
            <input
              type="text"
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              placeholder="Username"
              className="w-full text-black border border-white rounded-md px-4 focus:ring focus:ring-white focus:ring-opacity-20 focus:outline-none"
            />
            <span className="w-full flex justify-end pt-4">
              <StreamThingButton
                innerText="Add Friend"
                disabled={
                  formik.errors.username !== undefined ||
                  formik.values.username.length > 50
                }
              />
            </span>
          </span>
        </form>
      </div>
    </BaseModal>
  );
};
