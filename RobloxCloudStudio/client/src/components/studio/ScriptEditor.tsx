import { useState, useRef, useEffect } from "react";
import { useObjects } from "../../lib/stores/useObjects";
import { useStudio } from "../../lib/stores/useStudio";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import Editor from "@monaco-editor/react";

export function ScriptEditor() {
  const { selectedObjectId } = useStudio();
  const { getObject, updateObject } = useObjects();
  const [currentScript, setCurrentScript] = useState('');
  const [isEditorReady, setIsEditorReady] = useState(false);
  
  const selectedObject = selectedObjectId ? getObject(selectedObjectId) : null;

  useEffect(() => {
    if (selectedObject?.script) {
      setCurrentScript(selectedObject.script);
    } else {
      const defaultScript = `-- ${selectedObject?.name || 'Script'} - LuaU Script
-- This is a LuaU script with full Roblox API support

local part = script.Parent

-- Example: Change part color when touched
part.Touched:Connect(function(hit)
    local humanoid = hit.Parent:FindFirstChild("Humanoid")
    if humanoid then
        part.BrickColor = BrickColor.new("Bright red")
        wait(1)
        part.BrickColor = BrickColor.new("Medium stone grey")
    end
end)
`;
      setCurrentScript(defaultScript);
    }
  }, [selectedObject]);

  function handleEditorDidMount(editor: any, monaco: any) {
    // Register LuaU language
    monaco.languages.register({ id: 'luau' });

    // Define LuaU syntax highlighting
    monaco.languages.setMonarchTokensProvider('luau', {
      tokenizer: {
        root: [
          // Comments
          [/--\[\[.*?\]\]/, 'comment.block'],
          [/--.*$/, 'comment'],
          
          // Strings
          [/"([^"\\]|\\.)*"/, 'string'],
          [/'([^'\\]|\\.)*'/, 'string'],
          [/\[\[.*?\]\]/, 'string'],
          
          // Numbers
          [/\b\d+\.?\d*\b/, 'number'],
          [/\b0x[a-fA-F\d]+\b/, 'number'],
          
          // Keywords
          [/\b(and|break|do|else|elseif|end|false|for|function|if|in|local|nil|not|or|repeat|return|then|true|until|while|continue|export|type)\b/, 'keyword'],
          
          // Roblox services and globals
          [/\b(game|workspace|script|Workspace|Players|ReplicatedStorage|ServerStorage|StarterGui|StarterPack|Lighting|SoundService|TweenService|RunService|UserInputService|HttpService|DataStoreService|MarketplaceService|Teams|Chat|BadgeService|GamePassService)\b/, 'keyword.roblox'],
          
          // Built-in functions
          [/\b(print|warn|error|assert|type|typeof|tostring|tonumber|next|pairs|ipairs|pcall|xpcall|getfenv|setfenv|getmetatable|setmetatable|rawget|rawset|rawequal|rawlen|select|unpack|pack|require|spawn|delay|wait|tick|time|os|math|string|table|coroutine|debug|Instance|Vector3|Vector2|CFrame|UDim2|UDim|Color3|BrickColor|Region3|Ray|Enum)\b/, 'keyword.builtin'],
          
          // Operators
          [/[=!<>]=?/, 'operator'],
          [/[+\-*/%^#]/, 'operator'],
          [/[(){}[\]]/, 'bracket'],
          [/[;,.]/, 'delimiter'],
          
          // Identifiers
          [/[a-zA-Z_]\w*/, 'identifier'],
        ]
      }
    });

    // Define completion provider
    monaco.languages.registerCompletionItemProvider('luau', {
      provideCompletionItems: () => {
        const suggestions = [
          {
            label: 'game:GetService',
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: 'game:GetService("${1:ServiceName}")',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Gets a Roblox service'
          },
          {
            label: 'print',
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: 'print(${1:message})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Prints a message to the output'
          },
          {
            label: 'wait',
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: 'wait(${1:seconds})',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Waits for the specified number of seconds'
          }
        ];
        return { suggestions };
      }
    });

    // Define custom theme
    monaco.editor.defineTheme('luau-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A9955' },
        { token: 'keyword', foreground: 'C586C0' },
        { token: 'keyword.roblox', foreground: '4FC1FF' },
        { token: 'keyword.builtin', foreground: 'DCDCAA' },
        { token: 'string', foreground: 'CE9178' },
        { token: 'number', foreground: 'B5CEA8' },
        { token: 'operator', foreground: 'D4D4D4' },
        { token: 'identifier', foreground: '9CDCFE' }
      ],
      colors: {
        'editor.background': '#1e1e1e',
        'editor.foreground': '#d4d4d4'
      }
    });

    setIsEditorReady(true);
  }

  const saveScript = () => {
    if (selectedObject) {
      updateObject(selectedObject.id, { script: currentScript });
    }
  };

  const insertCode = (code: string) => {
    setCurrentScript(prev => prev + '\n' + code);
  };

  const codeSnippets = [
    { name: 'Print', code: 'print("Hello World!")' },
    { name: 'Wait', code: 'wait(1)' },
    { name: 'Function', code: 'function myFunction()\n\t-- code here\nend' },
    { name: 'If Statement', code: 'if condition then\n\t-- code here\nend' },
    { name: 'For Loop', code: 'for i = 1, 10 do\n\t-- code here\nend' },
    { name: 'While Loop', code: 'while condition do\n\t-- code here\nend' },
    { name: 'Touched Event', code: 'script.Parent.Touched:Connect(function(hit)\n\tlocal humanoid = hit.Parent:FindFirstChild("Humanoid")\n\tif humanoid then\n\t\t-- player touched the part\n\tend\nend)' },
    { name: 'Player Service', code: 'local Players = game:GetService("Players")\nlocal player = Players.LocalPlayer' },
    { name: 'TweenService', code: 'local TweenService = game:GetService("TweenService")\nlocal tweenInfo = TweenInfo.new(1, Enum.EasingStyle.Quad)\nlocal tween = TweenService:Create(part, tweenInfo, {Position = Vector3.new(0, 10, 0)})' },
  ];

  if (!selectedObject) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-3 border-b border-gray-700">
          <h3 className="text-sm font-medium text-white">Script Editor</h3>
        </div>
        <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
          Select an object to edit its script
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-gray-700 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-white">Script Editor</h3>
          <p className="text-xs text-gray-400">{selectedObject.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={saveScript}>
            💾 Save
          </Button>
        </div>
      </div>
      
      <div className="flex h-full">
        {/* Code Snippets Sidebar */}
        <div className="w-48 border-r border-gray-700 bg-gray-800 p-2">
          <h4 className="text-xs font-medium text-gray-300 mb-2">Code Snippets</h4>
          <div className="space-y-1">
            {codeSnippets.map((snippet) => (
              <Button
                key={snippet.name}
                variant="ghost"
                size="sm"
                className="w-full justify-start text-xs h-7"
                onClick={() => insertCode(snippet.code)}
              >
                {snippet.name}
              </Button>
            ))}
          </div>
          
          <Separator className="my-3" />
          
          <h4 className="text-xs font-medium text-gray-300 mb-2">Roblox API</h4>
          <div className="space-y-1">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-xs h-7"
              onClick={() => insertCode('local Players = game:GetService("Players")')}
            >
              Players Service
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-xs h-7"
              onClick={() => insertCode('local RunService = game:GetService("RunService")')}
            >
              RunService
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-xs h-7"
              onClick={() => insertCode('local TweenService = game:GetService("TweenService")')}
            >
              TweenService
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-xs h-7"
              onClick={() => insertCode('local UserInputService = game:GetService("UserInputService")')}
            >
              UserInputService
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-xs h-7"
              onClick={() => insertCode('workspace')}
            >
              Workspace
            </Button>
          </div>
        </div>
        
        {/* Code Editor */}
        <div className="flex-1 flex flex-col">
          <Editor
            height="100%"
            language="luau"
            value={currentScript}
            onChange={(value) => setCurrentScript(value || '')}
            onMount={handleEditorDidMount}
            theme="luau-dark"
            options={{
              fontSize: 14,
              fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
              minimap: { enabled: false },
              wordWrap: 'on',
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 4,
              insertSpaces: false,
              detectIndentation: true,
              folding: true,
              autoClosingBrackets: 'always',
              autoClosingQuotes: 'always',
              autoIndent: 'full',
              formatOnPaste: true,
              formatOnType: true,
              suggestOnTriggerCharacters: true,
              acceptSuggestionOnEnter: 'on'
            }}
          />
          
          {/* Status Bar */}
          <div className="h-6 bg-gray-800 border-t border-gray-700 flex items-center px-4 text-xs text-gray-400">
            Lines: {currentScript.split('\n').length} | 
            Characters: {currentScript.length} | 
            Language: LuaU {isEditorReady && '✓'}
          </div>
        </div>
      </div>
    </div>
  );
}
