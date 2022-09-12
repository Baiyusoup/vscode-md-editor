import * as vscode from 'vscode';
import EditorProvider from './CustomMarkdownEditorProvider';

export function activate(context: vscode.ExtensionContext) {
	console.log("baiyusoup start");
	context.subscriptions.push(
		EditorProvider.register(context),
	);
}

export function deactivate() {}


