/**
 * This file was generated from GameWidget.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { CSSProperties } from "react";
import { ActionValue, EditableValue } from "mendix";
import { Big } from "big.js";

export type BootstrapStyleEnum = "default" | "primary" | "success" | "info" | "inverse" | "warning" | "danger";

export type GamewidgetTypeEnum = "badge" | "label";

export interface GameWidgetContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    valueAttribute?: EditableValue<string | Big>;
    gamewidgetValue: string;
    bootstrapStyle: BootstrapStyleEnum;
    gamewidgetType: GamewidgetTypeEnum;
    onClickAction?: ActionValue;
}

export interface GameWidgetPreviewProps {
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
    gamewidgetValue: string;
    bootstrapStyle: BootstrapStyleEnum;
    gamewidgetType: GamewidgetTypeEnum;
    onClickAction: {} | null;
}
