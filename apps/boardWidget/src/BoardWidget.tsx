import { ReactElement, createElement, useMemo, CSSProperties } from "react";

import { BoardWidgetContainerProps } from "../typings/BoardWidgetProps";
// import { BadgeSample } from "./components/BadgeSample";
import { ValueStatus } from "mendix";
import "./ui/BoardWidget.css";

export interface Score {
    score: number;
    username: string;
}
export interface BoardProps {
    data: Score[];
    className?: string;
    style?: CSSProperties;
}

// react fn components use list of score as param
export function Board(props: BoardProps): ReactElement {
    return (
        <div className={props.className} style={props.style}>
            board itself
        </div>
    );
}

export function BoardWidget(props: BoardWidgetContainerProps): ReactElement {
    const { style, datasource, score, username } = props;
    const data: Score[] = useMemo(() => {
        if (datasource.status === ValueStatus.Available && datasource.items) {
            return datasource.items.map(item => ({
                score: score.get(item).value?.toNumber() || 0,
                username: username.get(item).value || ""
            }));
        }
        return [];
    }, []);
    // const onClickHandler = useCallback(() => {
    //     if (onClickAction && onClickAction.canExecute) {
    //         onClickAction.execute();
    //     }
    // }, [onClickAction]);

    return (
        <Board style={style} className={props.class} data={data} />
        // <BadgeSample
        //     type={boardwidgetType}
        //     bootstrapStyle={bootstrapStyle}
        //     className={props.class}
        //     clickable={!!onClickAction}
        //     defaultValue={boardwidgetValue ? boardwidgetValue : ""}
        //     onClickAction={onClickHandler}
        //     style={style}
        //     value={valueAttribute ? valueAttribute.displayValue : ""}
        // />
    );
}
