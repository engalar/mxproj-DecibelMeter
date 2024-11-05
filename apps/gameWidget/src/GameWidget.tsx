import { ReactElement, createElement, useCallback } from "react";

import { GameWidgetContainerProps } from "../typings/GameWidgetProps";
import { BadgeSample } from "./components/BadgeSample";
import "./ui/GameWidget.css";

export function GameWidget(props: GameWidgetContainerProps): ReactElement {
    const { gamewidgetType, gamewidgetValue, valueAttribute, onClickAction, style, bootstrapStyle } = props;
    const onClickHandler = useCallback(() => {
        if (onClickAction && onClickAction.canExecute) {
            onClickAction.execute();
        }
    }, [onClickAction]);

    return (
        <BadgeSample
            type={gamewidgetType}
            bootstrapStyle={bootstrapStyle}
            className={props.class}
            clickable={!!onClickAction}
            defaultValue={gamewidgetValue ? gamewidgetValue : ""}
            onClickAction={onClickHandler}
            style={style}
            value={valueAttribute ? valueAttribute.displayValue : ""} />
    );
}
