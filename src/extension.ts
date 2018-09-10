'use strict';
import * as vscode from 'vscode';

import { DocsYamlCompletionProvider } from "./yaml-support/yaml-snippet";
import { registerYamlSchemaSupport } from './yaml-support/yaml-schema';
import axios from 'axios';
import { xhr, XHRResponse, configure as configureHttpRequests, getErrorStatusDescription } from 'request-light'
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
    // monitorSchemaChange();
    subscriptions.forEach((element) => {
        context.subscriptions.push(element);
    }, this);
}

async function addTocSchemaToConfig(){
    const config = vscode.workspace.getConfiguration().inspect(YAML_SCHEMA_CONFIG_NAME_OF_VSCODE_YAML_EXTENSION);
    await addTocSchemaToConfigAtScope(TOC_SCHEMA_FILE, TOC_FILE_GLOBAL_PATTERN, vscode.ConfigurationTarget.Global, config.globalValue);
}

async function addTocSchemaToConfigAtScope(configKey: string, value: string, scope: vscode.ConfigurationTarget, valueAtScope: any){
    let newValue: any = {};
    if (valueAtScope) {
        newValue = Object.assign({}, valueAtScope);
    }
    newValue[configKey] = value;
    await vscode.workspace.getConfiguration().update(YAML_SCHEMA_CONFIG_NAME_OF_VSCODE_YAML_EXTENSION, newValue, scope);
}

function monitorSchemaChange() {
    let uri = "https://api.github.com/repos/928PJY/perf-test-repo/commits/extension-test"
    let lastCommitId = '';

    const options = {
        method: 'Get',
        headers: { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': '32ff3a19665ad2e2bb56fb5dffcda1d4746431ff' },
        url: uri,
      };
      axios(options)
        .then(response => {
            lastCommitId = response.data.sha;
        })
        .catch(error => {
            console.log(error)
        })

    setInterval(() => {
        axios(options)
        .then(response => {
            if(lastCommitId === '')
            {
                lastCommitId = response.data.sha;
            } else if(lastCommitId !== response.data.sha){
                lastCommitId = response.data.sha;
                showReloadPrompt("Reload Window to use new schema");
            }
        })
        .catch(error=>{
            console.log(error)
        })
    }, 10000)
}

function showReloadPrompt(msg: string): void {
    let reload: string = "Reload";
    vscode.window.showInformationMessage(msg, reload).then(value => {
        if (value === reload) {
            vscode.commands.executeCommand("workbench.action.reloadWindowWithExtensionsDisabled");
        }
    });
} 

// this method is called when your extension is deactivated
export function deactivate() {
}