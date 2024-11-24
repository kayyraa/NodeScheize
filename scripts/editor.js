import { Keywords, Operators } from "./keywords.js";

const Editor = document.querySelector(".Editor");
const CodeEditor = Editor.querySelector(".CodeEditor");

const LoadLines = () => {
    Array.from(CodeEditor.children).forEach(Line => {
        const SaveChanges = () => {
            let InsideString = false;
            let Word = "";

            Line.querySelector("input").value.split("").forEach(Char => {
                if (Char === '"') {
                    InsideString = !InsideString;
                }

                if (Char === " " || Char === "\n") {
                    const WordElement = document.createElement("div");
                    WordElement.innerHTML = Word;

                    if (Keywords.includes(Word)) {
                        WordElement.classList.add("Keyword");
                        WordElement.style.marginLeft = "8px";
                    } else if (!isNaN(parseFloat(Word)) && isFinite(Word)) {
                        WordElement.classList.add("Number");
                        WordElement.style.marginLeft = "8px";
                    } else if (Operators.includes(Word)) {
                        WordElement.classList.add("Any");
                        WordElement.style.marginLeft = "8px";
                    } else {
                        WordElement.classList.add("String");
                    }

                    Line.appendChild(WordElement);
                    Word = ""; // Reset word after processing
                } else {
                    Word += Char; // Build the word
                }

                const CharElement = document.createElement("div");
                CharElement.innerHTML = Char;

                if (InsideString) {
                    CharElement.classList.add("String");
                } else {
                    CharElement.classList.add("Any");
                }

                Line.appendChild(CharElement);
            });

            LoadLines();
            Line.querySelector("input").remove();
        };

        let Text = "";
        Array.from(Line.children).forEach(TextNode => {
            Text += TextNode.innerHTML;
        });

        Line.addEventListener("click", () => {
            if (Line.querySelector("input")) return;

            Line.innerHTML = "";

            const EditorInput = document.createElement("input");
            EditorInput.value = Text;
            Line.appendChild(EditorInput);

            setTimeout(() => {
                EditorInput.focus();
            }, 0);
        });

        Line.addEventListener("keypress", (Event) => {
            if (Event.key === "Enter") SaveChanges();
        });

        CodeEditor.addEventListener("mousedown", (Event) => {
            if (!Line.contains(Event.target)) SaveChanges();
        });
    });
}

const Loop = () => {
    Array.from(CodeEditor.children).forEach(Line => {
        Array.from(Line.children).forEach(TextNode => {
            const Text = TextNode.innerHTML;

            if (Keywords.includes(Text)) {
                TextNode.classList.add("Keyword");
                TextNode.style.marginLeft = "8px";
            } else if (!isNaN(parseFloat(Text)) && isFinite(Text)) {
                TextNode.classList.add("Number");
                TextNode.style.marginLeft = "8px";
            } else if (Operators.includes(Text)) {
                TextNode.classList.add("Any");
                TextNode.style.marginLeft = "8px";
            } else if (typeof Text === "string") {
                TextNode.classList.add("String");
            }
        });
    });

    requestAnimationFrame(Loop);
}

LoadLines();
Loop();