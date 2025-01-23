import { useEffect, useRef, useState } from "react";

export type SliderButtonProps = {
    onLeftClick: () => void;
    onRightClick: () => void;
    leftLabel?: string;
    rightLabel?: string
};

export const SliderButton = (props: SliderButtonProps) => {
    const { leftLabel, rightLabel, onLeftClick, onRightClick } = props;    
    
    const [isLeftSelected, setIsLeftSelected] = useState(true);
    const [leftWidth, setLeftWidth] = useState(0);
    const [rightWidth, setRightWidth] = useState(0);

    const leftRef = useRef<HTMLDivElement>(null);
    const rightRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (leftRef.current && rightRef.current) {
        setLeftWidth(leftRef.current.offsetWidth);
        setRightWidth(rightRef.current.offsetWidth);
      }
    }, [leftLabel, rightLabel]);

    const handleRightClick = () => {
        if(!isLeftSelected) {
            return;
        }
        setIsLeftSelected(false)
        onRightClick();
    };

    const handleLeftClick = () => {
        if(isLeftSelected) {
            return;
        }
        setIsLeftSelected(true)
        onLeftClick();
    };
    
    return (
      <div className="relative flex items-center rounded-full border w-fit bg-inherit">
        <div
          className={`absolute top-0 bottom-0 rounded-full bg-primary transition-all duration-200`}
          style={{
            willChange: "transform, width",
            width: isLeftSelected ? `${leftWidth}px` : `${rightWidth}px`,
            transform: isLeftSelected
              ? `translateX(0)`
              : `translateX(${leftWidth}px)`,
          }}
        ></div>

        <div
          ref={leftRef}
          className={`py-1 px-4 rounded font-semibold cursor-pointer z-10 ${
            isLeftSelected ? "text-primary-foreground" : "text-gray-400"
          }`}
          onClick={handleLeftClick}
        >
          {leftLabel || "Left"}
        </div>

        <div
          ref={rightRef}
          className={`py-1 px-4 rounded font-semibold cursor-pointer z-10 ${
            !isLeftSelected ? "text-primary-foreground" : "text-gray-400"
          }`}
          onClick={handleRightClick}
        >
          {rightLabel || "Right"}
        </div>
      </div>
    );
};