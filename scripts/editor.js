import { Keywords, Operators } from "./keywords.js";

const Editor = document.querySelector(".Editor");
const CodeEditor = Editor.querySelector(".CodeEditor");

const LoadLines = () => {
    Array.from(CodeEditor.children).forEach((Line, Index) => {
        if (!Line.hasAttribute("Number")) {
            Line.setAttribute("Number", Index);
        }

        let Text = "";

        const SaveChanges = (SpecifiedLine) => {
            if (!Line.querySelector("input")) return;
            if (SpecifiedLine) Line = SpecifiedLine;

            const CodeText = Line.querySelector("input").value;
            const Words = SplitWords(CodeText); 

            Line.innerHTML = "";

            Words.forEach(Word => {
                const WordElement = document.createElement("div");
                WordElement.innerHTML = Word;

                if (Keywords.includes(Word)) {
                    WordElement.classList.add("Keyword");
                } else if (!isNaN(parseFloat(Word)) && isFinite(Word)) {
                    WordElement.classList.add("Number");
                } else if (Operators.includes(Word)) {
                    WordElement.classList.add("Operator");
                } else if (Word.startsWith('"') || Word.startsWith("'") || Word.startsWith("`")) {
                    WordElement.classList.add("String");
                } else {
                    WordElement.classList.add("Any");
                }

                Line.appendChild(WordElement);
            });
        };

        Array.from(Line.children).forEach(TextNode => {
            if (String(TextNode.tagName).toLowerCase() === "stamp") return;

            Text += TextNode.innerHTML;
        });

        Line.addEventListener("click", () => {
            if (Line.querySelector("input")) return;

            Line.innerHTML = "";

            const EditorInput = document.createElement("input");
            EditorInput.value = Text;
            Line.appendChild(EditorInput);

            EditorInput.addEventListener("keydown", (Event) => {
                const AssignControls = (Event, Line) => {
                    const Previous = Line.previousElementSibling;
                    if (Event.key === "Backspace") {
                        const PreviousInput = Previous.querySelector("input");
                        if (Previous && PreviousInput.selectionEnd === 0) {
                            PreviousInput.focus();
                            Line.remove();
                            SaveChanges();
                            
                        }
                    } else if (Event.key === "Enter") {
                        SaveChanges();

                        const NewLine = document.createElement("div");
                        NewLine.setAttribute("Number", CodeEditor.children.length);
                        const NewLineInput = document.createElement("input");
                        NewLine.appendChild(NewLineInput);
                        CodeEditor.appendChild(NewLine);
                        LoadLines();

                        setTimeout(() => {
                            NewLineInput.focus();
                        }, 0);

                        NewLineInput.addEventListener("keydown", (Event) => {
                            AssignControls(Event, NewLine);
                        });
                    }
                }

                AssignControls(Event, Line);
            });

            setTimeout(() => {
                EditorInput.focus();
            }, 0);
        });

        CodeEditor.addEventListener("mousedown", (Event) => {
            if (!Line.contains(Event.target)) SaveChanges();
        });
    });
}

const SplitWords = (Text) => {
    const Regex = /(\w+|\d+|[=;+\-*/(){}[\],.]+|".*?"|'.*?'|`.*?`)/g;
    return Text.match(Regex) || [];
}

LoadLines();