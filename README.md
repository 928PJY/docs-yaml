
# Docs-YAML Support for Visual Studio Code

Provides Docs-YAML support via [yaml-language-server](https://github.com/redhat-developer/yaml-language-server).

## Features

![screencast](./images/docs-yaml-extension.gif)

1. YAML validation:
    * Apply schema validation according to the [YamlMime](#YamlMime)
    * Detects errors such as:
        * Invalid property value type
        * Invalid child property
        * Required node is missing
        * Unexpected property

2. Auto completion:
    * Auto completes on the YamlMime and supported node
    * Supported nodes recommendation *if provided by schema*(<kbd>Ctrl</kbd> + <kbd>Space</kbd>)
    * Enumerated node value recommendation *if provided by schema*

3. Hover support:
    * Hovering over a node shows description *if provided by schema*

## Extra Knowledge

### **YamlMime**

A YAML syntax to identify the mime type of this YAML document, which will decide the applied schema type
e.g.

```yaml
### YamlMime:Module
....
```

* YamlMime should be the first line
* There are should be a space between triple `#` and case-sensitive `YamlMime`
* There are should not be extra space between `YamlMime`, MimetypeName and `:`

## Developer Support

### Developing the client side

1. Install prerequisites:
   * latest [Visual Studio Code](https://code.visualstudio.com/)
   * [Node.js](https://nodejs.org/) v6.0.0 or higher
2. Fork this repository.
3. Build this project.
    ```bash
    # clone your forked repository
    $ git clone https://github.com/{your-github-name}/docs-yaml
    $ cd docs-yaml
    # install npm dependencies
    $ npm install
    # compile
    $ npm run compile
    # open the project in vscode
    $ code .
    ```
4. Make changes as neccessary and the run the code using F5.
    Refer to VS Code [documentation](https://code.visualstudio.com/docs/extensions/debugging-extensions) on how to run and debug the extension.
5. Create a pull-request to Github repository and we will review, merge it and publish new version extension regularly.

### Contributing to schemas and snippets

Comming soon.

**All contributions are welcome!**
