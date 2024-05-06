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

export function showMessage(message: string, level: LogLevel | number, ex?: Error | undefined, options?: vscode.MessageOptions | undefined, ...items: string[]): void {
  // if (!Logger.enabled(ex != null ? 'error' : 'debug')) return;

  switch (level) {
    case LogLevel.Debug:
    case 0:
      if (options) {
        vscode.window.showErrorMessage(`${message}${ex != null ? " " + ex : ''}`, options, ...items);
      } else {
        vscode.window.showErrorMessage(`${message}${ex != null ? " " + ex : ''}`, ...items);
      }
      break;
    case LogLevel.Information:
    case 1:
      if (options) {
        vscode.window.showInformationMessage(`${message}${ex != null ? " " + ex : ''}`, options, ...items);
      } else {
        vscode.window.showInformationMessage(`${message}${ex != null ? " " + ex : ''}`, ...items);
      }
      break;
    case LogLevel.Warning:
    case 2:
      if (options) {
        vscode.window.showWarningMessage(`${message}${ex != null ? " " + ex : ''}`, options, ...items);
      } else {
        vscode.window.showWarningMessage(`${message}${ex != null ? " " + ex : ''}`, ...items);
      }
      break;
    case LogLevel.Error:
    case 3:
      if (options) {
        vscode.window.showErrorMessage(`${message}${ex != null ? " " + ex : ''}`, options, ...items);
      } else {
        vscode.window.showErrorMessage(`${message}${ex != null ? " " + ex : ''}`, ...items);
      }
      break;
  }

  _gitOutput ??= vscode.window.createOutputChannel('Twee3');
  _gitOutput.appendLine(`${timestamp()} ${message}${ex != null ? ` \u2022 FAILED` : ''}`);
  if (ex != null) {
    _gitOutput.appendLine(`\n${String()}\n`);
  }
}

export function showErrorMessage(message: string, ex?: Error | any | undefined, options?: vscode.MessageOptions | undefined, ...items: string[]): void {
  showMessage(message, LogLevel.Error, ex, options, ...items);
}

export function showInformationMessage(message: string, options?: vscode.MessageOptions | undefined, ...items: string[]): void {
  showMessage(message, LogLevel.Warning, undefined, options, ...items);
}

export function showWarningMessage(message: string, options?: vscode.MessageOptions | undefined, ...items: string[]): void {
  showMessage(message, LogLevel.Warning, undefined, options, ...items);
}

export function showDebugMessage(message: string, options?: vscode.MessageOptions | undefined, ...items: string[]): void {
  showMessage(message, LogLevel.Debug, undefined, options, ...items);
}

