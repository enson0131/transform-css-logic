// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
const postcssRtlLogicalProperties = require('postcss-rtl-logical-properties');
const postcss = require('postcss');
const syntax = require('postcss-less');
/**
 * 思路很简单就是在获取当对应的文本后，对对应的 CSS 值进行转化逻辑 CSS 即可。
 * @param context 
 */
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
// 插件激活的入口
export function activate(context: vscode.ExtensionContext) {
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('transform-css-logic.transformFile', async () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		const editor = vscode.window.activeTextEditor; // 当前活动的编辑器
		if (!editor) {
			vscode.window.showInformationMessage('Unknown error from transform-css-logic!');
			return;
		}
		const doc = editor.document;
		const text = doc.getText();

		console.log(`1`);
		const result = await postcss([
			postcssRtlLogicalProperties(),
		]).process(text, { syntax });
		console.log(`2`);

		const startPosition = new vscode.Position(0, 0);
        const endPosition = new vscode.Position(doc.lineCount + 1, 0);
		const range = new vscode.Range(startPosition, endPosition);
		editor.edit(editBuilder => {
			try {
				const a = result.css;
				console.log(`result.css====>,1`, a);
				
				editBuilder.replace(range, result.css);
			} catch (err) {
				console.log(`err ====>`, err);
				vscode.window.showInformationMessage('Unknown error from transform-css-logic!');
			}
			
		}).then(success => {
			console.log(`...args`, ...arguments);
			// 返回是否应用修改
			if (success) {
			  console.log('Edit applied!');
			} else {
			  vscode.window.showInformationMessage('Try again!');
			}
		});
	});


	 // 给插件订阅 transform-css-logic.transformFile 命令
	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
// 插件退出的入口
export function deactivate() {}
