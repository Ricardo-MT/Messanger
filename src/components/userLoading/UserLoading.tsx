import { authState } from "../../contexts/authSlice";
import { useAppSelector } from "../../store/storeHooks";
import css from "./UserLoading.module.css";

const totalItems = 6;

export const UserLoading = () => {
  const userState = useAppSelector(authState);
  return (
    userState.loading && (
      <div className={css.container}>
        <div className={css.loadingSpinner}>
          {Array.from({ length: totalItems }).map((_, index) => (
            <div
              key={index}
              className={css.loadingSpinnerItem}
              data-spinning-index-item={index}
              data-spinning-total-items={totalItems}
              style={{ "--animation-order": totalItems - index }}
            >
              <div className={css.loadingSpinnerItemInner} />
            </div>
          ))}
        </div>
      </div>
    )
  );
};
