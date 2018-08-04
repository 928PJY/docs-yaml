import * as vscode from 'vscode';
import {
    VSCODE_YAML_EXTENSION_ID,
    SCHEMA_CONFIG_FILE
} from "./yaml-constant";
import * as util from './yaml-util';
import { DocsSchemaHolder } from "./yaml-schem-Holder";

// The function signature exposed by vscode-yaml:
// 1. the requestSchema api will be called by vscode-yaml extension to decide whether the schema can be handled by this
// contributor, if it returns undefined, means it doesn't support this yaml file, vscode-yaml will ask other contributors
// 2. the requestSchemaContent api  will give the parameter uri returned by the first api, and ask for the json content(after stringify) of
// the schema
declare type YamlSchemaContributor = (schema: string,
    requestSchema: (resource: string) => string,
    requestSchemaContent: (uri: string) => string) => void;

const docsSchemaHolder = new DocsSchemaHolder();

export async function registerYamlSchemaSupport(): Promise<void> {
    docsSchemaHolder.loadSchema(SCHEMA_CONFIG_FILE);
    const yamlPlugin: any = await activateYamlExtension();
    if (!yamlPlugin || !yamlPlugin.registerContributor) {
        // activateYamlExtension has already alerted to users for errors.
        return;
    }
    // register for kubernetes schema provider
    yamlPlugin.registerContributor("docs-yaml", requestYamlSchemaUriCallback, null);
}

// See docs from YamlSchemaContributor
function requestYamlSchemaUriCallback(resource: string): string {
    const textEditor = vscode.window.visibleTextEditors.find((editor) => editor.document.uri.toString() === resource);
    if (textEditor) {
        return getSchemaUri(textEditor.document);
    }
}

// Get schema uri of this textDocument
function getSchemaUri(textDocument: vscode.TextDocument) {
    var yamlMime = util.getYamlMime(textDocument.getText());
    return docsSchemaHolder.lookup(yamlMime);
}

// Find redhat.vscode-yaml extension and try to activate it to get the yaml contributor
async function activateYamlExtension(): Promise<{ registerContributor: YamlSchemaContributor }> {
    const ext: vscode.Extension<any> = vscode.extensions.getExtension(VSCODE_YAML_EXTENSION_ID);
    if (!ext) {
        vscode.window.showWarningMessage('Please install \'YAML Support by Red Hat\' via the Extensions pane.');
        return;
    }
    const yamlPlugin = await ext.activate();

    if (!yamlPlugin || !yamlPlugin.registerContributor) {
        vscode.window.showWarningMessage('The installed Red Hat YAML extension doesn\'t support Kubernetes Intellisense. Please upgrade \'YAML Support by Red Hat\' via the Extensions pane.');
        return;
    }
    return yamlPlugin;
}
