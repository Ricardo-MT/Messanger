import { useAppSelector } from "../../../store/storeHooks";
import { manageProfilesState } from "./manageProfilesSlice";
import css from "./manageProfiles.module.css";
import defaultImage from "../../../assets/default-avatar.png";
import { useState } from "react";
import { Profile } from "../../../interfaces/profile";
import { CreateProfile } from "./create/CreateProfile";
import { EditProfile } from "./edit/EditProfile";

export const ManageProfilesPage = () => {
  const { loading, error, profiles } = useAppSelector(manageProfilesState);
  const [crudState, setCrudState] = useState<
    | { action: "create" }
    | {
        action: "edit";
        profile: Profile;
      }
    | null
  >(null);

  const handleStartCreatingProfile = () => {
    setCrudState({ action: "create" });
  };

  const handleStartEditingProfile = (profile: Profile) => {
    setCrudState({ action: "edit", profile });
  };

  const onDone = () => {
    setCrudState(null);
  };

  return (
    <>
      <div className={css.manageProfilesPage}>
        <div className={css.pageHeader}>
          <h2>Your profiles</h2>
          <button onClick={handleStartCreatingProfile}>Create</button>
        </div>
        {error && <p>{error}</p>}
        {loading && <p>Loading ...</p>}
        <table className={css.profilesTable}>
          <thead>
            <tr>
              {profileTableHeaders.map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {profiles.map((profile) => (
              <tr key={profile.id}>
                <td>
                  <picture>
                    <source srcSet={profile.avatar} type="image/webp" />
                    <img
                      className={css.avatar}
                      src={defaultImage}
                      alt="Profile avatar"
                    />
                  </picture>
                </td>
                <td>{profile.name}</td>
                <td>{profile.alias}</td>
                <td>{profile.createdAt}</td>
                <td>{profile.updatedAt}</td>
                <td>
                  <button
                    onClick={() => {
                      handleStartEditingProfile(profile);
                    }}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {crudState?.action === "create" && <CreateProfile onDone={onDone} />}
      {crudState?.action === "edit" && (
        <EditProfile onDone={onDone} profile={crudState.profile} />
      )}
    </>
  );
};

const profileTableHeaders = [
  "",
  "Name",
  "Alias",
  "Created",
  "Last updated",
  "Actions",
];
