import { useState } from "react";
import styles from "./DropFile.module.css";
import PropTypes from "prop-types";

DropFile.propTypes = {
    onFileDropped: PropTypes.func.isRequired,
};

export default function DropFile({ onFileDropped }) {
    const [fileDraggedOver, setFileDraggedOver] = useState(false);

    function dropHandler(e) {
        e.preventDefault();
        setFileDraggedOver(false);

        // for (const item of [...e.dataTransfer.items]) {
        //     console.log(item.kind);
        // }

        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            const item = e.dataTransfer.items[0];

            if (item.kind === "file") {
                const file = item.getAsFile();
                openFile(file);
            }
        } else {
            // Use DataTransfer interface to access the file(s)
            [...e.dataTransfer.files].forEach((file, i) => {
                console.log(`… file[${i}].name = ${file.name}`);
            });
        }
    }

    function dragOverHandler(e) {
        e.preventDefault();
    }

    function handleFileOpenClick() {
        const input = document.createElement("input");
        input.type = "file";

        input.onchange = (event) => {
            const file = event.target.files[0];
            openFile(file);
        };

        input.click();
    }

    function openFile(file) {
        if (file.type !== "application/json") {
            console.log("The file is not of type application/json");
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const result = JSON.parse(e.target.result);
                if (result && typeof result === "object") {
                    onFileDropped?.(result);
                } else {
                    console.log(typeof result);
                }
            } catch (err) {
                console.log("Could not parse the JSON file.");
                console.error(err);
            }
        };

        reader.readAsText(file);
    }

    return (
        <div className={styles.container}>
            <p className={styles.description}>
                {fileDraggedOver
                    ? "Drop it like it's hot"
                    : "Click to open file explorer or drop your JSON Schema here"}
            </p>
            <span
                className={styles.hover}
                onClick={handleFileOpenClick}
                onDrop={dropHandler}
                onDragOver={dragOverHandler}
                onDragEnter={setFileDraggedOver.bind(null, true)}
                onDragLeave={setFileDraggedOver.bind(null, false)}
            ></span>
        </div>
    );
}
