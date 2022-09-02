import type * as vscode from 'vscode';

export default class Holder {
  public static activeDocument: vscode.TextDocument | null;
}
