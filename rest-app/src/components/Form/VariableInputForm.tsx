import React, { useState } from 'react';
import styles from './VariableInputForm.module.css';

interface Variable {
  name: string;
  type: string;
  format: string;
  defaultValue: string;
  options: { key: string; value: string }[];
}

interface VariableInputFormProps {
  variables: Variable[];
  itemName: string; // クリックしたアイテムの名前を受け取る
  onSubmit: (values: Record<string, string>) => void;
  onCancel: () => void;
}

const VariableInputForm: React.FC<VariableInputFormProps> = ({ variables, itemName, onSubmit, onCancel }) => {
  const [formValues, setFormValues] = useState<Record<string, string>>(
    variables.reduce((acc, variable) => {
      acc[variable.name] = variable.defaultValue || '';
      return acc;
    }, {} as Record<string, string>)
  );

  const handleChange = (name: string, value: string) => {
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(formValues);
  };

  return (
    <div className={styles.formContainer}>
      {/* クリックしたアイテムの名前を表示 */}
      <div className={styles.itemName}>{itemName}</div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>変数入力フォーム</h2>
        {variables.map((variable) => (
          <div key={variable.name} className={styles.formGroup}>
            <label htmlFor={variable.name}>{variable.name}</label>
            {variable.options.length > 0 ? (
              <select
                id={variable.name}
                value={formValues[variable.name]}
                onChange={(e) => handleChange(variable.name, e.target.value)}
              >
                {variable.options.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.value}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id={variable.name}
                type="text"
                value={formValues[variable.name]}
                onChange={(e) => handleChange(variable.name, e.target.value)}
                maxLength={variable.format === 'A8' ? 8 : undefined}
              />
            )}
          </div>
        ))}
        <div className={styles.buttonGroup}>
          <button type="submit">実行</button>
          <button type="button" onClick={onCancel}>キャンセル</button>
        </div>
      </form>
    </div>
  );
};

export default VariableInputForm;