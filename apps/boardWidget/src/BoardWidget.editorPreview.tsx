import { createElement, ReactElement } from "react";

import { BoardWidgetPreviewProps } from "../typings/BoardWidgetProps";
import { Board, BoardProps } from "./BoardWidget";

function parentInline(node?: HTMLElement | null): void {
    // Temporary fix, the web modeler add a containing div, to render inline we need to change it.
    if (node && node.parentElement && node.parentElement.parentElement) {
        node.parentElement.parentElement.style.display = "inline-block";
    }
}

function transformProps(_props: BoardWidgetPreviewProps): BoardProps {
    return {
        data: []
    };
}

export function preview(props: BoardWidgetPreviewProps): ReactElement {
    return (
        <div ref={parentInline}>
            <Board {...transformProps(props)}></Board>
        </div>
    );
}

export function getPreviewCss(): string {
    return require("./ui/BoardWidget.css");
}
