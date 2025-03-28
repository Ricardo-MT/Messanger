import { useCreateProfile } from "./useCreateProfile";
import css from "./createProfile.module.css";
import { useRef } from "react";

type Props = {
  onDone: () => void;
};

export const CreateProfile = ({ onDone }: Props) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const {
    avatarPreview,
    error,
    onAliasChange,
    onNameChange,
    onAvatarChange,
    onSubmit,
  } = useCreateProfile();

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
        <h2>Creando perfil</h2>
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
          {avatarPreview && (
            <img className={css.avatar} src={avatarPreview} alt="" />
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
                type="text"
                onChange={(e) => onNameChange(e.target.value)}
              />
            </div>
          </label>
          <label>
            Alias
            <div>
              <input
                type="text"
                onChange={(e) => onAliasChange(e.target.value)}
              />
            </div>
          </label>
          <button type="submit">Crear</button>
        </form>
        {error ? <p>{error}</p> : null}
      </div>
    </div>
  );
};
