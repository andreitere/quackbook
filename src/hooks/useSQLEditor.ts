import {createSharedComposable} from "@vueuse/core";
import {crosshairCursor, drawSelection, highlightActiveLine, highlightActiveLineGutter, highlightSpecialChars, lineNumbers} from "@codemirror/view";
import {defaultHighlightStyle, foldGutter, indentOnInput, syntaxHighlighting} from "@codemirror/language";
import {history} from "@codemirror/commands";
import {EditorState} from "@codemirror/state";
import {autocompletion, closeBrackets} from "@codemirror/autocomplete";
import {sql} from "@codemirror/lang-sql";

export const useSQLExtensions = createSharedComposable(() => {
  return [
    lineNumbers(),
    highlightActiveLineGutter(),
    highlightSpecialChars(),
    foldGutter(),
    history(),
    drawSelection(),
    EditorState.allowMultipleSelections.of(true),
    indentOnInput(),
    syntaxHighlighting(defaultHighlightStyle, {fallback: true}),
    crosshairCursor(),
    highlightActiveLine(),
    autocompletion(),
    closeBrackets(),
    sql(),
  ]
})