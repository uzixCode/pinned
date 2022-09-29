"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const path = require("path");
const vscode = require("vscode");
const promises_1 = require("fs/promises");
// all
let all = "//ALL";
// pinned
let pinnedPattern = /(PINNED:)/;
let pinned = "//PINNED:";
let pinnedIcon = 'icon_pin.svg';
// doc
let docPattern = /(DOC:)/;
let doc = "//DOC:";
let docIcon = 'doc.png';
// working
let workingPattern = /(WORKING:)/;
let wokring = "//WORKING:";
let wokringIcon = 'working.png';
// done
let donePattern = /(DONE:)/;
let done = "//DONE:";
let doneIcon = 'done.png';
// todo
let todoPattern = /(TODO:)/;
let todo = "//TODO:";
let todoIcon = 'todo.png';
// sos
let sosPattern = /(SOS:)/;
let sos = "//SOS:";
let sosIcon = 'sos.png';
// issue
let issuePattern = /(ISSUE:)/;
let issue = "//ISSUE:";
let issueIcon = 'issue.png';
let pattern2 = /(\/\/)/;
let defaultPinned = pinned;
let defaultFilterPage = all;
let defaultFilterList = all;
function activate(context) {
    checkFilesActivity();
    let windowListener = vscode.workspace.onDidChangeTextDocument((changeState) => {
        const lines = changeState.document.getText().split('\n');
        if (isValidPinned(lines[changeState.contentChanges[0].range.start.line])) {
            checkFiles(false, true);
        }
    });
    let refreshPinnedList = vscode.commands.registerCommand('pinned.refreshList', () => {
        checkFilesActivity();
    });
    let deletePinnedInline = vscode.commands.registerCommand('pinned.deleteInline', async (item) => {
        await vscode.window.withProgress({ location: vscode.ProgressLocation.Notification, title: "Pinned", cancellable: true }, async (progress) => {
            progress.report({ message: "Deleting Pinned" });
            const edit = new vscode.WorkspaceEdit();
            let file = await vscode.workspace.openTextDocument(item.filePath);
            let textLine = file.lineAt(item.line).text;
            if (isValidPinned(file.lineAt(item.line).text)) {
                if (pinnedType(textLine) === wokring) {
                    edit.delete(vscode.Uri.parse(item.filePath), new vscode.Range(new vscode.Position(item.line, file.lineAt(item.line).text.indexOf(wokring)), file.lineAt(item.line).range.end));
                }
                else if (pinnedType(textLine) === doc) {
                    edit.delete(vscode.Uri.parse(item.filePath), new vscode.Range(new vscode.Position(item.line, file.lineAt(item.line).text.indexOf(doc)), file.lineAt(item.line).range.end));
                }
                else if (pinnedType(textLine) === done) {
                    edit.delete(vscode.Uri.parse(item.filePath), new vscode.Range(new vscode.Position(item.line, file.lineAt(item.line).text.indexOf(done)), file.lineAt(item.line).range.end));
                }
                else if (pinnedType(textLine) === todo) {
                    edit.delete(vscode.Uri.parse(item.filePath), new vscode.Range(new vscode.Position(item.line, file.lineAt(item.line).text.indexOf(todo)), file.lineAt(item.line).range.end));
                }
                else if (pinnedType(textLine) === sos) {
                    edit.delete(vscode.Uri.parse(item.filePath), new vscode.Range(new vscode.Position(item.line, file.lineAt(item.line).text.indexOf(sos)), file.lineAt(item.line).range.end));
                }
                else if (pinnedType(textLine) === issue) {
                    edit.delete(vscode.Uri.parse(item.filePath), new vscode.Range(new vscode.Position(item.line, file.lineAt(item.line).text.indexOf(issue)), file.lineAt(item.line).range.end));
                }
                else {
                    edit.delete(vscode.Uri.parse(item.filePath), new vscode.Range(new vscode.Position(item.line, file.lineAt(item.line).text.indexOf(pinned)), file.lineAt(item.line).range.end));
                }
            }
            let success = await vscode.workspace.applyEdit(edit);
            checkFiles(false, true);
        });
    });
    let deletePinnedInlineList = vscode.commands.registerCommand('pinned.deleteInlineList', async (item) => {
        await vscode.window.withProgress({ location: vscode.ProgressLocation.Notification, title: "Pinned", cancellable: true }, async (progress) => {
            progress.report({ message: "Deleting Pinned" });
            const edit = new vscode.WorkspaceEdit();
            let file = await vscode.workspace.openTextDocument(item.filePath);
            if (pinnedType(file.lineAt(item.line).text.trimStart()) === wokring) {
                edit.delete(vscode.Uri.parse(item.filePath), new vscode.Range(new vscode.Position(item.line, file.lineAt(item.line).text.indexOf(wokring)), file.lineAt(item.line).range.end));
            }
            if (defaultFilterList === doc || defaultFilterList === all) {
                if (pinnedType(file.lineAt(item.line).text.trimStart()) === doc) {
                    edit.delete(file.uri, new vscode.Range(new vscode.Position(item.line, file.lineAt(item.line).text.indexOf(doc)), file.lineAt(item.line).range.end));
                }
            }
            if (defaultFilterList === done || defaultFilterList === all) {
                if (pinnedType(file.lineAt(item.line).text.trimStart()) === done) {
                    edit.delete(file.uri, new vscode.Range(new vscode.Position(item.line, file.lineAt(item.line).text.indexOf(done)), file.lineAt(item.line).range.end));
                }
            }
            if (defaultFilterList === todo || defaultFilterList === all) {
                if (pinnedType(file.lineAt(item.line).text.trimStart()) === todo) {
                    edit.delete(file.uri, new vscode.Range(new vscode.Position(item.line, file.lineAt(item.line).text.indexOf(todo)), file.lineAt(item.line).range.end));
                }
            }
            if (defaultFilterList === sos || defaultFilterList === all) {
                if (pinnedType(file.lineAt(item.line).text.trimStart()) === sos) {
                    edit.delete(file.uri, new vscode.Range(new vscode.Position(item.line, file.lineAt(item.line).text.indexOf(sos)), file.lineAt(item.line).range.end));
                }
            }
            if (defaultFilterList === issue || defaultFilterList === all) {
                if (pinnedType(file.lineAt(item.line).text.trimStart()) === issue) {
                    edit.delete(file.uri, new vscode.Range(new vscode.Position(item.line, file.lineAt(item.line).text.indexOf(issue)), file.lineAt(item.line).range.end));
                }
            }
            if (defaultFilterList === pinned || defaultFilterList === all) {
                if (pinnedType(file.lineAt(item.line).text.trimStart()) === pinned) {
                    edit.delete(file.uri, new vscode.Range(new vscode.Position(item.line, file.lineAt(item.line).text.indexOf(pinned)), file.lineAt(item.line).range.end));
                }
            }
            let success = await vscode.workspace.applyEdit(edit);
            checkFiles(false, true);
        });
    });
    let deletePinnedInlineParentList = vscode.commands.registerCommand('pinned.deleteParentList', async (item) => {
        await vscode.window.withProgress({ location: vscode.ProgressLocation.Notification, title: "Pinned", cancellable: true }, async (progress) => {
            await vscode.window.withProgress({ location: vscode.ProgressLocation.Notification, title: "Pinned", cancellable: true }, async (progress) => {
                progress.report({ message: "Deleting Pinned" });
                const edit = new vscode.WorkspaceEdit();
                let file = await vscode.workspace.openTextDocument(item.filePath);
                let lines = file.getText().split('\n');
                for (let i = 0; i < lines.length; i++) {
                    if (isValidPinned(lines[i].trimStart())) {
                        if (defaultFilterList === wokring || defaultFilterList === all) {
                            if (pinnedType(lines[i].trimStart()) === wokring) {
                                edit.delete(file.uri, new vscode.Range(new vscode.Position(i, file.lineAt(i).text.indexOf(wokring)), file.lineAt(i).range.end));
                            }
                        }
                        if (defaultFilterList === doc || defaultFilterList === all) {
                            if (pinnedType(lines[i].trimStart()) === doc) {
                                edit.delete(file.uri, new vscode.Range(new vscode.Position(i, file.lineAt(i).text.indexOf(doc)), file.lineAt(i).range.end));
                            }
                        }
                        if (defaultFilterList === done || defaultFilterList === all) {
                            if (pinnedType(lines[i].trimStart()) === done) {
                                edit.delete(file.uri, new vscode.Range(new vscode.Position(i, file.lineAt(i).text.indexOf(done)), file.lineAt(i).range.end));
                            }
                        }
                        if (defaultFilterList === todo || defaultFilterList === all) {
                            if (pinnedType(lines[i].trimStart()) === todo) {
                                edit.delete(file.uri, new vscode.Range(new vscode.Position(i, file.lineAt(i).text.indexOf(todo)), file.lineAt(i).range.end));
                            }
                        }
                        if (defaultFilterList === sos || defaultFilterList === all) {
                            if (pinnedType(lines[i].trimStart()) === sos) {
                                edit.delete(file.uri, new vscode.Range(new vscode.Position(i, file.lineAt(i).text.indexOf(sos)), file.lineAt(i).range.end));
                            }
                        }
                        if (defaultFilterList === issue || defaultFilterList === all) {
                            if (pinnedType(lines[i].trimStart()) === issue) {
                                edit.delete(file.uri, new vscode.Range(new vscode.Position(i, file.lineAt(i).text.indexOf(issue)), file.lineAt(i).range.end));
                            }
                        }
                        if (defaultFilterList === pinned || defaultFilterList === all) {
                            if (pinnedType(lines[i].trimStart()) === pinned) {
                                edit.delete(file.uri, new vscode.Range(new vscode.Position(i, file.lineAt(i).text.indexOf(pinned)), file.lineAt(i).range.end));
                            }
                        }
                    }
                }
                let success = await vscode.workspace.applyEdit(edit);
                checkFiles(false, true);
            });
        });
    });
    let deletePinnedPage = vscode.commands.registerCommand('pinned.deletePage', async () => {
        const edit = new vscode.WorkspaceEdit();
        const { activeTextEditor } = vscode.window;
        if (!activeTextEditor) {
            return;
        }
        const lines = activeTextEditor.document.getText().split('\n');
        for (let i = 0; i < lines.length; i++) {
            if (isValidPinned(lines[i].trimStart())) {
                if (defaultFilterPage === wokring || defaultFilterPage === all) {
                    if (pinnedType(lines[i].trimStart()) === wokring) {
                        edit.delete(activeTextEditor.document.uri, new vscode.Range(new vscode.Position(i, activeTextEditor.document.lineAt(i).text.indexOf(wokring)), activeTextEditor.document.lineAt(i).range.end));
                    }
                }
                if (defaultFilterPage === doc || defaultFilterPage === all) {
                    if (pinnedType(lines[i].trimStart()) === doc) {
                        edit.delete(activeTextEditor.document.uri, new vscode.Range(new vscode.Position(i, activeTextEditor.document.lineAt(i).text.indexOf(doc)), activeTextEditor.document.lineAt(i).range.end));
                    }
                }
                if (defaultFilterPage === done || defaultFilterPage === all) {
                    if (pinnedType(lines[i].trimStart()) === done) {
                        edit.delete(activeTextEditor.document.uri, new vscode.Range(new vscode.Position(i, activeTextEditor.document.lineAt(i).text.indexOf(done)), activeTextEditor.document.lineAt(i).range.end));
                    }
                }
                if (defaultFilterPage === todo || defaultFilterPage === all) {
                    if (pinnedType(lines[i].trimStart()) === todo) {
                        edit.delete(activeTextEditor.document.uri, new vscode.Range(new vscode.Position(i, activeTextEditor.document.lineAt(i).text.indexOf(todo)), activeTextEditor.document.lineAt(i).range.end));
                    }
                }
                if (defaultFilterPage === sos || defaultFilterPage === all) {
                    if (pinnedType(lines[i].trimStart()) === sos) {
                        edit.delete(activeTextEditor.document.uri, new vscode.Range(new vscode.Position(i, activeTextEditor.document.lineAt(i).text.indexOf(sos)), activeTextEditor.document.lineAt(i).range.end));
                    }
                }
                if (defaultFilterPage === issue || defaultFilterPage === all) {
                    if (pinnedType(lines[i].trimStart()) === issue) {
                        edit.delete(activeTextEditor.document.uri, new vscode.Range(new vscode.Position(i, activeTextEditor.document.lineAt(i).text.indexOf(issue)), activeTextEditor.document.lineAt(i).range.end));
                    }
                }
                if (defaultFilterPage === pinned || defaultFilterPage === all) {
                    if (pinnedType(lines[i].trimStart()) === pinned) {
                        edit.delete(activeTextEditor.document.uri, new vscode.Range(new vscode.Position(i, activeTextEditor.document.lineAt(i).text.indexOf(pinned)), activeTextEditor.document.lineAt(i).range.end));
                    }
                }
            }
        }
        let success = await vscode.workspace.applyEdit(edit);
        checkFiles(false, true);
    });
    let refreshPinnedPage = vscode.commands.registerCommand('pinned.refreshPage', () => {
        checkFiles(true, true);
    });
    let filterPage = vscode.commands.registerCommand('pinned.filterPage', async () => {
        let picked = await vscode.window.showQuickPick([all, pinned, doc, todo, wokring, done, sos, issue], { title: "CHOOSE PINNED TYPE" });
        if (picked !== undefined) {
            defaultFilterPage = picked;
            checkFiles(false, true);
        }
    });
    let filterList = vscode.commands.registerCommand('pinned.filterAllPage', async () => {
        let picked = await vscode.window.showQuickPick([all, pinned, doc, todo, wokring, done, sos, issue], { title: "CHOOSE PINNED TYPE" });
        if (picked !== undefined) {
            defaultFilterList = picked;
            addtoTree();
        }
    });
    let inline = vscode.commands.registerTextEditorCommand('pinned.inline', async (editor, edit) => {
        edit.insert(editor.selection.active, defaultPinned);
    });
    context.subscriptions.push(vscode.commands.registerTextEditorCommand('pinned.multipleInline', async (editor, edit) => {
        let picked = await vscode.window.showQuickPick([pinned, doc, todo, wokring, done, sos, issue], { title: "CHOOSE PINNED TYPE" });
        if (picked !== undefined) {
            defaultPinned = picked;
            editor.edit((editBuilder) => { editBuilder.insert(editor.selection.active, defaultPinned); });
        }
    }));
    // let multipleinline =
    let editorListener = vscode.window.onDidChangeActiveTextEditor(editor => {
        checkFiles(false, false);
    });
    let openSelected = vscode.commands.registerCommand('pinned.openSelected', async (uri, line) => {
        vscode.workspace.openTextDocument(vscode.Uri.file(uri)).then((a) => {
            vscode.window.showTextDocument(a, 1, false).then(e => {
                let range = e.document.lineAt(line).range;
                e.selection = new vscode.Selection(range.start, range.end);
                e.revealRange(range);
            });
        }, (error) => {
            console.error(error);
            debugger;
        });
    });
    context.subscriptions.push(refreshPinnedList);
    context.subscriptions.push(refreshPinnedPage);
    context.subscriptions.push(openSelected);
    context.subscriptions.push(windowListener);
    context.subscriptions.push(editorListener);
    context.subscriptions.push(inline);
    context.subscriptions.push(deletePinnedInline);
    context.subscriptions.push(deletePinnedPage);
    context.subscriptions.push(deletePinnedInlineList);
    context.subscriptions.push(deletePinnedInlineParentList);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
async function checkFilesActivity() {
    vscode.window.withProgress({ location: vscode.ProgressLocation.Notification, title: "Pinned", cancellable: true }, async (progress) => {
        progress.report({ message: "Scanning Pinned" });
        const files = await vscode.workspace.findFiles('**/*.{dart,ts,js,java,kt,cpp,ino,swift}');
        await Promise.all(files);
        let dataJson = await JSON.parse('{"data":{}}');
        for (let u = 0; u < files.length; u++) {
            const file = await vscode.workspace.openTextDocument(files[u]);
            // console.log(path.basename(file.fileName));
            const lines = file.getText().split('\n');
            for (let i = 0; i < lines.length; i++) {
                if (isValidPinned(lines[i])) {
                    let label = lines[i].replace(pinned, "").replace(wokring, "").replace(doc, "").replace(done, "").replace(todo, "").replace(sos, "").replace(issue, "").trimStart();
                    console.log(pinnedType(lines[i]));
                    if (pinnedType(lines[i]) === pinned) {
                        if (dataJson["data"][file.uri.path] === undefined) {
                            dataJson["data"][file.uri.path] = { "path": file.uri.path, "child": [{ "label": label, "path": file.uri.path, "line": i, "icon": pinnedIcon }] };
                        }
                        else {
                            dataJson["data"][file.uri.path]["child"].push({ "label": label, "path": file.uri.path, "line": i, "icon": pinnedIcon });
                        }
                    }
                    if (pinnedType(lines[i]) === wokring) {
                        if (dataJson["data"][file.uri.path] === undefined) {
                            dataJson["data"][file.uri.path] = { "path": file.uri.path, "child": [{ "label": label, "path": file.uri.path, "line": i, "icon": wokringIcon }] };
                        }
                        else {
                            dataJson["data"][file.uri.path]["child"].push({ "label": label, "path": file.uri.path, "line": i, "icon": wokringIcon });
                        }
                    }
                    if (pinnedType(lines[i]) === doc) {
                        if (dataJson["data"][file.uri.path] === undefined) {
                            dataJson["data"][file.uri.path] = { "path": file.uri.path, "child": [{ "label": label, "path": file.uri.path, "line": i, "icon": docIcon }] };
                        }
                        else {
                            dataJson["data"][file.uri.path]["child"].push({ "label": label, "path": file.uri.path, "line": i, "icon": docIcon });
                        }
                    }
                    if (pinnedType(lines[i]) === done) {
                        if (dataJson["data"][file.uri.path] === undefined) {
                            dataJson["data"][file.uri.path] = { "path": file.uri.path, "child": [{ "label": label, "path": file.uri.path, "line": i, "icon": doneIcon }] };
                        }
                        else {
                            dataJson["data"][file.uri.path]["child"].push({ "label": label, "path": file.uri.path, "line": i, "icon": doneIcon });
                        }
                    }
                    if (pinnedType(lines[i]) === todo) {
                        if (dataJson["data"][file.uri.path] === undefined) {
                            dataJson["data"][file.uri.path] = { "path": file.uri.path, "child": [{ "label": label, "path": file.uri.path, "line": i, "icon": todoIcon }] };
                        }
                        else {
                            dataJson["data"][file.uri.path]["child"].push({ "label": label, "path": file.uri.path, "line": i, "icon": todoIcon });
                        }
                    }
                    if (pinnedType(lines[i]) === sos) {
                        if (dataJson["data"][file.uri.path] === undefined) {
                            dataJson["data"][file.uri.path] = { "path": file.uri.path, "child": [{ "label": label, "path": file.uri.path, "line": i, "icon": sosIcon }] };
                        }
                        else {
                            dataJson["data"][file.uri.path]["child"].push({ "label": label, "path": file.uri.path, "line": i, "icon": sosIcon });
                        }
                    }
                    if (pinnedType(lines[i]) === issue) {
                        if (dataJson["data"][file.uri.path] === undefined) {
                            dataJson["data"][file.uri.path] = { "path": file.uri.path, "child": [{ "label": label, "path": file.uri.path, "line": i, "icon": issueIcon }] };
                        }
                        else {
                            dataJson["data"][file.uri.path]["child"].push({ "label": label, "path": file.uri.path, "line": i, "icon": issueIcon });
                        }
                    }
                }
            }
        }
        let coockedData = JSON.stringify(dataJson);
        const pathFile = path.join(__filename, '..', '..', 'assets', 'json', 'data.json');
        let writeData = await (0, promises_1.writeFile)(pathFile, coockedData);
        await addtoTree();
        await checkFiles(false, false);
    });
}
async function addtoTree() {
    const pathFile = path.join(__filename, '..', '..', 'assets', 'json', 'data.json');
    let rawdata = await (0, promises_1.readFile)(pathFile);
    let dataJson = await JSON.parse(rawdata.toString());
    const dataParent = [];
    let dataObject = dataJson["data"];
    Object.entries(dataObject).forEach(([key, value], index) => {
        let parent = value;
        const data = [];
        let list = parent["child"];
        let indx = 0;
        list.forEach(element => {
            if (defaultFilterList === pinned) {
                if (element["icon"] === pinnedIcon) {
                    data.push(new TreeItem(element["label"], [element["path"], element["line"]], element["path"], element["line"], indx, element["icon"]));
                }
            }
            if (defaultFilterList === doc) {
                if (element["icon"] === docIcon) {
                    data.push(new TreeItem(element["label"], [element["path"], element["line"]], element["path"], element["line"], indx, element["icon"]));
                }
            }
            if (defaultFilterList === wokring) {
                if (element["icon"] === wokringIcon) {
                    data.push(new TreeItem(element["label"], [element["path"], element["line"]], element["path"], element["line"], indx, element["icon"]));
                }
            }
            if (defaultFilterList === done) {
                if (element["icon"] === doneIcon) {
                    data.push(new TreeItem(element["label"], [element["path"], element["line"]], element["path"], element["line"], indx, element["icon"]));
                }
            }
            if (defaultFilterList === sos) {
                if (element["icon"] === sosIcon) {
                    data.push(new TreeItem(element["label"], [element["path"], element["line"]], element["path"], element["line"], indx, element["icon"]));
                }
            }
            if (defaultFilterList === issue) {
                if (element["icon"] === issueIcon) {
                    data.push(new TreeItem(element["label"], [element["path"], element["line"]], element["path"], element["line"], indx, element["icon"]));
                }
            }
            if (defaultFilterList === all) {
                data.push(new TreeItem(element["label"], [element["path"], element["line"]], element["path"], element["line"], indx, element["icon"]));
            }
            indx++;
        });
        if (data.length > 0) {
            dataParent.push(new TreeItemCollapseAble(path.basename(value["path"]), key, data));
        }
    });
    vscode.window.registerTreeDataProvider('pinned-list', new TreeDataProviderCollapable(dataParent));
}
async function checkFiles(isShowNotif, isRefreshList) {
    if (isShowNotif) {
        await vscode.window.withProgress({ location: vscode.ProgressLocation.Notification, title: "Pinned", cancellable: true }, async (progress) => {
            const data = [];
            const { activeTextEditor } = vscode.window;
            if (!activeTextEditor) {
                return;
            }
            const lines = activeTextEditor.document.getText().split('\n');
            let indx = 0;
            for (let i = 0; i < lines.length; i++) {
                if (isValidPinned(lines[i])) {
                    let label = lines[i].replace(pinned, "").replace(wokring, "").replace(doc, "").replace(done, "").replace(todo, "").replace(sos, "").replace(issue, "").trimStart();
                    if (defaultFilterPage === pinned) {
                        if (pinnedType(lines[i]) === pinned) {
                            data.push(new TreeItem(label, [activeTextEditor.document.uri.path, i], activeTextEditor.document.uri.path, i, indx, pinnedIcon));
                        }
                    }
                    else if (defaultFilterPage === wokring) {
                        if (pinnedType(lines[i]) === wokring) {
                            data.push(new TreeItem(label, [activeTextEditor.document.uri.path, i], activeTextEditor.document.uri.path, i, indx, wokringIcon));
                        }
                    }
                    else if (defaultFilterPage === doc) {
                        if (pinnedType(lines[i]) === doc) {
                            data.push(new TreeItem(label, [activeTextEditor.document.uri.path, i], activeTextEditor.document.uri.path, i, indx, docIcon));
                        }
                    }
                    else if (defaultFilterPage === done) {
                        if (pinnedType(lines[i]) === done) {
                            data.push(new TreeItem(label, [activeTextEditor.document.uri.path, i], activeTextEditor.document.uri.path, i, indx, doneIcon));
                        }
                    }
                    else if (defaultFilterPage === todo) {
                        if (pinnedType(lines[i]) === todo) {
                            data.push(new TreeItem(label, [activeTextEditor.document.uri.path, i], activeTextEditor.document.uri.path, i, indx, todoIcon));
                        }
                    }
                    else if (defaultFilterPage === sos) {
                        if (pinnedType(lines[i]) === sos) {
                            data.push(new TreeItem(label, [activeTextEditor.document.uri.path, i], activeTextEditor.document.uri.path, i, indx, sosIcon));
                        }
                    }
                    else if (defaultFilterPage === issue) {
                        if (pinnedType(lines[i]) === issue) {
                            data.push(new TreeItem(label, [activeTextEditor.document.uri.path, i], activeTextEditor.document.uri.path, i, indx, issueIcon));
                        }
                    }
                    else {
                        if (pinnedType(lines[i]) === wokring) {
                            data.push(new TreeItem(label, [activeTextEditor.document.uri.path, i], activeTextEditor.document.uri.path, i, indx, wokringIcon));
                        }
                        else if (pinnedType(lines[i]) === doc) {
                            data.push(new TreeItem(label, [activeTextEditor.document.uri.path, i], activeTextEditor.document.uri.path, i, indx, docIcon));
                        }
                        else if (pinnedType(lines[i]) === done) {
                            data.push(new TreeItem(label, [activeTextEditor.document.uri.path, i], activeTextEditor.document.uri.path, i, indx, doneIcon));
                        }
                        else if (pinnedType(lines[i]) === todo) {
                            data.push(new TreeItem(label, [activeTextEditor.document.uri.path, i], activeTextEditor.document.uri.path, i, indx, todoIcon));
                        }
                        else if (pinnedType(lines[i]) === sos) {
                            data.push(new TreeItem(label, [activeTextEditor.document.uri.path, i], activeTextEditor.document.uri.path, i, indx, sosIcon));
                        }
                        else if (pinnedType(lines[i]) === issue) {
                            data.push(new TreeItem(label, [activeTextEditor.document.uri.path, i], activeTextEditor.document.uri.path, i, indx, issueIcon));
                        }
                        else {
                            data.push(new TreeItem(label, [activeTextEditor.document.uri.path, i], activeTextEditor.document.uri.path, i, indx, pinnedIcon));
                        }
                    }
                    indx++;
                }
            }
            const tree = vscode.window.createTreeView("pinned-page", { treeDataProvider: new TreeDataProvider(data), });
            if (isRefreshList) {
                await refreshListPerPage(activeTextEditor.document.uri.path);
            }
        });
    }
    else {
        const data = [];
        const { activeTextEditor } = vscode.window;
        if (!activeTextEditor) {
            return;
        }
        const lines = activeTextEditor.document.getText().split('\n');
        let indx = 0;
        for (let i = 0; i < lines.length; i++) {
            if (isValidPinned(lines[i])) {
                let label = lines[i].replace(pinned, "").replace(wokring, "").replace(doc, "").replace(done, "").replace(todo, "").replace(sos, "").replace(issue, "").trimStart();
                if (defaultFilterPage === pinned) {
                    if (pinnedType(lines[i]) === pinned) {
                        data.push(new TreeItem(label, [activeTextEditor.document.uri.path, i], activeTextEditor.document.uri.path, i, indx, pinnedIcon));
                    }
                }
                else if (defaultFilterPage === wokring) {
                    if (pinnedType(lines[i]) === wokring) {
                        data.push(new TreeItem(label, [activeTextEditor.document.uri.path, i], activeTextEditor.document.uri.path, i, indx, wokringIcon));
                    }
                }
                else if (defaultFilterPage === doc) {
                    if (pinnedType(lines[i]) === doc) {
                        data.push(new TreeItem(label, [activeTextEditor.document.uri.path, i], activeTextEditor.document.uri.path, i, indx, docIcon));
                    }
                }
                else if (defaultFilterPage === done) {
                    if (pinnedType(lines[i]) === done) {
                        data.push(new TreeItem(label, [activeTextEditor.document.uri.path, i], activeTextEditor.document.uri.path, i, indx, doneIcon));
                    }
                }
                else if (defaultFilterPage === todo) {
                    if (pinnedType(lines[i]) === todo) {
                        data.push(new TreeItem(label, [activeTextEditor.document.uri.path, i], activeTextEditor.document.uri.path, i, indx, todoIcon));
                    }
                }
                else if (defaultFilterPage === sos) {
                    if (pinnedType(lines[i]) === sos) {
                        data.push(new TreeItem(label, [activeTextEditor.document.uri.path, i], activeTextEditor.document.uri.path, i, indx, sosIcon));
                    }
                }
                else if (defaultFilterPage === issue) {
                    if (pinnedType(lines[i]) === issue) {
                        data.push(new TreeItem(label, [activeTextEditor.document.uri.path, i], activeTextEditor.document.uri.path, i, indx, issueIcon));
                    }
                }
                else {
                    if (pinnedType(lines[i]) === wokring) {
                        data.push(new TreeItem(label, [activeTextEditor.document.uri.path, i], activeTextEditor.document.uri.path, i, indx, wokringIcon));
                    }
                    else if (pinnedType(lines[i]) === doc) {
                        data.push(new TreeItem(label, [activeTextEditor.document.uri.path, i], activeTextEditor.document.uri.path, i, indx, docIcon));
                    }
                    else if (pinnedType(lines[i]) === done) {
                        data.push(new TreeItem(label, [activeTextEditor.document.uri.path, i], activeTextEditor.document.uri.path, i, indx, doneIcon));
                    }
                    else if (pinnedType(lines[i]) === todo) {
                        data.push(new TreeItem(label, [activeTextEditor.document.uri.path, i], activeTextEditor.document.uri.path, i, indx, todoIcon));
                    }
                    else if (pinnedType(lines[i]) === sos) {
                        data.push(new TreeItem(label, [activeTextEditor.document.uri.path, i], activeTextEditor.document.uri.path, i, indx, sosIcon));
                    }
                    else if (pinnedType(lines[i]) === issue) {
                        data.push(new TreeItem(label, [activeTextEditor.document.uri.path, i], activeTextEditor.document.uri.path, i, indx, issueIcon));
                    }
                    else {
                        data.push(new TreeItem(label, [activeTextEditor.document.uri.path, i], activeTextEditor.document.uri.path, i, indx, pinnedIcon));
                    }
                }
                indx++;
            }
        }
        const tree = vscode.window.createTreeView("pinned-page", { treeDataProvider: new TreeDataProvider(data), });
        if (isRefreshList) {
            await refreshListPerPage(activeTextEditor.document.uri.path);
        }
    }
}
async function refreshListPerPage(filePath) {
    const pathFile = path.join(__filename, '..', '..', 'assets', 'json', 'data.json');
    let rawdata = await (0, promises_1.readFile)(pathFile);
    let dataJson = await JSON.parse(rawdata.toString());
    const file = await vscode.workspace.openTextDocument(vscode.Uri.parse(filePath));
    const lines = file.getText().split('\n');
    delete dataJson["data"][filePath];
    dataJson["data"][filePath] = { "path": filePath, "child": [] };
    for (let i = 0; i < lines.length; i++) {
        if (isValidPinned(lines[i])) {
            let label = lines[i].replace(pinned, "").replace(wokring, "").replace(doc, "").replace(done, "").replace(todo, "").replace(sos, "").replace(issue, "").trimStart();
            console.log(pinnedType(lines[i]));
            if (pinnedType(lines[i]) === pinned) {
                dataJson["data"][file.uri.path]["child"].push({ "label": label, "path": file.uri.path, "line": i, "icon": pinnedIcon });
            }
            if (pinnedType(lines[i]) === wokring) {
                dataJson["data"][file.uri.path]["child"].push({ "label": label, "path": file.uri.path, "line": i, "icon": wokringIcon });
            }
            if (pinnedType(lines[i]) === doc) {
                dataJson["data"][file.uri.path]["child"].push({ "label": label, "path": file.uri.path, "line": i, "icon": docIcon });
            }
            if (pinnedType(lines[i]) === done) {
                dataJson["data"][file.uri.path]["child"].push({ "label": label, "path": file.uri.path, "line": i, "icon": doneIcon });
            }
            if (pinnedType(lines[i]) === todo) {
                dataJson["data"][file.uri.path]["child"].push({ "label": label, "path": file.uri.path, "line": i, "icon": todoIcon });
            }
            if (pinnedType(lines[i]) === sos) {
                dataJson["data"][file.uri.path]["child"].push({ "label": label, "path": file.uri.path, "line": i, "icon": sosIcon });
            }
            if (pinnedType(lines[i]) === issue) {
                dataJson["data"][file.uri.path]["child"].push({ "label": label, "path": file.uri.path, "line": i, "icon": issueIcon });
            }
        }
    }
    if (dataJson["data"][filePath]["child"].length < 1) {
        delete dataJson["data"][filePath];
    }
    let coockedData = JSON.stringify(dataJson);
    let writeData = await (0, promises_1.writeFile)(pathFile, coockedData);
    await addtoTree();
}
function isValidPinned(text) {
    let isValid = false;
    if (pinnedPattern.test(text.trimStart()) && pattern2.test(text.trimStart())) {
        isValid = true;
        return isValid;
    }
    if (docPattern.test(text.trimStart()) && pattern2.test(text.trimStart())) {
        isValid = true;
        return isValid;
    }
    if (workingPattern.test(text.trimStart()) && pattern2.test(text.trimStart())) {
        isValid = true;
        return isValid;
    }
    if (donePattern.test(text.trimStart()) && pattern2.test(text.trimStart())) {
        isValid = true;
        return isValid;
    }
    if (todoPattern.test(text.trimStart()) && pattern2.test(text.trimStart())) {
        isValid = true;
        return isValid;
    }
    if (sosPattern.test(text.trimStart()) && pattern2.test(text.trimStart())) {
        isValid = true;
        return isValid;
    }
    if (issuePattern.test(text.trimStart()) && pattern2.test(text.trimStart())) {
        isValid = true;
        return isValid;
    }
    return isValid;
}
function pinnedType(text) {
    let type = pinned;
    if (pinnedPattern.test(text.trimStart()) && pattern2.test(text.trimStart())) {
        type = pinned;
        return type;
    }
    if (docPattern.test(text.trimStart()) && pattern2.test(text.trimStart())) {
        type = doc;
        return type;
    }
    if (workingPattern.test(text.trimStart()) && pattern2.test(text.trimStart())) {
        type = wokring;
        return type;
    }
    if (donePattern.test(text.trimStart()) && pattern2.test(text.trimStart())) {
        type = done;
        return type;
    }
    if (todoPattern.test(text.trimStart()) && pattern2.test(text.trimStart())) {
        type = todo;
        return type;
    }
    if (sosPattern.test(text.trimStart()) && pattern2.test(text.trimStart())) {
        type = sos;
        return type;
    }
    if (issuePattern.test(text.trimStart()) && pattern2.test(text.trimStart())) {
        type = issue;
        return type;
    }
    return type;
}
class TreeDataProvider {
    constructor(data) {
        this.data = data;
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        if (element === undefined) {
            return this.data;
        }
        return element.children;
    }
}
class TreeItem extends vscode.TreeItem {
    constructor(label, uri, filePath, line, index, icon, contextValue = "pinned-item", iconPath = {
        light: path.join(__filename, '..', '..', 'assets', icon ?? pinnedIcon),
        dark: path.join(__filename, '..', '..', 'assets', icon ?? pinnedIcon),
    }, command = { title: label, command: 'pinned.openSelected', arguments: uri }) {
        super(label);
        this.filePath = filePath;
        this.line = line;
        this.index = index;
        this.icon = icon;
        this.contextValue = contextValue;
        this.iconPath = iconPath;
        this.command = command;
    }
}
class TreeDataProviderCollapable {
    constructor(data) {
        this.data = data;
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        if (element === undefined) {
            return this.data;
        }
        return element.children;
    }
}
class TreeItemCollapseAble extends vscode.TreeItem {
    constructor(label, filePath, children, contextValue = "pinned-parent") {
        super(label, children === undefined ? vscode.TreeItemCollapsibleState.None :
            vscode.TreeItemCollapsibleState.Expanded);
        this.filePath = filePath;
        this.contextValue = contextValue;
        this.children = children;
    }
}
//# sourceMappingURL=extension.js.map