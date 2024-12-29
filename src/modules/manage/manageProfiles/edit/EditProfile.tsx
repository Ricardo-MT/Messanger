import { useEditProfile } from "./useEditProfile";
import css from "./editProfile.module.css";
import { useRef } from "react";
import { Profile } from "../../../../interfaces/profile";

type Props = {
  onDone: () => void;
  profile: Profile;
};

export const EditProfile = ({ onDone, profile }: Props) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const { newProfile, error, onAliasChange, onNameChange, onSubmit } =
    useEditProfile(profile);
  return (
    <div
      onClick={(e) => {
        if (
          contentRef?.current === e.target ||
          contentRef?.current?.contains(e.target as Node)
        ) {
          return;
        }
        onDone();
      }}
      className={css.background}
    >
      <div ref={contentRef} className={css.content}>
        <h2>Edit profile</h2>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            e.stopPropagation();
            const res = await onSubmit();
            if (res) {
              onDone();
            }
          }}
        >
          <label>
            Name
            <div>
              <input
                value={newProfile.name}
                type="text"
                onChange={(e) => onNameChange(e.target.value)}
              />
            </div>
          </label>
          <label>
            Alias
            <div>
              <input
                value={newProfile.alias}
                type="text"
                onChange={(e) => onAliasChange(e.target.value)}
              />
            </div>
          </label>
          <button type="submit">Save</button>
        </form>
        {error ? <p>{error}</p> : null}
      </div>
    </div>
  );
};
