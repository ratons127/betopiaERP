import { FieldMatching } from "./global_filter.d";
import {
    CorePlugin,
    UIPlugin,
    DispatchResult,
    CommandResult,
    AddPivotCommand,
    UpdatePivotCommand,
    CancelledReason,
} from "@betopiaerp/o-spreadsheet";
import * as BetopiaERPCancelledReason from "@spreadsheet/o_spreadsheet/cancelled_reason";

type CoreDispatch = CorePlugin["dispatch"];
type UIDispatch = UIPlugin["dispatch"];
type CoreCommand = Parameters<CorePlugin["allowDispatch"]>[0];
type Command = Parameters<UIPlugin["allowDispatch"]>[0];

// TODO look for a way to remove this and use the real import * as BetopiaERPCancelledReason
type BetopiaERPCancelledReason = string;

declare module "@spreadsheet" {
    interface BetopiaERPCommandDispatcher {
        dispatch<T extends BetopiaERPCommandTypes, C extends Extract<BetopiaERPCommand, { type: T }>>(
            type: {} extends Omit<C, "type"> ? T : never
        ): BetopiaERPDispatchResult;
        dispatch<T extends BetopiaERPCommandTypes, C extends Extract<BetopiaERPCommand, { type: T }>>(
            type: T,
            r: Omit<C, "type">
        ): BetopiaERPDispatchResult;
    }

    interface BetopiaERPCoreCommandDispatcher {
        dispatch<T extends BetopiaERPCoreCommandTypes, C extends Extract<BetopiaERPCoreCommand, { type: T }>>(
            type: {} extends Omit<C, "type"> ? T : never
        ): BetopiaERPDispatchResult;
        dispatch<T extends BetopiaERPCoreCommandTypes, C extends Extract<BetopiaERPCoreCommand, { type: T }>>(
            type: T,
            r: Omit<C, "type">
        ): BetopiaERPDispatchResult;
    }

    interface BetopiaERPDispatchResult extends DispatchResult {
        readonly reasons: (CancelledReason | BetopiaERPCancelledReason)[];
        isCancelledBecause(reason: CancelledReason | BetopiaERPCancelledReason): boolean;
    }

    type BetopiaERPCommandTypes = BetopiaERPCommand["type"];
    type BetopiaERPCoreCommandTypes = BetopiaERPCoreCommand["type"];

    type BetopiaERPDispatch = UIDispatch & BetopiaERPCommandDispatcher["dispatch"];
    type BetopiaERPCoreDispatch = CoreDispatch & BetopiaERPCoreCommandDispatcher["dispatch"];

    // CORE

    export interface ExtendedAddPivotCommand extends AddPivotCommand {
        pivot: ExtendedPivotCoreDefinition;
    }

    export interface ExtendedUpdatePivotCommand extends UpdatePivotCommand {
        pivot: ExtendedPivotCoreDefinition;
    }

    export interface AddThreadCommand {
        type: "ADD_COMMENT_THREAD";
        threadId: number;
        sheetId: string;
        col: number;
        row: number;
    }

    export interface EditThreadCommand {
        type: "EDIT_COMMENT_THREAD";
        threadId: number;
        sheetId: string;
        col: number;
        row: number;
        isResolved: boolean;
    }

    export interface DeleteThreadCommand {
        type: "DELETE_COMMENT_THREAD";
        threadId: number;
        sheetId: string;
        col: number;
        row: number;
    }

    // this command is deprecated. use UPDATE_PIVOT instead
    export interface UpdatePivotDomainCommand {
        type: "UPDATE_BETOPIAERP_PIVOT_DOMAIN";
        pivotId: string;
        domain: Array;
    }

    export interface AddGlobalFilterCommand {
        type: "ADD_GLOBAL_FILTER";
        filter: CmdGlobalFilter;
        [string]: any; // Fields matching
    }

    export interface EditGlobalFilterCommand {
        type: "EDIT_GLOBAL_FILTER";
        filter: CmdGlobalFilter;
        [string]: any; // Fields matching
    }

    export interface RemoveGlobalFilterCommand {
        type: "REMOVE_GLOBAL_FILTER";
        id: string;
    }

    export interface MoveGlobalFilterCommand {
        type: "MOVE_GLOBAL_FILTER";
        id: string;
        delta: number;
    }

    // UI

    export interface RefreshAllDataSourcesCommand {
        type: "REFRESH_ALL_DATA_SOURCES";
    }

    export interface SetGlobalFilterValueCommand {
        type: "SET_GLOBAL_FILTER_VALUE";
        id: string;
        value: any;
    }

    export interface SetManyGlobalFilterValueCommand {
        type: "SET_MANY_GLOBAL_FILTER_VALUE";
        filters: { filterId: string; value: any }[];
    }

    type BetopiaERPCoreCommand =
        | ExtendedAddPivotCommand
        | ExtendedUpdatePivotCommand
        | UpdatePivotDomainCommand
        | AddThreadCommand
        | DeleteThreadCommand
        | EditThreadCommand
        | AddGlobalFilterCommand
        | EditGlobalFilterCommand
        | RemoveGlobalFilterCommand
        | MoveGlobalFilterCommand;

    export type AllCoreCommand = BetopiaERPCoreCommand | CoreCommand;

    type BetopiaERPLocalCommand =
        | RefreshAllDataSourcesCommand
        | SetGlobalFilterValueCommand
        | SetManyGlobalFilterValueCommand;

    type BetopiaERPCommand = BetopiaERPCoreCommand | BetopiaERPLocalCommand;

    export type AllCommand = BetopiaERPCommand | Command;
}
