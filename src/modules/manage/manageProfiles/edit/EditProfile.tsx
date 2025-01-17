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
  const {
    newProfile,
    avatarPreview,
    error,
    onAliasChange,
    onNameChange,
    onAvatarChange,
    onSubmit,
  } = useEditProfile(profile);

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
        <h2>Editar perfil</h2>
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
          {(avatarPreview || profile.avatar) && (
            <img
              className={css.avatar}
              src={avatarPreview || profile.avatar}
              alt=""
            />
          )}
          <label>
            Foto de perfil
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files) {
                    const file = e.target.files[0];
                    onAvatarChange(file);
                  }
                }}
              />
            </div>
          </label>
          <label>
            Nombre
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
          <button type="submit">Guardar</button>
        </form>
        {error ? <p>{error}</p> : null}
      </div>
    </div>
  );
};
