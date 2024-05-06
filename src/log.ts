import * as vscode from "vscode";

let _gitOutput: vscode.OutputChannel | undefined = undefined;

function timestamp(): string {
  return `[${new Date().toISOString().replace(/T/, ' ').slice(0, -1)}]`;
}

export enum LogLevel {
  Debug = 0,
  Information = 1,
  Warning = 2,
  Error = 3,
}

function buildMessage(outputLog: boolean = false, message: string, ex?: Error | Error[] | undefined): string {
  let stringBuilder: string = message;

  if (ex !== undefined && ex !== null) {
    if (ex instanceof Error && !Array.isArray(ex)) {
      if (outputLog) {
        stringBuilder += ` \u2022 FAILED\n${String(ex)}\n`;
      } else {
        stringBuilder += `\n${ex.message}`;
      }
    } else if (outputLog && Array.isArray(ex)) {
      stringBuilder += ` \u2022 FAILED\n`;
      for (const _ex of ex) {
        stringBuilder += `${String(_ex)}\n`;
      }
      stringBuilder += "\n";
    }
  }

  return stringBuilder;
}

function showMessage(message: string, level: LogLevel | number, ex?: Error | Error[] | undefined, options?: vscode.MessageOptions | undefined, ...items: string[]): Thenable<string | undefined> {
  // if (!Logger.enabled(ex != null ? 'error' : 'debug')) return;
  if (typeof _gitOutput === "undefined") {
    _gitOutput = vscode.window.createOutputChannel('Twee3');
  }
  _gitOutput.appendLine(`${timestamp()} ${buildMessage(true, message, ex)}`);

  switch (level) {
    case LogLevel.Information:
    case 1:
      return (typeof options !== "undefined" ?
              vscode.window.showInformationMessage(buildMessage(false, message, ex), options, ...items) :
              vscode.window.showInformationMessage(buildMessage(false, message, ex), ...items));
    case LogLevel.Warning:
    case 2:
      return (typeof options !== "undefined" ?
              vscode.window.showWarningMessage(buildMessage(false, message, ex), options, ...items) :
              vscode.window.showWarningMessage(buildMessage(false, message, ex), ...items));
    case LogLevel.Error:
    case 3:
      return (typeof options !== "undefined" ?
              vscode.window.showErrorMessage(buildMessage(false, message, ex), options, ...items) :
              vscode.window.showErrorMessage(buildMessage(false, message, ex), ...items));
    case LogLevel.Debug:
    case 0:
    default:
      return (typeof options !== "undefined" ?
              vscode.window.showErrorMessage(buildMessage(false, message, ex), options, ...items) :
              vscode.window.showErrorMessage(buildMessage(false, message, ex), ...items));
  }
}

export function showErrorMessage(message: string, ex?: Error | any | undefined, options?: vscode.MessageOptions | undefined, ...items: string[]): Thenable<string | undefined> {
  return showMessage(message, LogLevel.Error, ex, options, ...items);
}

export function showInformationMessage(message: string, options?: vscode.MessageOptions | undefined, ...items: string[]): Thenable<string | undefined> {
  return showMessage(message, LogLevel.Warning, undefined, options, ...items);
}

export function showWarningMessage(message: string, options?: vscode.MessageOptions | undefined, ...items: string[]): Thenable<string | undefined> {
  return showMessage(message, LogLevel.Warning, undefined, options, ...items);
}

export function showDebugMessage(message: string, options?: vscode.MessageOptions | undefined, ...items: string[]): Thenable<string | undefined> {
  return showMessage(message, LogLevel.Debug, undefined, options, ...items);
}

