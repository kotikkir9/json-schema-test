import Form from "@rjsf/mui";
// import Form from '@rjsf/fluent-ui'
import validator from "@rjsf/validator-ajv8";
import { useState } from "react";
import DropFile from "./components/DropFile";

const submit = (data, title) => {
    const result = JSON.stringify(data, null, "\t");
    console.log(result);

    const blob = new Blob([result], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title?.replace(/\s/g, "").toLowerCase()}.json`;
    const clickEvent = new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true,
    });
    link.dispatchEvent(clickEvent);
    URL.revokeObjectURL(url);
};

const error = (errors) => {
    console.log(errors);
};

function App() {
    const [schema, setSchema] = useState(null);
    const [formData, setFormData] = useState(null);

    return (
        <div className="container">
            <div className="container">
                {schema === null ? (
                    <DropFile onFileDropped={(obj) => setSchema(obj)} />
                ) : (
                    <Form
                        focusOnFirstError
                        schema={schema}
                        validator={validator}
                        onSubmit={submit.bind(null, formData, schema.title)}
                        formData={formData}
                        onChange={(e) => setFormData(e.formData)}
                        noHtml5Validate
                        onError={error}
                        showErrorList={false}
                    />
                )}
            </div>
        </div>
    );
}

export default App;
