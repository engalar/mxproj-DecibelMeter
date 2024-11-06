/**
 * This file was generated from BoardWidget.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { CSSProperties } from "react";
import { ListValue, ListAttributeValue } from "mendix";
import { Big } from "big.js";

export interface BoardWidgetContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    datasource: ListValue;
    score: ListAttributeValue<Big>;
    username: ListAttributeValue<string>;
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
    datasource: {} | { caption: string } | { type: string } | null;
    score: string;
    username: string;
}
