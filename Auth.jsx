import axios from 'axios'
import { useEffect } from 'react'
const Auth = ()=>{

    useEffect(()=>{
        const headers = {Key:"token",Value:123456};
        axios.get("http://localhost:8080/api/user/userLists",{headers})
        .then((response)=>{
            console.log(response.data)
        })
    })


}
export default Auth;

import { writeFileSync, mkdir } from "fs";
import inquirer from "inquirer";
import path from "path";

const formFor = ["web_app", "native_app"];

const nativeComponentMap = {
  text: "KHFTextInput",
  numeric_input: "KHFNumericInput",
  check_box: "KHFCheckBox",
  radio: "KHFRadioButton",
  "single-select-l10n (deprecated)": "KHFSelect",
  single_select: "KHFSelect",
  date_time: "KHFDateTimeInput",
  array: "KrushalFieldArray",
};

const fieldChoice = Object.keys(nativeComponentMap);

async function generateForm() {
  const { _formFor } = await inquirer.prompt({
    type: "list",
    name: "_formFor",
    message: "Choose which project app you need this form",
    choices: formFor,
  });
  const { formName } = await inquirer.prompt({
    type: "input",
    name: "formName",
    message: "Enter form name",
  });

  const form = {
    form_name: formName,
    form_fields: [],
  };

  const { fieldCount } = await inquirer.prompt({
    type: "number",
    name: "fieldCount",
    message: "Enter the number of form fields:",
    validate: (value) => {
      if (isNaN(value) || value <= 0) {
        return "Please enter a valid number greater than 0.";
      }
      return true;
    },
  });

  for (let i = 0; i < fieldCount; i++) {
    const { label, key, type , validation} = await inquirer.prompt([
      {
        type: "input",
        name: "label",
        message: `Field ${i + 1}: Enter the label for the field:`,
      },
      {
        type: "input",
        name: "key",
        message: `Field ${i + 1}: Enter the key for the field:`,
      },
      {
        type: "list",
        name: "type",
        message: `Field ${i + 1}: Select the type for the field:`,
        choices: fieldChoice,
      },
      {
        type : "confirm",
        name : "validation",
        message : "Do you want add validation for this field ?"
      }
    ]);

    let validationObj = {}
    const validationOptions = ["required","pattern","maxLength","min","max"]
    if (validation) {
      const {validations} = await inquirer.prompt([
        {
          type : "checkbox",
          name : "validations",
          message : "Select the validations types",
          choices : validationOptions
        }
      ])

      for (let index = 0; index < validations?.length; index++) {
        const {value, message} = await inquirer.prompt([
          {
            type : "input",
            name : "value",
            message : `Enter the value for ${validations[index]} ?`
          },
          {
            type : "input",
            name : "message",
            message : `Enter message for ${validations[index]} ?`
          }
        ])
        validationObj[validations[index]] = {
          value,
          message
        }
      }
    }

    const field = {
      label,
      key,
      type,
      validation: validationObj
    };

    if (
      type === "single-select-l10n" ||
      type === "single_select" ||
      type === "check_box"
    ) {
      const { optionsCount } = await inquirer.prompt({
        type: "number",
        name: "optionsCount",
        message: `Field ${
          i + 1
        }: Enter the number of options for the dropdown:`,
        validate: (value) => {
          if (isNaN(value) || value <= 0) {
            return "Please enter a valid number greater than 0.";
          }
          return true;
        },
      });

      const options = [];
      for (let j = 0; j < optionsCount; j++) {
        const { value, optionLabel } = await inquirer.prompt([
          {
            type: "input",
            name: "value",
            message: `Enter the value for option ${j + 1}:`,
          },
          {
            type: "input",
            name: "optionLabel",
            message: `Enter the label for option ${j + 1}:`,
          },
        ]);
        options.push({ value, label: optionLabel });
      }

      field.options = options;
    }

    if (type === "radio") {
      const { optionsCount } = await inquirer.prompt({
        type: "number",
        name: "optionsCount",
        message: `Field ${
          i + 1
        }: Enter the number of options for the dropdown:`,
        validate: (value) => {
          if (isNaN(value) || value <= 0) {
            return "Please enter a valid number greater than 0.";
          }
          return true;
        },
      });

      const options = [];
      for (let j = 0; j < optionsCount; j++) {
        const { value = false, optionLabel } = await inquirer.prompt([
          {
            type: "input",
            name: "optionLabel",
            message: `Enter the label for option ${j + 1}:`,
          },
        ]);
        options.push({ value, label: optionLabel });
      }

      field.options = options;
    }

    form.form_fields.push(field);
  }

  const jsonData = JSON.stringify(form, null, 2);

  let web_jsx = `
    import config from "./config.json";
    import {KrushalHookFormWeb, webComponentMap, useKHF} from "krushal-hook-form/web/src/index";
    import { FormProvider } from "react-hook-form";
    const KHF${formName} = () => {
      const methods = useKHF(testconfig, {
        config: testconfig,
        readOnly: false,
        componentMap: webComponentMap,
      });
    
      const onSubmit = data => console.log(data)
    
      return (
        <>
          <FormProvider {...methods}>
            <KrushalHookFormWeb />
          </FormProvider>
          <button onClick={methods.handleSubmit(onSubmit)}>Submit</button>
        </>
      );
    };
    export default KHF${formName}`;

  const native_jsx = `
  import { View } from 'react-native'
  import { FormProvider } from 'react-hook-form'
  import { Button } from 'react-native-paper'
  import KrushalHookFormNative from 'krushal-hook-form/native/KrushalHookForm'
  import { useKHF } from 'krushal-hook-form/native/hooks/useKHF'
  import componentmap from 'krushal-hook-form/native/helpers/componentmap'
  import config from "./config.json"
  
  const KHF${formName} = () => {
    const methods = useKHF(
      { shouldUnregister: true },
      {
        config: jsonObject,
        readOnly: false,
        componentMap: componentmap,
      }
    )
    const onSubmit = (data) => console.log(data);
    return (
      <View>
        <FormProvider {...methods}>
          <KrushalHookFormNative />
        </FormProvider>
        <Button mode="contained" onPress={methods.handleSubmit(onSubmit)}>
          Submit
        </Button>
      </View>
    )
  }
  export default KHF${formName};  
  `;

  const { filePathName } = await inquirer.prompt({
    type: "input",
    name: "filePathName",
    message: "Where you want to keep this folder ?",
  });

  let dir = path.join(filePathName, `KHF${formName}`);
  mkdir(dir, { recursive: true }, (err) => {
    if (err) throw err;
    writeFileSync(
      path.join(dir, `KHF${formName}.jsx`),
      _formFor === "web_app" ? web_jsx : native_jsx
    );
    writeFileSync(path.join(dir, "config.json"), jsonData);
  });
  console.log("Form JSON file generated successfully.");
}

generateForm();
