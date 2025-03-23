import React, { CSSProperties, useEffect, useRef, useState } from "react";
import { IconType } from "react-icons";
import { LongPressReactEvents, useLongPress } from "use-long-press";
import css from "./ContextMenu.module.css";
import ReactDOM from "react-dom";
import { AnimatePresence, motion } from "motion/react";

const extraSpace = 4;

type Props = {
  options: ContextMenuOption[];
  event?: LongPressReactEvents;
  onCancel?: () => void;
  children: React.ReactElement;
};

export const ContextMenu = ({ children, options }: Props) => {
  const [state, setState] = useState<{
    element: HTMLElement;
    style: CSSProperties;
  } | null>(null);
  const onLongPressBinder = useLongPress((e) => {
    const { target } = e;
    const element = getParentMessageElement(target as HTMLElement);

    const { top, left, height } = element.getBoundingClientRect();
    const cloned = element.cloneNode(true) as HTMLElement;
    cloned.style.position = "absolute";
    cloned.style.top = `${top}px`;
    cloned.style.left = `${left}px`;

    const newStyles: CSSProperties = {};
    if (top < window.innerHeight / 2) {
      newStyles.top = `${top + height / 2 + extraSpace}px`;
    } else {
      newStyles.bottom = `${window.innerHeight - top + extraSpace}px`;
    }
    setState({ element: cloned, style: newStyles });
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
              optionsContainerStyles={state.style}
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
  optionsContainerStyles: React.CSSProperties;
  onClose: () => void;
};

export const BackgroundPanel = ({
  clonedElement,
  options,
  optionsContainerStyles,
  onClose,
}: BackgroundPanelProps) => {
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    backgroundRef.current?.appendChild(clonedElement);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      ref={backgroundRef}
      className={`${css.backgroundPanel} backgroundPanel`}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        className={css.contextMenuOptionsContainer}
        style={optionsContainerStyles}
      >
        {options.map((option, index) => (
          <motion.div
            whileTap={{
              backgroundColor: "var(--background-traslucent)",
            }}
            key={index}
            className={css.contextMenuOption}
            onClick={(e) => {
              e.stopPropagation();
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
