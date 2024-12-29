import { useCreateProfile } from "./useCreateProfile";
import css from "./createProfile.module.css";
import { useRef } from "react";

type Props = {
  onDone: () => void;
};

export const CreateProfile = ({ onDone }: Props) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const { error, onAliasChange, onNameChange, onSubmit } = useCreateProfile();
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
        <h2>Creating profile</h2>
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
          <button type="submit">Create</button>
        </form>
        {error ? <p>{error}</p> : null}
      </div>
    </div>
  );
};
