'use strict';
import * as vscode from 'vscode';

import { DocsYamlCompletionProvider } from "./yaml-support/yaml-snippet";
import { registerYamlSchemaSupport } from './yaml-support/yaml-schema';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
    const subscriptions = [
        // Completion providers
        vscode.languages.registerCompletionItemProvider('yaml', new DocsYamlCompletionProvider()),
    ];

    await registerYamlSchemaSupport();
    subscriptions.forEach((element) => {
        context.subscriptions.push(element);
    }, this);
}

// this method is called when your extension is deactivated
export function deactivate() {
}