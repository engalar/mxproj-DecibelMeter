/**
 * This file was generated from BoardWidget.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { CSSProperties } from "react";
import { ActionValue, EditableValue } from "mendix";
import { Big } from "big.js";

export type BootstrapStyleEnum = "default" | "primary" | "success" | "info" | "inverse" | "warning" | "danger";

export type BoardwidgetTypeEnum = "badge" | "label";

export interface BoardWidgetContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    valueAttribute?: EditableValue<string | Big>;
    boardwidgetValue: string;
    bootstrapStyle: BootstrapStyleEnum;
    boardwidgetType: BoardwidgetTypeEnum;
    onClickAction?: ActionValue;
}

export interface BoardWidgetPreviewProps {
    /**
     * @deprecated Deprecated since version 9.18.0. Please use class property instead.
     */
    className: string;
    class: string;
    style: string;
    styleObject?: CSSProperties;
    readOnly: boolean;
    renderMode?: "design" | "xray" | "structure";
    valueAttribute: string;
    boardwidgetValue: string;
    bootstrapStyle: BootstrapStyleEnum;
    boardwidgetType: BoardwidgetTypeEnum;
    onClickAction: {} | null;
}
