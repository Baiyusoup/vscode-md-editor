import * as vscode from 'vscode';
import EditorProvider from './CustomMarkdownEditorProvider';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		EditorProvider.register(context),
	);
}

export function deactivate() {}


