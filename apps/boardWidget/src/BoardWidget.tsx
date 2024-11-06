import { ReactElement, createElement, useMemo, CSSProperties } from "react";

import { BoardWidgetContainerProps } from "../typings/BoardWidgetProps";
import { ValueStatus } from "mendix";
import "./ui/BoardWidget.css";
import { Board } from "./Board";

export interface Score {
    score: number;
    username: string;
}
export interface BoardProps {
    data: Score[];
    className?: string;
    style?: CSSProperties;
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
    }, [datasource.items, datasource.status, score, username]);
    // const onClickHandler = useCallback(() => {
    //     if (onClickAction && onClickAction.canExecute) {
    //         onClickAction.execute();
    //     }
    // }, [onClickAction]);

    return <Board style={style} className={props.class} data={data} />;
}
