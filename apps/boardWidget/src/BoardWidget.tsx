import { ReactElement, createElement, useCallback } from "react";

import { BoardWidgetContainerProps } from "../typings/BoardWidgetProps";
import { BadgeSample } from "./components/BadgeSample";
import "./ui/BoardWidget.css";

export function BoardWidget(props: BoardWidgetContainerProps): ReactElement {
    const { boardwidgetType, boardwidgetValue, valueAttribute, onClickAction, style, bootstrapStyle } = props;
    const onClickHandler = useCallback(() => {
        if (onClickAction && onClickAction.canExecute) {
            onClickAction.execute();
        }
    }, [onClickAction]);

    return (
        <BadgeSample
            type={boardwidgetType}
            bootstrapStyle={bootstrapStyle}
            className={props.class}
            clickable={!!onClickAction}
            defaultValue={boardwidgetValue ? boardwidgetValue : ""}
            onClickAction={onClickHandler}
            style={style}
            value={valueAttribute ? valueAttribute.displayValue : ""}
        />
    );
}
