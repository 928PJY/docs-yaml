'use strict';
import * as vscode from 'vscode';

import { DocsYamlCompletionProvider } from "./yaml-support/yaml-snippet";
import { registerYamlSchemaSupport } from './yaml-support/yaml-schema';
import { YAML_SCHEMA_CONFIG_NAME_OF_VSCODE_YAML_EXTENSION, TOC_SCHEMA_FILE, TOC_FILE_GLOBAL_PATTERN } from "./yaml-support/yaml-constant";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
    const subscriptions = [
        // Completion providers
        vscode.languages.registerCompletionItemProvider('yaml', new DocsYamlCompletionProvider()),
    ];

    await addTocSchemaToConfig();
    await registerYamlSchemaSupport();
    subscriptions.forEach((element) => {
        context.subscriptions.push(element);
    }, this);
}

async function addTocSchemaToConfig(){
    const config = vscode.workspace.getConfiguration().inspect(YAML_SCHEMA_CONFIG_NAME_OF_VSCODE_YAML_EXTENSION);
    await addTocSchemaToConfigAtScope(TOC_SCHEMA_FILE, TOC_FILE_GLOBAL_PATTERN, vscode.ConfigurationTarget.Global, config.globalValue);
    await addTocSchemaToConfigAtScope(TOC_SCHEMA_FILE, TOC_FILE_GLOBAL_PATTERN, vscode.ConfigurationTarget.Workspace, config.workspaceValue);
}

async function addTocSchemaToConfigAtScope(configKey: string, value: string, scope: vscode.ConfigurationTarget, valueAtScope: any){
    let newValue: any = {};
    if (valueAtScope) {
        newValue = Object.assign({}, valueAtScope);
    }
    newValue[configKey] = value;
    await vscode.workspace.getConfiguration().update(YAML_SCHEMA_CONFIG_NAME_OF_VSCODE_YAML_EXTENSION, newValue, scope);
}

// this method is called when your extension is deactivated
export function deactivate() {
}