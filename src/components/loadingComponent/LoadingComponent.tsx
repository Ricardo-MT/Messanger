import css from "./LoadingComponent.module.css";

export const LoadingComponent = () => {
  return (
    <div className={css.container}>
      <div className={css.loadingSpinner} />
    </div>
  );
};
