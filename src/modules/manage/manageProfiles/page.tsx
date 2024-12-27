import { useAppSelector } from "../../../store/storeHooks";
import { manageProfilesState } from "./manageProfilesSlice";
import css from "./manageProfiles.module.css";
import defaultImage from "../../../assets/default-avatar.png";

export const ManageProfilesPage = () => {
  const { loading, error, profiles } = useAppSelector(manageProfilesState);

  return (
    <div className={css.manageProfilesPage}>
      <div className={css.pageHeader}>
        <h2>Your profiles</h2>
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
            <td>{profile.updatedAt}</td>
            <td>
              <button>Edit</button>
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
};

const profileTableHeaders = ["", "Name", "Alias", "Last updated", "Actions"];
