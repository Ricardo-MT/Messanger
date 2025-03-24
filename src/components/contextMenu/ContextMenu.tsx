import React, { useEffect, useRef, useState } from "react";
import { IconType } from "react-icons";
import { LongPressReactEvents, useLongPress } from "use-long-press";
import css from "./ContextMenu.module.css";
import ReactDOM from "react-dom";
import { AnimatePresence, motion } from "motion/react";

type Props = {
  options: ContextMenuOption[];
  event?: LongPressReactEvents;
  onCancel?: () => void;
  children: React.ReactElement;
};

export const ContextMenu = ({ children, options }: Props) => {
  const [state, setState] = useState<{
    element: HTMLElement;
  } | null>(null);
  const onLongPressBinder = useLongPress((e) => {
    const { target } = e;
    const element = getParentMessageElement(target as HTMLElement);

    const cloned = element.cloneNode(true) as HTMLElement;
    setState({ element: cloned });
  });

  return (
    <>
      {React.cloneElement(children, { ...onLongPressBinder() })}
      {ReactDOM.createPortal(
        <AnimatePresence>
          {state && (
            <BackgroundPanel
              clonedElement={state.element}
              options={options}
              onClose={() => setState(null)}
            />
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

type BackgroundPanelProps = {
  clonedElement: HTMLElement;
  options: ContextMenuOption[];
  onClose: () => void;
};

export const BackgroundPanel = ({
  clonedElement,
  options,
  onClose,
}: BackgroundPanelProps) => {
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    backgroundRef.current?.insertBefore(
      clonedElement,
      backgroundRef.current.firstChild
    );
  }, []);

  return (
    <motion.div
      initial={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
      animate={{ backgroundColor: "var(--background-traslucent)" }}
      exit={{ opacity: 0 }}
      ref={backgroundRef}
      className={`${css.backgroundPanel} backgroundPanel`}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        const target = e.target;
        if (target === backgroundRef.current) {
          onClose();
        }
      }}
    >
      <motion.div
        initial={{ scale: 0, transformOrigin: "top" }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        className={css.contextMenuOptionsContainer}
      >
        {options.map((option, index) => (
          <motion.div
            whileTap={{
              backgroundColor: "var(--background-traslucent)",
            }}
            key={index}
            className={css.contextMenuOption}
            onTap={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onClose();
              option.onClick();
            }}
          >
            {option.icon({ size: 24, color: option.iconColor })}
            <span>{option.label}</span>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export type ContextMenuOption = {
  label: string;
  onClick: () => void;
  icon: IconType;
  iconColor?: string;
};

function getParentMessageElement(element: HTMLElement) {
  if (element.classList.contains("messageContainer")) {
    return element;
  }
  return getParentMessageElement(element.parentElement!);
}
